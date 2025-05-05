from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('landing/', landingpage, name='dashboard'),
    path('login/', loginpage, name='loginpage'),
    path('user_login/', user_login, name='user_login'),
    path('signup/', user_signup, name='user_signup'),
    path('accounts/', include('allauth.urls')),
    path('home/<int:recipe_id>/', homepage, name='homepage'),
    path('user_account/', user_account, name='user_acc'),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)