from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("document/", DocumentAPIView.as_view(), name="document"),
]
