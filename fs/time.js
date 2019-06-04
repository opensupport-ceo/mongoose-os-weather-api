load('api_config.js');
load('api_rpc.js');
load('api_timer.js');
load('api_sys.js');
load('api_events.js');
load('api_ds3231.js');

////////////////////////////////////////

let RTC = {
  rtc: DS3231.create(0x68),
  
  handler: true,
  sync: true,
  period: 1*60*1000,

  setRTC: function(){
    let dt = DS3231DateTime.create();
    dt.setUnixtime(Timer.now()+0.5);
    RTC.rtc.write(dt);
  },
  
  setfromRTC: function(){
    RTC.handler = false;
    RTC.rtc.setTimeOfDay();
  },
  
  read: function(){
    return RTC.rtc.read();//.getUnixtime();
  },
  
  log: function(str){
    print(str);
    print("RTC:", RTC.read().getUnixtime(), ", machine:", Timer.now());
    TIME.read();
    //print('Time: ', RTC.rtc.getTimeHours(), ':', RTC.rtc.getTimeMinutes(), ':', RTC.rtc.getTimeSeconds() );
    //print('Date: ', RTC.rtc.getTimeDate(), '-', RTC.rtc.getTimeMonth(), '-', RTC.rtc.getTimeYear(), ' Day of the week -', RTC.rtc.getTimeDayOfTheWeek());
  },
};

Event.addHandler(Event.SYS + 5, function (ev, evdata, userdata) {
  if (RTC.handler) {
    //set RTC from SNTP
    RTC.setRTC();
  }
  
  if(!RTC.handler) {
    //machine set from RTC (do not set RTC)
    RTC.handler = true;
  }
}, null);

/*Timer.set(RTC.period, Timer.REPEAT, function() {
  //set machine from RTC periodically
  RTC.setfromRTC();
}, null);*/

////////////////////////////////////////

let TIME = {
  format: function(unix){
    let dt = DS3231DateTime.create();
    dt.setUnixtime(unix);
    print (dt.getYear(), dt.getMonth(), dt.getDay(), dt.getHour(), dt.getMinute(), dt.getSecond());
    return {
      unix: dt.getUnixtime(),
      Year: dt.getYear(),
      Month: dt.getMonth(),
      Day: dt.getDay(),
      Dow: dt.getDow(),
      Hour: dt.getHour(),
      Min: dt.getMinute(),
      Sec: dt.getSecond(),
    };
  },
  
  read: function(){
    return TIME.format(Timer.now());
  }, 
};

