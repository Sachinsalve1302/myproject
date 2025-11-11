# music_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongViewSet
from . import views

router = DefaultRouter()
router.register(r'songs', SongViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Player
    path("player/", views.player, name="player"),

    # Playlists
    path("playlist/", views.playlist_view, name="playlist"),
    path("playlist/<int:playlist_id>/", views.playlist_detail, name="playlist_detail"),
    path("playlist/<int:playlist_id>/add/", views.add_songs, name="add_songs"),

    # Add or remove a single song
    path("playlist/<int:playlist_id>/add-song/<int:song_id>/", views.add_song_to_playlist, name="add_song_to_playlist"),
    path("playlist/<int:playlist_id>/remove-song/<int:song_id>/", views.remove_from_playlist, name="remove_from_playlist"),

    path('delete_playlist/<int:playlist_id>/', views.delete_playlist, name='delete_playlist'),
    path('rename_playlist/<int:playlist_id>/', views.rename_playlist, name='rename_playlist'),


    # Authentication
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
