var express    = require('express');
var bodyParser = require('body-parser');

var cors    = require('cors');
var hat     = require('hat');
var moment  = require('moment');
var sys     = require('util');
var amadeus = require('./utils/amadeus.js');
var iataDb  = require('./utils/iata.js').data;
var app     = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// Test the server starts 
app.get('/', function(req, res) {
        return res.status(200).send("OK");
});
//"https://airport.api.aero/airport/" + airportCode + "?user_key=352f918f2f96a9f61c30987195dfc9f5"

// Get ariports API
app.get('/getDestinations', function(req, res) {
	var props            = new Object();
	props.origin         = req.query.origin;
	props.departure_date = req.query.depart;
	props.duration       = req.query.duration;
	props.max_price      = req.query.max_price;
	props.apikey         = "";

	var totalBudget = props.max_price;
	props.max_price -= props.duration * 51; 

	amadeus.flightSearch(props, (err,data)=>{
		if (err) {
			console.log(err);
			res.sendStatus(400);
		}
		if (data.results == undefined) {
			console.log(data);
			res.sendStatus(400);
		}
		else {
			var listOfPlaces = [];
			for(var i = 0; i < data.results.length;i++) {	
				var minHotelCost = 80 * props.duration;
				if ((minHotelCost + (18 * props.duration)) + (props.duration * (minHotelCost + (18 * props.duration)) / 100) > (props.max_price - data.results[i].price + 76 * props.duration)) {
					//listOfPlaces.push(data.results[i].destination);
					for(var index = 0; index < iataDb.response.length; index++) {
						if ((iataDb.response[index].code).localeCompare(data.results[i].destination) == 0) {
							listOfPlaces.push(data.results[i]);
						}
					}		
				}				
			}
			res.send(JSON.stringify(listOfPlaces));
		}
	});
});

app.get('/getCoordinatesofPlaces', function(req, res) {
	var props      = new Object();
	props.airport  = req.query.airport;
	props.user_key = "";

	amadeus.getAirportInfo(props, (err, data)=> {
		if (err) {
			console.log(err);
			res.sendStatus(400);
		}		
		if (data == undefined || data == null || data.length == 0) {
			console.log(data);
			res.sendStatus(400);
		}
		else {
			//console.log(data);
			var json = data;
			json.ind = req.query.ind;
			res.send(JSON.stringify(json));
		}
		//console.log(listOfPlaces);
	});		
});

var port   = process.env.PORT || 8000;
var server = app.listen(port, function() {
        		console.log(`App listening on port ${port}`);
        	});

module.exports = app;