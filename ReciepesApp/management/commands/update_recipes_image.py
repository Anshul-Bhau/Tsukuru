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
        dataset_file = 'images^Mrecipes.csv'  # Path to your dataset file

        # Open and read the dataset (assuming CSV format)
        import csv
        with open(dataset_file, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                title = row['title']
                image_name = row['image_name']  # Assuming your dataset has an image_filename field

                # Check if the image file exists
                image_path = os.path.join(media_dir, image_name)
                if os.path.exists(image_path):
                    # Open the image file and assign it to the Recipe model
                    with open(image_path, 'rb') as img_file:
                        recipe = Recipes(
                            title=title,
                            image=File(img_file, name=image_name)
                        )
                        recipe.save()
                        self.stdout.write(self.style.SUCCESS(f"Recipe '{title}' imported successfully"))
                else:
                    self.stdout.write(self.style.WARNING(f"Image for '{title}' not found at {image_path}"))
