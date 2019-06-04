load('api_config.js');
load('api_rpc.js');
load('api_adc.js');

////////////////////////////////////////

let THERMISTOR = {
  pin: 36,
  scale: 4095.0,
  
  calc: function(analog){
    let R0 = 10000;
    let T0 = 15; //room temperature
    let B = 3435; //the coefficient of the thermistor
    let SERISR = 10000; //seris resistor 100K
    
    let thermistorRValue = SERISR / ((1.0 / analog) - 1);
    let temperature = Math.log(thermistorRValue / R0) / B; // R/R0
    temperature = temperature + 1.0 / (T0 + 273.15);
    temperature = 1.0 / temperature;
    temperature -= 273.15 ;// kelvins to C
    
    return temperature;
  },
  analog: function(){return ADC.read(THERMISTOR.pin);},
  read: function(){return THERMISTOR.calc(THERMISTOR.analog()/THERMISTOR.scale);},
};
