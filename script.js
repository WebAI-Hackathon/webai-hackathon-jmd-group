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
  '#keyboard',
  '#clock',
  '#telephone',
  '#ventilator',
  '#fridge',
  '#tv',
  '#lo-fi-music',
  '#arcade-music',
  '#classical-music'
]

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
  const { desc } = e.detail;
  const { value } = e.detail;
  const { sliderNumber } = e.detail;
  console.log(value);
  console.log(sliderNumber);
  document.querySelector(allSounds[sliderNumber-1] + ' input[type=range]').value = value;
  adjustAudio(document.querySelector(allSounds[sliderNumber-1] + ' input[type=range]'), value, allSounds[sliderNumber-1] + ' audio');
});

function adjustAudio(desc, value, tag) {
    desc.value = value
    document.querySelector(tag).volume = value/100;
    document.querySelector(tag).play();
    console.log(desc)   
  };

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

 document.getElementById('gen-form').onclick = async () => {
  let audioValues = [];
  let prompt = `Realistic image with `
  let totalValue = 0;

  document.getElementById("waitText").style.visibility = "visible";

  document.querySelectorAll('.audioPlayer').forEach(r => {
    let valueName = "";
    let value = parseInt(r.querySelector("input").value);
    totalValue += value;

    if (value != 0) {
          if (value > 0 && value <= 30) {
        valueName = "a little bit of ";
        audioValues.push({id: r.id, value: valueName});
      } else if (value > 30 && value <=60) {
        valueName = "some ";
        audioValues.push({id: r.id, value: valueName});
      } else {
        valueName = "a lot of ";
        audioValues.push({id: r.id, value: valueName});
      }

    }
    });

  if (totalValue === 0) {
    console.log("All values are zero, image won't generate");
    document.getElementById("waitText").innerHTML = "Select at least one sound to generate an image.";
    return;
  }

  audioValues.forEach(v => {
    prompt = prompt + " " + v.value + " " + v.id;
  })
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
}

function hover() {
    document.getElementById("staticTV").style.opacity = "70%";
}

function unhover() {
    document.getElementById("staticTV").style.opacity = "30%"
}

function start() { //here comes the preset
    document.getElementById("tv-wrapper").innerHTML = `<img src="images/tv screen.png" class="tv-frame">

                <!--Screen-->
                <div class="tv-screen" id="screen">

                    <img src="images/staticTV2.gif" id="staticTV" alt="">
                    
                    <img src="images/raw.png" id="imageTV" style="width: 800px; height: 800">
                    
                    <p id="channel">Ch. 01</p>

                    <p id="waitText"> <-select the sounds that you prefer</p>

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
            size: "1036x1085"
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