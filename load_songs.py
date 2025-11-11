import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from myapp.models import Song

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(BASE_DIR, "static", "data", "songs.json")

with open(json_path, "r", encoding="utf-8") as f:
    songs_data = json.load(f)

for s in songs_data:
    # Check if the song already exists
    if not Song.objects.filter(song_name=s["song_name"], movie_title=s["movie_title"]).exists():
        Song.objects.create(
            language=s["language"],
            movie_title=s["movie_title"],
            artist=s.get("artist", ""),
            song_name=s["song_name"],
            audio_file=f'songs/audio/{s["audio_file"].split("/")[-1]}',
            cover_image=f'songs/covers/{s["cover_image"].split("/")[-1]}',
            uploaded_at=s["uploaded_at"]
        )

print("Songs loaded successfully!")
