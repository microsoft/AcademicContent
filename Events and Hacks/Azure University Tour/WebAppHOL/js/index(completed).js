var infobox;
var map = null;
var map_height = 0;
var pins = {};
var city_listings = null;
var max_score = 0;

var category_string = "";

var infobox_template = '<div class="customInfobox"><div class="infobox-title">{title}</div>'
                     + '<div>{number} properties found</div>'
                     + '<div>{description}</div>'
                     // + '<div class="debug">Score: {score}</div>'
                     + '</div>';

var category_template = '<li>'
                      + '<label>{name}</label>'
                      + '<div class="range-container"><input type="range" min="1" max="3" value="{value}" class="slider" id="{id}"></div>'
                      + '<div class="range-labels"><span>Not important</span><span>Somewhat important</span><span>Very important</span></div>'
                      + '</li>';

var pin_template = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="15" stroke="black" stroke-width="0" fill="{color}"></circle><text x="15" y="20" text-anchor="middle" font-family="Verdana" font-size="12" fill="#ffffff">{text}</text></svg>';


/**
 * Startup the Bing Map.
 * Resize the Map.
 * Create the hover over infobox.
 * (see index.html)
 *
 * @public
 */

function CreateMap() {
    map = new Microsoft.Maps.Map('#map-container', {
        credentials: bingMapsKey,
        center: new Microsoft.Maps.Location(47.61023, -122.252658),
        showDashboard: false,
        zoom: 12
    });

    Resize();

    CreateInfoBox();
}



/**
 * Clears map of pins and empties the pins object.
 *
 * @private
 */
function ClearMap() {
    map.entities.clear();
    max_score = 0;
    pins = {};
}



/**
 * Pulls the json file that contains the neighborhood data for the selected city.
 * Note that, in a real application, this data would be requested from a server.
 * (see the ChooseCity function)
 *
 * @param  {string} dataset - the name of the neighborhood json file
 * @public
 */
function GetCityData(dataset) {

    city_listings = window["data_" + dataset];
    GetNeighborhoods();


    // If you are running this on a server, you can use this to pull the json data.

    // jQuery.getJSON("./data/data_" + dataset + ".json", function(json) {
    //     city_listings = json;
    //     GetNeighborhoods();
    // });
}

/**
 * Clears the Map of any existing pins.
 * Centers map at the selected city.
 * Calls the PlacePin function for each neighborhood in the city.
 * (see the GetCityData function)
 *
 * @private
 */
function GetNeighborhoods() {
    ClearMap();

    if (city_listings) {
        CenterMap(settings.city);

        var neighborhoods_list = Object.keys(city_listings);
        for (var n=0; n<neighborhoods_list.length; n++) {
            PlacePin(neighborhoods_list[n]);
        }
    }
}



/**
 * Centers the map on a requested location.
 * (see the GetNeighborhoods function)
 *
 * @param  {string} location - the name of the location on which to center the map.
 * @private
 */
function CenterMap(location) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var requestOptions = {
            bounds: map.getBounds(),
            where: location ,
            callback: function (answer, userData) {
                map.setView({ 
                    center: new Microsoft.Maps.Location(answer.results[0].location.latitude,answer.results[0].location.longitude),
                    zoom: 12
                });
            }
        };
        searchManager.geocode(requestOptions);
    });
}



/**
 * Uses the Bing Map Search module to find the requested neighborhood.
 * Creates a new custom pin and adds it to our pins object.
 * Calls GetNeighborhoodScore.
 * Adds the pin to the map.
 * (See the GetNeighborhoods function)
 *
 * @param  {string} neighborhood - the name of the neighborhood
 * @private
 */
function PlacePin(neighborhood) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var requestOptions = {
            bounds: map.getBounds(),
            where: neighborhood + settings.city ,

            callback: function (answer, userData) {
                var location = answer.results[0].location;

                //Note that this number manipulation is to more accurately represent vacant listings.
                var listings = Math.ceil(city_listings[neighborhood] * 0.12).toString();

                //Create a new pin in the pins object. We name the pin after it's neighborhood and city
                pins[neighborhood + settings.city] = new Microsoft.Maps.Pushpin(location, {
                    icon: pin_template,
                    color: 'hsl(215, 6%, 69%)',
                    text: listings,
                    anchor: new Microsoft.Maps.Point(15, 15)
                });

                //Attach mouse over and mouse out events to the pin.
                Microsoft.Maps.Events.addHandler(pins[neighborhood + settings.city], 'mouseover', PinMouseOver);
                Microsoft.Maps.Events.addHandler(pins[neighborhood + settings.city], 'mouseout', PinMouseOut);


                pins[neighborhood + settings.city].results = {};
                
                //Store some metadata with the pin.
                pins[neighborhood + settings.city].metadata = {
                    listings: listings,
                    neighborhood: neighborhood,
                    title: neighborhood,
                    description: "loading..."
                };

                //Call the Project Wollongong api for this neighborhood
                GetNeighborhoodScore(location, category_string, pins[neighborhood + settings.city]);

                map.entities.push(pins[neighborhood + settings.city]);
            }
        };
        searchManager.geocode(requestOptions);
    });
}




