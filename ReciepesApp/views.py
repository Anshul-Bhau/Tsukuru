from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from .models import Recipes
import json
from .models import *



# Create your views here.

def landingpage(request):
    trending_recipes = Recipes.objects.all()[4:15:3]
    context = {
        'active_page': 'home',
        'trending_recipes': trending_recipes,
    }
    return render(request, 'index.html', context)

def loginpage(request):
    return render(request, 'login.html')

def user_login(request):
    try:
        if request.method == 'POST':
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST


            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                if request.content_type == "application/json":
                    return JsonResponse({"error": "Email and password are required"}, status=400)
                else:
                    return render(request, 'login.html', {'error' : "Email and password are required"})
        

            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user)
                if request.content_type == "application/json":
                    print("gets here ")
                    return JsonResponse({"user_id": user.id, "role" : user.role, "message": "Login successful"}, status=200)
                else:
                    return redirect('dashboard')
            else:
                print("got stuck")
                return render(request, 'login.html', {
                'error': "Invalid email or password. Please try again."})
        
        else:
            return render(request, 'login.html')

    except Exception as e:
        if request.content_type == "application/json":
            return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
        else:
            return render(request, 'login.html', {'error' : f'Internal server error : {str(e)}'})

def user_signup(request):
    if request.method == "POST":
        try:  
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                print("json data", data)
            else:
                data = request.POST

            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            
            if not name or not email or not password:
                return JsonResponse({'error': 'All fields are required'}, status=400)

            if Users.objects.filter(email = email).exists():
                return JsonResponse({'error': 'Email already in use'}, status=400)
            
            user = Users.objects.create(username = name, email=email, role='user')
            user.set_password(password)
            user.save()

            user = authenticate(request, username=email, password=password)
            print("user made ", user)

            print("going for js shii")
            return JsonResponse({"user_id": user.id, "role" : user.role, "message": "Signup successful"}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def home(request) :
    searched_recipes = Recipes.objects.all()[15:38:3]
    trending_recipes = Recipes.objects.all()[4:15:3]
    context = {
        'active_page': 'cook',
        'searched_recipes': searched_recipes,
        'trending_recipes' : trending_recipes,}
    return render(request, 'homepage.html', context)

def homepage(request, recipe_id) :
    recipe = get_object_or_404(Recipes, id=recipe_id)
    return render(request, 'homepage.html', {'recipe': recipe})

def user_account(request) :
    boards = Recipes.objects.all()[0:6]
    return render(request, 'user_acc.html', {
        'pfp_range': range(1, 13),
        "boards" : boards,
    })

