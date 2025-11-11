from django.shortcuts import render,get_object_or_404,redirect
from rest_framework import viewsets
from .models import Song
from .serializers import SongSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by("-uploaded_at")
    serializer_class = SongSerializer


def music_player(request):
    songs=Song.objects.all()
    context={
        "songs":songs
    }
    return render(request, "player.html",context)   


def audio(request, song_name):
    # Find the song by slugified title
    song_name_clean = song_name.replace("-", " ")
    song = get_object_or_404(Song, song_name__iexact=song_name_clean)
    songs = Song.objects.all()

    songs_list = [
        {
            "id": s.id,
            "movie_title": s.movie_title,
            "artist": s.artist,
            "song_name": s.song_name,
            "audio_file": s.audio_file.url,
            "cover_image": s.cover_image.url
        } for s in songs
    ]

    return render(request, "audio.html", {"song": song, "songs": songs_list})

def player(request):
    song_id = request.GET.get("song")
    songs = Song.objects.all()
    current_song = None

    if song_id:
        current_song = Song.objects.filter(id=song_id).first()

    return render(request, "player.html", {
        "songs": songs,
        "current_song": current_song,
    })
