from allauth.account.forms import LoginForm
from django import forms

class CustomLoginForm(LoginForm):
    remember = forms.BooleanField(required=False, label="Remember Me")

    def login(self, *args, **kwargs):
        remember = self.cleaned_data.get('remember')
        if not remember:
            self.request.session.set_expiry(0)  # Expire on browser close
            self.request.session.modified = True
        return super().login(*args, **kwargs)
