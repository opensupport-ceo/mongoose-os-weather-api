#include "qicharger.h"

int checkQiStatus(){
    return mgos_adc_read_voltage(qiPin);
}