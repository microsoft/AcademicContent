var restify = require('restify');
var builder = require('botbuilder');
var tfl = require('tfl.api')(process.env.TFL_APP_ID, process.env.TFL_APP_KEY);

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
//var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector);  
server.post('/api/messages', connector.listen());

var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i }); 
bot.beginDialogAction('help', '/help', { matches: /^help/i }); 

bot.dialog('/', intents);
intents.matches('None', '/help')
.matches('findbylocation', '/findByClosestBusStop')
.matches('findbybusnum', '/findByBusNum')
.matches('detailedquery', '/findByQuery')
.matches('greeting', '/greeting')
.matches('setlocation', '/location')
.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."))





//=========================================================
// Bot Dialogs
//=========================================================

bot.dialog('/findByClosestBusStop', [
    function (session){
        builder.Prompts.text(session, "Send me your current location, if you can't type: pass");
    },
    function (session, results, next) {
        if(results.response == "pass" || results.response == "Pass"){
            session.beginDialog('/noLocation');
        }else{
            session.userData.lat = session.message.entities[0].geo.latitude;
            session.userData.lon = session.message.entities[0].geo.longitude;
        //   session.userData.lat = 51.4673838;
        //   session.userData.lon = -0.190017;

            tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram', radius: 500})
            .then(result => {     
                var searchResult = JSON.parse(result.text);   
                var naptanId = searchResult.stopPoints[0].id;

                return tfl.stoppoint.byIdArrivals(naptanId);
            })
            .then(result => { 
                var searchResult = JSON.parse(result.text);
                if(searchResult.length != 0){
                    var i = searchResult.length-1;
                    for(i; i>=0; i--){
                        var lineName = searchResult[i].lineName;
                        var destinationName = searchResult[i].destinationName;   
                        var arrivalTime = searchResult[i].expectedArrival;
                        var time = new Date(arrivalTime);     
                        var hour = time.getHours() + 1;
                        session.send(lineName + " to " + destinationName + "           " + hour + ":" + time.getMinutes());
                        console.log(time.getHours() + ":" + time.getMinutes() + "     " + lineName + " to " + destinationName);                      
                    } 
                }else{
                    session.send("There are no near by bus stops");
                }

            });
        }      
    }
]);

bot.dialog('/findByBusNum', [
    function (session, args) {
        if(args.entities != null){
            var busnum  = builder.EntityRecognizer.findEntity(args.entities, 'busnum');
            session.userData.busnum = busnum.entity;
        }else{
            session.beginDialog('/getBusNum'); 
        }

        builder.Prompts.text(session, "Send me your current location, if you can't type: pass");
    },
    function (session, results, next) {
        if(results.response == "pass" || results.response == "Pass"){
            session.beginDialog('/noLocation');
        }else{
            session.userData.lat = session.message.entities[0].geo.latitude;
            session.userData.lon = session.message.entities[0].geo.longitude;
                      
            // session.userData.lat = 51.4673838;
            // session.userData.lon = -0.190017;

            tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})
            .then(result => {     
                var searchResult = JSON.parse(result.text);   
                var stopPointsNum = searchResult.stopPoints.length;
                var direction = new Array();
                var i = 0;
                var j = 0;
                var counter = 0;
                
                for(i; i<stopPointsNum; i++){
                    for(j; j<searchResult.stopPoints[i].lines.length; j++){
                        if(searchResult.stopPoints[i].lines[j].name == session.userData.busnum){
                            direction[counter] = searchResult.stopPoints[i].additionalProperties[1].value;
                            counter++;
                        }
                    }
                    j=0;         
                }

                session.userData.directionArray = direction;
                session.beginDialog('/selectDirection');
            });
            next;         
        }
    },
    function (session, next){
        tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})       
        .then(result => { 
            var naptanId;
            var busDestination;
            var searchResult = JSON.parse(result.text);
            var userDirection = session.userData.direction;
            var stopPointsNum = searchResult.stopPoints.length;
            
            for(var i=0; i<stopPointsNum; i++){
                if(searchResult.stopPoints[i].lines.length != 0){
                    busDestination = searchResult.stopPoints[i].additionalProperties[1].value;
                    if(busDestination.includes(userDirection)){
                        naptanId = searchResult.stopPoints[i].id;
                        break;
                    }                
                }           
            }

            return tfl.stoppoint.byIdArrivals(naptanId);
        }).then(result => {
            var busnum = session.userData.busnum;
            var direction = session.userData.direction;
            var searchResult = JSON.parse(result.text);
            var i = searchResult.length-1;

            session.send(busnum + " towards " + direction);
            for(i; i>=0; i--){
                if(searchResult[i].lineName == busnum){
                    var lineName = searchResult[i].lineName;
                    var destinationName = searchResult[i].destinationName;   
                    var arrivalTime = searchResult[i].expectedArrival;
                    var time = new Date(arrivalTime);     
                    session.send(time.getHours()+1 + ":" + time.getMinutes());   
                    console.log(time.getHours()+1 + ":" + time.getMinutes() + "     " + lineName + " to " + destinationName);        
                }    
            } 
        });
        
        session.endDialog(); 
    }
]);

