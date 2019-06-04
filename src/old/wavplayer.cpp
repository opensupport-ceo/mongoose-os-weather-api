#include "wavplayer.h"
#include "Arduino.h"
//SdFat sd;
//SdFile file1;
//SdFile file2;

//#define SDSPEED SD_SCK_MHZ(20) // result: 101 tracks in 771 ms

//TaskHandle_t Task0;
TaskHandle_t Task1;

void loadWAVFile(char* filename){
  flash_init_file(filename);	
}

void I2SInit() {
  // initialize memory with SDSPEED
  /*if (!sd.begin(5, SDSPEED)) {
    Serial.println("Card Mount Failed");
    return;
  }*/


  //initialize i2s with configurations above
  i2s_driver_install((i2s_port_t)i2s_num, &i2s_config, 0, NULL);
  i2s_set_pin((i2s_port_t)i2s_num, &pin_config);
  //set sample rates of i2s to sample rate of wav file
  i2s_set_sample_rates((i2s_port_t)i2s_num, 44100);

  delay(500);
}

void playLoop() {
  if (rewind_1) {
    rewind_1 = 0;
    //if a trigger has been detected, jump back at the beginning of the data bytes
    //the file becomes then available again
    //file1.seekSet(start_byte_1);
  }

  playByte();
}

void playByte(){
/*if (file1.available()) {
    if (number_of_channels_1 == 2) {
      file1.read(buf1_a, 4);

      //Right channel only
      //data = data << 16;

      //Left channel only
      //data_1_32 = data_1_32 >> 16;
    }

    if (number_of_channels_1 == 1) {
      file1.read(buf1_a, 2);
      //Right channel only
      //data = data_1_16 << 16;

      //Left channel only
      //data = data16;
    }
  }*/ // read 2 bytes and play

  data = buf1_a[0];
  data |= buf1_a[1] << 8;
  data |= buf1_a[2] << 16;
  data |= buf1_a[3] << 24;

  i2s_write_bytes((i2s_port_t)i2s_num, (const char *)&data, sizeof(uint32_t), 100);

}

void flash_init_file(char* fname){

}

/*
void sd_init_file(char* fname) {
  //-----------------//
  //---Open FILE1----//
  //-----------------//
  Serial.println("Parsing FILE1 now");

  // sd.vwd()->rewind();
  // file1.openNext (sd.vwd(), O_READ);
  //  file1.printName(&Serial);

  if (!file1.open(fname)) {
  }


  for (int i = 0; i < 100; i++) {
    reading = file1.read();

    if (reading == 0x66) {
      reading_2 = file1.read();
      reading_3 = file1.read();
      reading_4 = file1.read();

      //search for Subchunk1ID, Contains the letters, "fmt " (0x666d7420 big-endian form).
      if ((reading_2 == 0x6d) && (reading_3 == 0x74) && (reading_4 == 0x20)) {
        break;
      }
    }
  }

  Serial.print("Subchunk1 ID start at : ");
  Serial.println(file1.curPosition() - 4, DEC);

  //after the Subchunk1ID, we know for sure that the next bytes define important information
  //skip Subchunk1Size
  for (int i = 0; i < 4; i++) {
    file1.read();
  }

  //skip AudioFormat
  for (int i = 0; i < 2; i++) {
    file1.read();
  }

  //get number of channels
  number_of_channels_1 = file1.read();
  Serial.print("number of channels : ");
  Serial.println(number_of_channels_1, DEC);
  //byte 2 is empty
  file1.read();

  //get sample rate
  sample_rate_1_lsb = file1.read();
  sample_rate_1_msb = file1.read();
  sample_rate_1 = sample_rate_1_lsb;
  sample_rate_1 |= sample_rate_1_msb << 8;
  Serial.print("sample_rate : ");
  Serial.println(sample_rate_1, DEC);
  //byte 3 & 4 are empty
  file1.read();
  file1.read();

  //skip bytes until bitdepth
  for (int i = 0; i < 6; i++) {
    file1.read();
  }

  //bit depth
  bit_depth_1 = file1.read();
  Serial.print("bitdepth : ");
  Serial.println(bit_depth_1, DEC);
  file1.read();

  //scroll through file until reaching the Subchunk2ID
  for (int i = 0; i < 1000; i++) {
    reading = file1.read();
    //Serial.print(i);
    // Serial.print("  -  ");
    // Serial.println(reading, HEX);

    if (reading == 0x64) {
      reading_2 = file1.read();
      reading_3 = file1.read();
      reading_4 = file1.read();

      //search for Subchunk2ID, Contains the letters "data" (0x64617461 big-endian form).
      if ((reading_2 == 0x61) && (reading_3 == 0x74) && (reading_4 == 0x61)) {
        break;
      }
    }
  }

  Serial.print("Subchunk2ID start at : ");
  Serial.println(file1.curPosition() - 4, DEC);

  //we then reached the Subchunk2Size, and can read the length of the file
  reading =  file1.read();
  length_audio1 = reading;
  reading =  file1.read();
  length_audio1 |= reading << 8;
  reading =  file1.read();
  length_audio1 |= reading << 16;
  reading =  file1.read();
  length_audio1 |= reading << 32;

  //length of audio in samples, it's the half of the amount of bytes in mono 16bits
  //length_audio1 = length_audio1 / 2;

  Serial.println(length_audio1);

  start_byte_1 = file1.curPosition();

  Serial.print("audio starting start at : ");
  Serial.println(start_byte_1, DEC);

  //to avoid starting playback when powering module
  //jump to the end, it's also like a stop function
  
  file1.seekSet(file1.fileSize());
}*/