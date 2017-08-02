
var thisIsClickedButton;


/* ---------------------------------------------------------------- */
function alertSaved() {
    //alert('Saved');
    showSnackbar('saved', 'saved', 3000);
}

function alertError() {
    //alert('Error! Please enter valid data');
    showSnackbar('enterValidData', 'Error! Please enter valid data', 3000);
}



function validate(ele) {
    if (ele.value) {
        ele.style.outline = 'none';
        return 0;
    } else {
        ele.style.outline = "1px solid red";
        return 1;
    }
}

function checkFields() {

    var vehicleName = document.getElementById('j_id0:detailFrm:vehicle');
    var vehicleCapacity = document.getElementById('j_id0:detailFrm:capacity');
    var vehicleNum = document.getElementById('j_id0:detailFrm:vehicleNum');
    var homeLocation = document.getElementById('j_id0:detailFrm:homeLoc');
    var leaveTo = document.getElementById('j_id0:detailFrm:leaveTo');
    var leaveFrom = document.getElementById('j_id0:detailFrm:leaveFrom');

    if (validate(vehicleName)) return;
    if (validate(vehicleCapacity)) return;
    if (validate(vehicleNum)) return;
    if (validate(homeLocation)) return;
    if (validate(leaveTo)) return;
    if (validate(leaveFrom)) return;

    

    saveEmpRequest(vehicleName.value, parseInt(vehicleCapacity.value), vehicleNum.value, homeLocation.value, leaveTo.value, leaveFrom.value);

}



/* ---------------------------------------------------------------- */
function openNav() {
    browserHistoryPush();
    document.getElementById('myUpnav').style.height = '90%';
    document.getElementById('routesDiv').style.zIndex = '1';
    var hopClasses = document.getElementsByClassName('tour-hello-hopscotch');
    for (var kl = 0; kl < hopClasses.length; kl++) {
        hopClasses[kl].style.zIndex = 1;

    }
} /* ---------------------------------------------------------------- */

function closeNav() {
    document.getElementById('myUpnav').style.height = '0';
    document.getElementById('routesDiv').style.zIndex = '3';
    var hopClasses = document.getElementsByClassName('tour-hello-hopscotch');
    for (var kl = 0; kl < hopClasses.length; kl++) {
        hopClasses[kl].style.zIndex = 3;

    }
} /* ---------------------------------------------------------------- */


var noOfRoutes = '0';

function addExistingRoutes() {   
    var activeRt = '0';
    for (var kk = 1; kk <= noOfRoutes; kk++) {
        var rt;
        if (kk == activeRt) {
            rt = ' <div class="col-md-2 " id="routeno' + kk + '" onclick="callctr_js(this)"> <div class="card routeButton valgn active " > <span class="detailsText"> Route &#160;' + kk +
                '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';

            loadActiveRoutePoints_js(kk);


        } else {
            rt = ' <div class="col-md-2 " id="routeno' + kk + '" onclick="callctr_js(this)"> <div class="card routeButton valgn " > <span class="detailsText"> Route &#160;' + kk +
                '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';
        }
        $(rt).insertBefore($('#newRouteId'));

    }
}

/* ---------------------------------------------------------------- */

function addNewRoute() {
    if(document.getElementById('j_id0:detailFrm:vehicle')){
        if(!(document.getElementById('j_id0:detailFrm:vehicle').value.length > 0)) {
            showSnackbar('noMoreRoutes', 'Please fill in your details', 3000);
            openNav();
            return;
        }        
    }

    if (noOfRoutes <= 3) {
        clearSelectedClass(' card routeButton valgn ');
        //IF NO OF ROUTES IS LESS THAN 3/4
        //ENABLE SAVE BUTTON
        //ENABLE SEARCH
        //CLEAR THE EXISTING ROUTE
        clearstDet();
        clearRenderer();
        ++noOfRoutes;
        var rt = ' <div class="col-md-2 " id="routeno' + noOfRoutes + '" onclick="fr_routeBtnClickHandler(this)"> <div class="card routeButton valgn selected " > <span class="detailsText"> Route &#160;' + noOfRoutes +
            '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';
        $(rt).insertBefore($('#newRouteId'));

        toggleSearch('visible');
    } else {
        //alert('You cant have more than 4 routes, Remove the existing routes..');
        showSnackbar('noMoreRoutes', 'You cant have more than 4 routes, Remove the existing routes..', 3000);
    }
} /* ---------------------------------------------------------------- */

function delgateActivateRemoveTheRoutes(t) {

    var route_Id = selectedClassDivs[0].parentNode.id;

    {
        if (t.id === 'activate') {
            activateTheRoutes(route_Id);
        } else if (t.id === 'remove') {
            removeTheRoutes(route_Id);
        }
    }

} /* ---------------------------------------------------------------- */

