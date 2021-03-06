let map;
let mine_renderer;
let map_coord;
let cur_coord;

let geo_json;
let ns_outline;
let airport_json;

let nspoints=[[-61.92443847656251,45.89383147810292],[-62.57263183593751,45.70234306798271],[-62.89123535156251,45.79816953017265],[-63.17687988281251,45.794339630460705],[-63.64929199218751,45.882360730184025],[-64.00085449218751,46.00840867976967],[-64.39636230468751,45.77135470445038],[-64.68200683593751,45.583289756006316],[-64.97314453125001,45.30966593483413],[-63.40759277343751,45.3444241045224],[-64.29199218750001,45.158800738352106],[-64.41833496093751,45.30580259943578],[-65.16540527343751,45.02695045318546],[-65.81909179687501,44.68427737181225],[-66.42333984375001,44.2294565683017],[-65.88500976562501,44.56699093657141],[-66.17065429687501,44.19402066387343],[-66.17065429687501,43.8543357707896],[-65.99487304687501,43.65197548731187],[-65.63232421875001,43.361132106881726],[-65.29174804687501,43.54854811091288],[-64.87976074218751,43.739352079154706],[-64.57214355468751,44.05206384489493],[-64.23706054687501,44.3002644115815],[-63.86352539062501,44.48866833139467],[-63.55590820312501,44.38669150215206],[-63.39111328125001,44.60220174915696],[-62.82531738281251,44.68818283842486],[-62.36938476562501,44.883120442385646],[-61.50146484375001,45.166547157856016],[-60.95764160156251,45.30966593483413],[-61.33666992187501,45.40230699238177],[-60.45227050781251,45.61403741135093],[-59.91394042968751,45.85558643964395],[-59.66674804687501,46.05036097561633],[-60.17761230468751,46.28622391806708],[-60.43579101562501,46.33934333161124],[-60.29296875000001,46.848921470800455],[-60.57861328125001,47.0214613091173],[-60.84777832031251,46.81133924039194],[-61.34216308593751,46.23685258143994],[-61.55639648437501,46.03510927947337],[-61.48498535156251,45.67548217560647],[-61.86950683593751,45.66780526567164],[-61.92443847656251,45.89383147810292]];
let airports=[
    [[-64.89752769470216,44.970263256450565],[-64.89169120788576,44.97080976042204],[-64.894437789917,44.974695860708394],[-64.88945960998537,44.97591021304562],[-64.8970127105713,44.989387797074784],[-64.89426612854005,44.990237628601946],[-64.8952102661133,44.991573052686405],[-64.88945960998537,44.9929084456553],[-64.89023208618165,44.99582192231021],[-64.88533973693849,44.99764277000212],[-64.88937377929689,44.99928148345493],[-64.8966693878174,44.99685374310617],[-64.90859985351564,44.99406171454265],[-64.91992950439455,44.99345473381072],[-64.92713928222658,44.98926639154229],[-64.9328899383545,44.98604905123087],[-64.93984222412111,44.984713498441046],[-64.9431896209717,44.97973525482604],[-64.94018554687501,44.97803526775827],[-64.93615150451662,44.97378507957975],[-64.9322032928467,44.96983819420591],[-64.92610931396486,44.969230956963344],[-64.91907119750978,44.9701418104164],[-64.91563796997072,44.97056687041095],[-64.91452217102052,44.969716747271704],[-64.91083145141603,44.9712348154664],[-64.91263389587404,44.97487801519832],[-64.89967346191408,44.973117164225506]],
    [[-63.52638244628907,44.898079022097725],[-63.520030975341804,44.900389350114814],[-63.51608276367188,44.896984623793756],[-63.51058959960938,44.89978137805801],[-63.50234985351563,44.896498217861584],[-63.497543334960945,44.897835824274686],[-63.49016189575196,44.89090425391711],[-63.485527038574226,44.88239065605275],[-63.49170684814454,44.878498305929305],[-63.50698471069337,44.876673676163136],[-63.515739440917976,44.87387579814654],[-63.52638244628907,44.863777976705755],[-63.5335922241211,44.86341296203544],[-63.53754043579102,44.8687662785834],[-63.53153228759766,44.877403535012675],[-63.52569580078126,44.89491737016678]],
    [[-61.38198852539063,45.6588675363732],[-61.38198852539063,45.65412816147472],[-61.349716186523445,45.65454812228241],[-61.349287033081055,45.657847704759796],[-61.36284828186036,45.658927525889645],[-61.373662948608406,45.659347450705305]],
    [[-60.05453109741212,46.16467394223821],[-60.06946563720704,46.15403220284412],[-60.04852294921876,46.14915652869249],[-60.03925323486328,46.14850244198587],[-60.030841827392585,46.14784834750661],[-60.02818107604981,46.15884799349936],[-60.03470420837403,46.16098820962094],[-60.03075599670411,46.169488801542414],[-60.03127098083497,46.17519475571962],[-60.04225730895997,46.17204466671293],[-60.04491806030274,46.17691831295241]],
    [[-66.09186172485353,43.83935582945542],[-66.09580993652345,43.83588886076491],[-66.09169006347658,43.8324836061513],[-66.09520912170412,43.8234432604773],[-66.10130310058595,43.81725045281085],[-66.09692573547365,43.814091873569105],[-66.0875701904297,43.814587348027736],[-66.07581138610841,43.8230097848488],[-66.07847213745119,43.82653942343269],[-66.07649803161623,43.82895431905901],[-66.09031677246095,43.839170104096574]]
];

