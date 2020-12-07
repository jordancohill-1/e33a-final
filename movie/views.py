import json
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.serializers import serialize
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Comment
 


def display(request, comments, user=None, view=None):

    page_index = request.GET.get("page", 1)
    paginator = Paginator(comments, 5)
    page = paginator.page(page_index)

    return render(request, "movie/index.html", {
        "comments": comments,
        "page": page,
        "user": user,
        "view": view
    })


def index(request):
    comments = Comment.objects.order_by("-timestamp").all()
    return display(request, comments, None, "default")

############################## MovieData ###############################################
def moviedata(request, id):
    comments = Comment.objects.filter(imdbId=id).order_by("-timestamp").all()
    return display(request, comments, None, "moviedata")

################################ PROFILE ########################################
def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise Http404("User does not exist.")
    comments = Comment.objects.filter(user=user).order_by("-timestamp").all()
    return display(request, comments, user, "profile")

################################# FOLLOW  ########################################
@login_required
def follow(request, username):
    if request.method == "POST":
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User does not exist.") 
        if user != request.user:
            if 'follow' in request.POST:
                user.followers.add(request.user)
            else:
               user.followers.remove(request.user) 
    return HttpResponseRedirect(reverse("profile", args=(username,)))

@login_required
def following(request):
    comments = Comment.objects.filter(user__in=request.user.following.all()).order_by("-timestamp").all()
    return display(request, comments)

################################# COMMENTS ########################################
@login_required
def new_comment(request):
    if request.method == "POST":
        c = Comment(
            content=request.POST["comment-text"],
            user=request.user,
            imdbId= request.POST["id"]
        )
        c.save()
    return HttpResponseRedirect(reverse("index"))

################################# EDIT ########################################

@login_required
def edit(request, id):
    if request.method == "POST":
        try:
            comment = Comment.objects.get(id=id)
            imdbId = comment.imdbId;
        except comment.DoesNotExist:
            raise Http404("Comment does not exist.") 
        if 'edit' in request.POST:
            comment.content = request.POST["content"];
            comment.save();
        else: comment.delete();
    if(request.POST["m"]== "movie"):
        return HttpResponseRedirect(reverse("moviedata", args=(imdbId,)))
    else:
        return HttpResponseRedirect(reverse("index"))

########################### LIKE ########################################################
@login_required
def like(request, comment_id):
    try:
        print('entered')
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({"error": "Comment not found."}, status=404)

    if request.method == "PUT":
        data = json.loads(request.body)
        like = bool(data.get("like"))
        if like:
            print('here')
            request.user.likes.add(comment)
        else:
            print('there')
            request.user.likes.remove(comment)
    
    return JsonResponse({
        "id": comment_id,
        "content": comment.content,
        "likes": comment.likes.count()
    })

#####################LOGIN/REGISTER/LOGOUT GIVEN FROM NETWORK############################

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "movie/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "movie/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "movie/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "movie/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "movie/register.html")