function toggleActiveClass() {
    var activeCls = document.getElementsByClassName('active');
    if (activeCls.length > 0) {
        var existingClsName = activeCls[0].className;
        existingClsName = existingClsName.replace('active', '');
        for (var j = 0; j < activeCls.length; j++) {
            activeCls[j].className = existingClsName;
        }
    }


    var selectedClassDivs = document.getElementsByClassName('selected');
    var newClsName = ' card routeButton valgn active';

    selectedClassDivs[0].className = newClsName;




}

/************************* */
var modalConfirm = function (callback) {

    $("#btn-activateRouteModal").on("click", function () {
        // if (gcodes.length > 0 && gcodes.length < 65) 
        if (gcodes.length > 65) {
            showSnackbar('selectRoute', 'Only destinations within the city limits(30 Kms from office) are allowed', 3000);
            return;
        }
        {

            if (!selectedClassDivs) {
                selectedClassDivs = document.getElementsByClassName('selected');
            }
            if (selectedClassDivs.length > 0) {
                if ((selectedClassDivs[0].parentNode.id.indexOf('route') == -1 && gcodes.length == 0) || (gcodes.length > 0)) {
                    $("#activateRouteModal").modal('show');
                } else {
                    showSnackbar('selectRoute', 'Please search the destination', 3000);
                }
            } else {
                //alert('Please select the route ');
                showSnackbar('selectRoute', 'Please select the route', 3000);
            }
        }
        //  else {
        //     showSnackbar('selectRoute', 'Please search the destination', 3000);
        // }
    });

    $("#modal-btn-activate-yes").on("click", function () {
        callback('activate-true');
        $("#activateRouteModal").modal('hide');
    });

    $("#modal-btn-activate-no").on("click", function () {
        callback('activate-false');
        $("#activateRouteModal").modal('hide');
    });


    $("#btn-deactivateRouteModal").on("click", function () {
        if (!selectedClassDivs) {
            selectedClassDivs = document.getElementsByClassName('selected');
        }
        if (selectedClassDivs.length > 0) {
            $("#deactivateRouteModal").modal('show');
        } else {
            //alert('Please select the route ');
            showSnackbar('selectRoute', 'Please select the route', 3000);
        }

    });

    $("#modal-btn-deactivate-yes").on("click", function () {
        callback('deactivate-true');
        $("#deactivateRouteModal").modal('hide');
    });

    $("#modal-btn-deactivate-no").on("click", function () {
        callback('deactivate-false');
        $("#deactivateRouteModal").modal('hide');
    });
};

modalConfirm(function (confirmMsg) {
    var route_Id;

    var selectedDiv = document.getElementsByClassName('selected');
    if (selectedDiv.length > 0) {
        route_Id = selectedDiv[0].parentNode.id;
    }
    //ACTIVATE THE ROUTE
    {
        if (confirmMsg == 'activate-true') {            
            activateTheRoutes(route_Id)
        } else if (confirmMsg == 'activate-false') {            
        }
    }
    //DEACTIVATE THE ROUTE
    {
        if (confirmMsg == 'deactivate-true') {           
            removeTheRoutes(route_Id);
        } else if (confirmMsg == 'deactivate-false') {        
        }
    }
});

function activateTheRoutes(route_Id) {
    {
        
        toggleSearch('hidden');
        if (route_Id.indexOf('route') > -1) {
            //New Route Activation
            getActiveRouteKeys();
        } else {
            //Existing route activation
            up_getActiveRouteKeys();

        }

    }

} /* ---------------------------------------------------------------- */

function removeTheRoutes(route_Id) {
    //var confirm = window.confirm('Remove the Route  ?');
    //if (confirm) 
    {
        noOfRoutes--;
        noOfRoutes++;
        //SERVER CALL IF SUCCSSFUL REMOVE
        del_setDeleteToTrueForTheRoute(route_Id);
        del_adjustRotueNumbers(route_Id);
        document.getElementById(route_Id).remove();
        clearstDet();
        clearRenderer();
        noOfRoutes--;

    }
}
/* ---------------------------------------------------------------- */

var directions = {};
var map;
var stDet = [];

function clearstDet() {
    if (stDet) {
        stDet.length = 0;
    }
}
var selectedClassDivs;
/* ---------------------------------------------------------------- */
function clearSelectedClass(cls) {
    selectedClassDivs = document.getElementsByClassName('selected');
    for (var j = 0; j < selectedClassDivs.length; j++) {
        selectedClassDivs[j].className = cls;
    }
}

/* ---------------------------------------------------------------- */

function toggleSearch(opt) {
    document.getElementById('pac-input').style.visibility = opt;
}

/* ---------------------------------------------------------------- */

function populateRouteMarkers(rtMarks) {    

    if (rtMarks.length > 0) {
        toggleSearch('hidden');
        clearSelectedClass(' card routeButton valgn ');


        if (renderer) {
            renderer.setMap(null);
            cleargmarker();
        }
        clearstDet();
        clearRenderer();

        for (var jj = 0; jj < rtMarks.length; jj++) {
            stDet.push({
                'Geometry': {
                    'Latitude': rtMarks[jj],
                    'Longitude': rtMarks[++jj]
                }
            });
        }

        drawRoute();
    } else {
        //alert('No data found!');
        showSnackbar('noMoreRoutes', 'No data found!', 3000);

    }
}

