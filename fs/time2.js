////////////////////////////////////////////////////////////////////////////
//
// time2.js
//
// Description: system unix-time & current local-time.
// Author: Jaehong Park (binixcode) / jaehong1972@gmail.com
//
//
/////////////////////////////////////////////////////////////////////////////
load('api_rpc.js');
load('api_timer.js');
load('api_math.js');

let localTIME = {

    /* Unix time */
    UnixTime: 0, //unixtime.
    TimeStamp: "", // timestamp based on unixtime.
    
    UnixYear: 1970,
    UnixMonth: 1,
    UnixDay: 1,
    UnixHour: 1,
    UnixMin: 1,
    UnixSec: 1,    

    /* Weather local time*/
    WeatherTime: 0,
    WeatherTimeStamp: "",
    
    WeatherYear: 2019,
    WeatherMonth: 1,
    WeatherDay: 1,
    WeatherHour: 16,
    WeatherMin: 30,
    WeatherSec: 35,

    /* Current loca (KR) time */
    CurrentTime: 0,
    CurrTimeStamp: "",
    
    CurrYear: 2019,
    CurrMonth: 1,
    CurrDay: 1,
    CurrHour: 16,
    CurrrMin: 30,
    CurrSec: 35,

    getInfo: function(){
        localTIME.UnixTime = Timer.now();
        localTIME.TimeStamp = Timer.fmt("%Y-%m-%d %H:%M:%S", localTIME.UnixTime);
        print('++++', JSON.stringify({UnixTime: localTIME.UnixTime}));
        print('++++', JSON.stringify({UnixTime: localTIME.TimeStamp}));
    /*
        [Mar 20 16:38:51.698] ++++ {"now":10.868159}
        [Mar 20 16:38:51.719] ++++ {"now":"1970-01-01 00:00:11"}
        [Mar 20 16:38:52.198] ++++ {"now":1521556732.984298}      //the time is synchronized now
        [Mar 20 16:38:52.222] ++++ {"now":"2018-03-20 14:38:53"}
    */
        let UnixTimeStampStr = localTIME.TimeStamp;
        let yearStr = UnixTimeStampStr.slice(0,4);
        localTIME.UnixYear = JSON.parse(yearStr);

        if(localTIME.UnixYear < 2019){
            print("+++ Could not get appropriate time info. +++");
            return false;
        }

        /*
        ** Adjust to time zone, KR. more than 9 hours.
        */
        localTIME.CurrentTime = localTIME.UnixTime + (9*60*60); 
        localTIME.CurrTimeStamp = Timer.fmt("%Y-%m-%d %H:%M:%S", localTIME.CurrentTime);
        print('++++', JSON.stringify({CurrentTime: localTIME.CurrentTime}));
        print('++++', JSON.stringify({CurrentTime: localTIME.CurrTimeStamp}));
        localTIME.setInfo(localTIME.CurrentTime); // Adjust current timezone.

        //localTIME.dispWeatherDate();
        return true;
    },

    dispUnixDate: function(){
        print("+++ Unix time +++");
        /*
        print("Year: ", localTIME.WeatherYear);
        print("Month: ", localTIME.WeatherMonth);
        print("Day: ", localTIME.WeatherDay);
        print("Hour: ", localTIME.WeatherHour);
        print("Minute: ", localTIME.WeatherMin);       
        print("Sec: ", localTIME.WeatherSec); 
        */   
    },

    dispWeatherDate: function(){
        print("+++ Weather time +++");
        print("Year: ", localTIME.WeatherYear);
        print("Month: ", localTIME.WeatherMonth);
        print("Day: ", localTIME.WeatherDay);
        print("Hour: ", localTIME.WeatherHour);
        print("Minute: ", localTIME.WeatherMin);       
        print("Sec: ", localTIME.WeatherSec);    
    },

    dispCurrentDate: function(){
        print("+++ Current time +++");
        /*
        print("Year: ", localTIME.WeatherYear);
        print("Month: ", localTIME.WeatherMonth);
        print("Day: ", localTIME.WeatherDay);
        print("Hour: ", localTIME.WeatherHour);
        print("Minute: ", localTIME.WeatherMin);       
        print("Sec: ", localTIME.WeatherSec);    
        */
    },

    setInfo: function(unixtime){
        localTIME.WeatherTime = unixtime;
        localTIME.WeatherTimeStamp = Timer.fmt("%Y-%m-%d %H:%M:%S", localTIME.WeatherTime);
        print('++++', JSON.stringify({WeatherTime: localTIME.WeatherTime}));
        print('++++', JSON.stringify({WeatherTime: localTIME.WeatherTimeStamp}));
    /*    
        [Mar 20 16:38:52.198] ++++ {"now":1521556732.984298}      //the time is synchronized now
        [Mar 20 16:38:52.222] ++++ {"now":"2018-03-20 14:38:53"}
    */
        let WeatherTimeStampStr = localTIME.WeatherTimeStamp;
        //print("WeatherTimeStmapStr: ", WeatherTimeStampStr);
        
        let yearStr = WeatherTimeStampStr.slice(0,4);
        //print("yearStr: ", yearStr);
        let monStr = WeatherTimeStampStr.slice(5,7);
        let dayStr = WeatherTimeStampStr.slice(8,10);
        let hourStr = WeatherTimeStampStr.slice(11,13);
        let minStr = WeatherTimeStampStr.slice(14,16);
        let secStr = WeatherTimeStampStr.slice(17,19);
        //print("secStr: ", secStr);

        localTIME.WeatherYear = JSON.parse(yearStr);
        //print("localTIME.WeatherYear: ", localTIME.WeatherYear);
        localTIME.WeatherMonth = JSON.parse(monStr);
        localTIME.WeatherDay = JSON.parse(dayStr);
        localTIME.WeatherHour = JSON.parse(hourStr);
        localTIME.WeatherMin = JSON.parse(minStr);
        localTIME.WeatherSec = JSON.parse(secStr);
        //print("localTIME.WeatherSec: ", localTIME.WeatherSec);
        
        localTIME.dispWeatherDate();
        return true;
    }
}