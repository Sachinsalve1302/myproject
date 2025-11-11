
const song = document.getElementById("mysong");
const playPause = document.getElementById("playPause");
const progress = document.getElementById("progress");
const durationEl = document.getElementById("duration");
const currentEl = document.getElementById("current");
const coverEl = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let isSeeking = false;
let currentIndex = 0;

// ✅ Load playlist from JSON
const songs = JSON.parse(document.getElementById("playlist-data").textContent);
console.log(songs);

const container = document.querySelector(".container");
const currentSongId = parseInt(container.dataset.currentId);

currentIndex = songs.findIndex(s => s.id === currentSongId);
// Truncate the title on initial page load
titleEl.textContent = truncateText(titleEl.textContent, 19);


// Format time
function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}
window.addEventListener("popstate", () => {
    const path = window.location.pathname; // e.g., /audio/song-name/
    const slug = path.split("/").filter(Boolean).pop();
    const songIndex = songs.findIndex(s => slugify(s.song_name) === slug);
    if (songIndex !== -1) loadSong(songIndex);
});


// function slugify(str) {
//   return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
// }

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, '');      // remove leading/trailing dash
}


function truncateText(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}


function loadSong(index) {
  if (index < 0 || index >= songs.length) return;
  const s = songs[index];

  song.src = s.audio_file;
  coverEl.src = s.cover_image;
  titleEl.textContent = s.song_name;
  artistEl.textContent = s.artist;
  artistEl.textContent = `${s.movie_title}. ${s.artist}`;

  titleEl.textContent = truncateText(s.song_name, 19);

  currentIndex = index;

  const slugTitle = slugify(s.song_name);
  window.history.replaceState({}, `${s.song_name}`, `/audio/${slugTitle}/`);


  const handleCanPlay = () => {
    song.play();
    playPause.textContent = "⏸";
    progress.max = song.duration;
    song.removeEventListener("canplay", handleCanPlay);
  };
  song.addEventListener("canplay", handleCanPlay);
  song.load();
}





// Play/Pause
playPause.addEventListener("click", () => {
  if (song.paused) {
    song.play();
    playPause.textContent = "⏸";
  } else {
    song.pause();
    playPause.textContent = "▶";
  }
});

// Metadata loaded
song.addEventListener("loadedmetadata", () => {
  durationEl.textContent = fmtTime(song.duration);
  progress.max = song.duration;
});

// Update progress
song.addEventListener("timeupdate", () => {
  if (!isSeeking) {
    progress.value = song.currentTime;
    currentEl.textContent = fmtTime(song.currentTime);
  }
});

// Seeking
progress.addEventListener("mousedown", () => isSeeking = true);
progress.addEventListener("touchstart", () => isSeeking = true);

progress.addEventListener("input", () => {
  if (isSeeking) {
    currentEl.textContent = fmtTime(progress.value);
  }
});

// function stopSeek() {
//   if (isSeeking) {
//     song.currentTime = progress.value;
//     isSeeking = false;
//   }
// }

// function stopSeek() {
//   if (isSeeking) {
//     if(song.readyState >= 2){  // HAVE_CURRENT_DATA
//       song.currentTime = progress.value;
//     }
//     isSeeking = false;
//   }
// }

function stopSeek() {
  if (isSeeking) {
    if (song.readyState >= 1) { // HAVE_METADATA
      song.currentTime = progress.value;
    } else {
      song.addEventListener("loadedmetadata", () => {
        song.currentTime = progress.value;
      }, { once: true });
    }
    isSeeking = false;
  }
}





progress.addEventListener("mouseup", stopSeek);
progress.addEventListener("touchend", stopSeek);

// Next & Prev
nextBtn.addEventListener("click", () => {
  let nextIndex = (currentIndex + 1) % songs.length;
  loadSong(nextIndex);
  // const slugTitle = slugify(songs[nextIndex].song_name);
  // window.location.href = `/audio/${slugTitle}/`;
});

prevBtn.addEventListener("click", () => {
  let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex);
  // const slugTitle = slugify(songs[prevIndex].song_name);
  // window.location.href = `/audio/${slugTitle}/`;
});

// Auto play next when song ends
song.addEventListener("ended", () => {
  let nextIndex = (currentIndex + 1) % songs.length;
  loadSong(nextIndex);
});



const backBtn = document.getElementById("backToHome");
backBtn.addEventListener("click", () => {
    const s = songs[currentIndex];
    localStorage.setItem("lastPlayed", JSON.stringify({
        ...s,
        currentTime: song.currentTime  // save current position
    }));
    window.location.href = "/player/";
});








