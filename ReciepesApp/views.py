import json

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator
from django.db.models import Q

from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

# ---------------------------------------------------------------------------
# Auth
# All auth endpoints are JSON-only and return a DRF auth token that the
# React app stores and sends back as `Authorization: Token <key>`.
# ---------------------------------------------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    data = request.data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"error": "Invalid email or password. Please try again."}, status=400)

    login(request, user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user_id": str(user.id),
        "username": user.username,
        "role": user.role,
        "message": "Login successful",
    }, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_signup(request):
    data = request.data
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields are required"}, status=400)

    if Users.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=400)

    user = Users.objects.create(username=name, email=email, role="user")
    user.set_password(password)
    user.save()

    user = authenticate(request, username=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "user_id": str(user.id),
        "username": user.username,
        "role": user.role,
        "message": "Signup successful",
    }, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    Token.objects.filter(user=request.user).delete()
    logout(request)
    return Response({"message": "Logged out"}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(UserSerializer(request.user).data)


# ------------------------------------------------------------------------------------------
# Recipes
# ------------------------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([AllowAny])
def trending_recipes(request):
    recipes = Recipes.objects.all()[4:15:3]
    return Response(ReciepeSerializer(recipes, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recipe_list(request):
    """
    Search + paginated recipe listing.
    Query params: ?q=<search text>&page=<n>
    """
    recipes = Recipes.objects.all()[15:38:3]  # default fallback set
    query = request.GET.get("q", "").strip()
    page_no = request.GET.get("page", 1)

    if query:
        keywords = [kw.lower() for kw in query.split() if kw]
        q = Q()
        for kw in keywords:
            q &= (Q(title__icontains=kw) | Q(cleaned_ingredients__contains=[kw]))
        recipes = Recipes.objects.filter(q).distinct()

    paginator = Paginator(recipes, 12)
    page_obj = paginator.get_page(page_no)

    return Response({
        "results": ReciepeSerializer(page_obj.object_list, many=True).data,
        "page": page_obj.number,
        "num_pages": paginator.num_pages,
        "count": paginator.count,
        "query": query,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recipe_detail(request, recipe_id):
    recipe = get_object_or_404(Recipes, id=recipe_id)
    boards = Boards.objects.filter(user=request.user)
    return Response({
        "recipe": ReciepeSerializer(recipe).data,
        "boards": BoardsSerializer(boards, many=True).data,
    })


# ---------------------------------------------------------------------------
# Boards / saved recipes
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_account(request):
    boards = Boards.objects.filter(user=request.user).prefetch_related("recipes")
    return Response(BoardsSerializer(boards, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_recipe(request):
    recipe_id = request.data.get("recipe_id")
    board_id = request.data.get("board_id")
    new_board_title = (request.data.get("new_board_title") or "").strip()

    if not recipe_id:
        return Response({"error": "recipe_id is required"}, status=400)

    recipe = get_object_or_404(Recipes, id=recipe_id)

    if new_board_title:
        board, _ = Boards.objects.get_or_create(title=new_board_title, user=request.user)
    elif board_id:
        board = get_object_or_404(Boards, id=board_id, user=request.user)
    else:
        return Response({"error": "Please select or create a Board"}, status=400)
    if board.recipes.filter(id=recipe_id).exists():
        return Response({"message": "Recipe is already saved to the board"}, status=200)

    board.recipes.add(recipe)
    saved_recipes.objects.create(recipe=recipe, user=request.user, board=board)
    return Response({"message": "Recipe saved successfully!", "board": BoardsSerializer(board).data}, status=201)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unsave_recipe(request, recipe_id, board_id):
    recipe = get_object_or_404(Recipes, id=recipe_id)
    board = get_object_or_404(Boards, id=board_id, user=request.user)

    saved = saved_recipes.objects.filter(user=request.user, recipe=recipe, board=board).first()
    if not saved:
        return Response({"error": "This recipe is not saved to this board."}, status=404)

    saved.delete()
    board.recipes.remove(recipe)
    return Response({"message": "Recipe unsaved successfully."}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createBoard(request):
    serializer = BoardsSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        board = serializer.save()
        return Response(BoardsSerializer(board).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_recipe(request):
    """
    Multipart endpoint for creating a new recipe.
    Expected fields: title, directions, ingredients (JSON string or list),
    cleaned_ingredients (JSON string or list), image (file).
    """
    data = request.data.copy()
    for field in ("ingredients", "cleaned_ingredients"):
        value = data.get(field)
        if isinstance(value, str):
            try:
                data[field] = json.loads(value)
            except (TypeError, ValueError):
                data[field] = [v.strip() for v in value.split(",") if v.strip()]

    serializer = ReciepeSerializer(data=data)
    if serializer.is_valid():
        recipe = serializer.save()
        return Response(ReciepeSerializer(recipe).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# def landingpage(request):
#     trending_recipes = Recipes.objects.all()[4:15:3]
#     context = {
#         'active_page': 'home',
#         'trending_recipes': trending_recipes,
#     }
#     return render(request, 'index.html', context)

# def loginpage(request):
#     return render(request, 'login.html')

# def user_login(request):
#     try:
#         if request.method == 'POST':
#             if request.content_type == 'application/json':
#                 data = json.loads(request.body)
#             else:
#                 data = request.POST


#             email = data.get("email")
#             password = data.get("password")

#             if not email or not password:
#                 if request.content_type == "application/json":
#                     return JsonResponse({"error": "Email and password are required"}, status=400)
#                 else:
#                     return render(request, 'login.html', {'error' : "Email and password are required"})
        

#             user = authenticate(request, username=email, password=password)

#             if user is not None:
#                 login(request, user)
#                 if request.content_type == "application/json":
#                     print("gets here ")
#                     return JsonResponse({"user_id": user.id, "role" : user.role, "message": "Login successful"}, status=200)
#                 else:
#                     return redirect('dashboard')
#             else:
#                 print("got stuck")
#                 return render(request, 'login.html', {
#                 'error': "Invalid email or password. Please try again."})
        
#         else:
#             return render(request, 'login.html')

#     except Exception as e:
#         if request.content_type == "application/json":
#             return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
#         else:
#             return render(request, 'login.html', {'error' : f'Internal server error : {str(e)}'})

# def user_signup(request):
#     if request.method == "POST":
#         try:  
#             if request.content_type == 'application/json':
#                 data = json.loads(request.body)
#                 print("json data", data)
#             else:
#                 data = request.POST

#             name = data.get('name')
#             email = data.get('email')
#             password = data.get('password')
            
#             if not name or not email or not password:
#                 return JsonResponse({'error': 'All fields are required'}, status=400)

#             if Users.objects.filter(email = email).exists():
#                 return JsonResponse({'error': 'Email already in use'}, status=400)
            
#             user = Users.objects.create(username = name, email=email, role='user')
#             user.set_password(password)
#             user.save()

#             user = authenticate(request, username=email, password=password)
#             print("user made ", user)

#             print("going for js shii")
#             return JsonResponse({"user_id": user.id, "role" : user.role, "message": "Signup successful"}, status=200)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)

# @login_required
# def home(request):
#     recipes = Recipes.objects.all()[15:38:3]  # default fallback
#     trending_recipes = Recipes.objects.all()[4:15:3]
#     saved_boards = Boards.objects.filter(user=request.user)

#     input_query = ''
#     page_no = request.GET.get('page', 1)

#     if request.method == "POST":
#         input_query = request.POST.get('input', '').strip()
#         request.session['last_search'] = input_query
#         page_no = 1  

#     elif 'input' in request.GET:
#         input_query = request.GET.get('input', '').strip()
#         request.session['last_search'] = input_query  

#     elif 'last_search' in request.session:
#         input_query = request.session.get('last_search', '')

#     # Now use it to search, if not empty
#     if input_query:
#         keywords = [kw.lower() for kw in input_query.split() if kw]
#         q = Q()
#         for kw in keywords:
#             q &= (Q(title__icontains=kw) | Q(cleaned_ingredients__contains=[kw]))
#         recipes = Recipes.objects.filter(q).distinct()

#     paginator = Paginator(recipes, 12)
#     page_obj = paginator.get_page(page_no)

#     context = {
#         'active_page': 'cook',
#         # 'searched_recipes': recipes,
#         'trending_recipes': trending_recipes,
#         'boards': saved_boards,
#         'show_detail': False,
#         'page_obj' : page_obj,
#         'input_query' : input_query,
#     }
#     return render(request, 'homepage.html', context)

# # this is for single recipe detail in recipe page
# @login_required
# def recipe_detail(request, recipe_id):
#     recipe = get_object_or_404(Recipes, id=recipe_id)
#     saved_boards = Boards.objects.filter(user=request.user)
#     context = {
#         'boards': saved_boards,
#         'recipe': recipe,
#         'ingredients': recipe.ingredients,
#         'show_detail': True,
#     }
#     return render(request, 'recipe.html', context)

# def user_account(request) :
#     boards = Boards.objects.filter(user=request.user).prefetch_related('recipes')
#     return render(request, 'user_acc.html', {
#         "boards" : boards,
#         "range" : range(1,25)
#     })

# @login_required
# def save_recipe(request):
#     if request.method == "POST":
#         recipe_id = request.POST.get('recipe_id')
#         board_id = request.POST.get('board_id')
#         new_board_title = request.POST.get('new_board_title').strip()
#         input_term =request.POST.get('input', '')

#         request.session['last_search'] = request.POST.get('input', '')

#         recipe = get_object_or_404(Recipes, id=recipe_id)

#         if new_board_title:
#             board, created = Boards.objects.get_or_create(
#                 title = new_board_title,
#                 user = request.user
#             )
#         elif board_id:
#             board= get_object_or_404(Boards, id=board_id, user=request.user)
#         else:
#             messages.error(request, "Please select or create a Board")
#             return redirect(request.META.get('HTTP_REFERER', '/'))
        
#         if board.recipes.filter(id=recipe_id).exists():
#             messages.info(request, "Recipe is alredy saved to the board")
#         else:
#             board.recipes.add(recipe)
#             saved_recipes.objects.create(recipe = recipe, user=request.user, board=board)
#             messages.success(request, "Recipe saved successfully!")

#         return redirect(request.META.get('HTTP_REFERER', '/'))
    
# # @login_required
# # def board_detail(request, board_id, save_recipe):
# #     board = get_object_or_404(Boards, id=board_id, user=request.user)
# #     saved = saved_recipes.objects.filter(board=board).select_related('recipe').first()
# #     image_url = saved.recipe.image.url if saved else None

# #     context = {
# #         'board' : board,
# #         'image_url' : image_url,
# #     }

# #     return render(request , 'user_account.html', context)

# @require_POST
# @login_required
# def unsave_recipe(request, recipe_id, board_id):
#     try:
#         recipe = Recipes.objects.get(id=recipe_id)
#         print("Found recipe:", recipe)
#     except Recipes.DoesNotExist:
#         print("Recipe does not exist")
#         return JsonResponse({"error": f"Recipe {recipe_id} not found."}, status=404)

#     try:
#         board = Boards.objects.get(id=board_id, user=request.user)
#         print("Found board:", board)
#     except Boards.DoesNotExist:
#         print("Board not found or no permission")
#         return JsonResponse({"error": "Board not found or you don’t have permission."}, status=403)

#     print("Checking for saved recipe with:")
#     print(f"user={request.user}, recipe={recipe.id}, board={board.id}")
#     print(saved_recipes.objects.filter(user=request.user, recipe=recipe, board=board))
#     print(Boards.objects.filter(recipes=recipe))

#     try:
#         saved = saved_recipes.objects.get(user=request.user, recipe=recipe, board=board)
#         print(saved)
#         saved.delete()
#         board.recipes.remove(recipe)
#         print(Boards.objects.filter(recipes=recipe))
#         print("unsaved")
#         return JsonResponse({"message": "Recipe unsaved successfully."})
#     except saved_recipes.DoesNotExist:
#         print("Saved recipe does not exist")
#         return JsonResponse({"error": "This recipe is not saved to this board."}, status=404)
#     except Exception as e:
#         print("Unexpected error in unsave_recipe:", e)
#         return JsonResponse({"error": "Something went wrong."}, status=500)

# @login_required
# def root_redirect(request):
#     return redirect('home')

# def contact_page(request):
#     return render(request, 'contact.html', {
#         'active_page': 'contact'
#     })

# def submit_recipe(request):
#     return render(request, "submit_recipe.html")


# #  serializers
# @api_view(['GET'])
# def getUsers(request):
#     users = Users.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getPasswords(request):
#     passws = Passwords.objects.all()
#     serializer = PasswordsSerializer(passws, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getBoards(request):
#     boards = Boards.objects.all()
#     serializer = BoardsSerializer(boards, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getRecipies(request):
#     recipes = Recipes.objects.all()
#     serializer = ReciepeSerializer(recipes, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getSavedRecipes(request):
#     sav_recs = saved_recipes.objects.all()
#     serializer = SavedrecipeSerializer(sav_recs, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getuser(request, pk):
#     user = Users.objects.get(id = pk)
#     serializer = UserSerializer(user, many=False)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getpassword(request, pk):
#     passw = Passwords.objects.get(user__id = pk)
#     serializer = PasswordsSerializer(passw, many=False)
#     return Response(serializer.data)

# @api_view(["GET"])
# def getrecipe(request, name):
#     recipe = Recipes.objects.filter(title__icontains=name)
#     if not recipe.exists():
#         return Response({"detail" : "No recipes found"},
#         status = status.HTTP_404_NOT_FOUND
#         )
#     serializer = ReciepeSerializer(recipe, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(["GET"])
# def getlimitedrecipe(request, name, count):
#     recipe = Recipes.objects.filter(title__icontains=name,)[:count]
#     if not recipe.exists():
#         return Response({"detail" : "No recipes found"},
#         status = status.HTTP_404_NOT_FOUND
#         )
#     serializer = ReciepeSerializer(recipe, many=True,)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(["GET"])
# def getboard(request, name):
#     board = Boards.objects.get(title = name, user = request.user)
#     if not board.exists():
#         return Response({"detail" : "No board found"},
#         status = status.HTTP_404_NOT_FOUND
#         )
#     serializer = BoardsSerializer(board, many=False)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(["GET"])
# def getUserSavedRecipe(request, pk):
#     saved_recipe = saved_recipes.objects.filter(user__id = pk)
#     if saved_recipe.exists():
#         return Response({"detail" : "No recipes found"},
#         status = status.HTTP_404_NOT_FOUND
#         )
#     serializer = SavedrecipeSerializer(saved_recipes, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def createBoard(request):
#     serializer = BoardsSerializer(data=request.data, context={"request":request})
#     if serializer.is_valid():
#         board = serializer.save()
#         return Response(BoardsSerializer(board).data, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @require_GET
# def get_csrf_token(request):
#     token = get_token(request)
#     return JsonResponse({'csrfToken': token})