var searchCoords;

var opened = 0;


var map;
var geocoder;
var counter = 0;
var coordArr = [];
var markers = [];

var isMarkerChanged = true;

var j$ = jQuery.noConflict();

/* ---------------------------------------------------------------- */
var listObj;

function suggest(proximity) {


    clearuidList();
    removeCurrentSuggestions();
    if (markers.length > 0 && isMarkerChanged && coordArr.length) {

        listObj = [];
        //OPEN THE NAV BAR
       openNav();

        var coordinates = coordArr[0].toString().split(',');

        var coordlat = parseFloat(coordinates[0].trim());
        var coordlng = parseFloat(coordinates[1].trim());

        keysEntered = false;

        registerGeoQuery(coordlat, coordlng, parseInt(proximity.trim()));
        runGeoQuery();



    } else {
        //alert('Choose a point on the map and click search');
        showSnackbar('chooseAPoint', 'Choose a point on the map and click search', 3000);
    }
}

/* -------------------------------------------------------------- */

function getCurrentUserUID() {
    return firebase.auth().currentUser.uid;
}

var geoFire;

function initialiseGeoQuery() {
    var ref = firebase.database().ref().child("userroutes");
    geoFire = new GeoFire(ref);

}

var uidList;

function clearuidList() {
    uidList = [];
}

var geoQuery;
var keysEntered = false;

function registerGeoQuery(coordlat, coordlng, radius) {
    geoQuery = geoFire.query({
        center: [coordlat, coordlng],
        radius: radius
    });
}

function runGeoQuery() {
    if (!(j$('.NoDataFound').is(":visible"))) {
        var noDataFound = '<div class="col-md-12 NoDataFound" id="NoDataFound">  <div  style="padding: 10px 30px;text-align: center; ">No users are travelling near your destination.</div>           </div>';
        j$(noDataFound).insertAfter(j$("#proximityBar"));
    }
    var onReadyRegistration = geoQuery.on("ready", function () {
        console.log("GeoQuery has loaded and fired all other events for initial data");
        if (!keysEntered) {
            //SET NO DATA FOUND

            // var noDataFound = '<div class="col-md-12 NoDataFound" id="NoDataFound">  <div  style="padding: 10px 30px;text-align: center; ">No users are travelling near your destination.</div>           </div>';
            // j$(noDataFound).insertAfter(j$("#proximityBar"));

            console.log("There was no initial data, so there are no business in range (yet).");
        }
    });

    var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
        keysEntered = true;



        var useridKey = key.split('__');

        if (uidList.indexOf(useridKey[0]) < 0) {
            uidList.push(useridKey[0]);

            var userRef = firebase.database().ref().child('users').child(useridKey[0].trim());
            userRef.once('value').then(function (snapshot) {

                if ((snapshot.val().remainingSeats > 0 || !snapshot.hasChild('remainingSeats')) && snapshot.key !== getCurrentUserUID()) {
                    if (typeof snapshot.val().car !== "undefined") {
                        populateTable(snapshot.val(), snapshot.key);
                    }
                }
            }).then().catch(function (error) {
                console.log('error reading user data: ', error);
            });

        }

    });

    var onKeyExitedRegistration = geoQuery.on("key_exited", function (key, location, distance) {
        //TO BE IMPLEMENTED FOR REAL TIME GEOLOCATION
    });

    var onKeyMovedRegistration = geoQuery.on("key_moved", function (key, location, distance) {

    });

}

/* -------------------------------------------------------------- */

function removeCurrentSuggestions() {
    j$('.userInfoCard').remove();
}
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {

    if (typeof str !== "undefined") {
        return str.replace(/[&<>]/g, replaceTag);
    }
}


