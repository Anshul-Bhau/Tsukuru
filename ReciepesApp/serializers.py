from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"


class PasswordsSerializer(ModelSerializer):
    class Meta:
        model = Passwords
        fields = "__all__"

class ReciepeSerializer(ModelSerializer):
    class Meta:
        model = Recipes
        fields = "__all__"
    
class BoardsSerializer(ModelSerializer):
    class Meta:
        model = Boards
        fields= "__all__"
    
    def create(self, validated_data):
        user = self.context["request"].user
        recipes = validated_data.pop("recipes", [])
        board = Boards.objects.create(user=user, title=validated_data["title"])
        board.recipes.set(recipes)
        return board

class SavedrecipeSerializer(ModelSerializer):
    class Meta:
        model = saved_recipes
        fields = "__all__"

