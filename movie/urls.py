
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("comment", views.new_comment, name="new_comment"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.following, name="following"),
    path("edit/<int:id>", views.edit, name="edit"),
    path("profile/<str:username>/follow", views.follow, name="follow"),
    path("like/<int:comment_id>", views.like, name="like"),
    path("moviedata/<str:id>", views.moviedata, name="moviedata")

]