/**
 * Calls the Project Wollongong api for the requested location.
 * The sum of nearby locations for each category is used for the score of that category.
 * (see the PlacePin function)
 *
 * @param  {obj} location - location object returned from the Maps Search module
 * @param  {string} category - category string used in the Project Wollongong api call
 * @param  {obj} pin - the map pin connected to this location
 * @private
 */
function GetNeighborhoodScore(location, category, pin) {

    var url = 'https://cognitivegarage.azure-api.net/BingMaps/NavJoin?startPoint='
            + location.latitude + ',' + location.longitude
            + '&routeMode=' + settings.route_mode
            + '&categoryIds=' + category
            // maxTime and maxDistance can be interchanged. (Distance is in km)
            + (settings.minute_distance ? '&maxTime=' + settings.minute_distance : "")
            + (settings.distance ? '&maxDistance=' + settings.distance : "");

    jQuery.ajax({
        type: "GET",
        url: url,
        headers: {
            'Ocp-Apim-Subscription-Key': cogServicesKey
        }
    }).done(function(data) {
        var result = data;
        if (result.NavJoinCategoryResults) {
            for (var i = 0; i<result.NavJoinCategoryResults.length; i++) {
                var categoryId = result.NavJoinCategoryResults[i].CategoryId;
                try {
                    //The sum of nearby locations for this category becomes this category's score.
                    pin.results[categoryId] = result.NavJoinCategoryResults[i].NavJoinEntities.length;
                }
                catch (err) {
                    pin.results[categoryId] = 0;
                }
            }
            // CalculatePinScore(pin);
        }
    }).fail(function (error) {

        console.error(error);


        // A work around for a 429 error.
        // (429 means there were too many api calls within a given period. This work around waits a second and then tries again.)
        if (error.status == 429) {
            setTimeout(function(){
                GetNeighborhoodScore(location, category, pin);
            },1000); 
        } else {
            pin.setOptions({ color: "hsla(0, 96%, 19%, "+ .2 +")" });
            pin.metadata.description = "<span class='error'>Match Score Error</span>";
        }  

    });
}




/**
 * Calculates the score of this pin by adding up all of the pin's weighted category scores.
 * Updates all of the pins' colors based on their relative scores.
 * (see the GetNeighborhoodScore function)
 *
 * @param  {obj} pin - the pin to recieve a score.
 * @private
 */
function CalculatePinScore(pin) {

    var score = 0;

    var pin_keys = Object.keys(pins);
    var category_results = Object.keys(pin.results);

    var category_names = Object.keys(settings.categories);

    for (var i=0; i<category_results.length; i++) {
        //          The number of nearby locations * The priority of those locations (1-3)  * 10
        score += (pin.results[category_results[i]] * settings.categories[category_results[i]].value) * 10;
    }

    pin.metadata.score = score;

    max_score = Math.max(max_score, score);

    UpdatePinColors();
}


/**
 * Updates all of the pins' colors based on their score compared to the highest score.
 *
 * @private
 */
function UpdatePinColors() {
    var pin;
    var description;
    var pin_keys = Object.keys(pins);
    for (var p=0; p<pin_keys.length; p++) {
        pin = pins[pin_keys[p]];

        if (pin.metadata.score >= 0) {
            // if this pin's score is the best.
            if (pin.metadata.score === max_score) {
                pin.setOptions({
                    color: "hsl(207, 98%, 43%)"
                });
                description = "<strong>Best Match</strong>";
            } else {
                pin.setOptions({
                    color: "hsla(215, 96%, 19%, "+ (pin.metadata.score/max_score + .1) +")"
                });
                description = '<span class="debug">' + Math.round(100*pin.metadata.score/max_score) + "% Match</span>";
            }
            pin.metadata.description = description;
        }
    }
}





/**
 * Handles the mouse over event for the pins.
 * Updates the infobox with data about this pin.
 *
 * @param  {event} e - mouse over event
 * @private
 */
function PinMouseOver(e) {
    if (e.target.metadata) {
        infobox.setLocation(e.target.getLocation());
        infobox.setOptions({
            visible: true,
            zIndex: 4,
            title: e.target.metadata.description,
            description: e.target.metadata.description,
            htmlContent: infobox_template.replace('{title}', e.target.metadata.title).replace('{description}', e.target.metadata.description).replace('{number}', e.target.metadata.listings).replace('{score}', e.target.metadata.score)
        });
    }
}


/**
 * Handles the mouse out event for the pins.
 * Hides the infobox.
 *
 * @param  {event} e - mouse out event
 * @private
 */
function PinMouseOut(e) {
    infobox.setOptions({visible: false});
}




