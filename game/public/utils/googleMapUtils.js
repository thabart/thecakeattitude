var GoogleMapUtils = {
  getAddress: function (adrComponents) {
      var result = {
          postal_code: "",
          locality: "",
          country: "",
          street_address: ""
      };
      if (!adrComponents) return result;
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
  }
};
