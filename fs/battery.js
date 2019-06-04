load('api_config.js');
load('api_rpc.js');
load('api_adc.js');
load('api_gpio.js');

let Battery = {
	bat_pin: 34,
	
	enable: function(){
	  ADC.enable(this.bat_pin);
	},
	
	checkStatus: function(){
		let capacity = ADC.read(this.bat_pin);
		print (capacity);
		return capacity;
	}
}