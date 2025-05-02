from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from .models import Recipes
import json



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
            print(user)

            if user is not None:
                login(request, user)
                print("good")
                if request.content_type == "application/json":
                    print("gets here ")
                    return JsonResponse({"user_id": user.id, "role" : user.role, "message": "Login successful"}, status=200)
                else:
                    return redirect('dashboard')
            else:
                print("got stuck")
                return redirect('loginpage')
        
        else:
            return render(request, 'login.html')

    except Exception as e:
        if request.content_type == "application/json":
            return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)
        else:
            return render(request, 'login.html', {'error' : f'Internal server error : {str(e)}'})

def homepage(request) :
    recipe_id = request.GET.get('recipe_id')
    recipe = get_object_or_404(Recipes, id=recipe_id)
    return render(request, 'homepage.html', {'recipe': recipe})
    # return render(request, 'homepage.html')

def user_account(request) :
    boards = Recipes.objects.all()[0:6]
    return render(request, 'user_acc.html', {
        'pfp_range': range(1, 13),
        "boards" : boards,
    })