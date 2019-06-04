#include "thermistor.h"

// resistance at 25 degrees C
#define THERMISTORNOMINAL 10000      
// temp. for nominal resistance (almost always 25 C)
#define TEMPERATURENOMINAL 15   
// how many samples to take and average, more takes longer
// but is more 'smooth'
#define NUMSAMPLES 3
// The beta coefficient of the thermistor (usually 3000-4000)
#define BCOEFFICIENT 3435
// the value of the 'other' resistor
#define SERIESRESISTOR 10000    

 
uint16_t samples[NUMSAMPLES];


int TARGET_TEMP = 10;
bool IS_CHECKING_UPPER_TARGET_TEMP = true;

void thermistorInit(void){
    mgos_adc_enable(thermistorPin); //ADC1_0
}

float readCurrentTemperature(void) {
  uint8_t i;
  float average;
 
  // take N samples in a row, with a slight delay
  for (i=0; i< NUMSAMPLES; i++) {
   samples[i] = mgos_adc_read(thermistorPin);
  }
 
  // average all the samples out
  average = 0;
  for (i=0; i< NUMSAMPLES; i++) {
     average += samples[i];
  }
  average /= NUMSAMPLES;
 
  // convert the value to resistance
  average = 4095 / average - 1;
  average = SERIESRESISTOR / average;
 
  float steinhart;
  steinhart = average / THERMISTORNOMINAL;     // (R/Ro)
  steinhart = log(steinhart);                  // ln(R/Ro)
  steinhart /= BCOEFFICIENT;                   // 1/B * ln(R/Ro)
  steinhart += 1.0 / (TEMPERATURENOMINAL + 273.15); // + (1/To)
  steinhart = 1.0 / steinhart;                 // Invert
  steinhart -= 273.15;                         // convert to C
 
  return steinhart;
}

// checks if current temperature has reached target temperature
bool checkTemperature() {
    if (IS_CHECKING_UPPER_TARGET_TEMP){
        if (readCurrentTemperature() > TARGET_TEMP){
            return true;
        } else {
            return false;
        }
    } else {
        if (readCurrentTemperature() < TARGET_TEMP){
            return true;
        } else {
            return false;
        }
    }
}

extern "C" {
    void setUpperTargetTemp(float target_temp){
        IS_CHECKING_UPPER_TARGET_TEMP = true;
        TARGET_TEMP = target_temp;
    }

    void setLowerTargetTemp(float target_temp){
        IS_CHECKING_UPPER_TARGET_TEMP = false;
        TARGET_TEMP = target_temp;
    }

    void setTargetTemp(float target_temp){
        TARGET_TEMP = target_temp;
    }
}