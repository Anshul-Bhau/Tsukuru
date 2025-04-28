import os
from django.core.management.base import BaseCommand
from ReciepesApp.models import Recipes
from django.core.files import File
from django.conf import settings

class Command(BaseCommand):
    help = 'Import recipes and their images from a dataset'

    def handle(self, *args, **kwargs):
        # Path to the directory where the images are located
        media_dir = os.path.join(settings.BASE_DIR, 'media', 'recipes')
        dataset_file = 'Food Ingredients and Recipe Dataset with Image Name Mapping.csv'  # Path to your dataset file

        # Open and read the dataset (assuming CSV format)
        import csv
        with open(dataset_file, newline='', encoding='utf-8', errors='replace') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                title = row['title']
                image_name = row['image_name']  # Assuming your dataset has an image_filename field

                # Check if the image file exists
                image_path = os.path.join(media_dir, image_name)
                image_path += ".jpg"
                if os.path.exists(image_path):
                    # Open the image file and assign it to the Recipe model
                    with open(image_path, 'rb') as img_file:
                        recipes = Recipes.objects.filter(title=title, image_name=image_name)
                        if recipes.exists():
                            for recipe in recipes:
                                recipe.image.save(image_name, File(img_file), save=True)
                                self.stdout.write(self.style.SUCCESS(f"Recipe '{title}' imported successfully"))
                else:
                    self.stdout.write(self.style.WARNING(f"Image for '{title}' not found at {image_path}"))


# import chardet

# with open("Food Ingredients and Recipe Dataset with Image Name Mapping.csv", "rb") as f:
#     result = chardet.detect(f.read(10000))
#     print(result)