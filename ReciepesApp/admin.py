from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import *
from .resources import RecipesResource
from import_export.admin import ImportExportModelAdmin


Users = get_user_model()

class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'role')
    ordering = ('username',)

@admin.register(Recipes)
class RecipesAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = RecipesResource
    list_display = ('title', 'cleaned_ingredients')
    search_fields = ('title',)