load('api_rpc.js');
load('api_timer.js');
load('api_ds3231.js');
load('time.js');

////////////////////////////////////////
let playMP3File = ffi('bool playMP3File(char*)');

let ALARM = {
  tick: 10*1000,
  duration : 60*5, // 5 minutes
  
  alarm: [], //{hour: 16, min: 17, duration: 3}, {hour: 11, min: 58, duration: 3}, {hour: 12, min: 4, duration: 2}],
  alarmtime: [] // [unixtime1, unixtime2, ...]
};

Timer.set(ALARM.tick, Timer.REPEAT, function() {
    //let dt = DS3231DateTime.create();
    //dt.setUnixtime(Timer.now() + 9*3600);
    let dt = RTC.rtc.read();
    let mtime = dt.getUnixtime();
    
    for (let i=0; i<ALARM.alarmtime.length; i++){
      let at = ALARM.alarmtime[i];
      print("alarm time : ", at, " current time : ", mtime);
      let at_end = at + ALARM.duration;

      if (at <= mtime && mtime < at_end){
          print("alarm on");
        let alarm_success = playMP3File("/data/x.mp3");
        if (alarm_success){ // if target temperature reached
          print ("alarm successed\n");
        } else { // if max MP3 replay count reached
          print ("alarm failed\n");
        }

        // remove alarmtime
        ALARM.alarmtime.splice(i, 1);
        break;

      }
    }

    /*for(let i=0; i<ALARM.alarm.length; i++){
      let a = ALARM.alarm[i];
      let a_start = a.hour*60 + a.min;
      let a_end = a_start + a.duration; // after duration minutes
      
      if(a_start <= mtime && mtime < a_end)
        flag = true; // ring alarm
      
      if(a_start <= mtime+24*60 && mtime+24*60 < a_end)
        flag = true;
    }*/
    
    //print(flag);
    //print(JSON.stringify(time));
    
}, null);
