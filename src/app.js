var fs = require('fs');
var myo = require('./remark-myo');

setupSlideshow();

function setupSlideshow () {
  var data = fs.readFileSync(__dirname + '/../slides/slides.md', 'utf8');
  document.querySelector('#source').innerHTML = data;

  var slideshow = remark.create({
    ratio: '16:9',
    highlightStyle: 'monokai'
  });
  var Myo = myo(slideshow);

  slideshow.on('showSlide', function (slide) {
    var img = document.querySelector('.tardis-img');
    var gesture = Myo.myos[0];

    if (!gesture || !gesture.connected) { return; }

    if (slide.properties.name !== 'tardis') {
      gesture.off('orientation');
      return;
    }
    console.log("Starting orientation")
    gesture.zeroOrientation();
    var w = window.innerWidth / 2;
    var h = window.innerHeight / 2;
    gesture.on('orientation', function(data){
      img.style.transform = `translate(${-data.z * w}px, ${-data.y * w}px)`;
    })
  });
}
