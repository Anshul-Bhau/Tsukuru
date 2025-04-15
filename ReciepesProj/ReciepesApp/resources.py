from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import *
import json


class RecipesResource(resources.ModelResource):
    ingredients = fields.Field(column_name='ingredients')
    directions = fields.Field(column_name='directions')
    NER = fields.Field(column_name='NER')

    class Meta:
        model = Recipes
        fields = ('title', 'ingredients', 'directions', 'NER')
        import_id_fields = ('title', 'directions', 'ingredients')
        use_bulk = True
        skip_unchanged = True
        report_skipped = True

    def dehydrate_ingredients(self, recipe):
        return json.dumps(recipe.ingredients)
    def dehydrate_directions(self, recipe):
        return json.dumps(recipe.directions)
    def dehydrate_NER(self, recipe):
        return json.dumps(recipe.NER)
    
    def hydrate_ingredients(self, row):
        try:
            return json.loads(row.get('ingredients', '[]'))
        except Exception:
            return []

    def hydrate_directions(self, row):
        try:
            return json.loads(row.get('directions', '[]'))
        except Exception:
            return []
        
    def hydrate_NER(self, row):
        try:
            return json.loads(row.get('NER', '[]'))
        except Exception:
            return []
        
    def import_data(self, dataset, dry_run = True, raise_errors=True, use_transactinos=None, **kwargs):
        from import_export.results import Result
        result = Result()

        if dry_run:
            return super().import_data(dataset, dry_run, raise_errors, use_transactinos, **kwargs)
        
        recipes = []
        for row in dataset.dict:
            try:
                recipes.append(Recipes(
                    title = row['title'],
                    ingredients=json.loads(row.get('ingredients', '[]')),
                    directions=json.loads(row.get('directions', '[]')),
                    NER=json.loads(row.get('NER', '[]'))
                ))
            except Exception as e:
                result.invalid_rows.append((row, str(e)))
            
        if not dry_run:
            Recipes.objects.bulk_create(recipes, batch_size=100000)

        result.totals['new'] = len(recipes)
        return result
    