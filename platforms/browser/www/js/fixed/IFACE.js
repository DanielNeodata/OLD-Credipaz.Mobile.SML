var _IFACE = {
    onClearFooterDetails: function () {
        $(".footer-detail").html("");
    },
    onDestroyRoute: function () {
        if (_LAST_POLYLINE) { _LAST_POLYLINE.setMap(null); };
    },
    onTraceRoute: function (_origin, _destination) {
        _IFACE.onDestroyRoute();
        if (_LAST_ROUTE_MODE == "") { _LAST_ROUTE_MODE = "walking"; }
        $(".btnModeRoute").removeClass("activeNav");
        $("." + _LAST_ROUTE_MODE).addClass("activeNav");
        var _params = {
            "origin": (_origin.lat + "," + _origin.lng),
            "destination": (_destination.lat + "," + _destination.lng),
            "mode": _LAST_ROUTE_MODE,
            "language": "es",
            "units": "metric",
        };
        _AJAX.UiDirections(_params, function (datajson) {
            $.each(datajson.routes, function (i, route) {
                var _html = "";
                _LAST_POLYLINE = new google.maps.Polyline({
                    path: google.maps.geometry.encoding.decodePath(route.overview_polyline.points),
                    strokeColor: _ROUTE_COLOR,
                    strokeOpacity: 0.50,
                    strokeWeight: 5,
                    fillColor: _ROUTE_COLOR,
                    fillOpacity: 1.0,
                    map: map,
                });
                $.each(route.legs, function (x, leg) {
                    _html += "<div class='well' style='background-color:whitesmoke;'>";
                    _html += "<p><b>" + _v_distance_total + " " + leg.distance.text + " " + _v_duration_total + " " + leg.duration.text + "</b></p>";
                    _html += "<p>" + _v_begin + " " + leg.start_address + " " + "<th>" + _v_end + " " + leg.end_address + "</p>";
                    _html += "</div>";
                    $.each(leg.steps, function (y, step) {
                        var _color = "transparent";
                        _html += "<div class='well well-sm' style='background-color:" + _color + "'>";
                        _html += "<p>" + step.html_instructions + "</p>";
                        if (step.transit_details) {
                            _html += "<p><img src='" + step.transit_details.line.vehicle.icon + "'/>" + step.transit_details.line.short_name + " " + step.transit_details.line.name + "</p>";
                            _html += "<p>" + step.transit_details.num_stops + " " + _v_stops + " " + _v_to + " " + step.transit_details.arrival_stop.name + "</p>";
                        }
                        _html += "<p style='text-align:right;'>" + step.distance.text + " " + step.duration.text + "</p>";
                        _html += "</div>";
                    });
                    _html += "</tbody>";
                    _html += "</table>";
                });
                $(".footer-detail").html(_html);
                _ROUTE_ACTIVE = route;
                _bResolving = false;
            });
        });
    },
    onDrawDetails: function (obj) {
        _IFACE.onDestroyRoute();
        $(".footer-detail").html(_IFACE.onBuildHtmlInfo(obj));
        if (obj.data_cache != undefined && obj.data_cache != null && obj.data_cache != "") { obj = obj.data_cache; };
        var _icon = obj.icon;
        var _name = ("<img src='" + _icon + "' width='32' height='32'/> <b>" + obj.name + "</b>");
        var _address = "";
        var _phone = "";
        var _website = "";
        var _description = "";
        var _hours = "";
        var _photos = "";
        var _url_image = "";
        if (obj.address != undefined) { _address = obj.address; }
        if (obj.phone_number != undefined) { _phone = obj.phone_number; }
        if (obj.website != undefined) { _website = obj.website; }
        if (obj.description != undefined) { _description = obj.description; }
        if (obj.opening_hours != undefined) { _hours = obj.opening_hours; }
        if (obj.files != undefined) {
            $(".place-photos").html("");
            $.each(obj.files, function (i, _ft) {
                var _plain = {
                    "model": "files",
                    "page": 1,
                    "pagesize": 1,
                    "where": "model='places' AND id=" + _ft.id,
                };
                _AJAX.UiPlain(_plain, function (photo) {
                    var _image = photo.records[0].filename;
                    if (_image == "") { _image = photo.records[0].data; }
                    _photos = "<img src='" + _image + "'  class='img-place'/>";
                    if (i == 0) { $(".info-card").css({ "background-image": "url(" + _image + ")", }); };
                    $(".place-photos").append(_photos).removeClass("hidden");
                });
            });
        }
        if (obj.photos != undefined) { _url_image = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=350&maxheight=700&photoreference=" + obj.photos[0].photo_reference + "&key=" + _GOOGLE_PLACES_API_KEY; };
        if (_url_image != "") { $(".info-card").css({ "background-image": "url(" + _url_image + ")", }); };
        if (_address != "") { $(".place-address").html(_address).removeClass("hidden"); };
        if (_phone != "") { $(".place-phone").html(_phone).removeClass("hidden"); };
        if (_website != "") { $(".place-website").html("<a href='" + _website + "' target='_blank'>" + _website + "</a>").removeClass("hidden"); };
        if (_description != "") { $(".place-description").html(_description).removeClass("hidden"); };
        if (_hours != "") { $(".place-hours").html(_hours).removeClass("hidden"); };
        $(".place-name").html(_name).removeClass("hidden");

        if (obj.place_id != null) {
            var _params = { "place_id": obj.place_id };
            _AJAX.UiPlaceDetails(_params, function (datajson) {
                _hours = "";
                _photos = "";
                if (datajson.result.formatted_address != undefined) { _address = datajson.result.formatted_address; };
                if (datajson.result.formatted_phone_number != undefined) { _phone = datajson.result.formatted_phone_number; };
                if (datajson.result.website != undefined) { _website = datajson.result.website; };
                if (datajson.result.opening_hours != undefined) { $.each(datajson.result.opening_hours.weekday_text, function (i, _wd) { _hours += "<li>" + _wd + "</li>"; }); };
                if (datajson.result.photos != undefined) {
                    $.each(datajson.result.photos, function (i, _ft) {
                        if (_ft.width >= _ft.height) {
                            var _image = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=350&maxheight=700&photoreference=" + _ft.photo_reference + "&key=" + _GOOGLE_PLACES_API_KEY;
                            _photos += "   <img src='" + _image + "'  class='img-place' />";
                        }
                    });
                }
                if (_address != "") { $(".place-address").html(_address).removeClass("hidden"); };
                if (_phone != "") { $(".place-phone").html(_phone).removeClass("hidden"); };
                if (_website != "") { $(".place-website").html("<a href='" + _website + "' target='_blank'>" + _website + "</a>").removeClass("hidden"); };
                if (_hours != "") { $(".place-hours").html(_hours).removeClass("hidden"); };
                if (_photos != "") { $(".place-photos").html(_photos).removeClass("hidden"); };
            });
        }
    },
    onModeRoute: function (_this) {
        if (_bResolving) { alert(_v_resolving); return false; }
        _LAST_ROUTE_MODE = _this.attr("data-id");
        var i = _LAST_POLYLINE.getPath().length;
        var _origin = { "lat": _LAST_POLYLINE.getPath().getAt(0).lat(), "lng": _LAST_POLYLINE.getPath().getAt(0).lng() };
        var _destination = { "lat": _LAST_POLYLINE.getPath().getAt(i - 1).lat(), "lng": _LAST_POLYLINE.getPath().getAt(i - 1).lng() };
        _IFACE.onTraceRoute(_TRACK_POSITION, _destination);
    },
    onMiddleFooter: function () {
        var _height = $(".map-footer").height();
        var _top = (_height / 1.50);
        $(".map-footer").velocity({ "top": _top + "px" }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onPositionFooterControls((_height - _top));
        $(".btnDown").fadeOut("fast", function () { $(".btnUp").fadeIn("fast"); });
    },
    onShowMapBar: function () {
        $(".map-bar").velocity({ 'top': '0px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        $(".map-blog").velocity({ 'top': '55px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
    },
    onHideMapBar: function () {
        $(".map-bar").velocity({ 'top': '-100px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        $(".map-blog").velocity({ 'top': '-1000px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
    },
    onShowMapFooter: function () {
        var _height = ($(".map-footer").height() + 15);
        _IFACE.onPositionFooterControls();
        _IFACE.onHideFooterControls();
        $(".btnDown").fadeOut("fast", function () { $(".btnUp").fadeIn("fast"); });
        $(".footerSelector").addClass("hidden");
        $(".map-footer").velocity({ 'top': _height + 'px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
    },
    onHideMapFooter: function () {
        var _height = ($(".map-footer").height() + 80);
        $(".map-footer").velocity({ 'top': _height + 'px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onHideFooterControls();
    },
    onShowMapBackdrop: function () {
        $("body").css("background-color", "black");
        $("#map").css({ "opacity": 0.25 });
    },
    onHideMapBackdrop: function () {
        $("body").css("background-color", "white");
        $("#map").css({ "opacity": 1 });
    },
    onShowFooterControls: function () {
        $(".footerControl").show();
    },
    onHideFooterControls: function () {
        $(".footerControl").hide();
    },
    onOpenLeft: function () {
        $(".left-sidenav").show();
        $(".left-sidenav").velocity({ 'left': '0px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onHideMapBar();
        _IFACE.onHideMapFooter();
        _IFACE.onShowMapBackdrop();
    },
    onCloseLeft: function () {
        var _width = ($(".left-sidenav").width() * -1);
        $(".left-sidenav").velocity({ 'left': _width + 'px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        $(".btnItem").css({ "opacity": 1 });
        _IFACE.onSizeItems();
        _IFACE.onShowMapBar();
        _IFACE.onShowMapFooter();
        _IFACE.onHideMapBackdrop();
    },
    onOpenRight: function () {
        if (_USERDATA['oauth_uid'] == -1) { $(".btnInvite").addClass("hidden"); }
        $(".friends-list").html("");
        $(".right-sidenav").show();
        $(".right-sidenav").velocity({ 'left': '25%' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onHideMapBar();
        _IFACE.onHideMapFooter();
        _IFACE.onShowMapBackdrop();
        _IFACE.onFriendsStatus(_FRIENDS, function () { });
    },
    onCloseRight: function () {
        var _width = ($(".right-sidenav").width() * -1);
        $(".right-sidenav").velocity({ 'left': '175%' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onShowMapBar();
        _IFACE.onShowMapFooter();
        _IFACE.onHideMapBackdrop();
    },
    onOpenConfig: function () {
        _IFACE.onHideMapBar();
        _IFACE.onHideMapFooter();
        $(".config").velocity({ "top": "0px", " z-index": "9999" }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
    },
    onCloseConfig: function () {
        $(".config").velocity({ "top": "125%" }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onShowMapBar();
        _IFACE.onShowMapFooter();
    },
    onOpenExternal: function () {
        //_IFACE.onCloseLeft();
        _IFACE.onHideMapBar();
        _IFACE.onHideMapFooter();
        $(".external").velocity({ "left": "0px", " z-index": "9999" }, 350);
    },
    onCloseExternal: function () {
        _IFACE.onShowMapBar();
        _IFACE.onShowMapFooter();
        $(".external").velocity({ "left": "-125%" }, 350, function () {
            $(".external-body").html("");
        });
    },
    onOpenMessages: function (_this) {
        //_IFACE.onCloseRight();
        _IFACE.onHideMapBar();
        _IFACE.onSizeChatBody();
        var _html = _this.find(".friend-name").html() + " " + _this.find(".row-picture").html();
        $(".messages .details").html(_html);
        $("#id_user_to").val(_this.attr("data-id"));
        $(".messages").velocity({ "left": "0px", " z-index": "9999" }, 350, function () {
            _IFACE.onPageMessages(1);
            $(".writer").fadeIn("fast");
        });
    },
    onCloseMessages: function () {
        $(".chat-body").hide();
        $(".chat-body").html("");
        $(".messages .details").html("");
        $(".writer").hide();
        $(".messages").velocity({ "left": "-125%" }, 350);
    },
    onSizeChatBody: function () {
        var _top = $(".messages-header").height();
        var _height = ($(window).height() - (_top*1.5) - $(".messages-header").height());
        $(".chat-body").css({ "left": "0px", "top": (_top*1.5) + "px", "width": "100%", "height": _height + "px" }).fadeIn("slow");
    },
    onShowKeyboard: function () {
        if (!$(".chat-body").hasClass("onkey")) {
            $(".chat-body").addClass("onkey");
            var _height = $(".chat-body").height();
            $(".chat-body").css("height", (_height / 2) + "px");
            $(".writer").css("top", $(".chat-body").height() + "px");
        }
    },
    onHideKeyboard: function () {
        $(".chat-body").removeClass("onkey");
        _IFACE.onSizeChatBody();
        $(".writer").css("top", "");
    },
    onCloseAll: function () {
        $(".left-sidenav").hide();
        $(".right-sidenav").hide();
        _IFACE.onCloseRight();
        _IFACE.onCloseLeft();
    },
    onSizeItems: function () {
        $(".btnItemDetail").hide();
        $(".btnItemDetail").remove();
        $(".btnItem").css({ "width": "100%" }).show();
    },
    onOpenItem: function (_this) {
        var _item = _this.attr("data-item");
        var _stack = parseInt(_this.attr("data-stack"));
        _IFACE.onSizeItems();
        $.each(_MENU.records, function (i, obj) {
            if (obj.id == _item) {
                var _html = "";
                _html += "<div class='btnItemDetail'>";
                _html += "<ul class='list-inline'>";
                $.each(obj.children, function (x, child) {
                    if (child.order >= 0) {
                        var _code = child.code;
                        var _google = child.code;
                        var _keywords = child.keywords;
                        var _url = child.url;
                        if (child.url == null) { _url = ""; }
                        var _local = child.local;
                        var _zoom = child.zoom;
                        var _radio = child.radio;
                        if (_keywords == null) { _keywords = ""; }
                        if (_local == null) { _local = ""; }
                        if (_zoom == null) { _zoom = 15; }
                        if (_radio == null) { _radio = 1000; }
                        if (child.admin == 1) { _google = ""; }
                        _html += "<li class='btn btn-xs'>";
                        if (_url == "") {
                            _html += "   <a class='btnSearchPlaces' href='#' data-google-type='" + _google + "' data-mim-type='" + _code + "' data-keyword='" + _keywords + "' data-url='" + _url + "' local='" + _local + "'  data-zoom='" + _zoom + "' data-radio='" + _radio + "'>";
                        } else {
                            _html += "   <a class='' href='" + _url + "' target='_blank'>";
                        }
                        _html += child.icon + " " + eval("_v_" + child.resstring);
                        _html += "   </a>";
                        _html += "</li>";
                    }
                });
                _html += "</ul>";
                _html += "</div>";
                _this.parent().append(_html);
                for (var i = 1; i < 15; ++i) {
                    var _dif = ((1 - (Math.abs(_stack - i) * 1.5) / 10));
                    if (_dif < 0.15) { _dif = 0.15; }
                    $(".btnItem-" + i).css({ "opacity": _dif });
                }
                $(".btnItemDetail").show();
                return false;
            }
        });
    },
    onDestroyMarkers: function () {
        for (var i = 0; i < markers.length; i++) { markers[i].setMap(null); }
        _vPlaces = {};
        markers = [];
        _IFACE.onClearCircle();
    },
    onBuildHtmlInfo: function (_mark) {
        var _html = "";
        _html += "<div class='info-card-title well well-sm'>";
        _html += "   <p class='place place-name hidden'></p>";
        _html += "   <p class='place place-address hidden'></p>";
        _html += "   <p class='place place-website hidden'></p>";
        _html += "   <p class='place place-phone hidden'></p>";
        _html += "   <p class='place-description hidden'></p>";
        _html += "</div>";
        _html += "<div class='info-card well well '></div>";
        _html += "<div class='place-photos well well-sm hidden'></div>";
        _html += "<div class='info-card-details well well-sm'>";
        _html += "   <p class='place-hours hidden'></p>";
        _html += "</div>";
        return _html;
    },
    onBuildBlog: function (_key, _callBack) {
        var _params = {
            "model": "posts",
            "page": 1,
            "pagesize": -1,
            "where": "types='" + _key + "'",
            "order": "date_from DESC",
            "forceView": "",
            "god": 0
        };
        _AJAX.UiPlain(_params, function (datajson) {
            var _html = "";
            $.each(datajson.records, function (i, obj) {
                if (datajson.records.length == 1) {
                    _html += "<div id='art_" + obj.id + "' class='well well-sm'>";
                    _html += "<div class='external_html area-body'>";
                    _html += obj.body_post;
                    _html += "</div>";
                    _html += "</div>";
                } else {
                    _html += "<a href='#' class='btnToggleItemBlog btn btn-primary btn-md' style='display:block;' data-id='" + obj.id + "'>";
                    _html += obj.description;
                    _html += "</a>";
                    _html += "<div id='art_" + obj.id + "' class='well well-sm hidden'>";
                    _html += "<div class='external_html area-body'>";
                    _html += obj.body_post;
                    _html += "</div>";
                    _html += "</div>";

                }
            });
            if ($.isFunction(_callBack)) { _callBack(_html); };
        });
    },
    onPositionFooterControls: function (_bottom) {
        if (_bottom == undefined) { _bottom = "30"; }
        $(".footerControl").velocity({ "bottom": _bottom + "px" }, 350).fadeIn("fast");
        $(".btnCenterClose").hide();
    },
    onFriendsStatus: function (json, _callBack) {
        var _oauth_uids = "";
        $.each(json.data, function (i, obj) {
            _USERDATA["total_friends"] += 1;
            _oauth_uids += obj.id + ",";
        });
        if (_oauth_uids != "") {
            _oauth_uids = _oauth_uids.slice(0, -1);
            var _json = { "oauth_provider": "facebook", "oauth_uids": _oauth_uids };
            _AJAX.UiFriendsStatus(_json, function (datajson) {
                var _html = "";
                _AJAX.Load("fragments/splash.html", function (data) {
                    $(".friends-list").html(data);
                    setTimeout(function () {
                        $.each(datajson, function (i, obj) {
                            var _color = "color:red;";
                            if (obj.in_use == 1) { _color = "color:green;"; }
                            _html += "<div id='btnOpenMessages' class='btnOpenMessages friend-item list-group-item' data-id='" + obj.id + "' data-oauth_ui='" + obj.oauth_uid + "'>";
                            _html += "   <table style='width:100%;'>";
                            _html += "      <tr class='friend-line'>";
                            _html += "         <td valign='middle' class='row-picture'><img class='friend-picture circle' src='" + obj.picture_url + "' style='width:48px;height:48px;'/></td>";
                            _html += "         <td valign='middle'><a href='#' style='" + _color + "' class='pull-right'><i class='material-icons' style='font-size:16px;'>stop</i></a></td>";
                            _html += "         <td valign='middle' class='friend-name' style='width:100%;'>" + obj.first_name + " " + obj.last_name + "</td>";
                            _html += "         <td valign='middle' class='message-alert message-alert-" + obj.id + "'></td>";
                            _html += "      </tr>";
                            _html += "   </table>";
                            _html += "</div>";
                        });
                        _IFACE.onStatusMessages(null);
                        $(".friends-list").css({ "left": "-75%" });
                        if (_html == "") { _html = _IFACE.onBuildAlert(_v_no_data); }
                        $(".friends-list").html(_html);
                        $(".friends-list").velocity({ 'left': '0px' }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
                        if ($.isFunction(_callBack)) { _callBack(datajson); };
                    }, 350);
                });
            });
        } else {
            if ($.isFunction(_callBack)) { _callBack(null); };
        }
    },
    onStatusMessages: function (json) {
        if (json == null) {
            _AJAX.UiUnread({}, function (ret) {
                ret["unread"] = ret;
                _IFACE.onStatusMessages(ret);
            });
        } else {
            $(".message-alert").html("");
            var _unreads = 0;
            $.each(json.unread, function (i, obj) {
                _unreads += parseInt(obj.unread);
                var _html = "<span class='badge'><i class='material-icons' style='font-size:14px;'>chat</i>" + obj.unread + "</span>";
                if (parseInt(obj.unread) > 0) { $(".message-alert-" + obj.id_user_from).html(_html); }
            });
            $("#btnOpenRight .message-alert").remove();
            if (_unreads > 0) {
                var _html = "<div class='message-alert'><span class='badge'>" + _unreads + "</span></div>";
                $("#btnOpenRight").prepend(_html);
            }
        }
    },
    onShowMap: function (_callBack) {
        $("#main").css("display", "none");
        $("#main").removeClass("hidden");
        $("#splash").fadeOut("slow", function () {
            $("#facebook_id").val(_USERDATA['oauth_uid']);
            $(".user-picture").attr("src", _USERDATA['picture_url']);
            $(".user-name").html(_USERDATA['first_name'] + " " + _USERDATA['last_name']);
            $("#main").fadeIn("slow");
            _ACTIONS.onInitMap();
            _IFACE.onShowMapFooter();
            setTimeout(function () { _ACTIONS.onResume(); }, 1000);
            try {
                if (_USERDATA['oauth_uid'] != -1) {
                    FCMPlugin.onTokenRefresh(function (token) {
                        FCMPlugin.subscribeToTopic('Test');
                        _AJAX.UiTokenFireCloud({ "token": token }, function (data) { });
                    });
                    FCMPlugin.getToken(function (token) {
                        FCMPlugin.subscribeToTopic('Test');
                        _AJAX.UiTokenFireCloud({ "token": token }, function (data) { });
                    });
                }
            } catch (rex) { }
        });
    },
    onPageMessages: function (_ipage) {
        if (_ipage == null) { _ipage = _NEXT_PAGE; }
        if (_ipage == 1) {
            _NEXT_PAGE = 1;
            $(".chat-body").html("<div class='messages-previous'></div>");
        }
        var _id_user_to = $("#id_user_to").val();
        var _where = "(id_user_from=" + _ID_USER + " AND id_user_to=" + _id_user_to + ")";
        _where += " OR (id_user_to=" + _ID_USER + " AND id_user_from=" + _id_user_to + ")";
        var _params = {
            "model": "messages",
            "page": _ipage,
            "pagesize": 5,
            "where": _where,
            "order": "fum_ts DESC",
            "forceView": "",
            "god": 0,
            "id_user_to": _id_user_to
        };
        _AJAX.UiPlain(_params, function (datajson) {
            var _last_id_user = 0;
            _IFACE.onStatusMessages(datajson);
            _NEXT_PAGE += datajson.page;
            if (datajson.page < datajson.totalpages) {
                $(".message-pager").remove();
                var _html = "<div class='message-pager'>";
                _html += "<a href='#' class='btnMoreMessages btn btn-xs btn-default btn-raised pull-right'><i class='material-icons'>expand_less</i>" + _v_previous_messages + "</a>";
                _html += "</div>";
                $(".chat-body").append(_html);
            };

            $.each(datajson.records, function (i, obj) {
                if (_last_id_user != obj.id_user_from) {
                    _last_id_user = obj.id_user_from;
                    obj["show_picture"] = true;
                } else {
                    obj["show_picture"] = false;
                }
                if (obj.id_user_to != _ID_USER) {
                    _IFACE.onSendMessage(obj, _ipage, null);
                } else {
                    _IFACE.onReceiveMessage(obj, _ipage);
                }
            });
        });
    },
    onSendMessage: function (obj, _ipage, event) {
        if (event.which == 13 || event == null) {
            var _message = "";
            var _show_picture = true;
            if (obj != null) {
                _show_picture = obj["show_picture"];
                _message = obj.body;
            } else {
                _show_picture = true;
                _message = $("#message").val();
                $("#message").val("");
                var _params = { "id_user_from": _ID_USER, "id_user_to": $("#id_user_to").val(), "body": _message };
                _AJAX.UiMessageSend(_params, function (datajson) {
                    _IFACE.onStatusMessages(datajson);
                });
            }
            var _html = "<div class='message-sended'>";
            if (_show_picture) { _html += "<img src='" + _USERDATA["picture_url"] + "' style='height:24px;margin-right:5px;'/>"; }
            _html += _message;
            _html += "</div>";
            if (_ipage == 1) {
                $(".chat-body").append(_html);
                $(".chat-body").velocity({ scrollTop: 99999 }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
            } else {
                $(".messages-previous").append(_html);
                $(".chat-body").velocity({ scrollTop: 0 }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
            }
        }
    },
    onReceiveMessage: function (obj, _ipage) {
        var _show_picture = obj["show_picture"];
        var _html = "<div class='message-received'>";
        _html += obj.body;
        if (_show_picture) { _html += "<img src='" + obj.from_picture_url + "' class='pull-right'  style='height:24px;margin-left:5px;'/>"; }
        _html += "</div>";
        if (_ipage == 1) {
            $(".chat-body").append(_html);
            $(".chat-body").velocity({ scrollTop: 99999 }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        } else {
            $(".messages-previous").append(_html);
            $(".chat-body").velocity({ scrollTop: 0 }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        }
    },
    onSelectImage: function (_this) {
        $(".info-card").css("background-image", "url('" + _this.attr("src") + "')");
    },
    onFullDetails: function () {
        var _height = $(".map-footer").height();
        var _top = $(".map-footer").position().top;
        $(".map-footer").velocity({ "top": 0 }, { duration: 250, easing: "easeOutQuad", mobileHA: true });
        _IFACE.onPositionFooterControls(_height);
        $(".btnUp").fadeOut("fast", function () { $(".btnDown").fadeIn("fast"); });
        $(".footerControl").fadeOut("fast");
        $(".btnCenterClose").show();
        $(".footerControl").velocity({ "opacity": 1.0 }, 100);
    },
    onBuildAlert: function (_message, _class) {
        if (_class == undefined) { _class = "alert-info"; }
        var _html = "";
        _html += "<div class='alert alert-dismissible " + _class + "'>";
        _html += "<button type='button' class='close' data-dismiss='alert'>×</button>";
        _html += "<strong>" + _message + "</strong>";
        _html += "</div>";
        return _html;
    },
    onResolveTravelModes: function (_mode) {
        var _ret = "";
        switch (_mode) {
            case "DRIVING":
                _ret = _v_driving;
                break;
            case "BICYCLING":
                _ret = _v_bicycling;
                break;
            case "TRANSIT":
                _ret = _v_transit;
                break;
            default:
                _ret = _v_walking;
                break;
        }
        return _ret;
    },
    onDrawCircle: function (_coords, _radius, _fillcolor, _strokecolor) {
        var cLat = _coords.lat() * Math.PI / 180;
        var cLng = _coords.lng() * Math.PI / 180;
        var d = _radius / 6378137.0;
        var paths = [];
        for (var tc = 0; tc < 2 * Math.PI; tc += (Math.PI / 32)) {
            var lat = Math.asin(Math.sin(cLat) * Math.cos(d) + Math.cos(cLat) * Math.sin(d) * Math.cos(tc));
            var dlng = Math.atan2(Math.sin(tc) * Math.sin(d) * Math.cos(cLat), Math.cos(d) - Math.sin(cLat) * Math.sin(lat));
            var lng = ((cLng - dlng + Math.PI) % (2 * Math.PI)) - Math.PI;
            paths.push(new google.maps.LatLng(_TOOLS.toDeg(lat), _TOOLS.toDeg(lng)));
        }
        if (markers.length > 0) {
            var bounds = new google.maps.LatLngBounds();
            for (i = 0; i < markers.length; i++) { bounds.extend(markers[i].getPosition()); }
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
            var opts = {
                paths: paths,
                fillColor: '#eac321',
                fillOpacity: 0.35,
                strokeColor: '#53575A',
                strokeWeight: 1,
                strokeOpacity: 0.75,
                draggable: false,
                geodesic: true,
                map: map,
                zIndex: -9999,
            };
            return new google.maps.Polygon(opts);
        } else {
            alert(_v_no_data);
            return null;
        }
    },
    onClearCircle: function () {
        if (_CIRCLE) { _CIRCLE.setMap(null); }
    },
};
