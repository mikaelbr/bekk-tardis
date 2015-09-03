var Myo = require('myo');

module.exports = function connect (slideshow) {
  //Start talking with Myo Connect
  Myo.connect();
  Myo.on('pose', function (poseName) {
    console.log(poseName);
    if (poseName === 'wave_in' || poseName === 'wave_out') {
      this.vibrate('short');
      slideshow.gotoPreviousSlide();
    }
    else if (poseName === 'double_tap' || poseName === 'fist') {
      this.vibrate('short');
      slideshow.gotoNextSlide();
    }
  });

  Myo.on('paired', function(){
    console.log('Myo connected');
    Myo.setLockingPolicy('none');
  });

  return Myo;
};
