var request = require('request');
var http    = require('http');

var amadeusKey = require('../config/config.js').amadeusKey;
var sitaKey    = require('../config/config.js').sitaKey;

function flightSearch(props, cb) {
	var url = 'https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search';
	
	props.apikey = amadeusKey;
	request({ url: url, qs: props, json: true }, function(err, response, body) {
    	cb(err, body);
    	console.log(props);
  	});	        
}

function getAirportInfo(data, cb) {
	var url   = "https://airport.api.aero/airport/" + data.airport;
	var props = new Object();
	
	props.user_key = sitaKey;
	request({ url: url, qs: props, json: true }, function(err, response, body) {
		var res = new Object();

		if (body.airports.length !== 0) {
			res.city = body.airports[0].city,
	    	res.lat  = body.airports[0].lat,
	    	res.lng  = body.airports[0].lng 
	    }

    	cb(err, res);
  	});
}

module.exports = {
  flightSearch: flightSearch,
  getAirportInfo: getAirportInfo
 }