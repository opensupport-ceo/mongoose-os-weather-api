#include "pins.h"
#include "mgos_adc.h"
#include <math.h>

void thermistorInit(void);
float readCurrentTemperature(void);
bool checkTemperature();

extern "C" {
    void setUpperTargetTemp(float target_temp);
    void setLowerTargetTemp(float target_temp);
    void setTargetTemp(float target_temp);
}