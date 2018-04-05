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



///// Get Neighborhood Data Here



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
                // GetNeighborhoodScore(location, category_string, pins[neighborhood + settings.city]);

                map.entities.push(pins[neighborhood + settings.city]);
            }
        };
        searchManager.geocode(requestOptions);
    });
}




//// Call API Here




//// Update Pins Here





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

    CenterMap(settings.city);
    // GetCityData(city_code);
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





/////// Create Slider Functions Here






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
            // GetNeighborhoods();
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
    // CreateCategorySlidersList();

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