/* ---------------------------------------------------------------- */

function drawRoute() {
    
    var t = thisIsClickedButton;
    var element;
    var clsName = ' selected ';
    element = document.getElementById(t.id);
    element = element.childNodes[1];
    if (element.className.indexOf(clsName) === -1) {
        element.className = element.className + clsName;
    }


    drawUserRoute();

}
/* ---------------------------------------------------------------- */


function clearRenderer() {
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
    }
} /* ---------------------------------------------------------------- */

var directionsDisplay;
var directionsService;
var stops;

function drawUserRoute() {
    
    stops = stDet;
    // new up complex objects before passing them around
    directionsDisplay = new window.google.maps.DirectionsRenderer();
    directionsService = new window.google.maps.DirectionsService();
    Tour_startUp(stops);
    window.tour.loadMap(map, directionsDisplay);
    window.tour.fitBounds(map);
    if (stops.length > 1)
        window.tour.calcRoute(directionsService, directionsDisplay);
} /* ---------------------------------------------------------------- */

//TODO SET THE CITY CENTRE'S GEO CODE
const city = {};
city.lat = 12.9681417;
city.lng = 77.6119801;

function Tour_startUp(stops) {
    if (!window.tour) window.tour = {
        updateStops: function (newStops) {
            stops = newStops;
        },
        // map: google map object
        // directionsDisplay: google directionsDisplay object (comes in empty)
        loadMap: function (map, directionsDisplay) {
            var myOptions = {
                zoom: 13,
                center: new google.maps.LatLng(city.lat, city.lng),
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            map.setOptions(myOptions);
            directionsDisplay.setMap(map);
        },
        fitBounds: function (map) {
            var bounds = new window.google.maps.LatLngBounds();
            // extend bounds for each record
            jQuery.each(stops, function (key, val) {
                var myLatlng = new window.google.maps.LatLng(val.Geometry.Latitude, val.Geometry.Longitude);
                bounds.extend(myLatlng);
            });
            map.fitBounds(bounds);
        },
        calcRoute: function (directionsService, directionsDisplay) {
            var batches = [];
            var itemsPerBatch = 10; // google API max = 10 - 1 start, 1 stop, and 8 waypoints
            var itemsCounter = 0;
            var wayptsExist = stops.length > 0;
            while (wayptsExist) {
                var subBatch = [];
                var subitemsCounter = 0;
                for (var j = itemsCounter; j < stops.length; j++) {
                    subitemsCounter++;
                    subBatch.push({
                        location: new window.google.maps.LatLng(stops[j].Geometry.Latitude, stops[j].Geometry.Longitude),
                        stopover: true
                    });
                    if (subitemsCounter == itemsPerBatch)
                        break;
                }
                itemsCounter += subitemsCounter;
                batches.push(subBatch);
                wayptsExist = itemsCounter < stops.length;
                // If it runs again there are still points. Minus 1 before continuing to
                // start up with end of previous tour leg
                itemsCounter--;
            } // now we should have a 2 dimensional array with a list of a list of waypoints

            var combinedResults;
            var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
            var directionsResultsReturned = 0;
            for (var k = 0; k < batches.length; k++) {
                var lastIndex = batches[k].length - 1;
                var start = batches[k][0].location;
                var end = batches[k][lastIndex].location;
                // trim first and last entry from array
                var waypts = [];
                waypts = batches[k];
                waypts.splice(0, 1);
                waypts.splice(waypts.length - 1, 1);
                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    travelMode: window.google.maps.TravelMode.DRIVING
                };
                (function (kk) {
                    directionsService.route(request, function (result, status) {
                        if (status == window.google.maps.DirectionsStatus.OK) {
                            var unsortedResult = {
                                order: kk,
                                result: result
                            };
                            unsortedResults.push(unsortedResult);
                            directionsResultsReturned++;
                            if (directionsResultsReturned == batches.length) // weve received all the results. put to map
                            {
                                // sort the returned values into their correct order
                                unsortedResults.sort(function (a, b) {
                                    return parseFloat(a.order) - parseFloat(b.order);
                                });
                                var count = 0;
                                for (var key in unsortedResults) {
                                    if (unsortedResults[key].result != null) {
                                        if (unsortedResults.hasOwnProperty(key)) {
                                            if (count == 0) // first results. new up the combinedResults object
                                                combinedResults = unsortedResults[key].result;
                                            else {
                                                // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
                                                // directionResults object, but enough to draw a path on the map, which is all I need
                                                combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
                                                combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);
                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
                                            }
                                            count++;
                                        }
                                    }
                                }
                                directionsDisplay.setDirections(combinedResults);
                            }
                        }
                    });
                })(k);
            }
        }
    };
} /* ---------------------------------------------------------------- */

var destAddr;
var markers = [];

