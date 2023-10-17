let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio;
let isRecording = false;
let isPlaying = false;

const toggleButton = document.getElementById("toggleButton");
const playButton = document.getElementById("playButton");

toggleButton.addEventListener("click", async () => {
  if (!isRecording) {
    toggleButton.style.backgroundColor = "red";
    toggleButton.textContent = "stoppen";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      audioUrl = URL.createObjectURL(audioBlob);
      audio = new Audio(audioUrl);
    };

    mediaRecorder.start();
    isRecording = true;
  } else {
    mediaRecorder.stop();
    toggleButton.style.backgroundColor = "";
    toggleButton.textContent = "opnemen";
    isRecording = false;
  }
});

playButton.addEventListener("click", () => {
  if (audio) {
    if (!isPlaying) {
      audio.play();
      playButton.textContent = "stoppen";
      isPlaying = true;

      audio.addEventListener("ended", () => {
        playButton.textContent = "terugluisteren";
        isPlaying = false;
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
      playButton.textContent = "terugluisteren";
      isPlaying = false;
    }
  }
});

document.getElementById("downloadButton").addEventListener("click", () => {
  if (audioBlob) {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "myRecording.wav";
    a.click();
  }
});