/**
 * Handles selecting a city. Removes the front cover and closes the appropriate menus.
 * Calls the GetCityData function.
 *
 * @param  {string} city_code - used to determine which city was selected;
 * @private
 */
function ChooseCity(city_code) {
    settings.city_code = city_code;

    jQuery("#front-cover").addClass("hide");
    jQuery("#find-city-label").addClass("hide");
    jQuery("#find-neighborhood-label").removeClass("hide");
    jQuery("#toggle-nav").prop("checked", false);
    jQuery("#toggle-cities").prop("checked", false);

    if (city_code == "se") {
        settings.city = "Seattle, WA";
    }
    if (city_code == "au") {
        settings.city = "Austin, TX";
    }
    if (city_code == "la") {
        settings.city = "Los Angelas, CA";
    }
    if (city_code == "sf") {
        settings.city = "San Francisco, CA";
    }
    if (city_code == "dc") {
        settings.city = "Washington, DC";
    }
    if (city_code == "to") {
        settings.city = "Toronto, Ontario";
    }

    // CenterMap(settings.city);
    GetCityData(city_code);
}



/**
 * Creates a Bing Map infobox. This box is used to show data when a pin is hovered.
 *
 * @private
 */
function CreateInfoBox() {
    //A title and description for the infobox.
    var title = 'Title';
    var description = 'Description.';

    //Create an infobox at the center of the map but don't show it.
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        htmlContent: infobox_template.replace('{title}', title).replace('{description}', description),
        visible: false
    });

    //Assign the infobox to a map instance.
    infobox.setMap(map);               
}





/**
 * For every category, a range slider is created and added to the "#categories" page.
 *
 * @param  {obj} b Data point
 * @return {funct}   Tween function
 * @private
 */
function CreateCategorySlidersList() {
    var chart = jQuery("#categories");

    var category_keys = Object.keys(settings.categories);

    for (var i=0; i<category_keys.length; i++) {
        chart.append(CreateCategorySlider(category_keys[i], settings.categories[category_keys[i]].name,  settings.categories[category_keys[i]].value));
    }

}



/**
 * Creates one of the category sliders using the category_template.
 *
 * @param  {string} id - the category code used for the slider id.
 * @param  {string} name - the name of the category
 * @param  {int} value - the default value of the category
 * @return {obj} html object created.
 * @private
 */
function CreateCategorySlider(id, name, value) {
    var slider = jQuery(category_template.replace('{id}', id).replace('{name}', name).replace('{value}', value));

    jQuery("#"+id, slider).change(function () {
        settings.categories[id].value = parseInt(this.value);
    });

    return slider;
}






/**
 * Creates the category string to be used with the Project Wollongong api call.
 *
 * @private
 */
function CreateCategoryString() {
    var category_names = Object.keys(settings.categories);

    for (var i=0; i<category_names.length; i++) {
        category_string += category_names[i];
        if (i < category_names.length-1) {
            category_string += ",";
        }
    }
}



/**
 * The jQuery on document ready function.
 * Set up the button events.
 * Create the category string.
 * Create the Category Sliders.
 *
 * @private
 */
jQuery(document).ready(function () {

    jQuery("label.navbar-toggle").click(function() {
        jQuery("#toggle-categories").prop("checked", false);
        jQuery("#toggle-cities").prop("checked", false);
    });

    jQuery("#find-city-label").click(function() {
        jQuery("#toggle-categories").prop("checked", false);
        jQuery("#toggle-nav").prop("checked", false);
    });

    jQuery("#find-neighborhood-label").click(function() {
        jQuery("#toggle-nav").prop("checked", false);
        jQuery("#toggle-cities").prop("checked", false);
        if (jQuery("#toggle-categories").prop("checked")) {
            GetNeighborhoods();
        }
    });


    jQuery("#city-button").click(function() {
        ClearMap();
        jQuery("#front-cover").removeClass("hide");
        jQuery("#find-city-label").removeClass("hide");
        jQuery("#find-neighborhood-label").addClass("hide");
        jQuery("#toggle-nav").prop("checked", false);
        jQuery("#toggle-cities").prop("checked", true);
    });


    jQuery("#se-button").click(function() {
        ChooseCity("se");
    });

    jQuery("#au-button").click(function() {
        ChooseCity("au");
    });

    jQuery("#la-button").click(function() {
        ChooseCity("la");
    });

    jQuery("#sf-button").click(function() {
        ChooseCity("sf");
    });

    jQuery("#dc-button").click(function() {
        ChooseCity("dc");
    });

    CreateCategoryString();
    CreateCategorySlidersList();

});


/**
 * Resizes the Bing Map when the window resizes.
 *
 * @private
 */
function Resize() {
    var mapDiv = document.getElementById("map-container");
    var windowHeight = $(window).height();
    map_height = windowHeight - 50;
    mapDiv.style.height = map_height + "px";
}


window.onresize = Resize;
