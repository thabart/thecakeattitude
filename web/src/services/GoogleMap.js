import Constants from '../../Constants';
import $ from 'jquery';
import Promise from "bluebird";

var getAddress = function (adrComponents) {
    var result = {
        postal_code: "",
        locality: "",
        country: "",
        street_address: ""
    };
    var streetNumber = "",
        route = "";
    adrComponents.forEach(function (adrComponent) {
        if (!adrComponent.types) {
            return;
        }

        if (adrComponent.types.includes("street_number")) {
            streetNumber = adrComponent.long_name;
            return;
        }

        if (adrComponent.types.includes("route")) {
            route = adrComponent.long_name;
            return;
        }

        if (adrComponent.types.includes("postal_code")) {
            result['postal_code'] = adrComponent.long_name;
            return;
        }

        if (adrComponent.types.includes("locality")) {
            result['locality'] = adrComponent.long_name;
            return;
        }

        if (adrComponent.types.includes("country")) {
            result['country'] = adrComponent.long_name;
            return;
        }
    });

    if (streetNumber !== "" && route != "") {
        result["street_address"] = streetNumber + " " + route;
    }

    return result;
};

var getPlace = function(url) {
  return new Promise(function(resolve, reject) {
    $.get(url).then(function(r) {
      if (r.status !== 'OK') {
        reject();
      }

      var result = r.results[0];
      console.log(result);
      var adr = getAddress(result.address_components);
      resolve({adr: adr, place_id: result.place_id, geometry: result.geometry});
    }).catch(function() {
      reject();
    });
  });
}

module.exports = {
  getPlaceByPlaceId(placeId) {
    var url = Constants.googleMapUrl + '/geocode/json?key=' + Constants.googleMapKey + '&place_id=' + placeId;
    return getPlace(url);
  },
  getPlaceByLocation(location) {
    var url = Constants.googleMapUrl + "/geocode/json?latlng=" + location.latitude + "," + location.longitude;
    return getPlace(url);
  }
};