window.onload = () => {
    map = L.map("map", { preferCanvas: true }).setView([45.20139, -63.24829], 8);

    // Renderer for our markers (mines)
    mine_renderer = L.canvas();

    // Generate geojson layers (initialize)
    geo_json = L.geoJSON();
    ns_outline = L.geoJSON();
    airport_json = L.geoJSON();

    // Setup base maps
    let base_maps = {
        "OSM Default": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; ' + 
                        '<a href="https://www.openstreetmap.org/copyright">' +
                            'OpenStreetMap' + 
                        '</a> contributors'
        }),
        "OSM Hot": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; ' + 
                         '<a href="https://www.openstreetmap.org/copyright">' + 
                            'OpenStreetMap' + 
                         '</a> contributors, Tiles style by ' + 
                         '<a href="https://www.hotosm.org/" target="_blank">' + 
                            'Humanitarian OpenStreetMap Team' + 
                         '</a> hosted by ' + 
                         '<a href="https://openstreetmap.fr/" target="_blank">' + 
                            'OpenStreetMap France' + 
                        '</a>'
        })
    };

    // Setup overlays
    let overlays = {
        "Nova Scotia Outline": ns_outline,
        "Nova Scotia Airports": airport_json,
        "Abandoned Mines": mine_renderer,
        "Custom Geo Json": geo_json,
    };

    // Add ns polygon to ns outline
    ns_outline.addData({
        "type": "LineString",
        "coordinates": nspoints
    });
    
    // Add data to ns airports
    airports.forEach(points => {
        airport_json.addData({
            "type": "Polygon",
            "coordinates": [points]
        });
    });


    // Request mine data from file
    let xhr = new XMLHttpRequest();
    xhr.onload = (res) => { 
        console.log("loading finished");
        console.log(xhr.response.features[0]);

        // Foreach feature in the geojson data
        xhr.response.features.forEach(feature => {
            let props = feature.properties;
            let latlon = L.latLng(props["Lat_WM84dd"], props["Lon_WM84dd"]);

            // Add marker to the map and renderer
            let circle = L.circleMarker(latlon, {
                renderer: mine_renderer,
                color: "#ff00ff",
                opacity: 0.3,
                weight: 1,
                radius: 5
            }).addTo(map);

            let elements = "<div class='popupContainer'><table class='popup'>";

            // Add clickable popup
            Object.entries(props).forEach(([key, value]) => {

                // Only add value if not in the list below and is truthy
                if(!!value && !["Not Rated", "Unknown", "NOT INSPECTED", "0"].includes(value)){

                    // Convert urls to clickable <a> elements
                    if(typeof value === "string" && value.startsWith("http"))
                        value = "<a href='" + value + "'>" + value + "</a>";

                    elements += `<tr><th>${ key }</th><td>${ value }</td></tr>`;
                }
            });

            // Bind marker to our popup element
            circle.bindPopup(elements + "</table><div>");
        });
    };
    xhr.open("GET", "/leaflet-mapping/d010nssh.geojson", true);
    xhr.responseType = "json";
    xhr.send();

    // Add map and overlay options to map
    base_maps["OSM Default"].addTo(map);
    L.control.layers(base_maps, overlays).addTo(map);

    // Enable all overlays
    for(const layer of Object.values(overlays))
        layer.addTo(map);

    // Add scale bar
    L.control.scale().addTo(map);

    // Get map_coord element from the DOM
    map_coord = document.querySelector("#map_coords");
    map_coord.lat  = map_coord.querySelector(".lat");
    map_coord.long = map_coord.querySelector(".long");

    // Get cur_coord element from DOM
    cur_coord = document.querySelector("#cur_coords");
    cur_coord.lat  = cur_coord.querySelector(".lat");
    cur_coord.long = cur_coord.querySelector(".long");

    // Set map event listeners
    map.on("moveend", mapUpdate);
    map.on("mousemove", updateCursorCoords);

    // Initialize values
    mapUpdate();
};