bot.dialog('/findByQuery', [
    function (session, args) {
        if(args != null){
            var busnum  = builder.EntityRecognizer.findEntity(args.entities, 'busnum');
            var busstop = builder.EntityRecognizer.findEntity(args.entities, 'busstop');
            var towards = builder.EntityRecognizer.findEntity(args.entities, 'towards');
        
            if (!busnum) {
                session.beginDialog('/getBusNum');
            } else {
                session.userData.busnum = busnum.entity;
            }

            if (!busstop) {
                session.beginDialog('/getBusStop');
            } else {
                session.userData.busstop = busstop.entity;
            }       

            if (!towards) {
                session.beginDialog('/getTowards');
            } else {
                session.userData.towards = towards.entity;           
            }

           session.beginDialog('/proxy');

        }else{
            session.beginDialog('/noLocation');
        }       
    },
    function(session){       
        session.beginDialog('/checkArrivals');
    }
]);

bot.dialog('/proxy', [
    function(session){
        session.endDialog();
    }
])

bot.dialog('/noLocation', [
     function (session) {
        session.beginDialog('/getBusNum');
    },
     function (session) {
        session.beginDialog('/getBusStop');
    },
     function (session) {
        session.beginDialog('/getTowards');
    },
    function (session) {
        session.beginDialog('/checkArrivals');
        session.endDialog();
    }
]);

bot.dialog('/checkArrivals', [
    function (session) {
        var busnum = session.userData.busnum;
        var busstop = session.userData.busstop;
        var towards = session.userData.towards;  

        tfl.stoppoint.search(busstop)
        .then(result => {     
            var searchResult = JSON.parse(result.text);   
            var stopId = searchResult.matches[0].id;
            return tfl.stoppoint.byId(stopId);
        })
        .then(result => { 
            var naptanId;
            var searchResult = JSON.parse(result.text);
            for(var i=0; i<searchResult.children.length; i++){
                var busdestination = searchResult.children[i].additionalProperties[1].value.toLowerCase();
                if(busdestination.includes(towards.toLowerCase())){
                    naptanId = searchResult.children[i].id;
                }
            }   
            return tfl.stoppoint.byIdArrivals(naptanId);
        })
        .then(result => { 
            var searchResult = JSON.parse(result.text);
            var i = searchResult.length-1;
            session.send(busnum + " expected arrival times:");
            for(i; i>=0; i--){
                if(searchResult[i].lineName == busnum){
                    var lineName = searchResult[i].lineName;
                    var destinationName = searchResult[i].destinationName;   
                    var arrivalTime = searchResult[i].expectedArrival;
                    var time = new Date(arrivalTime);     
                    session.send(time.getHours()+1 + ":" + time.getMinutes());   
                    console.log(time.getHours()+1 + ":" + time.getMinutes() + "     " + lineName + " to " + destinationName);        
                }
            } 
        });

        session.endDialog();
        
    }
]);

////////////////////////////////////

bot.dialog('/help', [
     function (session) {
        session.endDialog("Example commands that you can try: \n\n* Next bus \n* When is the 28 coming \n* When is the next 28 from townmead road to wandsworth \n* help - Displays these commands.");
    }  
]);

bot.dialog('/greeting', [
     function (session) {
         //Should check if user is using Telegram before trying to send a Telegram sticker
        var data = { method: "sendSticker", parameters: { sticker: { url: "https://telegram.org/file/811140007/2/uHbXgsdVXQY/a75eee858dd829fb89", mediaType: "image/webp"} } };
        const message = new builder.Message(session);
        message.setChannelData(data);
        session.send(message); 


        session.endDialog("Hey!");
    }  
]);

bot.dialog('/getBusNum', [
     function (session) {
        builder.Prompts.text(session, "Which bus are you looking for?");
    },
    function (session, results) {
        if (results.response) {
            session.userData.busnum = results.response;
            session.endDialog();
        } else {
            session.send("Error");
            session.endDialog();
        }
    } 
]);

