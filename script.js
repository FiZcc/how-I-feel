const audio = document.getElementById("song");
const lyricsBox = document.getElementById("lyrics");

let lyrics = [];
fetch("lyrics.json")
  .then(r => r.json())
  .then(data => lyrics = data);

audio.addEventListener("timeupdate", () => {
  let current = audio.currentTime;

  let active = "";
  for (let i = 0; i < lyrics.length; i++) {
    if (current >= lyrics[i].time) {
      active = lyrics[i].text;
    }
  }

  lyricsBox.textContent = active;
});
