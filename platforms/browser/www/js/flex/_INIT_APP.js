(function () {
    _COMPILED = true;
    _REINIT_DATABASE = false;
    _ID_ROOT = "credipaz";
    _API_SERVER = "http://localhost:50533/";
    if (_REMOTE_MODE) { _API_SERVER = "http://200.11.115.146:50533/"; }
    if (_REMOTE_MODE) { if (!_COMPILED && _HERE.indexOf("localhost")) { _API_SERVER = _HERE; } }
    _MAP_STYLES = {
        default: null,
        hideAll: [
            { featureType: "poi", stylers: [{ visibility: "on" }] },
            { featureType: "poi.park", stylers: [{ visibility: "on" }] },
            { featureType: "transit", stylers: [{ visibility: "on" }] },
            { featureType: "administrative", stylers: [{ visibility: "on" }] },
            { featureType: "landscape", stylers: [{ visibility: "on" }] },
            { featureType: "road", stylers: [{ visibility: "on" }] },
        ],
    };
})();
