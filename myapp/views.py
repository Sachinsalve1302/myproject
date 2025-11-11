# myapp/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework import viewsets
from .models import Song, Playlist, PlaylistSong
from .serializers import SongSerializer
import json

# ----------------------------
# DRF ViewSet for API
# ----------------------------
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by("-uploaded_at")
    serializer_class = SongSerializer

# ----------------------------
# Player Page
# ----------------------------
@login_required
def player(request):
    song_id = request.GET.get("song")
    songs = Song.objects.all()
    current_song = Song.objects.filter(id=song_id).first() if song_id else None

    # Convert queryset to JSON serializable list for JS
    songs_list = [
        {
            "id": s.id,
            "language": s.language,
            "movie_title": s.movie_title,
            "artist": s.artist,
            "song_name": s.song_name,
            "audio_file": s.audio_file.url,
            "cover_image": s.cover_image.url
        } for s in songs
    ]

    context = {
        "songs": songs,
        "current_song": current_song,
        "songs_json": json.dumps(songs_list)
    }
    return render(request, "player.html", context)

# ----------------------------
# Playlist Views
# ----------------------------

@login_required
def playlist_view(request):
    playlists = Playlist.objects.filter(user=request.user)
    if request.method == "POST":
        name = request.POST.get("name")
        desc = request.POST.get("description", "")
        if name:
            Playlist.objects.create(user=request.user, name=name, description=desc)
            return redirect("playlist")
    return render(request, "playlist.html", {"playlists": playlists})

# @login_required
# def playlist_detail(request, playlist_id):
#     playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
#     songs = playlist.songs.all()
#      # Generate a random top color (but keep the black base same)
#     import random
#     hue = random.randint(0, 360)
#     playlist.top_color = f"hsl({hue}, 80%, 40%)"

#     return render(request, 'playlist_detail.html', {'playlist': playlist, 'songs': songs})

@login_required
def playlist_detail(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    songs = playlist.songs.all()

    import random
    random.seed(playlist.id) 
    hue = random.randint(0, 360)
    playlist.top_color = f"hsl({hue}, 95%, 50%)"

    unique_artists =list(songs.values_list('artist', flat=True).distinct()) 
    limited_artists = unique_artists[:5]
    if len(unique_artists) > 5:
        limited_artists.append("and more…")



    return render(request, "playlist_detail.html", {
        "playlist": playlist,
        "songs": songs,
        "limited_artists": limited_artists,
    })




# ---- Add Songs Page ----
@login_required
def add_songs(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    all_songs = Song.objects.all()
    added_song_ids = playlist.songs.values_list('id', flat=True)

    return render(request, "myapp/add_songs.html", {
        "playlist": playlist,
        "songs": all_songs,
        "added_song_ids": added_song_ids
    })

# ---- Add single song to playlist ----
@login_required
def add_song_to_playlist(request, playlist_id, song_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    song = get_object_or_404(Song, id=song_id)
    playlist.songs.add(song)
    return redirect('add_songs', playlist_id=playlist.id)

# ---- Remove song from playlist ----
@login_required
def remove_from_playlist(request, playlist_id, song_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    song = get_object_or_404(Song, id=song_id)
    playlist.songs.remove(song)
    return redirect('playlist_detail', playlist_id=playlist.id)

# ----------------------------
# Authentication Views
# ----------------------------

def signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, "Passwords do not match")
            return redirect('signup')
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect('signup')

        User.objects.create_user(username=username, password=password1)
        messages.success(request, "Account created successfully! Please login.")
        return redirect('login')

    return render(request, 'signup.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('player')
        else:
            messages.error(request, "Invalid username or password")
            return redirect('login')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('player')


@login_required
def delete_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    playlist.delete()
    return redirect('playlist')

@login_required
def rename_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlist, id=playlist_id, user=request.user)
    if request.method == "POST":
        new_name = request.POST.get("new_name")
        if new_name:
            playlist.name = new_name
            playlist.save()
    return redirect('playlist')
