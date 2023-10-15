
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;
    let audio;
    let isRecording = false;

    const toggleButton = document.getElementById("toggleButton");

    toggleButton.addEventListener("click", async () => {
      if (!isRecording) {
        // Change the button color and text when recording starts
        toggleButton.style.backgroundColor = "red";
        toggleButton.textContent = "Stop Recording";

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
        // Change the button color and text back when recording stops
        mediaRecorder.stop();
        toggleButton.style.backgroundColor = "";
        toggleButton.textContent = "Start Recording";
        isRecording = false;
      }
    });

    document.getElementById("playButton").addEventListener("click", () => {
      if (audio) {
        audio.play();
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