bot.dialog('/getBusStop', [
    function (session) {
        builder.Prompts.text(session, "Which bus stop are you at?");
    },
    function (session, results) {
        if (results.response) {
            session.userData.busstop = results.response;     
            session.endDialog();
        } else {
            session.send("Error");
            session.endDialog();
        }
    } 
]);

bot.dialog('/getTowards', [
    function (session) {
        builder.Prompts.text(session, "Where is the bus heading towards?");
    },
    function (session, results) {
        if (results.response) {
            session.userData.towards = results.response;           
            session.endDialog();
        } else {
            session.send("Error");
            session.endDialog();
        }
    } 
]);

bot.dialog('/selectDirection', [
    function (session){
        builder.Prompts.choice(session, "Which direction are you heading?", session.userData.directionArray);
    },
    function (session, results) {
        session.userData.direction = results.response.entity;
        session.endDialog();
    } 
])

bot.dialog('/selectBus', [
    function (session){
        builder.Prompts.choice(session, "Which bus?", session.userData.busArray);
    },
    function (session, results) {
        session.userData.busnum = results.response.entity;
        session.endDialog();
    } 
])


////////////////////////////

bot.dialog('/location', [
    function (session, next) {
        builder.Prompts.text(session, "Send me your current location");
    },
    function (session, results, next) {
        session.userData.lat = session.message.entities[0].geo.latitude;
        session.userData.lon = session.message.entities[0].geo.longitude;

        // session.userData.lat = 51.4673838;
        // session.userData.lon = -0.190017;

        tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})
        .then(result => {     
            var searchResult = JSON.parse(result.text);   
            var stopPointsNum = searchResult.stopPoints.length;
            var direction = new Array();
            var counter=0;
            for(var i=0; i<stopPointsNum; i++){
                if(searchResult.stopPoints[i].lines.length != 0){
                    direction[counter] = searchResult.stopPoints[i].additionalProperties[1].value;
                    counter++;
                }           
            }

            session.userData.directionArray = direction;
            session.beginDialog('/selectDirection');
        });

        next;
    },
    function (session, next){
        var latitude =  session.userData.lat;
        var longitude =  session.userData.lon;

        tfl.stoppoint({ lat: latitude, lon: longitude, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})       
        .then(result => { 
            var naptanId;
            var searchResult = JSON.parse(result.text);
            var userDirection = session.userData.direction;
            var stopPointsNum = searchResult.stopPoints.length;
            var busDestination;
            var busNumbers = new Array();
            
            for(var i=0; i<stopPointsNum; i++){
                if(searchResult.stopPoints[i].lines.length != 0){
                    busDestination = searchResult.stopPoints[i].additionalProperties[1].value;
                    if(busDestination.includes(userDirection)){
                        session.userData.naptanId = searchResult.stopPoints[i].id;
                        
                        for(var j=0; j<searchResult.stopPoints[i].lines.length; j++){
                            busNumbers[j] = searchResult.stopPoints[i].lines[j].name;
                        }

                        session.userData.busArray = busNumbers;
                        session.beginDialog('/selectBus');

                        break;
                    }                
                }           
            }
        });

        next;
    },
    function(session){
        var naptanId = session.userData.naptanId;
        var busnum = session.userData.busnum;
        var direction = session.userData.direction;

        tfl.stoppoint.byIdArrivals(naptanId)
        .then(result => { 
            var searchResult = JSON.parse(result.text);
            var i = searchResult.length-1;
            session.send(busnum + " towards " + direction);
            for(i; i>=0; i--){
                if(searchResult[i].lineName == busnum){
                    var lineName = searchResult[i].lineName;
                    var destinationName = searchResult[i].destinationName;   
                    var arrivalTime = searchResult[i].expectedArrival;
                    var time = new Date(arrivalTime);     
                    session.send(time.getHours()+1 + ":" + time.getMinutes());   
                    console.log(time.getHours()+1 + ":" + time.getMinutes() + "     " + lineName + " to " + destinationName);        
                }    
            } 
        });

        session.endDialog(); 

    }

]);

///Not in use
// bot.dialog('/setLocation', [
//     function (session) {
//         builder.Prompts.text(session, "Send me your current location, if you can't type: pass");
//     },
//     function (session, results) {
//         if(session.message.entities.length != 0){
//             session.userData.lat = session.message.entities[0].geo.latitude;
//             session.userData.lon = session.message.entities[0].geo.longitude;
//             session.endDialog();
//         }else if(results.response == "pass" || results.response == "Pass"){        
//             session.beginDialog('/noLocation');
//         }else{
//             session.send("Didn't get your location");
//             session.endDialog();
//         }    
//     }
// ]);