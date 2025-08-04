const Songs = [
  { title: "AAndhakar Kotha Ma", music: "songs/song01.mp3" },
  { title: "Layeko Maya", music: "songs/song02.mp3" },
  { title: "Orali Ukali", music: "songs/song03.mp3" },
  { title: "Bartika Eam Rai", music: "songs/song04.mp3" },
  { title: "Hindi Mashup", music: "songs/song05.mp3" },
  { title: "Sajada Tere Bin", music: "songs/song06.mp3" },
  { title: "Say You Wont Let Go", music: "songs/song07.mp3" },
  { title: "Jiunu Nai Hola", music: "songs/song08.mp3" },
  { title: "Mitho Sapana", music: "songs/song09.mp3" },
];

const AudioBook = Songs.map(song => ({
  title: song.title,
  audio: new Audio(song.music)
}));

let CurrentPlayingIndex = null;

function Rennder() {
  const playlist = document.getElementById("playlist");
  playlist.innerHTML = "";

  AudioBook.forEach((song, i) => {
    const p = document.createElement("p");
    p.textContent = song.title;
    p.addEventListener("click", () => playAudio(i));
    p.id = "song-" + i;

    if (i === CurrentPlayingIndex) p.classList.add("active");

    playlist.appendChild(p);
  });
}

function playAudio(index) {
  if (CurrentPlayingIndex !== null && CurrentPlayingIndex !== index) {
    AudioBook[CurrentPlayingIndex].audio.pause();
    AudioBook[CurrentPlayingIndex].audio.currentTime = 0;
    removeAudioEventListeners(CurrentPlayingIndex);
  }

  if (AudioBook[index]) {
    AudioBook[index].audio.play();
    CurrentPlayingIndex = index;

    updateUIForCurrentSong();
    Rennder();
    addAudioEventListeners(index);
  }
}

function PauseAudio() {
  if (CurrentPlayingIndex === null) return;

  const toggleBtn = document.getElementById('play-pause');
  const currentAudio = AudioBook[CurrentPlayingIndex].audio;

  if (currentAudio.paused) {
    currentAudio.play();
    toggleBtn.textContent = "Pause";
  } else {
    currentAudio.pause();
    toggleBtn.textContent = "Play";
  }
}

function PlayNext() {
  if (CurrentPlayingIndex === null) {
    CurrentPlayingIndex = 0;
  } else {
    CurrentPlayingIndex = (CurrentPlayingIndex + 1) % AudioBook.length;
  }
  playAudio(CurrentPlayingIndex);
}

function PlayPrevious() {
  if (CurrentPlayingIndex === null || CurrentPlayingIndex === 0) {
    CurrentPlayingIndex = AudioBook.length - 1;
  } else {
    CurrentPlayingIndex = CurrentPlayingIndex - 1;
  }
  playAudio(CurrentPlayingIndex);
}

function stopAllAudio() {
  AudioBook.forEach((song, i) => {
    song.audio.pause();
    song.audio.currentTime = 0;
    removeAudioEventListeners(i);
  });
}

function updateUIForCurrentSong() {
  const toggleBtn = document.getElementById('play-pause');
  toggleBtn.textContent = "Pause";

  document.getElementById("current-title").textContent = AudioBook[CurrentPlayingIndex].title;
  updateProgressBar();
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return `${mins < 10 ? "0"+mins : mins}:${secs < 10 ? "0"+secs : secs}`;
}

function updateProgressBar() {
  if (CurrentPlayingIndex === null) return;

  const audio = AudioBook[CurrentPlayingIndex].audio;
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);

  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  }
}

function addAudioEventListeners(index) {
  const audio = AudioBook[index].audio;
  audio.ontimeupdate = updateProgressBar;
  audio.onended = () => PlayNext();
}

function removeAudioEventListeners(index) {
  const audio = AudioBook[index].audio;
  audio.ontimeupdate = null;
  audio.onended = null;
}

document.getElementById("progress-container").addEventListener("click", (e) => {
  if (CurrentPlayingIndex === null) return;

  const progressContainer = e.currentTarget;
  const audio = AudioBook[CurrentPlayingIndex].audio;
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const newTime = (clickX / width) * audio.duration;
  audio.currentTime = newTime;
  updateProgressBar();
});

Rennder();
