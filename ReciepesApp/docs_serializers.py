from rest_framework import serializers
from .serializers import *

class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField(
        help_text="Error message describing what went wrong"
    )

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="Registered email address"
    )

    password = serializers.CharField(
        write_only=True,
        help_text="User password"
    )

class LoginResponseSerializer(serializers.Serializer):
    token = serializers.CharField(
        help_text="Authentication token"
    )

    user_id = serializers.UUIDField()

    username = serializers.CharField()

    role = serializers.CharField()

    message = serializers.CharField()

class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=100,
        help_text="Display name"
    )

    email = serializers.EmailField(
        help_text="Unique email address"
    )

    password = serializers.CharField(
        write_only=True,
        help_text="Password for the account"
    )

class LogoutResponseSerializer(serializers.Serializer):
    message = serializers.CharField()

class SaveRecipeSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField(
        help_text="Recipe ID to save"
    )

    board_id = serializers.IntegerField(
        required=False,
        help_text="Existing board ID"
    )

    new_board_title = serializers.CharField(
        required=False,
        help_text="Create a new board with this title"
    )

class SaveRecipeResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    board = BoardsSerializer()

class CreateBoardSerializer(serializers.Serializer):
    title = serializers.CharField(
        max_length=255,
        help_text="Board title"
    )

class RecipeSearchSerializer(serializers.Serializer):
    q = serializers.CharField(
        required=False,
        help_text="Search term"
    )

    page = serializers.IntegerField(
        required = False,
        default = 1,
        help_text = "Page number"
    )

class RecipeListResponseSerializer(serializers.Serializer):
    results = ReciepeSerializer(many=True)

    page = serializers.IntegerField()

    num_pages = serializers.IntegerField()

    count = serializers.IntegerField()

    query = serializers.CharField()

class RecipeDetailResponseSerializer(serializers.Serializer):
    recipe = ReciepeSerializer()

    boards = BoardsSerializer(many=True)

class RecipeUploadSerializer(serializers.Serializer):
    title = serializers.CharField()

    directions = serializers.CharField()

    ingredients = serializers.ListField(
        child=serializers.CharField()
    )

    cleaned_ingredients = serializers.ListField(
        child=serializers.CharField()
    )

    image = serializers.ImageField()

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()

class EmptySerializer(serializers.Serializer):
    pass