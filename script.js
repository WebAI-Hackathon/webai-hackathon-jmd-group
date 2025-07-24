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

let searchState = {
  message: '',
};

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