"use strict";

var url    = "http://localhost:8000/"
var gPlaces = [];

function body_onload() {
	new Vue({
		 el: "#itenerate",
		 data: {
		 	budget:       "",
		 	//selected:     "",
		 	term:         "",
		 	startDate:    "",
		 	endDate:      "",

		 	airports: [],
		 },

		 computed: {
		 	listAirports: function() {		 		
		 		if (this.term === "") {
		 			this.airports = [];
		 			return;
				}

		 		var self = this;
		 		fetch(encodeURI("https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=Vc0qZE6ehFil2H6SNJfR3eBi1euaK7B4&term=" + this.term), { 
			        method: "GET",
			        headers: {
			            'content-type': 'application/json'
			        }
			    }).then(function(res) {
			            if (res.ok) {
			                res.json().then(function(data) {
			                	//self.airports = data;			                	
			                });
			            }
			            else {
			            	res.json().then(function(data) {
			                    //self.airports.push({"value": "Sorry", "label": "No Results Found"});
			                });
			            }
			        }).catch(function(err) {
			        	//self.airports.push({"value": "Sorry", "label": "No Results Found"});
			           	//alert(err.message);
			    	});

			    /*
			    if (self.selected !== "") {
			    	self.term         = self.selected;
			    	self.selected     = "";
			        self.showAirports = false;
		       	} 
		       	*/
		 	}
		 },

		 methods: {
		 	btnGo_click: function() {
		 		var date1       = new Date(this.startDate);
				var date2       = new Date(this.endDate);
				var timeDiff    = Math.abs(date2.getTime() - date1.getTime());
				var duration    = Math.ceil(timeDiff / (1000 * 3600 * 24));
		 		
		 		var year   = date1.getFullYear();
		 		var month  = date1.getMonth() + 1;
		 		var day    = date1.getDate()  + 1;		 		
		 		var depart = year+ "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

		 		// Get the places based on user input
		 		fetch(encodeURI(url + "getDestinations" + "?origin=" + this.term.substring(0, 3) + "&duration=" + duration + "&max_price=" + this.budget + "&depart=" + depart), {
		 			method: "GET",
			        headers: {
			            'content-type': 'application/json'
			        }
			    }).then(function(res) {
			    	if (res.ok) {
			    		res.json().then(function(data) {
			                	self.airports = data;
			                	
			                	// Get the co-ordinates of the places
			                	for (var i = 0; i < airports.length; i++) {
			                		fetch(encodeURI(url + "getCoordinatesOfPlaces" + "?airport=" + airports[i].destination), {
							 			method: "GET",
								        headers: {
								            'content-type': 'application/json'
								        }
								    }).then(function(res) {
			                			if (res.ok) {
			                				res.json().then(function(data) {
			                					if (data.length != 0) gPlaces.push(JSON.stringify(data));
			                					if (gPlaces.length === airports.length) { 
			                						localStorage.setItem("places", JSON.stringify(gPlaces)); 
			                						window.location.href = "./maps/maps.html";
			             							gPlaces = []; 
			                					}
			                				});
			                			}
			                			else {
			                				res.json().then(function(data) {
							                    alert(data.message);
							                });
			                			}
								    }).catch(function(err) {
								    	alert(err.message);
								    });
			                	}
			            });
			    	}
			    	else {
			    		res.json().then(function(data) {
			                    alert(data.message);
			                });
			    	}
			    }).catch(function(err) {
			            alert(err.message);
			    });
			}  	
		 }
	});
}