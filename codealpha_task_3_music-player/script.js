const songs = [
  { title: 'Midnight Glow', artist: 'Luna Vale', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Golden Hour', artist: 'Mika Ray', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Soft Echo', artist: 'Noah Lane', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Velvet Sky', artist: 'Ari Moss', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'Summer Drift', artist: 'Nia Cole', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { title: 'Moonlit River', artist: 'Theo Brooks', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { title: 'Dreamcatcher', artist: 'Elia Quinn', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { title: 'Starlight Breeze', artist: 'Mira Chen', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];

const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progressEl = document.getElementById('progress');
const volumeEl = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 0;
let audio = new Audio(songs[0].src);
audio.autoplay = true;

function formatTime(time) {
  if (!time || Number.isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('li');
    item.textContent = `${song.title} — ${song.artist}`;
    if (index === currentIndex) item.classList.add('active');
    item.addEventListener('click', () => playSong(index));
    playlistEl.appendChild(item);
  });
}

function updateInfo() {
  const song = songs[currentIndex];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  renderPlaylist();
}

function playSong(index) {
  currentIndex = index;
  audio.src = songs[currentIndex].src;
  audio.currentTime = 0;
  audio.play();
  playPauseBtn.textContent = '⏸';
  updateInfo();
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
}

playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

progressEl.addEventListener('input', () => {
  const seekTime = (progressEl.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

volumeEl.addEventListener('input', () => {
  audio.volume = volumeEl.value;
});

audio.addEventListener('timeupdate', () => {
  durationEl.textContent = formatTime(audio.duration);
  currentTimeEl.textContent = formatTime(audio.currentTime);
  progressEl.value = (audio.currentTime / audio.duration) * 100 || 0;
});

audio.addEventListener('ended', nextSong);

updateInfo();
