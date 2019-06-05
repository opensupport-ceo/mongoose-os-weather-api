////////////////////////////////////////////////////////////////////////////
//
// ip-geoloc.js
//
// Description: Get the information such as IP address & geolocation & etc.
// Author: Jaehong Park (binixcode) / jaehong1972@gmail.com
//
//
/////////////////////////////////////////////////////////////////////////////
load('api_rpc.js');

let replace = ffi('char *replace(char*, char*, char*)');
let split = ffi('char* split2str(char*, char*, int)');

//let jsonEx = '{\x0a  "ip": "122.47.26.50",\x0a  "city": "Sogongdong",\x0a  "region": "Seoul-t'ukpyolsi",\x0a  "country": "KR",\x0a  "loc": "37.5645,126.9750",\x0a  "org": "AS17858 LG POWERCOMM"\x0a}';
//let textEX = '{\n  \"ip\": \"122.47.26.50\",\n  \"city\": \"Sogongdong\",\n  \"region\": \"Seoul-t'ukpyolsi\",\n  \"country\": \"KR\",\n  \"loc\": \"37.5645,126.9750\",\n  \"org\": \"AS17858 LG POWERCOMM\"\n}';
//let jsonEX2 = '{\x0a  "ip": "122.47.26.50",\x0a  "city": "Sogongdong",\x0a  "region": "Seoul-t'ukpyolsi",\x0a  "country": "KR",\x0a  "loc": "37.5645,126.9750",\x0a  "org": "AS17858 LG POWERCOMM"\x0a}';

let ipGeoLoc = {
  Reported: false,
  ip: "",
  city: "",
  //region: "",
  country: "",
  loc: "",
  org: "",

  lats: "",
  lngs: "",
  lat: 37.5645,
  lng: 126.9750,

  parse: function(response) {
    
      let jsonObj = JSON.parse(response);
      print("Geolocation jsonObj: ",jsonObj);
      print(jsonObj.ip);
      print(jsonObj.city);
      //print(jsonObj.region);
      print(jsonObj.country);
      print(jsonObj.loc);
      print(jsonObj.org);
    
      ipGeoLoc.ip = jsonObj.ip;
      ipGeoLoc.city = jsonObj.city;
      //ipGeoLoc.region = jsonObj.region;
      ipGeoLoc.country = jsonObj.country;
      ipGeoLoc.loc = jsonObj.loc;
      ipGeoLoc.org = jsonObj.org;

      let latitude = ipGeoLoc.loc;
      let longitude = ipGeoLoc.loc + ',';
      ipGeoLoc.lats = split(latitude, ',', 0);
      ipGeoLoc.lngs = split(longitude, ',', 1);

      ipGeoLoc.lat = JSON.parse(ipGeoLoc.lats);
      ipGeoLoc.lng = JSON.parse(ipGeoLoc.lngs);
      //ipGeoLoc.displayInfoDesc();
      ipGeoLoc.Reported = true;
      return true;
  },

  getInfo: function (){
      let ipLocURL = 'http://ipinfo.io/';
      ipLocURL += 'json';
        
      HTTP.query({
        url: ipLocURL,
        success: function(body, full_http_msg) { 
          print(body);
          ipGeoLoc.parse(body); 
        },
        error: function(err) {  // Optional
          print(err); 
        },
      });

      return true;
  },

  displayInfoDesc: function(){
    if(ipGeoLoc.Reported){
      print("ip: ", ipGeoLoc.ip);
      print("city: ", ipGeoLoc.city);
      //print("region: ", ipGeoLoc.region);
      print("country: ", ipGeoLoc.country);
      
      //print("latitude: ", ipGeoLoc.lats);
      print("latitude: ", ipGeoLoc.lat);
      //print("logitude: ", ipGeoLoc.lngs);
      print("logitude: ", ipGeoLoc.lng);
      
      print("organization: ", ipGeoLoc.org);
    }else{
      print("ipGeoLoc.Reported: false");
    }
  }
}