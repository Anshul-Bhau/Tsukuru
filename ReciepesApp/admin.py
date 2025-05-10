from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import *
from .resources import RecipesResource
from import_export.admin import ImportExportModelAdmin


Users = get_user_model()

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'role')
    ordering = ('username',)

@admin.register(Recipes)
class RecipesAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = RecipesResource
    list_display = ('title', 'cleaned_ingredients', 'image')
    search_fields = ('title',)

# @admin.register(Boards)
# class BoardsAdmin(admin.ModelAdmin):
#     list_display = ('title', 'user')
#     search_fields = ('title',)

