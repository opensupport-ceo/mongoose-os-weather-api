#include "battery.h"

int checkBatStatus(){
    return mgos_adc_read_voltage(batteryPin);
}