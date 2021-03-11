let map;
let map_coord;
let cur_coord;

let geo_json;
let mines;

let mine_showing = [0, 99];

window.onload = () => {
    map = L.map("map").setView([44.88502667909841, -65.16840650198439], 17);
    geo_json = L.geoJSON();
    mines = L.geoJSON(undefined, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<pre>${JSON.stringify(feature.properties)}</pre>`);
            // l.bindPopup('<pre>'+JSON.stringify(f.properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>');
        }
    });

    try{
        let params = new URLSearchParams(window.location.search);
        let showing = params.get("show");

        if(showing){
            let split = showing.split(",");
            mine_showing = [ parseInt(split[0]), parseInt(split[1])];
        }
    }catch{
        console.error("unable to load url param 'show'");
    }

    console.log("showing mines:", mine_showing);

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
        "GEO JSON": geo_json,
        "Mines": mines
    };

    let xhr = new XMLHttpRequest();
    xhr.onload = (res) => { 
        console.log("loading finished -", xhr.response);

        mines.addData(
            xhr.response.features.slice(...mine_showing)
        );
    };
    xhr.open("GET", "/leaflet-mapping/d010nssh.geojson", true);
    xhr.responseType = "json";
    xhr.send();

    // Add map and overlay options to map
    base_maps["OSM Default"].addTo(map);
    L.control.layers(base_maps, overlays).addTo(map);

    // Create blank geo_json
    overlays["GEO JSON"].addTo(map);
    overlays["Mines"].addTo(map);

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