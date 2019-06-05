load('api_config.js');
load('api_rpc.js');
load('api_timer.js');
load('api_wifi.js');
load('api_sys.js');
load('api_http.js');
load('api_adc.js');
load('api_aws.js');
load('api_gpio.js');
load('api_shadow.js');

////////////////////////////////////////
/*
load('led.js');
load('alarm.js');
load('time.js');
load('thermistor.js');
load('qicharger.js');
load('battery.js');
load('mic.js');
*/
////////////////////////////////////////


let led = Cfg.get('board.ledtest.pin');   // Built-in LED GPIO number
print('Built-in led pin number: ', led);  //14
let btn = Cfg.get('board.btntest.pin');     // Built-in button GPIO
print('Built-in button pin number: ', btn); //26
let state = { on: false,  // Device state - LED on/off status
              btnCount: 0,
              uptime: 0,
              ram_free: 0,
              alarm: {  // alarm time - hour, minute
                hour: 0,
                min: 0
              }
};
let online = false;                               // Connected to the cloud?

// set ALARM {"hour":12,"min":53}
let setALARM = function(args){
  //ALARM.alarm = [];
  ALARM.alarm.push(args);
  //print(RTC.rtc.read().getUnixtime() + ' + ' + JSON.parse(args.hour)*3600 + ' + ' + JSON.parse(args.min)*60);
  //let t = RTC.rtc.read().getUnixtime() + JSON.parse(args.hour)*3600 + JSON.parse(args.min)*60;
  //ALARM.alarmtime.push(t)

  state.alarmsuccess = true;
  return true;
};

let reportState = function() {
  Shadow.update(0, state);
};

// Set up Shadow handler to synchronise device state with the shadow state
Shadow.addHandler(function(event, obj) {
  if (event === 'CONNECTED') {
    print('event: ', 'CONNECTED');
    // Connected to shadow - report our current state.
    reportState();
  } else if (event === 'UPDATE_DELTA') {
    print('event: ', 'UPDATE_DELTA');
    // Got delta. Iterate over the delta keys, handle those we know about.
    for (let key in obj) {
      if (key === 'on') {
        // Shadow wants us to change local state - do it.
        state.on = obj.on;
        GPIO.set_mode(led, GPIO.MODE_OUTPUT);
        GPIO.write(led, state.on ? 1 : 0);
        print('LED on ->', state.on);
      } else if(key === 'alarm'){
          // Shadow wants us to change local state - do it.
          state.alarm = obj.alarm;
          print('hour: ', state.alarm.hour, ', min: ', state.alarm.min);
          if((state.alarm.hour >= 0) && (state.alarm.hour <= 24) ){
            if((state.alarm.min >= 0) && (state.alarm.min <= 60) ){
              setALARM(state.alarm);
            }else{
              print('Out of minute range');
            }
          }else{
            print('Out of hour range');
          }
      }else if (key === 'reboot') {
        state.reboot = obj.reboot;      // Reboot button clicked: that
        Timer.set(750, 0, function() {  // incremented 'reboot' counter
          Sys.reboot();                 // Sync and schedule a reboot
        }, null);
      }else {
        print('Dont know how to handle key', key);
      }
    }
    // Once we've done synchronising with the shadow, report our state.
    reportState();
  }else if(event === 'UPDATE_ACCEPTED'){
    print('event: ', 'UPDATE_ACCEPTED');
    reportState();
  }else if(event === 'UPDATE_REJECTED'){
    print('event: ', 'UPDATE_REJECTED');
    reportState();
  }
});

load('api_aws.js');
load('api_dash.js');
load("api_mqtt.js");

Timer.set(5000, Timer.REPEAT, function() {
  print('Timer.REPEAT every 5 secs');
  state.btnCount++;
  let message = JSON.stringify(state);
  let sendMQTT = true;
  /*
  if (Azure.isConnected()) {
    print('== Sending Azure D2C message:', message);
    Azure.sendD2CMsg('', message);
    sendMQTT = false;
  }
  if (GCP.isConnected()) {
    print('== Sending GCP event:', message);
    GCP.sendEvent(message);
    sendMQTT = false;
  }
  if (Watson.isConnected()) {
    print('== Sending Watson event:', message);
    Watson.sendEventJSON('ev', {d: state});
    sendMQTT = false;
  }
  */
  if (Dash.isConnected()) {
    print('Connected to Dash');
    // TODO: Maybe do something else?
    sendMQTT = false;
  }
  // AWS is handled as plain MQTT since it allows arbitrary topics.
  if (AWS.isConnected() || (MQTT.isConnected() && sendMQTT)) {
    let topic = 'devices/' + Cfg.get('device.id') + '/events';
    print('== Publishing to ' + topic + ':', message);
    MQTT.pub(topic, message, 0 ); // 0: QoS
  } else if (sendMQTT) {
    print('sendMQTT: false, Not connected!');
  }
}, null);

Event.on(Event.CLOUD_CONNECTED, function() {
  online = true;
  Shadow.update(0, {ram_total: Sys.total_ram()});
}, null);

Event.on(Event.CLOUD_DISCONNECTED, function() {
  online = false;
}, null);

// Demonstrate how to use shadow to periodically report metrics
load('api_timer.js');
load('api_sys.js');

/*
// Update state every second, and report to cloud if online
Timer.set(5000, Timer.REPEAT, function() {
  state.uptime = Sys.uptime();
  state.ram_free = Sys.free_ram();
  print('online:', online, JSON.stringify(state));
  if (online) reportState();
}, null);
*/

