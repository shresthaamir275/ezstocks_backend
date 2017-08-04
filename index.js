
// Import firebase SDK
var firebase = require('firebase');
var http = require('https');

//Initialize the database using service account from google cloud for admin
//access.
firebase.initializeApp({
	serviceAccount: "./ezStocks-2072dbe018c4.json",
	databaseURL: "https://ezstocks-c20c9.firebaseio.com"
});

var body = "";
var ticker = "AAPL,X,GOOG,FB,TSLA,BABA,TWTR,SNAP";
var date = new Date();

var db = firebase.database();
var ref = db.ref('ezstocks');

var stocksRef = ref.child('allstocks');

var request = http.get("https://query.yahooapis.com/v1/public/yql?q=" 
            + "select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20"
            + "(%22" + ticker + "%22)"
            + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(response)
{
    response.on("data", function(chunk){
    body += chunk;

    response.on("end", function(){
        var profile = JSON.parse(body);

        // console.log("Company Ticker " + profile.query.results.quote.symbol);
        // console.log("Company Name " + profile.query.results.quote.Name);
        // console.log("Daily Change " + profile.query.results.quote.Change);
        // console.log("Today's Low " + profile.query.results.quote.DaysLow);
        // console.log("Today's High " + profile.query.results.quote.DaysHigh);
        // console.log("Time " + profile.query.created);
        // console.log(date.getTime());
    profile.query.results.quote.forEach(function(pr){
	stocksRef.push({
		ticker : pr.symbol,
		Company_Name  : pr.Name,
		Daily_Change  : pr.Change,
		Day_Low  : pr.DaysLow,
		Day_High : pr.DaysHigh,
		time_stamp : date.getTime()
	});  
	});
    });
    });
});



