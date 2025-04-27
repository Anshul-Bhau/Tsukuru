from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        # Always allow auto signup without intermediate page
        return True

# import pandas as pd

# df = pd.read_csv(r"D:\downloads\reciepes_imges\images^Mrecipes.csv")

# # Print a few samples
# for i, val in enumerate(df['ingredients'].head(10)):
#     print(f"Row {i}: {val} — {type(val)}")