/* link cpp codes through ffi*/
//let checkBatStatus = ffi('int checkBatStatus(void)');
//let checkQiStatus = ffi('int checkQiStatus(void)');
//let I2SInit = ffi('void I2SInit(void)');
//let setTargetTemp = ffi('void setTargetTemp(float)');


//Qi.enable();
//Battery.enable();
//Mic.enable();

//LED.setBrightness(1, 0);
//LED.setBrightness(2, 0);

/*
Timer.set(3000 , true , function() {
  // send dht info to server
  print ("checking bat, qi status");
  if (Qi.checkStatus()){
    print ("charging...");
  } else {
    print ("not charging");
  }
  Battery.checkStatus();
  print (THERMISTOR.read());
  RTC.log();
}, null);

Timer.set(300, true, function(){
  let mic_val = Mic.readSound();
  if (mic_val > 2000){
    print ("mic on");
    print (Mic.getPhoneme());
  }
}, null);
*/

///////////////////////////////////////
load('LccDfs.js');
load('ip-geoloc.js');
load('weather.js');
///////////////////////////////////////
//let jsonEx = "{\x0a  "ip": "122.47.26.50",\x0a  "city": "Sogongdong",\x0a  "region": "Seoul-t'ukpyolsi",\x0a  "country": "KR",\x0a  "loc": "37.5645,126.9750",\x0a  "org": "AS17858 LG POWERCOMM"\x0a}";
//let textEX = '{  "ip": "122.47.26.50",  "city": "Sogongdong",  "country": "KR",  "loc": "37.5645,126.9750",  "org": "AS17858 LG POWERCOMM"}';
let resultTxt = '{  "ip": "122.47.26.50",  "city": "Sogongdong",  "country": "KR",  "loc": "37.5645,126.9750",  "org": "AS17858 LG POWERCOMM"}';

Timer.set(10*1000, Timer.REPEAT, function() {
  print("getting weather informations...");
  ipGeoLoc.parse(resultTxt); // for test.

  //ipGeoLoc.getInfo(); // for real condition.
  if(ipGeoLoc.Reported){
    ipGeoLoc.displayInfoDesc();
    
    if((ipGeoLoc.lat !== 0) &&(ipGeoLoc.lng !== 0)){
      print("lati: ", ipGeoLoc.lat, "longi: ", ipGeoLoc.lng);
      let rs = LCCDFS.conversion("toXY",ipGeoLoc.lat, ipGeoLoc.lng);
      print("rs.nx: ", rs.nx, "rs.ny: ", rs.ny);
      
      Weather.getInfoItems(rs.nx, rs.ny)
      if(Weather.Reported){
        Weather.dispInfoDesc();  
      }else{
        print("Could not get weather info.");
      }
    }
    
  }else{
    print("Could not get ipAddr & geoLoc.");
  }
  
},null);

// call Flags.log
RPC.addHandler('Flags.log', function(args) {
  return {"LED": LED.on, "ALARM": ALARM.on, "MOOD": MOOD.on};
});

//set LED
RPC.addHandler('LED.setBrightness', function(args) {
  LED.setBrightness(JSON.parse(args.target), JSON.parse(args.duty));
  return true;
});

//set LED blink
RPC.addHandler('LED.blink', function(args) {
  LED.blink(args.target);
  return true;
});

//call Thermistor.get
RPC.addHandler('Thermistor.get', function(args) {
  let analog = THERMISTOR.analog();
  return THERMISTOR.calc(analog/THERMISTOR.scale);
});

//call Thermistor.log
RPC.addHandler('Thermistor.log', function(args) {
  let analog = THERMISTOR.analog();
  return {result: THERMISTOR.calc(analog/THERMISTOR.scale), analog: analog};
});


// mos call Alarm.temp {"temp":20.0}
RPC.addHandler('Alarm.temp', function(args) {
  setTargetTemp(JSON.parse(args.temp));
  return true;
});

// mos call Alarm.set {"hour":12,"min":53,"duration":3}
RPC.addHandler('Alarm.set', function(args) {
  //ALARM.alarm = [];
  ALARM.alarm.push(args);
  let t = RTC.rtc.read().getUnixtime() + JSON.parse(args.hour)*3600 + JSON.parse(args.min)*60;
  ALARM.alarmtime.push(t)
  
  return true;
});

// call Alarm.get
RPC.addHandler('Alarm.get', function(args) {
  return ALARM.alarm;
});

// call Time.set
RPC.addHandler('Time.set', function(args) {
  return TIME.read();
});

RPC.addHandler('PlayMP3', function(args){
  print("play mp3 file : ", args.file);
  playMP3File(args.file);
  return true;
});

//call Time.get
RPC.addHandler('Time.get', function(args) {
  return TIME.read();
});

//call Time.log
RPC.addHandler('Time.log', function(args) {
    let rtn = TIME.read();
    rtn.unix_machine = Timer.now();
    rtn.unix_RTC = RTC.read().getUnixtime();
    
    return rtn;
});


// environment codes

RPC.addHandler('Wifi', function(args) {
  // saves configuration
  Cfg.set({wifi:{ap:{enable: true}, sta:{enable:true, ssid: args.ssid, pass: args.pw}}});
  
  // reboot in 1 seconds
  Sys.reboot(1000);
  return true;
});

RPC.addHandler('ping', function(args) {
  return true;
});

RPC.addHandler('awsID', function(args){
  return true;
});

RPC.addHandler('rmRPC', function(args){
  return true;
});

RPC.addHandler('Device.Owner', function(args) {
  Cfg.set({device: {owner: args.owner_id}});
  state.owner_id = args.owner_id;
  AWS.Shadow.update(0, {reported:state});
  return true;
});

RPC.addHandler('Device.Id', function(args) {
  return {device_id: Cfg.get('device.id')};
});