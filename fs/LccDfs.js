////////////////////////////////////////////////////////////////////////////
//
// LccDfs.js
//
// Description: get the location info. for weather info. 
//              using x, y geolocation & change between geolcation and location info. 
//              provided by weather agency.
// Author: Jaehong Park (binixcode) / jaehong1972@gmail.com
//
//
/////////////////////////////////////////////////////////////////////////////
load('api_rpc.js');
load('api_math.js');

let tan = ffi('double tan(double)');
let atan = ffi('double atan(double)');
let atan2 = ffi('double atan2(double, double)');

let LCCDFS = {
    conversion: function (code, v1, v2) {
        let RE = 6371.00877;    // 지구 반경(km)
        let GRID = 5.0;         // 격자 간격(km)
        let SLAT1 = 30.0;       // 투영 위도1(degree)
        let SLAT2 = 60.0;       // 투영 위도2(degree)
        let OLON = 126.0;       // 기준점 경도(degree)
        let OLAT = 38.0;        // 기준점 위도(degree)
        let XO = 43;            // 기준점 X좌표(GRID)
        let YO = 136;           // 기1준점 Y좌표(GRID)
        let PI = 3.14159;
        let DEGRAD = PI / 180.0;
        let RADDEG = 180.0 / PI;

        let re = RE / GRID;
        let slat1 = SLAT1 * DEGRAD;
        let slat2 = SLAT2 * DEGRAD;
        let olon = OLON * DEGRAD;
        let olat = OLAT * DEGRAD;

        let sn = tan(PI * 0.25 + slat2 * 0.5) / tan(PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        let sf = tan(PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        let ro = tan(PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        let rs = {};
        if (code === "toXY") {

            rs['lat'] = v1;
            rs['lng'] = v2;
            let ra = tan(PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            let theta = v2 * DEGRAD - olon;
            if (theta > PI) theta -= 2.0 * PI;
            if (theta < -PI) theta += 2.0 * PI;
            theta *= sn;
            rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        }
        else {
            rs['nx'] = v1;
            rs['ny'] = v2;
            let xn = v1 - XO;
            let yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) - ra;
            let alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * atan(alat) - PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            }
            else {
                if (Math.abs(yn) <= 0.0) {
                    theta = PI * 0.5;
                    if (xn < 0.0) - theta;
                }
                else theta = atan2(xn, yn);
            }
            let alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }
}
