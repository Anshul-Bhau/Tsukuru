from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import *
import json
import ast
from import_export.results import Result


class RecipesResource(resources.ModelResource):
    ingredients = fields.Field(column_name='ingredients')
    cleaned_ingredients = fields.Field(column_name='cleaned_ingredients')

    class Meta:
        model = Recipes
        fields = ('title', 'ingredients', 'directions', 'cleaned_ingredients', 'image_name')
        import_id_fields = ('title', 'directions', 'ingredients')
        use_bulk = True
        skip_unchanged = True
        report_skipped = True
    
    def import_data(self, dataset, dry_run = False, raise_errors=True, use_transactinos=None, **kwargs):
        
        result = Result()
        
        recipes = []
        for row in dataset.dict:
            try:
                recipes.append(Recipes(
                    title = row['title'],
                    ingredients=parse_ingredients(row.get('ingredients', '[]')),
                    directions=row['directions'],
                    cleaned_ingredients=parse_ingredients(row.get('cleaned_ingredients', '[]')),
                    image_name=row['image_name']
                ))
            except Exception as e:
                result.invalid_rows.append((row, str(e)))
            
        if not dry_run:
            Recipes.objects.bulk_create(recipes, batch_size=100000)
        result.totals['new'] = len(recipes)
        return result
    

def parse_ingredients(value):
    # if already list return the list itself
    if isinstance(value, list):  
        return value
    # if nor a string neither list return empty list
    if not isinstance(value, str):
        return []

    try:
        # tries to clean it by using literal_eval that will convert a list in string to list
        parsed = ast.literal_eval(value)
        if isinstance(parsed, list):
            return parsed
    except (ValueError, SyntaxError):
        pass

    return []



