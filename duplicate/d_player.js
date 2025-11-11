document.addEventListener("DOMContentLoaded", () => {
    const miniPlayer = document.getElementById("mini-player");
    const miniCover = document.getElementById("mini-cover");
    const miniTitle = document.getElementById("mini-title");
    const miniArtist = document.getElementById("mini-artist");
    const miniPlay = document.getElementById("mini-play");

    const lastPlayed = JSON.parse(localStorage.getItem("lastPlayed"));

    if (lastPlayed) {
        miniPlayer.classList.remove("hidden");
        miniCover.src = lastPlayed.cover_image;
        miniTitle.textContent = lastPlayed.song_name;
        miniArtist.textContent = `${lastPlayed.movie_title}. ${lastPlayed.artist}`;

        // create audio object
        const audio = new Audio(lastPlayed.audio_file);
        audio.currentTime = lastPlayed.currentTime || 0;

        // Try autoplay
        audio.play().then(() => {
            miniPlay.textContent = "⏸";  // Update play/pause button
        }).catch(() => {
            // Autoplay blocked by browser, user must click
            miniPlay.textContent = "⏯";
        });

        // Play/pause toggle
        miniPlay.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                miniPlay.textContent = "⏸";
            } else {
                audio.pause();
                miniPlay.textContent = "⏯";
            }
        });
    }
});
