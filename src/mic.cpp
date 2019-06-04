
#include "mic.h"

signal voice(micPin);
//String collvoice;
char prev;
boolean newline=false;
int sum = 0;

void micInit(){
  voice.f_enabled = true;
  voice.minVolume = 1500;
  voice.fconstant = 400;
  voice.econstant = 1;
  voice.aconstant = 2;
  voice.vconstant = 3;
  voice.shconstant = 4;
  voice.calibrate();
}

char micGetPhoneme(){
    voice.sample();
    char p = voice.getPhoneme();
    return p;
}