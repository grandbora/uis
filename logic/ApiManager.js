var request = require('request');

var ApiManager = function()  {
}

ApiManager.prototype.fetchTagData = function(tag, photo, cb) { //Freebase

    //Nokia maps
    var mapStr;
    if (photo.latitude && photo.longitude) {
        mapStr = getMapData(photo.latitude,photo.longitude);
    }

    getFreebaseData(tag, function(result) {
        cb({
            freebase : JSON.parse(result),
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


var getFreebaseData = function(tag, cb) {

    //FreeBase
    var query = [{'id': null, 'name': tag.tagName, 'type': tag.categoryName}];
    var query_envelope = {'query' : query};
    var service_url = 'http://api.freebase.com/api/service/mqlread';
    service_url += '?query=' + JSON.stringify(query_envelope);

    request(service_url, function (error, response, body) {      
        cb(body);
    });
};

exports.ApiManager = ApiManager;




        // <option value="places">Places</option>
        // <option value="food_drink">Food & Drink</option>
        // <option value="fashion">Fashion</option>
        // <option value="geographic">Geographic (i.e. Land, City)</option>
        // <option value="celebrities_society">Celebrities & Society</option>
        // <option value="sports">Sports</option>
        // <option value="multimedia">Multimedia</option>
        // <option value="science_education">Science & Education</option>
        // <option value="sports">Sports</option>
        // <option value="multimedia">Multimedia</option>
        // <option value="science_education">Science & Education</option>
        // <option value="technology">Technology</option>
        // <option value="automotive_transportation">Automotive & Transportation</option>
        // <option value="buildings">Buildings</option>
        // <option value="art_entertainment">Art & Entertainment</option>
        // <option value="animals">Animals</option>
        // <option value="travel">Travel</option>
        // <option value="hobbies_interests">Hobbies & Interests</option>