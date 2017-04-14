var Helpers = {
	// Convert array into JSON.
	getFormData : function getFormData(form){
		var unindexed_array = $(form).serializeArray();
		var indexed_array = {};
		$.map(unindexed_array, function(n, i){
			indexed_array[n['name']] = n['value'];
		});

		return indexed_array;
	},
	// Parse address.
	parseAddress: function(adr) {
		try {
			return JSON.parse(adr);
		} catch(e) {					
			var result = {};
			adr.replace('{','').replace('}','').split(',').forEach(function(elt) {
				var kvp = elt.split(':');
				var key = kvp[0].replace(/ /g,'');
				var value = kvp[1].replace(/'/g, '').replace(/^[ ]+|[ ]+$/g, '');
				result[key] = value;
			});
			
			return result;
		}
	},
	// Parse the address received from Google Map.
	getAddress: function(adrComponents) {
		var result = {};
		var streetNumber = "",
			route = "";
		adrComponents.forEach(function(adrComponent) {		
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
		
		result["street_address"] = streetNumber +" "+route;
		return result;
	},
	// Get the current location.
	getCurrentLocation: function(successCb, errorCb) {
		if (!navigator.geolocation) {
			errorModal.display('the geolocation is not supported by this browser', 3000, 'error');
			if (errorCb) errorCb();
			return;
		}
		
		navigator.geolocation.getCurrentPosition(function(position) {
			var url = Constants.googleMapUrl + "/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude;
			$.get(url).then(function(r) {
				if (!r || !r.results || r.results.length == 0) {
					if (errorCb) errorCb();
					return;
				}
				
				var adrComponent = r.results[0].address_components;
				var adr = Helpers.getAddress(adrComponent);
				if (successCb) successCb(adr);
			})
			.fail(function() {
				errorModal.display('Google map cannot be reached', 3000, 'error');				
				if (errorCb) errorCb();
			});
		});
	}
};