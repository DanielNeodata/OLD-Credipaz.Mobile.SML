var _ACTIONS = {
    onLoadAllApps: function (_callBack) {
        var _where = "id_root='" + _ID_ROOT + "'";
        if (_ID_APP != -1) { _where = "id='" + _ID_APP + "'"; }
        var _plain = {
            "model": "apps",
            "page": 1,
            "pagesize": -1,
            "where": _where,
            "order": "description ASC",
        };
        _AJAX.UiPlain(_plain, function (data) {
            $("#tdApps").html("");
            var _sel = -1;
            var _html = "<select id='facultades' name='facultades' class='cboFacultades form-control' style='width:240px;'>";
            if (data.records.length > 1) { _html += "<option value='-1'>" + _v_select + "</option>"; }
            $.each(data.records, function (i, obj) {
                _ID_APP = obj.id;
                if (i > 0) { _sel = -1; } else { _sel = _ID_APP; }
                _html += "<option value='" + obj.id + "'>" + obj.description + "</option>";
            });
            _html += "</select>";
            $("#tdApps").html(_html);
            $("#facultades").val(_sel);
            if (data.records.length == 1) {
                $("#tdApps").hide();
                _ACTIONS.onSelectFacultades();
            }
            if ($.isFunction(_callBack)) { _callBack(); };
        });
    },
    onDatabaseInit: function () {
        _APP_DATABASE = { "schema": _APP_NAME, "name": _APP_NAME + " Database", "version": "1.0", "size": 100000000 };
        _APP_TABLES = {
            "tables": [
                { "name": "places", "script": "(id INTEGER UNIQUE,place_id TEXT,lat TEXT,lng TEXT,name TEXT,address TEXT,phone_number TEXT,types TEXT,website TEXT,description TEXT,dead_cache DATE,data_cache TEXT)" },
                { "name": "details_cache", "script": "(id INTEGER UNIQUE,place_id TEXT,dead_cache DATE,data_cache TEXT)" },
                { "name": "directions_cache", "script": "(id INTEGER UNIQUE,origin TEXT,destination TEXT,mode TEXT,dead_cache DATE,data_cache TEXT)" },
                { "name": "external_cache", "script": "(id INTEGER UNIQUE,types TEXT,dead_cache DATE,data_cache TEXT)" },
            ],
            "index": [
                { "script": "CREATE UNIQUE INDEX IF NOT EXISTS places_id ON places (id)" },
                { "script": "CREATE INDEX IF NOT EXISTS places_dead_cache ON places (dead_cache)" },
                { "script": "CREATE INDEX IF NOT EXISTS places_mixed ON places (types,lat,lng)" },
                { "script": "CREATE INDEX IF NOT EXISTS details_cache_id ON details_cache (id)" },
                { "script": "CREATE INDEX IF NOT EXISTS directions_cache_id ON directions_cache (id)" },
                { "script": "CREATE INDEX IF NOT EXISTS external_cache_id ON external_cache (id)" },
            ]
        };
        _DB.onInit(_APP_DATABASE, function () { _ACTIONS.onLocalAllCleanDeadCache(); }, null, function (err) { alert(err); });
    },
    onActionsInit: function () {
        var _remember = _DB.Get("remember");
        if (_remember != null) {
            _ACTIONS.onMeDetails(_remember);
        } else {
            _ACTIONS.onShowLogin(function () { });
        }
    },
    onMeDetails: function (json, _callBack) {
        if ($(".remember").is(":checked")) { _DB.Set("remember", json); }
        _USERDATA = json;
        if (_USERDATA['id_app'] != null) { _ID_APP = _USERDATA['id_app']; }
        if (_USERDATA['id_group'] != null) { _ID_GROUP = _USERDATA['id_group']; }
        _USERDATA["oauth_uid"] = json.id;
        _USERDATA["first_name"] = json.first_name;
        _USERDATA["last_name"] = json.last_name;
        _USERDATA["email"] = json.email;
        _USERDATA["gender"] = json.gender;
        _USERDATA["locale"] = json.locale;
        _USERDATA["profile_url"] = ("https://www.facebook.com/" + json.oauth_uid);
        _USERDATA["picture_url"] = json.picture.data.url;
        _ACTIONS.onFinishLoad(function () {
            _ACTIONS.onAppDetail(function () {
                var _json = {
                    "oauth_provider": "facebook",
                    "oauth_uid": _USERDATA['oauth_uid'],
                    "first_name": _USERDATA['first_name'],
                    "last_name": _USERDATA['last_name'],
                    "email": _USERDATA['email'],
                    "gender": _USERDATA['gender'],
                    "locale": _USERDATA['locale'],
                    "profile_url": _USERDATA['profile_url'],
                    "picture_url": _USERDATA['picture_url'],
                };
                _AJAX.UiCheckUser(_json, function (datajson) {
                    try {
                        _ID_USER = datajson[0].id;
                        if ($(".main-menu").html() == "") {
                            _AJAX.UiMenuByUser({}, function (menu) {
                                _MENU = menu;
                                $.each(_MENU.records, function (i, obj) {
                                    if (parseInt(obj.admin) == 0) {
                                        var _i = (i + 1);
                                        var _html = "";
                                        _html += "<div class='list-group-item'>";
                                        _html += "   <a class='btnItem btnItem-" + _i + " btn' href='#' data-stack='" + _i + "' data-item='" + obj.id + "'>";
                                        _html += eval("_v_" + obj.resstring) + "<span class='pull-right'>" + obj.icon + "</span>";
                                        _html += "   </a>";
                                        _html += "</div>"
                                        $(".main-menu").append(_html);
                                    }
                                });
                            });
                        }
                        if (_USERDATA['oauth_uid'] == -1) {
                            _IFACE.onShowMap();
                            if ($.isFunction(_callBack)) { _callBack(); };
                        } else {
                            facebookConnectPlugin.api("me/friends",
                                _FACEBOOKPERMISSIONS,
                                function (datajson) {
                                    _ACTIONS.onGetFriends(datajson, _IFACE.onShowMap);
                                    if ($.isFunction(_callBack)) { _callBack(); };
                                },
                                function () {
                                    _ACTIONS.onGetFriends(_DEFAULT_FRIENDS, _IFACE.onShowMap);
                                    if ($.isFunction(_callBack)) { _callBack(); };
                                }
                            );
                        }
                    } catch (err) {
                        _ACTIONS.onGetFriends(_DEFAULT_FRIENDS, _IFACE.onShowMap);
                        if ($.isFunction(_callBack)) { _callBack(); };
                    }
                });
            });
        });
    },
    onShowLogin: function (_callBack) {
        setTimeout(function () {
            $("#splash").fadeOut("slow", function () {
                $(".main-menu").html("");
                _ACTIONS.onHideBlog();
                $("#login").hide();
                $("#main").hide();
                $(".remember").hide();
                $(".btnLoginMove").css({ "top": "1000px" });
                $("#login").removeClass("hidden");
                $("#login").fadeIn("slow");
                $(".remember").fadeIn("slow");
                $(".btnLoginMove").velocity({ "top": 0 }, { duration: 1000, easing: "easeOutQuad", mobileHA: true });
            });
        }, 0);
        if ($.isFunction(_callBack)) { _callBack({ "splash": false }); };
    },
    onHideLogin: function (_callBack) {
        setTimeout(function () { $("#login").fadeOut("slow", function () { $("#splash").fadeIn("slow"); }); }, 0);
        if ($.isFunction(_callBack)) { _callBack({ "splash": true }); };
    },
    onPause: function () {
        clearInterval(statusID);
        navigator.geolocation.clearWatch(watchID);
    },
    onResume: function () {
        try {
            _ACTIONS.onPause();
            statusID = setInterval(function () { _ACTIONS.onCheckConnection(function (data) { if (!data) { _ACTIONS.onPause(); } }) }, 15000);
            watchID = navigator.geolocation.watchPosition(_ACTIONS.onWatchPosition, _ACTIONS.onWatchPositionError, { maximumAge: 1000, timeout: 1000, enableHighAccuracy: true });
        }
        catch (err) {
            _ACTIONS.onWatchPositionError();
        }
    },
    onReload: function () {
        window.location = "index.html";
    },
    onCheckConnection: function (_callBack) {
        var _ret = true;
        try {
            switch (navigator.connection.type) {
                case Connection.ETHERNET:
                    break;
                case Connection.WIFI:
                    break;
                case Connection.CELL_2G:
                    break;
                case Connection.CELL_3G:
                    break;
                case Connection.CELL_4G:
                    break;
                case Connection.CELL:
                    break;
                case Connection.UNKNOWN:
                    _ret = false;
                    break;
                case Connection.NONE:
                    _ret = false;
                    break;
            }
            if ($.isFunction(_callBack)) { _callBack(_ret); };
        } catch (err) {
            var _params = { "url": (_AJAX.server + "favicon.ico") };
            _AJAX.UiUrlExists(_params, function (datajson) {
                if (!datajson.connected) {
                    $("#login").hide();
                    $("#main").hide();
                    $("#splash").fadeOut("slow", function () {
                        $("#disconnected").hide().removeClass("hidden");
                        $("#disconnected").fadeIn("fast");
                    });
                }
                if ($.isFunction(_callBack)) { _callBack(datajson.connected); };
            });
        }
    },
    onLoginSuccess: function (json) {
        _USERDATA = json;
        _USERDATA['id_app'] = _ID_APP;
        _USERDATA['id_group'] = _ID_GROUP;
        _USERDATA['status'] = json.status;
        _USERDATA['session_key'] = json.authResponse.session_key;
        _USERDATA['accesstoken'] = json.authResponse.accessToken;
        _USERDATA['expiresIn'] = json.authResponse.expiresIn;
        _USERDATA['sig'] = json.authResponse.sig;
        _USERDATA['secret'] = json.authResponse.secret;
        _USERDATA['userID'] = json.authResponse.userID;
        if (_USERDATA['oauth_uid'] == -1) {
            _ACTIONS.onMeDetails(json);
        } else {
            try {
                facebookConnectPlugin.api("me/?fields=id,first_name,last_name,email,gender,locale,picture", _FACEBOOKPERMISSIONS, _ACTIONS.onMeDetails, _ACTIONS.onDisplayResponse);
            } catch (err) {
                _ACTIONS.onMeDetails(json);
            };
        }
    },
    onLogoutSuccess: function () {
        _USERDATA = {};
        _TRACK_POSITION = {};
        _DB.Remove("remember");
    },
    onWatchPosition: function (position) {
        var _html = "";
        if (position.coords == undefined) { _TRACK_POSITION = _DEFAULT_POSITION; }
        try {
            _TRACK_POSITION = { lat: position.coords.latitude, lng: position.coords.longitude };
            _ACTIONS.onDrawMyPosition(false);
        } catch (err) {
            _ACTIONS.onWatchPositionError();
        }
        if (map && (_last_position !== position)) {
            _last_position = position;
            _ACTIONS.onSuccessTelemetry();
        }
    },
    onWatchPositionError: function () {
        _TRACK_POSITION = _DEFAULT_POSITION;
        _map_center = map.getCenter();
        _html = "<div class='alert alert-danger'><strong>" + _v_no_geo + "</strong></div>";
        $(".status").html(_html);
        // _ACTIONS.onDrawMyPosition();
    },
    onSuccessTelemetry: function () {
        var _json = {
            "id_app": _ID_APP,
            "id_user": _ID_USER,
            "lat": _TRACK_POSITION.lat,
            "lng": _TRACK_POSITION.lng,
            "altitude": null,
            "accuracy": null,
            "heading": null,
            "speed": null,
            "created_client": _TOOLS.todayYYYYMMDD("-"),
        };
        _AJAX.UiTelemetry(_json, function (datajson) { });
    },
    onDisplayResponse: function (json) {
        alert(JSON.stringify(json));
    },
    onAppDetail: function (_callBack) {
        var _json = { "types": _KEY_FIXED };
        _AJAX.UiAppDetail(_json, function (_initial) {
            var _app = _initial[1][0];
            _INITIAL = _initial[0];
            window.document.title = _app.description;
            _APP_NAME = _app.code;
            _ID_APP = _app.id;
            _ID_GROUP = _app.id_group;
            _KEY_FIXED = _app.key_fixed;
            _KEY_BLOG = _app.key_blog;
            _GOOGLE_PLACES_API_KEY = _app.google_places_api_key;
            _GOOGLE_MAP_API_KEY = _app.google_map_api_key;
            _GOOGLE_DIRECTIONS_API_KEY = _app.google_directions_api_key;
            _LANGUAGE = _app.language;
            _DEFAULT_ZOOM = parseInt(_app.default_zoom);
            _FACEBOOKAPPID = _app.facebookappid;
            _APP_INVITE_URL = _app.app_invite_url;
            _ROUTE_COLOR = _app.route_color;
            _ACTIONS.onDatabaseInit();
            if ($.isFunction(_callBack)) { _callBack(); };
        });
    },
    onGetFriends: function (json, _callBack) {
        _FRIENDS = json;
        _USERDATA["total_count"] = json.summary.total_count;
        _USERDATA["total_friends"] = 0;
        _IFACE.onFriendsStatus(_FRIENDS, function (datajson) {
            if ($.isFunction(_callBack)) { _callBack(datajson); };
        });
    },
    onShowBlog: function () {
        _IFACE.onBuildBlog(_KEY_BLOG, function (_html) { $(".area-blog").html(_html).removeClass("hidden"); });
        $(".openBlog").addClass("hidden");
        $(".closeBlog").removeClass("hidden");
    },
    onHideBlog: function () {
        $(".area-blog").html("").addClass("hidden");
        $(".closeBlog").addClass("hidden");
        $(".openBlog").removeClass("hidden");
    },

    onInitMap: function () {
        var _initial = _INITIAL;
        _AJAX.UiMyStatus({ "in_use": 1 })
        if (_initial.lat != undefined && _initial.lat != null && _initial.lat != "") {
            _DEFAULT_POSITION = { "lat": parseFloat(_initial.lat), "lng": parseFloat(_initial.lng) };
        }
        map = new google.maps.Map(document.getElementById('map'), {
            styles: _MAP_STYLES['hideAll'],
            zoom: _DEFAULT_ZOOM,
            center: _DEFAULT_POSITION,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
        });
        $.each(_initial.places.results, function (i, obj) {
            var marker = _ACTIONS.onAddMarker(obj, map, true, true);
            _vSedes[_vSedes.length] = marker;
            sedes.push(marker);
        });
        google.maps.event.addListener(map, 'click', function (event) {
            _map_center = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            _ACTIONS.onCenterMap(_map_center);
        });

    },
    onCenterMap: function (json) {
        if (json == null) { json = _map_center; }
        map.setCenter(json);
        if (_MARKER_TAP != null) { _MARKER_TAP.setMap(null); }
        _MARKER_TAP = _ACTIONS._onAddMarker({ "name": _v_search_here, "base_icon": "z.png", "geometry": { "location": { "lat": _map_center.lat, "lng": _map_center.lng } } }, map, false, { width: 24, height: 24 }, true);
        _IFACE.onStatusMessages(null);
    },
    onSearchAddress: function (_this, event, _callBackOk, _callBackError) {
        if (event != null) {
            if (event.which == 13) { _SEARCHEABLE = false; } else { _SEARCHEABLE = true; }
        } else {
            if (!_SEARCHEABLE) { return false; }
        }
        clearTimeout(searchID);
        searchID = setTimeout(function () {
            var _params = { "address": _this.val() };
            _AJAX.UiPlaceReverse(_params,
                function (datajson) {
                    if ($.isFunction(_callBackOk)) {
                        _callBackOk(datajson);
                    } else {
                        $.each(datajson.results, function (i, obj) {
                            _map_center = { lat: obj.geometry.location.lat, lng: obj.geometry.location.lng };
                            _ACTIONS.onCenterMap(_map_center);
                        });
                    };
                },
                function (err) { if ($.isFunction(_callBackError)) { _callBackError(err); }; }
            );
        }, 750);
    },
    onFilterFriends: function (_this) {
        $(".friend-name").parent().addClass("hidden");
        $(".friend-name").each(function () {
            if ($(this).html().toUpperCase().indexOf(_this.val().toUpperCase()) != -1) {
                $(this).parent().removeClass("hidden")
            }
        });
    },
    onSearchPlaces: function (_this) {
        _vLoaded = [];
        if (_MARKER) { _MARKER.setIcon(_LAST_ICON); }
        _MARKER = null;
        var _url = _this.attr("data-url");
        var _local = _this.attr("local");
        var _data_mim_type = _this.attr("data-mim-type");
        var _data_zoom = _this.attr("data-zoom");
        var _data_radio = _this.attr("data-radio");
        _map_center = map.getCenter();
        _ACTIONS.onCenterMap(null);
        map.setZoom(parseInt(_data_zoom));
        _IFACE.onClearFooterDetails();
        _IFACE.onDestroyMarkers();
        _IFACE.onCloseAll();
        _ACTIONS.onLocalCleanDeadCache("places");
        _ACTIONS.onLocalSelectPlaces(
            { "types": _data_mim_type, "distance": _data_radio },
            function (results) {
                for (var i = 0; i < results.rows.length; i++) {
                    var obj = null;
                    var _icon = (results.rows.item(i).types + ".png");
                    if (results.rows.item(i).data_cache && results.rows.item(i).data_cache != null) {
                        obj = JSON.parse(decodeURI(results.rows.item(i).data_cache));
                        obj["base_icon"] = _icon;
                        _vLoaded.push(obj.name);
                        _ACTIONS.onAddMarker(obj, map);
                    };
                };
                if (_url == "") {
                    switch (_local) {
                        case "":
                            _ACTIONS._onSearchMim(_this);
                            break;
                        case "mim":
                            _IFACE.onBuildBlog(_data_mim_type, function (_html) { $(".external-body").html(_html); });
                            _IFACE.onOpenExternal();
                            break;
                    }
                } else {
                    _AJAX.Load("fragments/splash.html", function (data) {
                        $(".external-body").html(data);
                    });
                    _IFACE.onOpenExternal();
                    var _params = { "url": _url, "type": _data_mim_type };
                    _AJAX.UiPlacesUrl(_params, function (datajson) {
                        $(".external-body").html((datajson.message + datajson.html));
                    });
                }
            });

    },
    _onSearchMim: function (_this) {
        var _data_mim_type = _this.attr("data-mim-type");
        var _data_keyword = _this.attr("data-keyword");
        var _data_zoom = _this.attr("data-zoom");
        var _data_radio = _this.attr("data-radio");
        if (_data_mim_type != "") {
            var _params = {
                "lat": _map_center.lat(),
                "lng": _map_center.lng(),
                "mode": "",
                "type": _data_mim_type,
                "keyword": _data_keyword,
                "radius": _data_radio,
            };
            _AJAX.UiPlacesMim(_params, function (datajson) {
                $.each(datajson.results, function (i, obj) {
                    var _add = true;
                    var _add_local = false;
                    for (var i = 0; i < _vLoaded.length; i++) { if (_vLoaded[i] == obj.name) { _add = false; break; } }
                    if (_add) {
                        if (obj.data_cache != undefined && obj.data_cache != null) { _ACTIONS.onLocalInsertPlace(obj); }
                        var _icon = obj.base_icon;
                        if (obj.data_cache && obj.data_cache != null) {
                            obj = obj.data_cache;
                            obj["base_icon"] = _icon;
                        };
                        _vLoaded.push(obj.name);
                        _ACTIONS.onAddMarker(obj, map);
                    }
                });
                _CIRCLE = _IFACE.onDrawCircle(_map_center, _data_radio, "#eac321", "#53575A");
                /*Go to Google */
                _ACTIONS._onSearchGoogle(_this);
            });
        };
    },
    _onSearchGoogle: function (_this) {
        var _data_google_type = _this.attr("data-google-type");
        var _data_keyword = _this.attr("data-keyword");
        var _data_zoom = _this.attr("data-zoom");
        var _data_radio = _this.attr("data-radio");
        if (_data_google_type != "") {
            var _params = {
                "lat": _map_center.lat(),
                "lng": _map_center.lng(),
                "mode": "nearbysearch", /*"radarsearch", /*nearbysearch*/
                "type": _data_google_type,
                "keyword": _data_keyword,
                "radius": _data_radio,
            };
            _AJAX.UiPlaces(_params, function (datajson) {
                $.each(datajson.results, function (i, obj) {
                    var _add = true;
                    for (var i = 0; i < _vLoaded.length; i++) { if (_vLoaded[i] == obj.name) { _add = false; break; } }
                    if (_add) { _ACTIONS.onAddMarker(obj, map); }
                });
            });
        };
    },
    onSelectMarker: function (marker, obj) {
        if (_bResolving) { alert(_v_resolving); return false; }
        if (_MARKER) { _MARKER.setIcon(_LAST_ICON); }
        _MARKER = marker;
        _OBJ = obj;
        if (_MARKER !== _MARKER_ME) {
            _LAST_ICON = _MARKER.getIcon();
            _MARKER.setIcon("./markers/selected.png");
        }
        _IFACE.onClearFooterDetails();
        _IFACE.onDestroyRoute();
        _ACTIONS.onCenterMap({ "lat": _MARKER.getPosition().lat(), "lng": _MARKER.getPosition().lng() });
        _IFACE.onMiddleFooter();
        _ACTIONS.onPlaceDetails(_OBJ);
    },
    onPlaceDetails: function (obj) {
        if (!_MARKER) { alert(_v_select_marker); return false; }
        $(".footerSelector").addClass("hidden");
        _IFACE.onDrawDetails(obj);
    },
    onPlaceRoutes: function (obj) {
        if (!_MARKER) { alert(_v_select_marker); return false; }
        $(".footerSelector").removeClass("hidden");
        _IFACE.onTraceRoute(_TRACK_POSITION, { "lat": obj.geometry.location.lat, "lng": obj.geometry.location.lng });
    },
    onAddMarker: function (obj, _targetMap, _skip, _see_label) {
        if (_skip == undefined) { _skip = false; }
        var marker = _ACTIONS._onAddMarker(obj, _targetMap, false, { width: 30, height: 36 }, _see_label);
        if (!_skip) { _vPlaces[_vPlaces.length - 1] = obj; markers.push(marker); };
        marker.addListener('click', function () { _ACTIONS.onSelectMarker(marker, obj); });
        return marker;
    },
    _onAddMarker: function (obj, _targetMap, _draggable, _size, _see_label) {
        if (_size == undefined) { _size = { width: 40, height: 50 }; }
        if (_see_label == undefined) { _see_label = false; }
        if (_draggable == undefined) { _draggable = false; }
        var _image = { url: ("./markers/" + obj.base_icon), scaledSize: new google.maps.Size(_size.width, _size.height) };
        var coords = obj.geometry.location;
        var latLng = new google.maps.LatLng(coords.lat, coords.lng);
        var _class = "marker-label";
        var _content = obj.name;
        if (!_see_label) { _class = "no-marker-label"; _content = ""; }
        var marker = new MarkerWithLabel({ position: latLng, animation: google.maps.Animation.DROP, draggable: _draggable, map: _targetMap, icon: _image, labelContent: _content, labelAnchor: new google.maps.Point(75, -3), labelClass: _class, labelInBackground: false });
        return marker;
    },
    onTrackSede: function (_callBackOk) {
        _ACTIONS.onCenterMap(_DEFAULT_POSITION);
        if ($.isFunction(_callBackOk)) { _callBackOk(); };
    },
    onTrackMe: function (_callBackOk) {
        _ACTIONS.onDrawMyPosition(true);
        if ($.isFunction(_callBackOk)) { _callBackOk(); };
    },
    onDrawMyPosition: function (_bCenter) {
        if (_TRACK_POSITION == null) { return false; }
        if (_MARKER_ME != null) { _MARKER_ME.setMap(null); }
        _MARKER_ME = new google.maps.Marker({
            position: _TRACK_POSITION,
            draggable: false,
            map: map
        });
        if (_bCenter) { _ACTIONS.onCenterMap(_TRACK_POSITION); }
    },
    onLocalInsertPlace: function (obj) {
        if (obj.place_id != null && obj.dead_cache != null) {
            var _sql = 'insert or ignore into places (id,place_id,lat,lng,name,address,phone_number,types,website,description,dead_cache,data_cache) ';
            _sql += ' values ("' + obj.id + '","' + obj.place_id + '","' + obj.lat + '","' + obj.lng + '","' + obj.name + '","' + obj.address + '","' + obj.phone_number + '","' + obj.types + '","' + obj.website + '","' + obj.description + '","' + obj.dead_cache + '","' + encodeURI(JSON.stringify(obj.data_cache)) + '")';
            //console.log(_sql);
            _DB.onExecuteSql(_sql, null, null, function (err) { console.log(err); });
        }
    },
    onLocalSelectPlaces: function (obj, _callBackOk) {
        var _min_lat = _map_center.lat() - 0.05;
        var _max_lat = _map_center.lat() + 0.05;
        var _min_lng = _map_center.lng() - 0.05;
        var _max_lng = _map_center.lng() + 0.05;
        var _sql = "select * from places where types='" + obj.types + "' and (cast(lat as decimal) between " + _min_lat + " and " + _max_lat + ") and (cast(lng as decimal) between " + _min_lng + " and " + _max_lng + ")";
        //console.log(_sql);
        _DB.onExecuteSql(_sql,
            function (results) { if ($.isFunction(_callBackOk)) { _callBackOk(results); } },
            null,
            function (err) { console.log(err); }
            );
    },
    onLocalCleanDeadCache: function (_table) {
        var _sql = "delete from " + _table + " where DATE(data_cache) < DATE('" + _TOOLS.todayYYYYMMDD('-') + "')";
        //console.log(_sql);
        _DB.onExecuteSql(_sql, null, null, function (err) { console.log(err); });
    },
    onLocalAllCleanDeadCache: function () {
        $.each(_APP_TABLES.tables, function (i, obj) { _ACTIONS.onLocalCleanDeadCache(obj.name); });
    },
    onToggleItemBlog: function (_this) {
        var _id = _this.attr("data-id");
        if ($("#art_" + _id).hasClass("hidden")) { $("#art_" + _id).removeClass("hidden"); } else { $("#art_" + _id).addClass("hidden"); }
    },
    onSelectFacultades: function (_callBack) {
        _ID_APP = $("#facultades").val();
        if (_ID_APP == -1) {
            alert(_v_empty_combo);
        } else {
            _ACTIONS.onAppDetail(function () { if ($.isFunction(_callBack)) { _callBack(); } });
        }
    },
    onFinishLoad: function (_callBack) {
        _ACTIONS.onCheckConnection(function (data) {
            if (data) {
                $.getScript("https://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false&key=" + _GOOGLE_MAP_API_KEY, function (data, textStatus, jqxhr) {
                    $.getScript("./js/vendor/markerwithlabel.js", function (data, textStatus, jqxhr) {
                        if ($.isFunction(_callBack)) { _callBack(); }
                    });
                });
            };
        });
    },
};
