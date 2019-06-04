load('api_rpc.js');
load('api_timer.js');
load('api_pwm.js');

////////////////////////////////////////

let LED = {
  pin1: 13,
  pin2: 14,
  freq: 9999,
  brightness:0,
  blink_target:2,
  isBlinking:false,
  
  setBrightness: function(target, duty){
      if (target === 1){
        PWM.set(LED.pin1, LED.freq, duty);
      } else if (target === 2){
        PWM.set(LED.pin2, LED.freq, duty);
        PWM.set(LED.pin1, LED.freq, duty);
      }
    },

  litup: function(target){
    LED.blink_target = target;
    LED.setBrightness(target, LED.brightness);
    LED.brightness += 0.04;
    Timer.set(10, false, function() {
      if(LED.brightness < 1.0) {
          LED.litup(2);
      } else if (LED.brightness >= 1){
        LED.litdown(2);
      }
    }, null);
  } ,
  

  litdown: function(target){
    LED.blink_target = target;
    LED.setBrightness(target, LED.brightness);
    LED.brightness -= 0.04;
    Timer.set(10, false, function() {
      if(LED.brightness > 0) {
          LED.litdown(LED.blink_target);
      } else {
        LED.setBrightness(LED.blink_target, 0);
        LED.isBlinking = false;
        return;
      }
    }, null);
  },
  
  blink: function(target){
    if (LED.isBlinking){
      return;
    } else{
      LED.isBlinking = true;
    }
    LED.litup(2);
  }
};
