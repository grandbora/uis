var request = require('request');

var ApiManager = function()  {
}

ApiManager.prototype.fetchTagData = function(tag, photo, cb) { //Freebase

    //Nokia maps
    var mapStr;
    if (photo.latitude && photo.longitude) {
        mapStr = getMapData(photo.latitude,photo.longitude);
    }

    //FreeBase
    var service_url = 'https://www.googleapis.com/freebase/v1/search?query=' + tag.tagName;
    request(service_url, function (error, response, body) {      
        cb({
            freebase : body,
            map : mapStr
        });
    });
};

var getMapData = function(lat, lon) {

    var app_id = 'irbEtA17e7khRQcuDjQB';
    var token = 'y8RuepVEq_-4eIrjcSljPw';
    var service_url = 'http://m.nok.it/?app_id='+app_id+'&token='+token+'&nord'+'&lat='+lat+'&lon='+lon;
    return "<img src='"+service_url+"'/>";
};

exports.ApiManager = ApiManager;