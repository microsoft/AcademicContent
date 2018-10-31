var bingMapsKey = 'Ah_C8OJJu8wnNX50rGHf8_OYKonuhZ-CfLQ-kXS-4tI-QsTN9pkLPPfgZgKigwa8';
var cogServicesKey = '<YOUR KEY>';




/*
 * This settings object controls how we use the Project Wollongong API.
 * The API is called in the GetNeighborhoodScore function on line 200 of index.js
 *
 * "route_mode":        Can be "walking", "transit", or "driving"
 *
 * "minute_distance":   Determines how far, in minutes, from the neighborhood to search for relevant locations
 * "distance":          Determines how far, in kilometers, from the neighborhood to search for relevant locations
 * NOTE: Only use either "minute_distance" or "distance". Not both.
 *
 * "categories":        The sliders in the "Make it Yours" menu are built dynamically based on which categories are in this object.
 *                      This will be used in the Wollongong API to know what kinds of nearby locations are relevant.
 *                      Each category object has 2 properties: name and value.
 *                      "name":  is the text that will appear above the slider.
 *                      "value": is the starting value of that slider (1-3)
 *
 */

var settings = {
    route_mode: "walking",
    minute_distance: 20,
    distance: null,
    categories: {
        // '90001':{name:"Arts & Entertainment", value: 2},
        // '90012':{name:"Attractions", value: 2},
        // '90016':{name:"Museums", value: 2},
        // '90111':{name:"Banking & Finance", value: 2},
        // '90353':{name:"Beauty & Spas", value: 2},
        // '90232':{name:"Food & Drink Stores", value: 2},
        // '90287':{name:"Restaurants", value: 2},
        // '90265':{name:"Fast Food Stores", value: 2},
        // '90243':{name:"Bars", value: 2},
        '90243':{name:"Bars/Nightlife", value: 2},
        '90870':{name:"Parks & Recreation", value: 2},
        // '90408':{name:"Medical Centers", value: 2},
        '90408':{name:"Medical Care", value: 2},
        // '90942':{name:"Animal & Pet Services", value: 2},
        // '90551':{name:"Child Care Services", value: 2},
        '90738':{name:"Grocery", value: 2},
        // '91493':{name:"Supermarkets", value: 2},
        // '90932':{name:"Home & Garden Stores", value: 2},
        // '90793':{name:"Pet Supply Stores", value: 2},
        // '90771':{name:"Malls & Shopping Centers", value: 2},
        '90771':{name:"Shopping", value: 2},
        // '91567':{name:"Park & Rides", value: 2},
        // '91510':{name:"Liquor & Wine Stores", value: 2},
        // '90727':{name:"Department Stores", value: 2},
        // '90661':{name:"Electronics Stores", value: 2},
        // '90617':{name:"Religion", value: 2},
        // '91457':{name:"Places of Worship", value: 2},
        // '90619':{name:"Churches", value: 2}
    }
};
