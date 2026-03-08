from django.urls import path
from . import views
urlpatterns = [
    path('',views.ProductListView.as_view(),name='products'),
    path('<int:id>/',views.ProductDeatilView.as_view())
]
