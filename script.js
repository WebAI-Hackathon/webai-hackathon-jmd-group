const allSounds = [
  '#wind',
  '#rain',
  '#water_stream',
  '#ocean_waves',
  '#forest',
  '#campfire',
  '#crickets',
  '#owl',
  '#frogs',
  '#wolf',
  '#dog-barking',
  '#cat-purring',
  '#traffic-vehicles',
  '#ambulance',
  '#construction-site',
  '#people-chattering',
  '#baby-crying',
  '#fireworks',
  '#typing-keyboard',
  '#clock',
  '#telephone',
  '#ventilator',
  '#fridge',
  '#tv',
  '#lo-fi-music',
  '#arcade-music',
  '#classical-music'
];

/*
document.getElementById("waitText") = async () => {
  let audioValues = [];
  let prompt = "relaxing "
  document.querySelectorAll('.audioPlayer').forEach(r => {
    let valueName = "";
    let value = r.querySelector("input").value;
    if (value == 0) {

    } else if (value > 0 && value <= 30) {
      valueName = "small ";
      audioValues.push({id: r.id, value: valueName});
    } else if (value > 30 && value <=60) {
      valueName = "medium ";
      audioValues.push({id: r.id, value: valueName});
    } else {
      valueName = "big ";
      audioValues.push({id: r.id, value: valueName});
    }
    console.log(audioValues);
  })
  audioValues.forEach(v => {
    prompt = prompt + " " + v.value + " " + v.id;
  })
  console.log(prompt);
  try {
        document.getElementById("waitText").innerHTML = "Generating image...";
        const imageUrl = await generateImage(prompt);
        document.getElementById("tv-wrapper").innerHTML = `<img src="images/tv screen.png" class="tv-frame"><div class="tv-screen" id="screen"><img src="images/staticTV2.gif" id="staticTV" alt=""><img src="data:image/png;base64,${imageUrl}" id="imageTV"><p id="channel">Ch. 01</p><p id="wait"></p><img src="images/tvLogo_1.gif" id="TVlogo" alt=""></div>`;
      } catch (err) {
        console.error(err);
        document.getElementById('screen').innerHTML = `<span class="warn">Error: ${err.message}</span>`;
      }
} */

document.querySelectorAll('.audioPlayer').forEach(player => {
            const audio = player.querySelector('audio');
            const slider = player.querySelector('.volumeSlider');

            // Set initial volume
            audio.volume = slider.value;

            // Update volume when slider changes
            slider.addEventListener('input', () => {
                audio.play();
                audio.volume = +slider.value/100;
            });
        });

document.querySelector('[name=adjust_audio]').addEventListener('call', async (e) => {
  const { desc, value, sliderNumbers } = e.detail;

  if (!sliderNumbers || !Array.isArray(sliderNumbers)) {
    console.warn("No valid slider numbers received.");
    return;
  }

  sliderNumbers.forEach((sliderNumber) => {
    const selector = allSounds[sliderNumber - 1];
    const slider = document.querySelector(`${selector} input[type=range]`);
    const audioTag = document.querySelector(`${selector} audio`);

    if (!slider || !audioTag) {
      console.warn(`Slider or audio not found for slider number: ${sliderNumber}`);
      return;
    }

    slider.value = value;
    adjustAudio(slider, value, audioTag);
  });
});


function adjustAudio(sliderElement, value, audioElement) {
  sliderElement.value = value;
  audioElement.volume = value / 100;

  try {
    audioElement.play();
  } catch (err) {
    console.error("Playback error:", err);
  }

  console.log(`Adjusted slider to ${value}, volume set on:`, audioElement);
}


document.querySelector('[name=reset_audio]').addEventListener('call', async (e) => {
  const { desc } = e.detail;
  console.log("Reset requested:", desc);

  allSounds.forEach((selector, index) => {
    const slider = document.querySelector(selector + ' input[type=range]');
    const audio = document.querySelector(selector + ' audio');

    if (slider && audio) {
      slider.value = 0;
      audio.volume = 0;
      audio.pause(); 
    }
  });
});

document.querySelector('[name=generate_image]').addEventListener('call', async (e) => {
  const { trigger } = e.detail;
  console.log("Generating image with trigger:", trigger);

  document.getElementById('gen-form').click();
});


