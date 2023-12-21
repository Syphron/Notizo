from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('', views.Routes, name="routes"),  # Zugriff auf die Routen
    path('notes/', views.GetNotes.as_view(), name="notes"),
    path('notes/<str:pk>/', views.GetNote.as_view(), name="note"),
    path('logout_view/', views.logout_view, name="logout_view"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