function ginit() {
    var opts = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(city.lat, city.lng),
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), opts);
    // *******************************************************************
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    // Bias the SearchBox results towards current maps viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        } // Clear out the old markers.

        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log('Returned place contains no geometry');
                return;
            }
            var icon = {
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            destAddr = place.geometry.location;
            fun(destAddr);
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                // bounds.union(place.geometry.viewport);
            } else {
                // bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
} /* ---------------------------------------------------------------- */

//TODO SET THE STARTING POINT
const office = {};
office.lat = 12.925962;
office.lng = 77.685824;

function fun(dest) {
    var routes = [{
        label: 'Home',
        request: {
            origin: new google.maps.LatLng(office.lat, office.lng),
            destination: dest,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
        },
        rendering: {
            marker: {
                icon: 'http://labs.google.com/ridefinder/images/mm_20_red.png'
            },
            draggable: true
        }
    },];
    var bounds = new google.maps.LatLngBounds();
    for (var r = 0; r < routes.length; ++r) {
        bounds.extend(routes[r].request.destination);
        routes[r].rendering.routeId = 'r' + r + new Date().getTime();
        routes[r].rendering.dist = 700;
        requestRoute(routes[r], map);
    }
    map.fitBounds(bounds);
} /* ---------------------------------------------------------------- */

function setMarkers(ID) {
    var direction = directions[ID],
        renderer = direction.renderer,
        dist = renderer.dist,
        marker = renderer.marker,
        map = renderer.getMap(),
        dirs = direction.renderer.getDirections();
    marker.map = map;
    for (var k in direction.sets) {
        var set = directions[ID].sets[k];
        set.visible = !!(k === dist);
        for (var m = 0; m < set.length; ++m) {
            set[m].setMap((set.visible) ? map : null);
        }
    }
    if (!direction.sets[dist]) {
        if (dirs.routes.length) {
            var route = dirs.routes[0];
            var az = 0;
            for (var i = 0; i < route.legs.length; ++i) {
                if (route.legs[i].distance) {
                    az += route.legs[i].distance.value;
                }
            }
            dist = Math.max(dist, Math.round(az / 100));
            direction.sets[dist] = gMilestone(route, dist, marker);
        }
    }
} /* ---------------------------------------------------------------- */

var renderer;

function requestRoute(route, map) {
    if (!window.gDirSVC) {
        window.gDirSVC = new google.maps.DirectionsService();
    }
    if (renderer) {
        renderer.setMap(null);
        cleargmarker();
    }
    renderer = new google.maps.DirectionsRenderer(route.rendering);
    renderer.setMap(map);
    renderer.setOptions({
        preserveViewport: false
    })
    google.maps.event.addListener(renderer, 'directions_changed', function () {
        clearmarkers();
        cleargmarker();
        if (directions[this.routeId]) {
            //remove markers
            for (var k in directions[this.routeId].sets) {
                for (var m = 0; m < directions[this.routeId].sets[k].length; ++m) {
                    directions[this.routeId].sets[k][m].setMap(null);
                }
            }
        }
        directions[this.routeId] = {
            renderer: this,
            sets: {}
        };
        setMarkers(this.routeId);
    });
    window.gDirSVC.route(route.request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            renderer.setDirections(response);
        }
    });
} /* ---------------------------------------------------------------- */

function clearmarkers() {
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];
} /* ---------------------------------------------------------------- */

function cleargmarker() {
    gcodes.length = 0;
}
/**
 * creates markers along a google.maps.DirectionsRoute
 *
 * @param route object google.maps.DirectionsRoute
 * @param dist  int    interval for milestones in meters
 * @param opts  object google.maps.MarkerOptions
 * @return array Array populated with created google.maps.Marker-objects
 **/

var gmarkers = [];
var gcodes = [];

function gMilestone(route, dist, opts) {
    var geo = google.maps.geometry.spherical,
        path = route.overview_path,
        point = path[0],
        distance = 0,
        leg,
        overflow,
        pos;
    for (var p = 1; p < path.length; ++p) {
        leg = Math.round(geo.computeDistanceBetween(point, path[p]));
        d1 = distance + 0;
        distance += leg;
        overflow = dist - (d1 % dist);
        if (distance >= dist && leg >= overflow) {
            if (overflow && leg >= overflow) {
                pos = geo.computeOffset(point, overflow, geo.computeHeading(point, path[p]));
                opts.position = pos;
                gcodes.push(pos);
                //gmarkers.push(new google.maps.Marker(opts));
                distance -= dist;
            }
            while (distance >= dist) {
                pos = geo.computeOffset(point, dist + overflow, geo.computeHeading(point, path[p]));
                opts.position = pos;
                gcodes.push(pos);
                //gmarkers.push(new google.maps.Marker(opts));
                distance -= dist;
            }
        }
        point = path[p]
    }
    return gmarkers;
}

//SERVER/DB CALLS BEGIN

callctr = function (loadRoute) {

};




