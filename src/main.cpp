/*
 * Copyright (c) 2014-2018 Cesanta Software Limited
 * All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the ""License"");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an ""AS IS"" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /*
 ** OWL Company 
 ** Author: Jaehong Park (hotcodeworker@github)
 */
#include "mgos.h"
#include "mgos_time.h"
#include "mgos_spi.h"
//#include "battery.h"
#include "mgos_http_server.h"
#include "mgos_rpc.h"
//#include "Audio.h"
//#include "thermistor.h"
#include <Arduino.h>

#define SD_CS          5
#define SPI_MOSI      23
#define SPI_MISO      19
#define SPI_SCK       18
#define I2S_BCLK      26
#define I2S_LRC       25
#define I2S_DOUT      22

/*
void ds3231_set(){
    int addr = 0x68;
    struct mgos_ds3231* ds=mgos_ds3231_create(addr);

    int time = mg_time();
    mgos_ds3231_date_time_set_unixtime(ds, time);

    mgos_ds3231_free(ds);
}

void ds3231_get(){
    int addr = 0x68;
    struct mgos_ds3231* ds=mgos_ds3231_create(addr);

    int time = mgos_ds3231_date_time_get_unixtime(ds);
    mgos_settimeofday(time, NULL);

    mgos_ds3231_free(ds);
}
*/

struct state {
  struct mg_rpc_request_info *ri; /* RPC request info */
  int uart_no;                    /* UART number to write to */
  int status;                     /* Request status */
  int64_t written;                /* Number of bytes written */
  FILE *fp;                       /* File to write to */
};

static void http_cb(struct mg_connection *c, int ev, void *ev_data, void *ud) {
  struct http_message *hm = (struct http_message *) ev_data;
  struct state *state = (struct state *) ud;

  switch (ev) {
    case MG_EV_CONNECT:
      state->status = *(int *) ev_data;
      break;
    case MG_EV_HTTP_CHUNK: {
      /*
       * Write data to file or UART. mgos_uart_write() blocks until
       * all data is written.
       */
      size_t n =
          (state->fp != NULL)
              ? fwrite(hm->body.p, 1, hm->body.len, state->fp)
              : mgos_uart_write(state->uart_no, hm->body.p, hm->body.len);
      if (n != hm->body.len) {
        c->flags |= MG_F_CLOSE_IMMEDIATELY;
        state->status = 500;
      }
      state->written += n;
      c->flags |= MG_F_DELETE_CHUNK;
      break;
    }
    case MG_EV_HTTP_REPLY:
      /* Only when we successfully got full reply, set the status. */
      state->status = hm->resp_code;
      LOG(LL_INFO, ("Finished fetching"));
      c->flags |= MG_F_CLOSE_IMMEDIATELY;
      break;
    case MG_EV_CLOSE:
      LOG(LL_INFO, ("status %d bytes %llu", state->status, state->written));
      if (state->status == 200) {
        /* Report success only for HTTP 200 downloads */
        mg_rpc_send_responsef(state->ri, "{written: %llu}", state->written);
      } else {
        mg_rpc_send_errorf(state->ri, state->status, NULL);
      }
      if (state->fp != NULL) fclose(state->fp);
      free(state);
      break;
  }
}

static void fetch_handler(struct mg_rpc_request_info *ri, void *cb_arg,
                          struct mg_rpc_frame_info *fi, struct mg_str args) {
  struct state *state;
  int uart_no = -1;
  FILE *fp = NULL;
  char *url = NULL, *path = NULL;

  json_scanf(args.p, args.len, ri->args_fmt, &url, &uart_no, &path);

  if (url == NULL || (uart_no < 0 && path == NULL)) {
    mg_rpc_send_errorf(ri, 500, "expecting url, uart or file");
    goto done;
  }

  if (path != NULL && (fp = fopen(path, "w")) == NULL) {
    mg_rpc_send_errorf(ri, 500, "cannot open %s", path);
    goto done;
  }

  if ((state = (struct state *) calloc(1, sizeof(*state))) == NULL) {
    mg_rpc_send_errorf(ri, 500, "OOM");
    goto done;
  }

  state->uart_no = uart_no;
  state->fp = fp;
  state->ri = ri;

  LOG(LL_INFO, ("Fetching %s to %d/%s", url, uart_no, path ? path : ""));
  if (!mg_connect_http(mgos_get_mgr(), http_cb, state, url, NULL, NULL)) {
    free(state);
    mg_rpc_send_errorf(ri, 500, "malformed URL");
    goto done;
  }

  (void) cb_arg;
  (void) fi;

done:
  free(url);
  free(path);
}


//Audio audio;



static void mp3_handler(struct mg_rpc_request_info *ri, void *cb_arg,
                          struct mg_rpc_frame_info *fi, struct mg_str args) {
  struct state *state;
  FILE* fp = NULL;
  char *path = NULL;

  json_scanf(args.p, args.len, ri->args_fmt, &path);

  /*if (path != NULL && (fp = fopen(path, "r")) == NULL) {
    mg_rpc_send_errorf(ri, 500, "cannot open %s", path);
    goto done;
  } else {
    mg_rpc_send_responsef(ri, "opened file %s \n ", path);
    fclose(fp);
  }*/

  /*
  bool res = playMP3File(path);
  if (res){
    goto done;
  } else {
  }
  */
  (void) cb_arg;
  (void) fi;

done:
  free(path);
}

enum mgos_app_init_result mgos_app_init(void) {
  printf ("app_main inited");

  // spi initialize
  struct mgos_spi *spi;
  spi = mgos_spi_get_global();
  if (spi == NULL) {
    LOG(LL_ERROR, ("SPI is not configured, make sure spi.enable is true"));
  }
  mgos_http_server_set_document_root("/data");

  //playMP3File();

  //mg_rpc_add_handler(mgos_rpc_get_global(), "PlayMP3", "{file: %Q}", mp3_handler, NULL);
  mg_rpc_add_handler(mgos_rpc_get_global(), "Fetch",
                     "{url: %Q, uart: %d, file: %Q}", fetch_handler, NULL);

  // initiate functions
  //thermistorInit();

  //for (int i=0; i<10; i++){
    //audio.instantiateAudio();
    //audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
  //}
  mgos_wdt_disable();
  
  // this part is for testing mp3 play
  /*FILE *fp = fopen("/data/x.mp3", "r");
  if (fp != NULL){
    printf("mp3 file found play");
    fclose(fp);
    playMP3File("/data/x.mp3");
  } else {
    printf("mp3 file not found, continue");
  }*/
  
  return MGOS_APP_INIT_SUCCESS;
}