/* -------------------------------------------------------------- */
function populateTable(carpooluser, carpooluserKey) {
    
    var HTMLCard = '<div onclick=\"prepareTheRequest(this);\" class="col-md-4 userInfoCard"  data-userkey=' + safe_tags_replace(carpooluserKey) + ' data-usermailid= ' + safe_tags_replace(carpooluser.shellMailId) + '><div class="suggestionsCard col-md-12"> <div class="mailIdInfo" > ' + safe_tags_replace(carpooluser.shellMailId) + ' </div> <div class="pd3"> <span> ' + safe_tags_replace(carpooluser.car) + ' </span> <span style="float: right;"> ' + safe_tags_replace(carpooluser.vehicleNumber) + '</span> </div> <div class="pd3"> Going to:  <span> ' + safe_tags_replace(carpooluser.homeLocation) + '</span> </div> <div class="pd3"> Leaves Home at: <span> ' + safe_tags_replace(carpooluser.leaveHomeAt) + '</span> </div><div class="pd3"> Leaves Office at: <span> ' + safe_tags_replace(carpooluser.leaveOfficeAt) + '</span> </div> <div> <button class="requestBtn"> request </button> </div> </div> </div> ';


    if (j$('.NoDataFound').is(":visible")) {

        j$('.NoDataFound').remove();
    }
    j$(HTMLCard).insertAfter(j$("#proximityBar"));

}


/* ---------------------------------------------------------------- */

function openNav() {
    browserHistoryPush();
    document.getElementById("mySidenav").style.transform = "translate3d(0,0,0)";
}


/* ---------------------------------------------------------------- */

function closeNav() {
    document.getElementById("mySidenav").style.transform = "translate3d(-100%,0,0)";
}

/* ---------------------------------------------------------------- */

function setSearchCoords(cord) {
    searchCoords = cord.lat() + ',' + cord.lng();
}

/* ---------------------------------------------------------------- */


function addTheRoute(addr, cord) {
    coordArr = [];
    coordArr.push(cord.lat() + ',' + cord.lng());
}

/* ---------------------------------------------------------------- */

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

/* ---------------------------------------------------------------- */

function clearMarkers() {
    setMapOnAll(null);
}

/* ---------------------------------------------------------------- */

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/* ---------------------------------------------------------------- */
//TODO - SET CITY COORDINIATES
const city = {};
city.lat = 12.9681417;
city.lng = 77.6119801;

function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(city.lat, city.lng),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    google.maps.event.addListener(map, 'click', function (event) {

        placeMarker(event.latLng);

        map.setCenter(event.latLng);
    });

    geocoder = new google.maps.Geocoder;
}


/* ---------------------------------------------------------------- */

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

/* ---------------------------------------------------------------- */

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,

    });

    deleteMarkers();
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        var coords = '' + marker.position.lat() + ',' + marker.position.lng();
        var index = coordArr.indexOf(coords);
        coordArr.splice(index, 1);
      
        marker.setMap(null);
        google.maps.event.clearInstanceListeners(marker);
    });

    var infoWinAddrs = '';
    geocoder.geocode({
        'location': location
    }, function (results, status) {
        if (status === 'OK') {
            if (results.length > 1) {


                infoWinAddrs = results[1].formatted_address;
                addTheRoute(infoWinAddrs, location);
            }
            var infowindow = new google.maps.InfoWindow({
                content: infoWinAddrs
            });
            infowindow.open(map, marker);
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });


}

/* ---------------------------------------------------------------- */
function getFirebaseRef() {
    return firebase.database().ref();
}

function getCurrentUser() {
    return firebase.auth().currentUser;
}

function getCurrentUserUID() {
    return firebase.auth().currentUser.uid;
}


//should we check for remaining seats here?!
function requestForTheRide(requestTo) {

    if (requestTo != getCurrentUserUID()) {


        var firebaseRef = getFirebaseRef().child("requests").child(getCurrentUserUID());

        firebaseRef.once('value').then(function (snapshot) {


            if (snapshot.val()) {
                if (snapshot.val().requestedTo === requestTo) {
                    //REQUESTING FOR ALREADY REQUESTED PERSON
                    //PUT A SNACKBAR
                    closeNav();

                    return;
                }

                //increase number of seats the counter then call update
                //updateRemainingSeats(snapshot.val().requestedTo, 1);
                updateRequests(firebaseRef, requestTo);
                //run the transaction
            } else {
                updateRequests(firebaseRef, requestTo);
            }
        });

    }
}

