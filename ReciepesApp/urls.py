from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from .views import *

urlpatterns = [
    # ---API docs---
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    
    # --- auth ---
    path("api/auth/login/", user_login, name="user_login"),
    path("api/auth/signup/", user_signup, name="user_signup"),
    path("api/auth/logout/", user_logout, name="user_logout"),
    path("api/auth/me/", current_user, name="current_user"),
    path("api/auth/csrf/", get_csrf_token, name="get_csrf_token"),
    path("accounts/", include("allauth.urls")),

    # --- recipes ---
    path("api/recipes/trending/", trending_recipes, name="trending_recipes"),
    path("api/recipes/", recipe_list, name="recipe_list"),
    path("api/recipes/submit/", submit_recipe, name="submit_recipe"),
    path("api/recipes/<int:recipe_id>/", recipe_detail, name="recipe_detail"),

    # --- boards / saved recipes
    path("api/account/", user_account, name="user_account"),
    path("api/boards/", createBoard, name="create_board"),
    path("api/recipes/save/", save_recipe, name="save_recipe"),
    path("api/recipes/unsave/<int:recipe_id>/<int:board_id>/", unsave_recipe, name="unsave_recipe"),

    # --- generic read endpoints ---
    path("api/get/users/", getUsers),
    path("api/get/boards/", getBoards),
    path("api/get/recipes/", getRecipies),
    path("api/get/saved_recipes/", getSavedRecipes),
    path("api/get/user/<str:pk>/", getuser),
    path("api/get/recipe/<str:name>/", getrecipe),
    path("api/get/recipe/<str:name>/<int:count>/", getlimitedrecipe),
    path("api/get/board/<str:name>/", getboard),
    path("api/get/user_saved_recipe/<str:pk>/", getUserSavedRecipe),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)