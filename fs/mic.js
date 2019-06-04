load('api_config.js');
load('api_rpc.js');
load('api_adc.js');
load('api_gpio.js');

//let micInit = ffi('void micInit(void)');
//let micGetPhoneme = ffi('char micGetPhoneme(void)');

let Mic = {
	mic_pin: 39,
	
	enable: function(){
	  //GPIO.set_mode(this.mic_pin, GPIO.MODE_INPUT);
	  let result = ADC.enable(this.mic_pin);
	  //micInit();
	  //print ("init ADC for mic : ", result);
	},
	
	readSound: function(){
		let sound = ADC.read(this.mic_pin);
		//print ("current sound value : " , sound);
		//print ("gpio : ", GPIO.read(this.mic_pin));
		return sound;
	},

	getPhoneme: function(){
		return 1;
		//return micGetPhoneme();
	}
}