function updateRemainingSeats(userId, counter) {


    var firebaseRef = getFirebaseRef().child("users").child(userId).child('remainingSeats');

    firebaseRef.transaction(function (remainingSeats) {
        return remainingSeats + counter;
    }).then(function (sucess) {

    }).catch(function (error) {
        console.log('error', error);
    });


}

function updateRequests(firebaseRef, requestTo) {
    firebaseRef.update({
        //Just the id or the whole info			
        requestedTo: requestTo,
    }).then(function (result) {
        closeNav();
        checkIfAlreadyRequested();
        //send push notification
        //run transaction decrement and increment
        //DO A COLOR ENCODING FOR REQUESTED RIDE WITH LITTLE ANIMATION COLOR GRADUAL CHANGE
        //updateRemainingSeats(requestTo, -1);

    });
}


function prepareTheRequest(requestToUser) {

    if (requestToUser.getAttribute('data-userkey')) {
        var requestToKey = requestToUser.getAttribute('data-userkey');

        requestForTheRide(requestToKey);
        if (requestToUser.getAttribute('data-usermailid')) {
            //var mailToId = requestToUser.getAttribute('data-usermailid');
            //openMailWindow(mailToId);

        }
    } else {
        console.warn('requestto user has missing params');
    }


}


function openMailWindow() {
    j$("#Rmail").get(0).click();

}

//SERVER/DB CALL BEGINS
requestRide = function (reqId) {
    A4J.AJAX.Submit('j_id0:j_id26', null, {
        'similarityGroupingId': 'j_id0:j_id26:j_id29',
        'oncomplete': function (request, event, data) {
            requestConfirmation();
        },
        'parameters': {
            'j_id0:j_id26:j_id29': 'j_id0:j_id26:j_id29',
            'reqId': (typeof reqId != 'undefined' && reqId != null) ? reqId : ''
        }
    })
};

function checkIfAlreadyRequested() {

    var firebaseRef = getFirebaseRef().child("requests").child(getCurrentUserUID());

    firebaseRef.once('value').then(function (snapshot) {

        if (snapshot.val()) {
            var requestedToRef = getFirebaseRef().child("users").child(snapshot.val().requestedTo);
            requestedToRef.once('value').then(function (requestedToUser) {
               
                j$("#Rmail").attr("href", "mailto:" + requestedToUser.val().shellMailId + '?subject= New passenger request' + '&body=Hello! %0A%0AI would like to join with you for the carpool.%0A %0A Thanks!').text(requestedToUser.val().shellMailId);
                j$("#Rcar").text(requestedToUser.val().car);
                j$("#Rnum").text("Number: "+requestedToUser.val().vehicleNumber);
                j$("#Rhome").text(requestedToUser.val().homeLocation);
                j$("#Rleavehome").text(requestedToUser.val().leaveHomeAt);
                j$("#Rleaveoff").text(requestedToUser.val().leaveOfficeAt);


            }).then(function (success) {
                j$(".exisitingRequest").css("top", "60px");
            });

        }

    });
}



//SERVER/DB CALL ENDS
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


                    initialiseGeoQuery();
                    clearuidList();
                    checkIfAlreadyRequested();

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
//TODO
var homePageURL = 'https://' + window.location.host;
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


j$('.navbar-toggle').on('click', function () {

    if (j$(".exisitingRequest").css("top") != "-360px") {
        if (j$('.navbar-toggle').attr("aria-expanded") == "true")
            j$(".exisitingRequest").css("top", "60px");
        else
            j$(".exisitingRequest").css("top", "200px");
    }
    if (j$("#mySidenav").css("width") != "0px")
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
    history.pushState(1, 'detailsOpened', 'requestride.html#open');
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
    browserHistoryinit();
    loadScript();
    handleRedirect();


};