/** Update map_coord element */
function mapUpdate(){

    // Return error if element doesn't exist
    if(!map || !map_coord) return console.error("Element missing");

    // Get the center coordnates of the map
    let center = map.getCenter();

    // Set element values
    map_coord.lat.innerText  = center.lat;
    map_coord.long.innerText = center.lng;
}

/** Move the cursor coordinate element */
function updateCursorCoords(cursor){
    moveCursorCoords(cursor);
    
    // Return error if element doesn't exist
    if(!cur_coord) return console.error("Element missing");

    // Get long / lat from cursor coordinate
    let position = cursor.latlng;

    // Set element values
    cur_coord.lat.innerText  = position.lat;
    cur_coord.long.innerText = position.lng;
}

/** Move cursor coordinate element */
function moveCursorCoords(cursor){

    // Return error if element doesn't exist
    if(!map || !cur_coord) return console.error("Element missing");

    // Get mouse position
    let position = cursor.containerPoint;

    // Move element
    cur_coord.style.left = position.x + 10 + "px";
    cur_coord.style.top  = position.y + 10 + "px";
}

/** Add GEO JSON point */
function makePoint(element){
    
    // Disable button
    element.disabled = true;

    // Return error if element doesn't exist
    if(!map || !geo_json) return console.error("Element missing");

    // Add event listener for a single click
    map.addEventListener("click", cursor => {

        // Create and add point
        geo_json.addData({
            "type": "Point",
            "coordinates": Object.values(cursor.latlng).reverse()
        });

        // Stop listener and re-enable button
        map.removeEventListener("click");
        element.disabled = false;

        // Enable other controls
        setDisableOtherControls(element, false);
    });

    // Disable other controls
    setDisableOtherControls(element);
}

let hasListener = false;
let oldText;
let points = [];
let markers = [];

/** Add geo json line string */
function makeLineString(element){

    // Return error if element doesn't exist
    if(!map || !geo_json) return console.error("Element missing");

    // Check for existing listener
    if(!hasListener){

        // Disable controls
        setDisableOtherControls(element);

        // Get text from button to replace with done
        oldText = element.innerText;
        element.innerText = "Done";

        // Set has listener to true (we're adding one)
        hasListener = true;

        // Add listener
        map.addEventListener("click", cursor => {

            // Add marker to the map
            markers.push(L.marker(cursor.latlng).addTo(map));

            // Push new data to "point" object to use later
            points.push(Object.values(cursor.latlng).reverse());
        });
    }else{

        // Enable other controls
        setDisableOtherControls(element, false);

        // Remove listeners (we've got all the points needed)
        map.removeEventListener("click");

        // Remove markers
        for(let marker of markers)
            map.removeLayer(marker);

        // Replace button text with it's old text (replacing 'done')
        element.innerText = oldText;
        hasListener = false;

        // Add data to our geo json object
        geo_json.addData({
            "type": "LineString",
            "coordinates": points
        });

        // Log points
        console.log(points);

        // Reset points
        points = [];
    }
}

/** Add geo json polygon */
function makePolygon(element){

    // Check for listener
    if(!hasListener){

        // First part is the same as creating a linestring, reuse that code
        makeLineString(element);
    }else{

        // Enable other controls
        setDisableOtherControls(element, false);

        // Remove listener
        map.removeEventListener("click");

        // Remove markers
        for(let marker of markers)
            map.removeLayer(marker);

        // Replace button text with it's old text (replacing 'done')
        element.innerText = oldText;
        hasListener = false;

        // Add data to our geo json object
        geo_json.addData({
            "type": "Polygon",
            "coordinates": [points]
        });

        // Log points
        console.log(points);

        // Reset points
        points = [];
    }
}

/** Enable / disable other geo json controls */
function setDisableOtherControls(element, disable=true){
    // Get all button elements
    let elements = document.querySelectorAll("#json_controls div button");

    // If the element isn't this one (element) disable/enable it
    for(let e of elements)
        if(e != element)
            e.disabled = disable;
}