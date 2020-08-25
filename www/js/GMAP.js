var _GMAP = {
    map: null,
    watchID: null,
    markers: [],
    _DEFAULT_POSITION: { lat: -34.5416838, lng: -58.7124407 }, //Casa Central
    _TRACK_POSITION: null,
    _DEFAULT_ZOOM: 9,
    _BIG_ZOOM: 14,
    _last_polyline: null,
    _last_route_mode: "",
    _route_color: "#141493",
    _ME_MARKER: null,
    _LAST_SELECTED_MARKER: null,
    _MARKERS: [],
    _MAP_STYLES: {
        default: null,
        hideAll: [
            { featureType: "poi", stylers: [{ visibility: "on" }] },
            { featureType: "poi.park", stylers: [{ visibility: "on" }] },
            { featureType: "transit", stylers: [{ visibility: "on" }] },
            { featureType: "administrative", stylers: [{ visibility: "on" }] },
            { featureType: "landscape", stylers: [{ visibility: "on" }] },
            { featureType: "road", stylers: [{ visibility: "on" }] },
        ],
    },
    onCreateMap: function () {
        if (_GMAP.map == null) {
            _GMAP.map = new google.maps.Map(document.getElementById('map'), {
                center: _GMAP._DEFAULT_POSITION,
                zoom: _GMAP._DEFAULT_ZOOM,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.LEFT_TOP
                },
                scaleControl: true,
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
            });
            _GMAP.watchID = navigator.geolocation.watchPosition(_GMAP.onWatchPosition, _GMAP.onWatchPositionError, { maximumAge: 0, timeout: 30000, enableHighAccuracy: true });
            for (var i = 0; i < _GMAP.markers.length; i++) { _GMAP.markers[i].setMap(null); }
            _GMAP.markers = [];
            _GMAP._LAST_SELECTED_MARKER = null;
        }
    },
    onGetMarkers: function (_json) {
        var _where = _json["where"];
        var _order = _json["order"];
        return new Promise(
            function (resolve, reject) {
                try {
                    var _json = {
                        "module": "mod_places",
                        "table": "places",
                        "model": "places",
                        "page": 1,
                        "pagesize": -1,
                        "where": _where,
                        "order": _order,
                    };
                    _AJAX.UiGet(_json).then(function (datajson) {
                        resolve(datajson);
                    }).catch(function (error) {
                        alert(error.message);
                    });
                } catch (rex) {
                    reject(rex);
                }
            }
        )
    },
    onTrackMe: function (_json) {
        if (_GMAP._ME_MARKER) {
            _GMAP.map.setCenter(_json);
            _GMAP.map.setZoom(parseInt(_GMAP._BIG_ZOOM));
            if (_GMAP._ME_MARKER.getAnimation() !== null) {
                _GMAP._ME_MARKER.setAnimation(null);
            } else {
                _GMAP._ME_MARKER.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () { _GMAP._ME_MARKER.setAnimation(null); }, 1000);
            }
        }
    },
    onWatchPosition: function (position) {
        try {
            if (position.coords == undefined) { throw new Error(null); }
            _GMAP._TRACK_POSITION = { lat: position.coords.latitude, lng: position.coords.longitude };
            //alert(_GMAP._TRACK_POSITION.lat);
            _FUNCTIONS.onSendTelemetry(position);
            var _size = { width: 40, height: 40 };
            var _image = { url: ("./markers/me.png"), scaledSize: new google.maps.Size(_size.width, _size.height) };
            if (_GMAP._ME_MARKER) { _GMAP._ME_MARKER.setMap(null); }
            _GMAP._ME_MARKER = new google.maps.Marker(
                {
                    position: _GMAP._TRACK_POSITION,
                    draggable: false,
                    map: _GMAP.map,
                    icon: _image,
                    title: "Mi ubicación actual",
                });
            _GMAP._ME_MARKER.addListener('click', function (event) {
                _GMAP.onTrackMe({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            });
        } catch (err) {
            _GMAP.onWatchPositionError();
        }
    },
    onWatchPositionError: function () {
        _GMAP._TRACK_POSITION = _GMAP._DEFAULT_POSITION;
        if (_GMAP._ME_MARKER) {
            _GMAP._ME_MARKER.setMap(null);
            _GMAP._ME_MARKER = null;
        }
    },
};