saveEmpRequest = function (veh, cap, vehnum, homeLoc, leaveTo, leaveFrom) {

    var currentUserKey = getCurrentUserUID();
    var userRef = getFirebaseRef().child("users");
    userRef.child(currentUserKey).update({
        car: veh,
        capacity: cap,
        vehicleNumber: vehnum,
        homeLocation: homeLoc,
        leaveHomeAt: leaveTo,
        leaveOfficeAt: leaveFrom,


    }).then(function (result) {       
        alertSaved();
    }).catch(function (error) {
        console.log('error', error);
        alertError();
    });


};

/* FIREBASE */

function getFirebaseRef() {
    return firebase.database().ref();
}
function getCurrentUser() {
    return firebase.auth().currentUser;
}

function getCurrentUserUID() {
    return firebase.auth().currentUser.uid;
}

/*************************** RENDER EXISTING ROUTES *************************/

function fr_addNewRoute() {
    if (noOfRoutes <= 3) {
        clearSelectedClass(' card routeButton valgn ');

        clearstDet();
        clearRenderer();
        ++noOfRoutes;

        var rt = ' <div class="col-md-2 " id="routeno' + noOfRoutes + '" onclick="fr_routeBtnClickHandler(this)"> <div class="card routeButton valgn selected " > <span class="detailsText"> Route &nbsp;' + noOfRoutes + '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';
        $(rt).insertBefore($('#newRouteId'));

        toggleSearch('visible');
    } else {
        //alert('You cant have more than 4 routes, Remove the existing routes..');
        showSnackbar('noMoreRoutes', 'You cant have more than 4 routes, Remove the existing routes..', 3000);
    }

}

function fr_addExistingRoutes() {
    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID());


    firebaseRef.orderByChild("isDeleted").equalTo(false).once('value', function (snapshot) {
        
        if (snapshot.val() != null) {
            noOfRoutes = Object.keys(snapshot.val()).length;

            var indexRouteNo = 0;
            snapshot.forEach(function (child) {
                ++indexRouteNo;
                var rt;

                if (child.val().isActive) {

                    rt = ' <div class="col-md-2 " id="' + child.key + '" onclick="fr_routeBtnClickHandler(this)"> <div class="card routeButton valgn active " > <span class="detailsText"> Route &nbsp;' + indexRouteNo + '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';
                    fr_getTheGeoCodes(child.key);

                } else {
                    rt = ' <div class="col-md-2 " id="' + child.key + '" onclick="fr_routeBtnClickHandler(this)"> <div class="card routeButton valgn " > <span class="detailsText"> Route &nbsp;' + indexRouteNo + '</span> <span class="glyphicon glyphicon-road"/> </div> </div>';
                }

                $(rt).insertBefore($('#newRouteId'));

            });
        }
    });
}

function fr_populateRouteMarkers(rtMarks) {

    if (rtMarks.length > 0) {

        if (renderer) {
            renderer.setMap(null);
            cleargmarker();
        }
        clearstDet();
        clearRenderer();

        for (var jj = 0; jj < rtMarks.length; jj++) {
            stDet.push({
                'Geometry': {
                    'Latitude': rtMarks[jj],
                    'Longitude': rtMarks[++jj]
                }
            });
        }

        fr_drawRoute();
    } else {
        //alert('No data found!');
        showSnackbar('noMoreRoutes', 'No data found!', 3000);
    }
}


function fr_drawRoute() {
    //Do the UI handling
    drawUserRoute();
}

function fr_routeBtnClickHandler(theHTMLElement) {
    
    if (theHTMLElement.id.indexOf('routeno') > -1) {
        //SAVE THE ROUTE INFO THEN STORE THE ID BACK
        //THIS SHOULD BE AFTER ACTIVATE
        //SOME GLOBAL VARIABLE TO STORE

        thisIsClickedButton = document.getElementById(theHTMLElement.id);

    } else {
        fr_updateUI(theHTMLElement); //MAKE IT ASYNC
        fr_getTheGeoCodes(theHTMLElement.id.toString().trim());
    }

}

function fr_updateUI(theHTMLElement) {

    clearSelectedClass(' card routeButton valgn ');

    var element;
    var clsName = ' selected ';
    element = document.getElementById(theHTMLElement.id);
    element = element.childNodes[1];
    if (element.className.indexOf(clsName) === - 1) {
        element.className = element.className + clsName;
    }


}

function fr_getTheGeoCodes(key) {
    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID()).child(key);

    firebaseRef.once('value', function (snapshot) {

        fr_populateRouteMarkers(fr_routePointsToArray(snapshot.val().routePoints));

    }).then(function (sucess) {
        
    }).catch(function (error) {
        console.log('error fr_getTheGeoCodes', error);
    });


}

function fr_routePointsToArray(routePts) {
    var routePointsToString = routePts.toString();


    routePointsToString = routePointsToString.substring(1, routePointsToString.length - 1);
    routePointsToString = routePointsToString.split('(').join('');
    routePointsToString = routePointsToString.split(')').join('');

    var routePointsArray = routePointsToString.split(',');

    return routePointsArray;
}


/*************************** RENDER EXISTING ROUTES END*************************/




/*****************************  HANLDE MULTI ROUTES **********************/

