"use strict";

var url    = "http://localhost:8000/"
var query  = location.search.substr(1);
	var index  = parseInt(query.substr(query.indexOf("=") + 1));
	var places = JSON.parse(localStorage.getItem("places"));
	var place  = JSON.parse(places[index]);

function body_onload() {
	new Vue({
		 el: "#itinerary",
		 computed: {
		 	city: function() {
		 		return place.city;
		 	},
		 	
		 	airline: function() {
		 		return place.airline;
		 	},

		 	departing: function() {
		 		return place.departing;
		 	},

		 	returning: function() {
		 		return place.returning;
		 	},

		 	price: function() {
		 		return place.price;
		 	},

		 	departure: function() {
		 		return place.departure;
		 	},

		 	destination: function() {
		 		return place.destination;
		 	}
		 }

	});
}