document.getElementById('gen-form').onclick = async () => {
  let audioValues = [];
  let prompt = "a peruvian guy with"
  let totalValue = 0;

  document.getElementById("waitText").style.visibility = "visible";

  document.querySelectorAll('.audioPlayer').forEach(r => {
    let value = parseInt(r.querySelector("input").value);
    totalValue += value;

    if (value > 0) {
        let intensity = value <= 50 ? "some" : "a lot of";
        audioValues.push(`${intensity} ${r.id}`);
    }
  });

  if (totalValue === 0) {
    console.log("All values are zero, image won't generate");
    document.getElementById("waitText").innerHTML = "Select at least one sound to generate an image.";
    return;
  }

  if (audioValues.length === 1) {
    prompt += ` ${audioValues[0]}`;
  } else if (audioValues.length === 2) {
    prompt += ` ${audioValues[0]} and ${audioValues[1]}`;
  } else {
    prompt += ` ${audioValues.slice(0, -1).join(', ')}, and ${audioValues.slice(-1)}`;
  }

  console.log(prompt);
    try {
        document.getElementById("waitText").innerHTML = "Generating image...";
        const imageUrl = await generateImage(prompt);
        document.getElementById("tv-wrapper").innerHTML = `
            <img src="images/tv screen.png" class="tv-frame">
            <div class="tv-screen" id="screen">
                <img src="images/staticTV2.gif" id="staticTV" alt="">
                <img src="data:image/png;base64,${imageUrl}" id="genImage">
                <p id="channel">Ch. 01</p>
                <p id="waitText" style="visibility: hidden;">placeholder</p>
                <img src="images/tvLogo_1.gif" id="TVlogo" alt="">
            </div>`;
    } catch (err) {
        console.error(err);
        document.getElementById('screen').innerHTML = `<span class="warn">Error: ${err.message}</span>`;
    }
};

const OPENAI_API_KEY = 'sk-Uyd5NxnfGjQR-S7UN2eJGQ'; // Replace with your API key

    async function generateImage(prompt) {
      try {
        const response = await fetch('https://api.litviva.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          mode: "cors",
          credentials: 'include',
          body: JSON.stringify({
            model: "hackathon/text2image",
            prompt: prompt,
            n: 1,
            size: "1013x772"
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || response.statusText);
        }

        const data = await response.json();
        return data.data[0].b64_json;
      } catch (err) {
        throw err;
      }
    }


    
//Sidenav

function openNav() {
  document.getElementById("sidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("sidenav").style.width = "0";
}
function start() { //here comes the preset
    document.getElementById("tv-wrapper").innerHTML = `<img src="images/tv screen.png" class="tv-frame">

                <!--Screen-->
                <div class="tv-screen" id="screen">

                    <img src="images/staticTV2.gif" id="staticTV" alt="">
                    
                    <img src="images/raw.png" id="imageTV" style="width: 100%; height: auto">
                    
                    <p id="channel">Ch. 01</p>

                    <p id="waitText" style="visibility: hidden;"> <-select the sounds that you prefer</p>

                    <img src="images/tvLogo_1.gif" id="TVlogo" alt="">

                </div>`;
    document.querySelectorAll('.audioPlayer').forEach(player => {
            const audio = player.querySelector('audio');
            const slider = player.querySelector('.volumeSlider');

            // Set initial volume
            audio.volume = 0;
            slider.value = 0;
        });
    document.getElementById("forest").querySelector("input").value = 60;
    document.getElementById("forest").querySelector("audio").volume = 0.6;
    document.getElementById("forest").querySelector("audio").play();
    document.getElementById("campfire").querySelector("input").value = 40;
    document.getElementById("campfire").querySelector("audio").volume = 0.4;
    document.getElementById("campfire").querySelector("audio").play();
    document.getElementById("wind").querySelector("input").value = 60;
    document.getElementById("wind").querySelector("audio").volume = 0.6;
    document.getElementById("wind").querySelector("audio").play();
    document.getElementById("crickets").querySelector("input").value = 30;
    document.getElementById("crickets").querySelector("audio").volume = 0.3;
    document.getElementById("crickets").querySelector("audio").play();
    document.getElementById("startButton").remove();
}

function hover() {
    document.getElementById("staticTV").style.opacity = "70%";
}

function unhover() {
    document.getElementById("staticTV").style.opacity = "30%"
}