function getActiveRouteKeys() {

    var firebaseRef = getFirebaseRef().child('activeRoutes').child(getCurrentUserUID());
    //where active flag to be true
    firebaseRef.once('value', function (snapshot) {
        if (snapshot.val() !== null) {
          
            var listofKeys = snapshot.val().toString().split(',');
            removeExistingActiveKeysFromUserRoute(listofKeys);
        } else {
           
            insertGeoCodesToGFire(gcodes);

        }
    }).then(function (sucess) {
        firebaseRef.remove().then(function (msg) {
            //console.log('error in removing activeRoutes', error);
        });
        
    });

}

function removeExistingActiveKeysFromUserRoute(listofKeys) {

    var geoFireRef = getFirebaseRef().child('userroutes');

    var updates = {};
    for (var i = 0; i < listofKeys.length; i++) {

        updates[listofKeys[i]] = null;

    }

    geoFireRef.update(
        updates
    ).then(function (sucess) {
        insertGeoCodesToGFire(gcodes);
    }).catch(function (error) {
        console.log('error', error);
    });



}


function insertGeoCodesToGFire(gcodes) {

    var firebaseRef = getFirebaseRef().child('userroutes');

    var geoFire = new GeoFire(firebaseRef);

    var currentUserId = getCurrentUserUID();

    var str = gcodes.toString().substring(1, gcodes.toString().length - 1);

    gcodes = str.split('),(');

    var authIdVSgCodes = {};

    var activeKeysList = [];

    for (var i = 0; i < gcodes.length; i++) {
        var gcodesArray = gcodes[i].split(',');
        gcodesArray[0] = parseFloat(gcodesArray[0].toString().trim());
        gcodesArray[1] = parseFloat(gcodesArray[1].toString().trim());
        authIdVSgCodes[currentUserId + "__ACTIVE__" + i] = gcodesArray;

        activeKeysList.push(currentUserId + "__ACTIVE__" + i);
    }

    geoFire.set(
        authIdVSgCodes
    ).then(function () {

        storeTheActiveRouteKeys(activeKeysList);
        console.log("Provided keys have been added to GeoFire");
    }, function (error) {
        console.log("Error: " + error);
    });


}



function storeTheActiveRouteKeys(activeKeysList) {


    var firebaseRef = getFirebaseRef().child('activeRoutes');

    var updates = {};

    updates[getCurrentUserUID()] = null;

    firebaseRef.update(
        updates
    ).then(function (sucess) {

        var newfirebaseRef = getFirebaseRef().child('activeRoutes').child(getCurrentUserUID());
        newfirebaseRef.update(
            activeKeysList
        ).then(function (sucess) {
           //UPDATE THE ROUTES - UID -  
            setActiveToFalseForRemainingRoutes();
        });
      
    });




}

function storeTheRouteAndRoutePoints(gcodes) {

    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID());


    var key = firebaseRef.push().key;


    firebaseRef.child(key).set({
        isActive: true,
        isDeleted: false,
        routePoints: gcodes
    }).then(function (sucess) {

        var selectedElement = document.getElementsByClassName('selected');
        selectedElement[0].parentNode.id = key;


        toggleActiveClass();
    });


}



function setActiveToFalseForRemainingRoutes() {

    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID());

    var listToUpdate = {};


    firebaseRef.orderByChild("isActive").equalTo(true).once('value', function (snapshot) {
        
        snapshot.forEach(function (child) {

            firebaseRef.child(child.key).update({
                isActive: false
            }).then(function (sucess) {

            });

        });
    }).then(function (sucess) {
       
        storeTheRouteAndRoutePoints(gcodes.toString());


    });


}

/*****************************  HANLDE MULTI ROUTES END**********************/

/*************************** DELETE A ROUTE *******************************/
function del_getActiveRouteKeys() {
   
    var firebaseRef = getFirebaseRef().child('activeRoutes').child(getCurrentUserUID());

    firebaseRef.once('value', function (snapshot) {
        if (snapshot.val() !== null) {
           
            var listofKeys = snapshot.val().toString().split(',');
            del_removeExistingActiveKeysFromUserRoute(listofKeys);
        } else {
            console.log('no data');
        }
    }).then(function (sucess) {
       
        firebaseRef.remove().then(function (sucess) {
           
        }).catch(function (error) {
            console.log('error in removing activeRoutes', error);
        });
    }).catch(function (error) {
        console.log('error del_getActiveRouteKeys', error);
    });

}

function del_removeExistingActiveKeysFromUserRoute(listofKeys) {

    var geoFireRef = getFirebaseRef().child('userroutes');

    var updates = {};
    for (var i = 0; i < listofKeys.length; i++) {

        updates[listofKeys[i]] = null;

    }

    geoFireRef.update(
        updates
    ).then(function (sucess) {
        
    }).catch(function (error) {
        
    });





}

function del_setDeleteToTrueForTheRoute(routeToDelete) {
    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID()).child(routeToDelete);
    var listToUpdate = {};

    firebaseRef.once('value', function (snapshot) {
       
        //if active route
        if (snapshot.val() && snapshot.val().isActive) {
            del_getActiveRouteKeys();
        }
    }).then(function (sucess) {
        firebaseRef.update({
            isActive: false,
            isDeleted: true
        }).then(function (sucess) {
          
        });
    });



}

