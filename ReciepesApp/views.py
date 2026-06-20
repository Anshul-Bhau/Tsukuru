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
from .docs_serializers import *

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter, OpenApiResponse

# ---------------------------------------------------------------------------
# Auth
# All auth endpoints are JSON-only and return a DRF auth token that the
# React app stores and sends back as `Authorization: Token <key>`.
# ---------------------------------------------------------------------------

@extend_schema(
    tags=["Authentication"],
    summary="Login User",
    description="""
    Authenticate using email and password.

    Returns a DRF token which must be included in future requests:

    Authorization: Token <token>
    """,
    request=LoginSerializer,
    responses={
        200: LoginResponseSerializer,
        400: ErrorSerializer,
    },
    examples=[
        OpenApiExample(
            "Login Request",
            value={
                "email": "john@example.com",
                "password": "password123"
            },
            request_only=True,
        ),
        OpenApiExample(
            "Login Success",
            value={
                "token": "7b61fca3...",
                "user_id": "8f29...",
                "username": "John",
                "role": "user",
                "message": "Login successful"
            },
            response_only=True,
            status_codes=["200"],
        ),
    ],
    auth=[],
)
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

@extend_schema(
    tags=["Authentication"],
    summary="Register User",
    description="Create a new account and return an authentication token.",
    request=SignupSerializer,
    responses={
        200: LoginResponseSerializer,
        400: ErrorSerializer,
    },
    auth=[],
)
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

@extend_schema(
    tags=["Authentication"],
    summary="Logout User",
    description="""
    Deletes the current authentication token.

    Requires authentication.
    """,
    responses={
        200: MessageSerializer
    }
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    Token.objects.filter(user=request.user).delete()
    logout(request)
    return Response({"message": "Logged out"}, status=200)


@extend_schema(
    tags=["Users"],
    summary="Get Current User",
    description="Returns details for the authenticated user.",
    responses=UserSerializer,
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(UserSerializer(request.user).data)


# ------------------------------------------------------------------------------------------
# Recipes
# ------------------------------------------------------------------------------------------
@extend_schema(
    tags=["Recipes"],
    summary="Trending Recipes",
    description="Returns a curated list of trending recipes.",
    responses=ReciepeSerializer(many=True),
)
@api_view(["GET"])
@permission_classes([AllowAny])
def trending_recipes(request):
    recipes = Recipes.objects.all()[4:15:3]
    return Response(ReciepeSerializer(recipes, many=True).data)

@extend_schema(
    tags=["Recipes"],
    summary="Search Recipes",
    description="""
    Search recipes by title and ingredients.

    Examples:

    ?q=pasta

    ?q=chicken soup&page=2
    """,
    parameters=[
        OpenApiParameter(
            name="q",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Search query"
        ),
        OpenApiParameter(
            name="page",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Page number"
        ),
    ],
    responses=RecipeListResponseSerializer,
)
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


@extend_schema(
    tags=["Recipes"],
    summary="Recipe Details",
    description="Retrieve a recipe and available user boards.",
    parameters=[
        OpenApiParameter(
            name="recipe_id",
            type=int,
            location=OpenApiParameter.PATH,
            description="Recipe ID"
        )
    ],
    responses=RecipeDetailResponseSerializer,
)
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

@extend_schema(
    tags=["Boards"],
    summary="User Boards",
    description="Returns all boards belonging to the authenticated user.",
    responses=BoardsSerializer(many=True),
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_account(request):
    boards = Boards.objects.filter(user=request.user).prefetch_related("recipes")
    return Response(BoardsSerializer(boards, many=True).data)

@extend_schema(
    tags=["Boards"],
    summary="Save Recipe",
    description="""
    Save a recipe to an existing board or create a new board.

    Either provide:

    - board_id

    OR

    - new_board_title
    """,
    request=SaveRecipeSerializer,
    responses={
        201: SaveRecipeResponseSerializer,
        400: ErrorSerializer,
    },
    examples=[
        OpenApiExample(
            "Save To Existing Board",
            value={
                "recipe_id": 5,
                "board_id": 2
            },
            request_only=True,
        ),
        OpenApiExample(
            "Create New Board",
            value={
                "recipe_id": 5,
                "new_board_title": "Dinner Ideas"
            },
            request_only=True,
        ),
    ],
)
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


@extend_schema(
    tags=["Boards"],
    summary="Unsave Recipe",
    description="Remove a recipe from a board.",
    parameters=[
        OpenApiParameter(
            "recipe_id",
            int,
            OpenApiParameter.PATH,
            description="Recipe ID"
        ),
        OpenApiParameter(
            "board_id",
            int,
            OpenApiParameter.PATH,
            description="Board ID"
        ),
    ],
    responses={
        200: MessageSerializer,
        404: ErrorSerializer,
    },
)
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


@extend_schema(
    tags=["Boards"],
    summary="Create Board",
    description="Create a new board for the authenticated user.",
    request=CreateBoardSerializer,
    responses={
        201: BoardsSerializer,
        400: ErrorSerializer,
    },
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createBoard(request):
    serializer = BoardsSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        board = serializer.save()
        return Response(BoardsSerializer(board).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Recipes"],
    summary="Submit Recipe",
    description="""
    Create a recipe with image upload.

    Content-Type:

    multipart/form-data
    """,
    request=RecipeUploadSerializer,
    responses={
        201: ReciepeSerializer,
        400: ErrorSerializer,
    },
)
@api_view(["POST"])
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


# ---------------------------------------------------------------------------
# Generic read endpoints 
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUsers(request):
    return Response(UserSerializer(Users.objects.all(), many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getBoards(request):
    return Response(BoardsSerializer(Boards.objects.all(), many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def getRecipies(request):
    return Response(ReciepeSerializer(Recipes.objects.all(), many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSavedRecipes(request):
    return Response(SavedrecipeSerializer(saved_recipes.objects.all(), many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getuser(request, pk):
    user = get_object_or_404(Users, id=pk)
    return Response(UserSerializer(user).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def getrecipe(request, name):
    recipe = Recipes.objects.filter(title__icontains=name)
    if not recipe.exists():
        return Response({"detail": "No recipes found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(ReciepeSerializer(recipe, many=True).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def getlimitedrecipe(request, name, count):
    recipe = Recipes.objects.filter(title__icontains=name)[:count]
    if not recipe.exists():
        return Response({"detail": "No recipes found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(ReciepeSerializer(recipe, many=True).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getboard(request, name):
    board = get_object_or_404(Boards, title=name, user=request.user)
    return Response(BoardsSerializer(board).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserSavedRecipe(request, pk):
    saved = saved_recipes.objects.filter(user__id=pk)
    if not saved.exists():
        return Response({"detail": "No recipes found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(SavedrecipeSerializer(saved, many=True).data, status=status.HTTP_200_OK)

@extend_schema(
    tags=["Utility"],
    summary="Get CSRF Token",
    description="Returns a CSRF token for session-based authentication flows.",
    responses={
        200: {
            "type": "object",
            "properties": {
                "csrfToken": {
                    "type": "string"
                }
            }
        }
    },
    auth=[],
)
@require_GET
def get_csrf_token(request):
    """
    Still needed if the React app uses SessionAuthentication anywhere
    (e.g. the DRF browsable API or allauth flows). Token-auth requests
    from React don't need this.
    """
    token = get_token(request)
    return JsonResponse({"csrfToken": token})
