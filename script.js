const allSounds = [
  '#forest',
  '#water',
  '#animals'
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

//document.querySelector('[name=adjust_water]').addEventListener('call', async (e) => {
  //const { desc } = e.detail;
  //const { value } = e.detail;
  //console.log(value);
  //adjustAudio(document.querySelector('#water input[type=range]'), value, "#water audio");
//});

function adjustAudio(desc, value, tag) {
    desc.value = value
    document.querySelector(tag).volume = value/100;
    document.querySelector(tag).play();
    console.log(desc)   
  };

 document.getElementById('gen-form').onclick = async () => {
  let audioValues = [];
  let prompt = ""
  document.querySelectorAll('.audioPlayer').forEach(r => {
    let valueName = "";
    let value = r.querySelector("input").value;
    if (value == 0) {

    } else if (value > 0 && value <= 30) {
      valueName = "a little bit of ";
      audioValues.push({id: r.id, value: valueName});
    } else if (value > 30 && value <=60) {
      valueName = "a good amount of ";
      audioValues.push({id: r.id, value: valueName});
    } else {
      valueName = "a lot of ";
      audioValues.push({id: r.id, value: valueName});
    }
    console.log(audioValues);
  })
  audioValues.forEach(v => {
    prompt = prompt + " " + v.value + " " + v.id;
  })
  try {
        const imageUrl = await generateImage(prompt);
        document.getElementById("tv-wrapper").innerHTML = `<img src="images/tv screen.png" class="tv-frame"><div class="tv-screen" id="screen" style="background: url("data:image/png;base64,${imageUrl}") center; background-repeat: no-repeat; background-size: cover;"><img src="images/staticTV2.gif" id="staticTV" alt=""><p id="channel">Ch. 01</p><p id="wait"> <span id="waitText">Click me daddy 🥵</span> </p><img src="images/tvLogo_1.gif" id="TVlogo" alt=""></div>`;
        console.log("uye");
      } catch (err) {
        console.error(err);
        document.getElementById('screen').innerHTML = `<span class="warn">Error: ${err.message}</span>`;
      }
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

    //document.querySelector('tool[name="create_img"]').addEventListener('call', (event) => {
      //const description = event.detail.description;
      //document.getElementById('prompt').value = description;
      //document.getElementById('gen-form').dispatchEvent(new Event('submit'));
      //document.querySelector('context[name="current_image"]').innerHTML = description
    //});