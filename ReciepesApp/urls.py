from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
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
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)