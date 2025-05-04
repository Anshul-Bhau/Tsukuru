from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
import uuid

class Users(AbstractUser):
    Role_Choices = [
        ("admin", "admin"),
        ("user", "user")
    ]

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    username = models.CharField(max_length=225, null=False, blank=False, unique=False)
    email = models.EmailField(max_length=250, null=False, blank=False, unique=True)
    role = models.CharField(max_length=30, blank=False, null=False, choices=Role_Choices)
    user_created_at = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=250, null=False, blank=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role', 'username', 'password']

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

        self.create_passw_instance()
        
    
    def create_passw_instance(self):
        try:
            Passwords.objects.get_or_create(
                user = self,
                defaults={
                    'username' : self.username,
                    'password' : self.password,
                    'user_email' : self.email
                }
            )
        except Exception as e:
            print(f"Error creating Passwords record: {e}")
        
    def __str__(self):
        return f"{self.username} is {self.role}"


class Passwords(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    user_email = models.EmailField(max_length=250, null=False, blank=False)
    username = models.CharField(max_length=200, null=False, blank=False)
    password = models.CharField(max_length=150, null=False, blank=False)

class Recipes(models.Model):
    title = models.CharField(max_length=300, null=False, blank=False, unique=False)
    ingredients = models.JSONField()
    directions = models.TextField()
    cleaned_ingredients = models.JSONField()
    image_name = models.CharField(max_length=250, null=False, unique=False, blank=False)
    image = models.ImageField(upload_to='recipes/', )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Boards(models.Model):
    title = models.CharField(max_length=250, null=False, unique=False, blank=False)
    user = models.OneToOneField(to=Users, on_delete=models.CASCADE, null=True)
    recipes = models.ManyToManyField(Recipes, related_name='boards')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.title}'
