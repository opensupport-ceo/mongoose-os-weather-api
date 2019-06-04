////////////////////////////////////////////////////////////////////////////
//
// weather.js
//
// Description: get the korean weather information based on geolocation 
//              using open API.
// Author: Jaehong Park (binixcode) / jaehong1972@gmail.com
//
//
/////////////////////////////////////////////////////////////////////////////
load('api_rpc.js');
load('time2.js');

//let replace = ffi('char *replace(char *s, const char *olds, const char *news)');

let Weather = {
    RainorSnow: 0,
    rainState: 0,
    rainCapa: 0,
    skyState: 0,
    Temp: 0,

    parse: function(response) {

        let jsonObj = JSON.parse(response);
        print("Weather jsonObj: ",jsonObj);
        if(jsonObj[0].response.body.totalCount !== 0){
            Weather.RainorSnow = jsonObj[0].response.body.items.item[0].fcstValue;
            Weather.rainState = jsonObj[0].response.body.items.item[1].fcstValue;
            Weather.rainCapa = jsonObj[0].response.body.items.item[3].fcstValue;
            Weather.skyState = jsonObj[0].response.body.items.item[4].fcstValue;
            Weather.Temp = jsonObj[0].response.body.items.item[5].fcstValue;
            return true;
        }else{
            print("Could not get weather info.");
            return false;
        }
    },

    getInfoItems: function (nx, ny){
        if(localTIME.getInfo() === false) return false;
        let now = localTIME.WeatherTime; //unixtime
        let year = localTIME.WeatherYear;
        let month = localTIME.WeatherMonth;
        let day = localTIME.WeatherDay;
        let hour = localTIME.WeatherHour;
        let min = localTIME.WeatherMin;
        
        if(min < 30){
            hour = hour - 1;
            if(hour < 0){
                now = now - (60*60*24);
                localTIME.setInfo(now); // set local time again.
                year = localTIME.WeatherYear;
                month = localTIME.WeatherMonth;
                day = localTIME.WeatherDay;
                hour = 23;
            }
        }
        
        let yearStr = JSON.stringify(year);
        let monthStr = JSON.stringify(month);
        let dayStr = JSON.stringify(day);
        let hourStr = JSON.stringify(hour);
        let minStr = JSON.stringify(min);

        if(day<10) {
            dayStr='0' + dayStr;
        }
        
        if(hour < 10) {
            hourStr='0' + hourStr;
        }
        if(min<10) {
            minStr='0' + minStr;
        }

        /* 
        ** test for hour because of items's count 
        ** Could not get weather info. when from 05:30 to 08:29.
        */
        //hourStr = '05';

        print("yearStr: ", yearStr, "monthStr: ", monthStr, "dayStr: ", dayStr);
        print("hourStr: ", hourStr, "minStr: ", minStr);

        let nxStr = JSON.stringify(nx);
        //print("nx: ", nx,"nxStr: ", nxStr);
        let nyStr = JSON.stringify(ny);
        //print("ny: ", ny, "nxStr: ", nxStr);
        let apikey = 'GsIEPvrEMExP3XquMGH1bYL8tixNTFkfjICqMXpMg3z2%2Fm3GzrMkyvfkwMdk6bidaAPFrsJrojC829XMl0anMQ%3D%3D';
        let todayStr = yearStr + '' + monthStr + '' + dayStr;
        let basetimeStr = hourStr + '00';
        let forecastURL = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData';
        forecastURL += '?ServiceKey=' + apikey;
        forecastURL += '&base_date=' + todayStr;
        forecastURL += '&base_time=' + basetimeStr;
        forecastURL += '&nx=' + nxStr + '&ny=' + nyStr;
        forecastURL += '&pageNo=1&numOfRows=7';
        forecastURL += '&_type=json';
              
        print("forecastURL: ", forecastURL);
        /*
        HTTP.query({
            url: forecastURL,
            success: function(body, full_http_msg) { 
                print(body);
                Weather.parse(body); 
            },
                error: function(err) {  // Optional
                print(err); 
            },
        });
        */

        return true;
    },

    dispInfoDesc: function(){
        print("rainState: " , Weather.rainState);
        print("skyState: " , Weather.skyState); // -
        print("RainorSnow: ", Weather.RainorSnow); // -    
        print("rain capacity: ", Weather.RainorSnow);
        print("Temp: ", Weather.Temp);

        /*
        if (Weather.rainState === 0) {
            switch(Weather.skyState) { 
                case 1:
                    print("good day");
                    break;
                case 2:
                    print("little cloudy");
                    break;
                case 3:
                    print("heavy cloudy");
                    break;
                case 4:
                    print("not good");    
                    break;
                
                default:
                    print("good");
                    break;
            }              
        }
        else{
            switch(Weather.rainState) {
                case 1:
                    print("rainny");
                    break;
                case 2:
                    print("rainny & snowy");
                    break;
                case 3:
                    print("snowy");
                    break;

                default:
                    break;
            }
        }
        */
    }
}