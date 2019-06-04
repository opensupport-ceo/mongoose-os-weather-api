//#include "FreeStack.h"
#include "esp_task_wdt.h"

//#include "SPI.h"
#include "driver/i2s.h"
#include "freertos/queue.h"

//#include <SD.h>

void I2SInit();

void loadWAVFile(char* filename);
void playLoop();
void playByte();

void flash_init_file(char* fname);

bool flip = 0;

uint32_t data_1_32;
uint16_t data_1_16;
uint32_t data_2_32;
uint16_t data_2_16;
uint32_t data;
int n1;
int n2;

bool need_sample = 1;
bool got_sample = 0;

unsigned int time_before = 0;

bool mono_mode = 1;

unsigned int sample_counter = 0;
unsigned int buffer_counter = 0;

unsigned int buffer_length = 256;

//------------//
//---INPUTS---//
//------------//
#define TRIG1 0
#define TRIG2 1

bool TRIG1_state = 0;
bool previous_TRIG1_state = 0;
unsigned int debounce_TRIG1 = 0;

//-------------------//
//----I2S Config-----//
//-------------------//
//i2s configuration
int i2s_num = 0; // i2s port number

i2s_config_t i2s_config = {
  .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
  .sample_rate = 44100,
  .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
  .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
  .communication_format = (i2s_comm_format_t)(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
  .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1, // high interrupt priority
  .dma_buf_count = 8,
  .dma_buf_len = 64   //Interrupt level 1
};

i2s_pin_config_t pin_config = {
  .bck_io_num = 26, //this is BCK pin
  .ws_io_num = 25, // this is LRCK pin
  .data_out_num = 22, // this is DATA output pin
  .data_in_num = I2S_PIN_NO_CHANGE
};

//-------------------//
//--SD and AUDIO-----//
//-------------------//
uint8_t buf1[2];
uint8_t buf1_a[512];
uint8_t buf1_b[512];

bool prepare_bytes = 1;

bool flip_flop = 0;
bool flip_flop_1 = 0;
bool flip_flop_2 = 0;

bool buffered_1_b = 0;
bool buffered_1_a = 0;

bool buffer_refill_1 = 0;

unsigned long buffer_counter_1 = 0;

unsigned long length_audio1 = 0;
unsigned long length_audio2 = 0;
unsigned int bit_depth_1 = 0;
unsigned int bit_depth_2 = 0;
unsigned int bit_shift = 0;

unsigned int sample_rate_1 = 0;
unsigned int sample_rate_1_msb = 0;
unsigned int sample_rate_1_lsb = 0;

unsigned int number_of_channels_1 = 0;

unsigned long reading = 0;
unsigned long reading_2 = 0;
unsigned long reading_3 = 0;
unsigned long reading_4 = 0;
unsigned long start_byte_1 = 0;

char name_1[20];
uint8_t name_1_size[13];

unsigned long before = 0;
unsigned long after = 0;

volatile unsigned long counter1 = 0;

volatile bool play1 = 0;

bool rewind_1 = 0;

int error_sd = 0;