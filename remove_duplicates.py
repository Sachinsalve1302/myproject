import os
import django
from django.db.models import Count

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from myapp.models import Song

# Find duplicate songs based on song_name + movie_title
duplicates = Song.objects.values('song_name', 'movie_title') \
                .annotate(count_id=Count('id')) \
                .filter(count_id__gt=1)

for dup in duplicates:
    # Get all duplicates ordered by id (oldest first)
    songs = Song.objects.filter(song_name=dup['song_name'], movie_title=dup['movie_title']).order_by('id')
    # Keep the first one, delete the rest
    for s in songs[1:]:
        s.delete()

print("Duplicate songs removed!")
