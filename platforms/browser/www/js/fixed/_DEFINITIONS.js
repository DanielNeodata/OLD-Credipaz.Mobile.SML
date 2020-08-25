/*GLOBALS*/
var _COMPILED = false;
var _REINIT_DATABASE = false;
var _ID_ROOT = "";

var _APP_NAME = "";
var _ID_APP = -1;
var _ID_GROUP = 0;
var _KEY_FIXED = "";
var _KEY_BLOG = "";
var _GOOGLE_PLACES_API_KEY = "";
var _GOOGLE_MAP_API_KEY = "";
var _GOOGLE_DIRECTIONS_API_KEY = "";
var _LANGUAGE = "";
var _DEFAULT_ZOOM = 0;
var _FACEBOOKAPPID = null;
var _APP_INVITE_URL = "";
var _ROUTE_COLOR = "";

var _DEFAULT_POSITION = { lat: -34.6036844, lng: -58.3815591 }; //Buenos Aires
var _MAP_STYLES = {};
var _TRACK_POSITION = {};
var _FACEBOOKPERMISSIONS = ["email", "public_profile", "user_friends"];
var _DEFAULT_ANON_USER = { status: "connected", id: "-1", oauth_uid: "-1", first_name: _v_guest_first_name, last_name: _v_guest_last_name, email: "", gender: "", locale: "es_LA", profile_url: (""), picture_url: "", picture: { data: { url: "" } }, authResponse: { session_key: true, accessToken: "LOCAL", expiresIn: 0, sig: "", secret: "", userID: "-1" }, };
var _DEFAULT_TEST_USER = { status: "connected", id: "1333229783428873", oauth_uid: "1333229783428873", first_name: "Daniel", last_name: "Fernández", email: "daniel@neodata.com.ar", gender: "male", locale: "es_LA", profile_url: ("https://www.facebook.com/1333229783428873"), picture_url: "https://scontent-gru2-2.xx.fbcdn.net/v/t1.0-1/p160x160/14657343_1148327395252447_3329181846415934345_n.jpg?oh=10c61c2efe99bb754a2bf3d3e8ebb8c7&oe=59B4C31C", picture: { data: { url: "https://scontent-gru2-2.xx.fbcdn.net/v/t1.0-1/p160x160/14657343_1148327395252447_3329181846415934345_n.jpg?oh=10c61c2efe99bb754a2bf3d3e8ebb8c7&oe=59B4C31C" } }, authResponse: { session_key: true, accessToken: "LOCAL", expiresIn: 0, sig: "", secret: "", userID: "1333229783428873" }, };
var _DEFAULT_FRIENDS = { "data": [{ "id": "1482390161781084" }, { "id": "10155283283009207" }], "summary": { "total_count": 163 } };
var _APP_DATABASE = {};
var _APP_TABLES = {};

var _API_SERVER = "";
var _HERE = (window.location.protocol + "//" + window.location.host + "/");
var _REMOTE_MODE = (typeof window.parent.ripple === "undefined");
var _ID_USER = 0;

var _SEARCHEABLE = true;
var _LAST_ICON = null;
var _LAST_ROUTE_MODE = "";
var map = null;
var markers = [];
var sedes = [];
var _vPlaces = new Array();
var _vSedes = new Array();
var _vPosts = {};
var _vLoaded = [];
var _map_center = null;

var _MENU = null;
var _CIRCLE = null;
var _OBJ = null;
var _MARKER = null;
var _MARKER_ME = null;
var _MARKER_TAP = null;
var _INITIAL = null;
var watchID = null;
var statusID = null;
var searchID = 0;
var _last_position = null;

var _USERDATA = {};
var _FRIENDS = {};

var _ROUTE_ACTIVE = null;
var _bResolving = false;
var _LAST_POLYLINE = null;
var _NEXT_PAGE = 0;