function del_adjustRotueNumbers(deleltedElementId) {

    var element = document.getElementById(deleltedElementId);

    var elementInnerText = element.childNodes[1].childNodes[1].innerHTML;
    var condtion = true;
    var curElementNumber = parseInt(elementInnerText.substring(elementInnerText.length - 1, elementInnerText.length).trim());

    while (condtion) {

        element = element.nextSibling;
        var innerText = element.childNodes[1].childNodes[1].innerHTML;

        if ((innerText.indexOf('New')) > -1) {
            condtion = false;
        } else {
            element.childNodes[1].childNodes[1].innerHTML = "Route &nbsp;" + curElementNumber++;
        }
    }
}

/*************************** DELETE A ROUTE END *******************************/

/********************** UPDATE EXISTING TO ACTIVE *************************/

function up_getActiveRouteKeys() {

    var firebaseRef = getFirebaseRef().child('activeRoutes').child(getCurrentUserUID());
    //where active flag to be true
    firebaseRef.once('value', function (snapshot) {

        

        var listofKeys;
        if (snapshot.val()) {
            listofKeys = snapshot.val().toString().split(',');
        }

        up_removeExistingActiveKeysFromUserRoute(listofKeys);

    }).then(function (sucess) {
       
    });

}


function up_removeExistingActiveKeysFromUserRoute(listofKeys) {

    var geoFireRef = getFirebaseRef().child('userroutes');

    var updates = {};
    if (listofKeys) {
        for (var i = 0; i < listofKeys.length; i++) {

            updates[listofKeys[i]] = null;

        }
    }
    geoFireRef.update(
        updates
    ).then(function (sucess) {
       
        up_getTheActiveGeoCodes(up_getCurrentRouteId());
    }).catch(function (error) {
        console.log('error', error);
    });
}

function up_getCurrentRouteId() {

    var selectedElement = document.getElementsByClassName('selected');

    return selectedElement[0].parentNode.id;

}

function up_getTheActiveGeoCodes(key) {


    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID()).child(key);

    firebaseRef.once('value', function (snapshot) {

        up_insertGeoCodesToGFire(snapshot.val().routePoints);

    }).then(function (sucess) {
      
    }).catch(function (error) {
        console.log('error fr_getTheGeoCodes', error);
    });
}


function up_insertGeoCodesToGFire(gcodes) {

    var firebaseRef = getFirebaseRef().child('userroutes');

    var geoFire = new GeoFire(firebaseRef);

    var currentUserId = getCurrentUserUID();

    var str = gcodes.toString().substring(1, gcodes.toString().length - 1);

    gcodes = str.split('),(');

    var authIdVSgCodes = {};

    var activeKeysList = [];

    for (var i = 0; i < gcodes.length; i++) {
        var gcodesArray = gcodes[i].split(',');
        gcodesArray[0] = parseFloat(gcodesArray[0].toString().trim());
        gcodesArray[1] = parseFloat(gcodesArray[1].toString().trim());
        authIdVSgCodes[currentUserId + "__ACTIVE__" + i] = gcodesArray;

        activeKeysList.push(currentUserId + "__ACTIVE__" + i);
    }

    geoFire.set(
        authIdVSgCodes
    ).then(function () {

        up_storeTheActiveRouteKeys(activeKeysList);
       
    }, function (error) {
        console.log("Error: " + error);
    });


}

function up_storeTheActiveRouteKeys(activeKeysList) {


    var firebaseRef = getFirebaseRef().child('activeRoutes');

    var updates = {};

    updates[getCurrentUserUID()] = null;

    firebaseRef.update(
        updates
    ).then(function (sucess) {

        var newfirebaseRef = getFirebaseRef().child('activeRoutes').child(getCurrentUserUID());
        newfirebaseRef.update(
            activeKeysList
        ).then(function (sucess) {
           
            //UPDATE THE ROUTES - UID -  
            up_setActiveToFalseForRemainingRoutes();
        });
        console.log('sucess storeTheActiveRouteKeys');
    });

}

function up_setActiveToFalseForRemainingRoutes() {

    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID());


    firebaseRef.orderByChild("isActive").equalTo(true).once('value', function (snapshot) {
       
        snapshot.forEach(function (child) {

            firebaseRef.child(child.key).update({
                isActive: false
            }).then(function (sucess) {

            });

        });
    }).then(function (sucess) {
        console.log('child read sucess ======', gcodes);
        up_setCurrentRotueToActive();


    });

}

function up_setCurrentRotueToActive() {



    var firebaseRef = getFirebaseRef().child('routes').child(getCurrentUserUID()).child(up_getCurrentRouteId());

    firebaseRef.update({
        isActive: true,
    }).then(function (sucess) {
        toggleActiveClass();
    }).catch(function (error) {
        console.log('error up_setCurrentRotueToActive', error);
    });
}

