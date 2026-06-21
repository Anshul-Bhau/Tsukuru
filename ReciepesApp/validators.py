import re
from django.core.exceptions import ValidationError

class ComplexityValidator:
    def validate(self, password, user=None):
        errors = []
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase.")
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one digit.")
        if not re.search(r'[^\w\s]', password):
            errors.append("Password must contain at least one special character.")
        if errors:
            raise ValidationError(errors)
    
    def get_help_text(self):
        return "Password must include an uppercase letter, a lowercase letter, a digit, and a special character."