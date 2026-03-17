from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
   path('register/',views.RegisterView.as_view()),
   path('login/',views.LoginView.as_view()),
   path('user/',views.UserView.as_view()),
   path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
]
