from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from dj_rest_auth.registration.views import VerifyEmailView
from .views import *

urlpatterns = [
    path('landing/', landingpage, name='dashboard'),
    path('login/', loginpage, name='loginpage'),
    path('user_login/', user_login, name='user_login'),
    path('signup/', user_signup, name='user_signup'),
    path('home/', home, name='home'),
    path('', root_redirect, name='root'),
    path('user_account/', user_account, name='user_acc'),
    path('save_recipe/', save_recipe, name='save_recipe'),
    path('unsave_recipe/<int:recipe_id>/<int:board_id>/', unsave_recipe, name='unsave_recipe'),
    path('accounts/', include('allauth.urls')),
    path('recipe/<int:recipe_id>', recipe_detail, name='recipe_detail'),
    path('contact/', contact_page, name='contact_page'),
    path("submit/", submit_recipe, name="submit_recipe"),
    # path("accounts/ajax-resend-email/", ajax_resend_email_verification, name="ajax_resend_email"),

    path('get/csrf-token/', get_csrf_token, name='get_csrf_token'),

    path("get/users/", getUsers), 
    path("get/boards/", getBoards),
    path("get/passwords/", getPasswords),
    path("get/recipes/", getRecipies),
    path("get/saved_recipes/", getSavedRecipes),

    path("get/user/<str:pk>", getuser),
    path("get/password/<str:pk>", getpassword),
    path("get/recipe/<str:name>", getrecipe),
    path("get/board/<str:name>", getboard),
    path("get/user_saved_recipe/<str:pk>", getUserSavedRecipe),

    path("create/board/", createBoard),

    #dj-rest-auth and auth related route
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
    path("auth/verify-email-code/", VerifyEmailByCodeView.as_view(), name="verify-email-code"),
    path("auth/resend-email-code/", ResendEmailCodeView.as_view(), name="resend-email-code"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)