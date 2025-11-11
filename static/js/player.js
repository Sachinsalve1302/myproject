
document.addEventListener("DOMContentLoaded", () => {
  // Only run this JS on the player page
  if (!document.querySelector(".rightside")) return;

  // --- Mini Player Elements ---
  const miniPlayer = document.getElementById("mini-player");
  const miniCover = document.getElementById("mini-cover");
  const miniTitle = document.getElementById("mini-title");
  const miniArtist = document.getElementById("mini-artist");
  const miniPlayBtn = document.getElementById("mini-play");
  const miniPrevBtn = document.getElementById("mini-prev");
  const miniNextBtn = document.getElementById("mini-next");
  const miniAudio = document.getElementById("mini-audio");
  const progress = document.getElementById("mini-progress");
  const currentEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration-time");

  if (!window.songs || window.songs.length === 0) return;

  let currentIndex = -1;
  let isPlaying = false;

  // --- Time formatting helper ---
  const fmtTime = sec => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // --- Play a song by index ---
  function playSong(index) {
    if (index < 0 || index >= window.songs.length) return;
    const song = window.songs[index];
    currentIndex = index;

    miniCover.src = song.cover_image;
    miniTitle.textContent = song.song_name;
    miniArtist.textContent = `${song.movie_title} • ${song.artist}`;
    miniAudio.src = song.audio_file;
    miniPlayer.classList.add("show");

    miniAudio.play()
      .then(() => {
        isPlaying = true;
        miniPlayBtn.textContent = "⏸";
      })
      .catch(() => {
        isPlaying = false;
        miniPlayBtn.textContent = "⏯";
      });
  }

  // --- Click main song covers ---
  document.querySelectorAll(".cover").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const id = parseInt(img.dataset.id);
      const index = window.songs.findIndex(s => s.id === id);
      if (index !== -1) playSong(index);
    });
  });

  // --- Play/Pause Toggle ---
  miniPlayBtn.addEventListener("click", () => {
    if (!miniAudio.src) return;
    if (isPlaying) miniAudio.pause();
    else miniAudio.play();
    isPlaying = !isPlaying;
    miniPlayBtn.textContent = isPlaying ? "⏸" : "⏯";
  });

  // --- Next / Previous Buttons ---
  miniNextBtn.addEventListener("click", () => {
    if (currentIndex < window.songs.length - 1) playSong(currentIndex + 1);
  });

  miniPrevBtn.addEventListener("click", () => {
    if (currentIndex > 0) playSong(currentIndex - 1);
  });

  // --- Update Progress Bar ---
  miniAudio.addEventListener("timeupdate", () => {
    progress.value = miniAudio.currentTime;
    if (currentEl) currentEl.textContent = fmtTime(miniAudio.currentTime);
  });

  miniAudio.addEventListener("loadedmetadata", () => {
    progress.max = miniAudio.duration;
    if (durationEl) durationEl.textContent = fmtTime(miniAudio.duration);
  });

  progress.addEventListener("input", () => {
    miniAudio.currentTime = progress.value;
  });

  // --- Auto Next Song ---
  miniAudio.addEventListener("ended", () => {
    if (currentIndex < window.songs.length - 1) playSong(currentIndex + 1);
    else {
      isPlaying = false;
      miniPlayBtn.textContent = "⏯";
    }
  });

 const searchInput = document.getElementById("song-search");
const containers = document.querySelectorAll(".container");
const headings = document.querySelectorAll(".language-name");

if (searchInput) {
  const filterSongs = () => {
    const query = searchInput.value.toLowerCase().trim();

    // Hide all language headings if searching, show if empty
    headings.forEach(h => h.style.display = query ? 'none' : 'block');

    containers.forEach(container => {
      const items = container.querySelectorAll(".img-name-con");

      items.forEach(item => {
        const coverId = parseInt(item.querySelector(".cover").dataset.id);
        const song = window.songs.find(s => s.id === coverId);
        if (!song) return;

        if (
          song.song_name.toLowerCase().includes(query) ||
          (song.movie_title || '').toLowerCase().includes(query) ||
          (song.artist || '').toLowerCase().includes(query)
        ) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  };

  searchInput.addEventListener("input", filterSongs);

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterSongs();
    }
  });
}


});
