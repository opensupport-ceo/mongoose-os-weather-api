#include "LED.h"
#include <string.h>
#include "mgos_pwm.h"
#include "Arduino.h"

LED led;

void LED::ledinit(){
    frequency = 9999;
    brightness = 0;
    blink_target = 2;
    is_blinking = false;
    is_lighting_up = true;
    tick_time = 0;
}

void LED::initializeBrightness(){
    brightness = 0;
    is_lighting_up = true;
}

void LED::revertBrightness(){
    brightness = 1;
    is_lighting_up = false;
}

void LED::resetBrightness(){
    initializeBrightness();
    mgos_pwm_set(ledPin1, frequency, 0);
    mgos_pwm_set(ledPin2, frequency, 0);
}

bool LED::setBrightness(int target, float br){
    if (target == 1){
	    mgos_pwm_set(ledPin1, frequency, br);
    } else if (target == 2){
	    mgos_pwm_set(ledPin2, frequency, br);
    } else if (target == 3){ // turn all lights on
	    mgos_pwm_set(ledPin1, frequency, br);
	    mgos_pwm_set(ledPin2, frequency, br);
    }

    brightness = br;
    return true;
}

bool LED::setBrightness2(float duty1, float duty2){
    mgos_pwm_set(ledPin1, frequency, duty1);
    mgos_pwm_set(ledPin2, frequency, duty2);
    return true;
}

bool LED::autoblink(int target){
    // check if tick time has not been reached (10ms)
    /*if (abs(tick_time -  ) < 10){
        return false;
    }*/

    if (is_lighting_up){
        litup(target);
    } else {
        litdown(target);
    }
    return true;
}

bool LED::litup (int target){
    blink_target = target;

    brightness += 0.04;
    if (brightness >= 1)
        revertBrightness();
    
    setBrightness(target, brightness);
    if (brightness < 1.0)
        return true;
    else 
        return false;
}

bool LED::litdown (int target){
    blink_target = target;

    brightness -= 0.04;
    if (brightness <= 0)
        initializeBrightness();
    
    setBrightness(target, brightness);
    if (brightness > 0.0)
        return true;
    else {
        is_blinking = false;
        return false;
    }
}

bool LED::blink(int target){
    // prevent blink call called twice on 50 mil delay
    if (is_blinking){
        return false;
    } else {
        is_blinking = true;
    }

    initializeBrightness();
    while (litup(target)){
        // sleep for 10 milliseconds
        delay(10);
    }

    // sleep for 50 milliseconds
    delay(50);

    while(litdown(target)){
        // sleep for 10 milliseconds
        delay(10);
    }
    return true;
};


