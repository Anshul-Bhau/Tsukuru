from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class Users(AbstractUser):
    Role_Choices = [
        ("admin", "admin"),
        ("user", "user")
    ]

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    username = models.CharField(max_length=225, null=False, blank=False, unique=False)
    email = models.EmailField(max_length=250, null=False, blank=False, unique=True)
    role = models.CharField(max_length=30, blank=False, null=False, choices=Role_Choices, default="user")
    user_created_at = models.DateTimeField(auto_now_add=True)
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role', 'username']  

    class Meta:
        ordering = ["-user_created_at"]
        
    def __str__(self):
        return f"{self.username} is {self.role}"

class Recipes(models.Model):
    title = models.CharField(max_length=300, null=False, blank=False, unique=False)
    ingredients = models.JSONField()
    directions = models.TextField()
    cleaned_ingredients = models.JSONField()
    image_name = models.CharField(max_length=250, null=False, unique=False, blank=True, default="")
    image = models.ImageField(upload_to='recipes/',)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.image and not self.image_name:
            self.image_name = self.image.name
        super().save(*args, **kwargs)

class Boards(models.Model):
    title = models.CharField(max_length=250, null=False, unique=False, blank=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    recipes = models.ManyToManyField(Recipes, related_name='boards')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def first_recipe_image(self):
        first_recipe = self.recipes.order_by("-created_at").first()
        return first_recipe.image.url if first_recipe and first_recipe.image else None
        

    def __str__(self):
        return f'{self.user.username} - {self.title}'

class saved_recipes(models.Model):
    recipe = models.ForeignKey(Recipes, on_delete=models.CASCADE, related_name='saved_recipes')
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    board = models.ForeignKey(Boards, on_delete=models.CASCADE, unique=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe', 'board')  # No double saves

    def __str__(self):
        return f"{self.recipe.title} - saved"

