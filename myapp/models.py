# models.py
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Song(models.Model):
    language = models.CharField(max_length=50)
    movie_title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, null=True, blank=True)
    song_name = models.CharField(max_length=100)
    audio_file = models.FileField(upload_to='songs/audio/')
    cover_image = models.ImageField(upload_to='songs/covers/')
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.song_name} - {self.movie_title} ({self.language})"


# ---------------- PLAYLIST MODEL ----------------
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    songs = models.ManyToManyField(Song, blank=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


# ---------------- PLAYLIST-SONG RELATIONSHIP ----------------
class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='playlist_songs')
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('playlist', 'song')  # Prevent duplicate songs in same playlist

    def __str__(self):
        return f"{self.song.song_name} in {self.playlist.name}"