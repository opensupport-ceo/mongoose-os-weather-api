load('api_config.js');
load('api_rpc.js');
load('api_adc.js');
load('api_gpio.js');


let Qi = {
	en_pin: 16,
	status_pin: 35,

	enable: function(){
	  ADC.enable(this.status_pin);
		GPIO.write(this.en_pin, 0);
	},

	disable: function(){
		GPIO.write(this.en_pin, 1);
	} ,

	checkStatus: function(){
		let voltage = ADC.read(this.status_pin);
		print (voltage);
		if (voltage > 100){
		  return true;
	  } else {
	    return false;
	  }
	}
};