/********************** UPDATE EXISTING TO ACTIVE END *************************/
/************** DISPLAY MY DETAILS */
function fr_displayMyDetails() {
    var vehicleName = document.getElementById('j_id0:detailFrm:vehicle');
    var vehicleCapacity = document.getElementById('j_id0:detailFrm:capacity');
    var vehicleNum = document.getElementById('j_id0:detailFrm:vehicleNum');
    var homeLocation = document.getElementById('j_id0:detailFrm:homeLoc');
    var leaveTo = document.getElementById('j_id0:detailFrm:leaveTo');
    var leaveFrom = document.getElementById('j_id0:detailFrm:leaveFrom');


    var userRef = getFirebaseRef().child("users").child(getCurrentUserUID());
    userRef.once('value', function (snapshot) {
        if (snapshot.val() != null) {
            if (snapshot.val().car)
                vehicleName.value = snapshot.val().car;
            if (snapshot.val().capacity)
                vehicleCapacity.value = snapshot.val().capacity;
            if (snapshot.val().vehicleNumber)
                vehicleNum.value = snapshot.val().vehicleNumber;
            if (snapshot.val().homeLocation)
                homeLocation.value = snapshot.val().homeLocation;
            if (snapshot.val().leaveHomeAt)
                leaveTo.value = snapshot.val().leaveHomeAt;
            if (snapshot.val().leaveOfficeAt)
                leaveFrom.value = snapshot.val().leaveOfficeAt;
        }



    }).then(function (result) {
       
    }).catch(function (error) {
        console.log('error', error);
    });
}
/**************DISPLAY MY DETAILS END */
//SERVER/DB CALLS END




function handleRedirect() {

    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

    });


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var firebaseRef = getFirebaseRef().child('users').child(getCurrentUserUID()).child('isVerified');
            firebaseRef.once('value').then(function (snapshot) {
             
                if (snapshot.val()) {

                   
                    fr_addExistingRoutes();
                    fr_displayMyDetails();

                } else {
                    // No user is signed in.
                    console.log('no user');
                    redirect(homePageURL);

                }
            }).catch(function (error) {
                console.log('error in reading is verified', error);
            });
        } else {
            // No user is signed in.
            console.log('no user');
            redirect(homePageURL);

        }


    });




}
//TODO: SET THE LOGIN PAGE URL
var homePageURL = 'https://'+window.location.host;
function signOut() {
    if (getCurrentUser()) {
        firebase.auth().signOut().then(function () {

            redirect(homePageURL);

        }).catch(function (error) {

        });
    }

}

function redirect(URL) {
    window.location = URL;
}

function showSnackbar(elementID, message, timeout) {

    var x = document.getElementById(elementID);
    x.innerHTML = message;

    x.className = "snackbar show";

    setTimeout(function () {
        var x = document.getElementById(elementID);
        x.innerHTML = '';
        x.className = "snackbar";
    }, timeout);
}

function tourDetails() {
    var tour;
    // First define your tour.
    tour = {
        "id": "hello-hopscotch",
        "steps": [{
            "target": "myDetailsButton",
            "placement": "top",
            "title": "Add My Details",
            "content": "Click on the button and the details(Applicable if you drive to office) <br/><br/> After adding click next",
        }, {
            "target": "newRouteButton",
            "placement": "left",
            "title": "Click New Route",
            "content": "You can have upto 4 routes",
            "arrowOffset": "50",
            "yOffset": "-60"

        }, {
            "target": "pac-input",
            "placement": "bottom",
            "title": "Search for your destination",
            "content": "If the search box is not visible, Please click on New Route"

        }, {
            "target": "activate",
            "placement": "left",
            "title": "Activate Route",
            "content": "Click to Save and Activate the Route"
        },

        {
            "target": "remove",
            "placement": "left",
            "title": "Remove Route",
            "content": "Click to Remove and Delete the Route"
        }, {
            "target": "searchRides",
            "placement": "bottom",
            "title": "Search Rides",
            "content": "Search for people with a car"
        }

        ]
    };
    hopscotch.startTour(tour);
}


function startTour() {
    tourDetails();
}

$('.navbar-toggle').on('click', function () {

    if ($("#myUpnav").css("height") != "0px")
        closeNav();


});

/* BROWSER HISTORY */
var historySupported = false;

function isSupportedBrowserHistory() {
    return !!(window.history && history.pushState);
}

function popStateHandler(event) {
    if (event.state != null) {
       
        if (event.state == 0) {
         
            closeNav();
        }
    }
}

function browserHistoryPush() {
    history.pushState(1, 'detailsOpened', 'mydetails.html#open');
}

function browserHistoryinit() {
    historySupported = isSupportedBrowserHistory();
    if (historySupported) {        
        history.replaceState(0, 'number 0', null);
        window.onpopstate = popStateHandler;
    } else {
        console.log('browser doesnt support history api');
    }
}
window.onload = function () {
    ginit();
    handleRedirect();
    browserHistoryinit();

};


//GUIDED TOUR
