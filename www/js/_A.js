var _APP_NAME = "appSML"

//document.addEventListener("deviceready", onLoadFiles, false);
function onLoadFiles() {
    setTimeout(function () {
        var _t = ($(window).height() - $(".scanner-borders").height()) / 2;
        var _l = ($(window).width() - $(".scanner-borders").width()) / 2;
        $(".scanner-borders").css({ "position": "absolute", "left": _l + "px", "top": _t + "px" });
        _t = ($(window).height() - $(".img-clubredondo").height()) / 2 - 150;
        _l = ($(window).width() - $(".img-clubredondo").width()) / 2;
        $(".img-clubredondo").css("left", _l + "px")
        _l = ($(window).width() - $(".img-mas").width()) / 2;
        $(".img-mas").css({ "left": _l + "px", "top": (_t + 60) + "px", "opacity": 0 }).show().css({ "opacity": 1 });
        _l = ($(window).width() - $(".img-waiter").width()) / 2;
        $(".img-waiter").css({ "left": _l + "px", "top": "0px", "opacity": 0 }).show();
        $(".img-welcome").css({ "top": "0px", "opacity": 0 }).show();
        $(".img-clubredondo").css({ "top": "0px", "opacity": 0 }).show();
        $(".img-clubredondo").animate({ "top": _t + "px", "opacity": 1 }, 250, function () { });
        $(".img-waiter").animate({ "opacity": 0.5, "top": (_t + 375) + "px" }, 500, function () { });
        $(".img-welcome").animate({ "top": (_t + 400) + "px", "opacity": 1 }, 750, function () { });
    }, 1);
    setTimeout(function () {
        $.getScript("js/_INIT_EVENTS.js", function () {
            $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC1tenNE7Ci3lOcX-MHqGEbzzFtPaSRJWY&libraries=geometry", function () {
                $.getScript("js/vendor/markerwithlabel.js", function () {
                    $.getScript("js/TOOLS.js", function () {
                        $.getScript("js/FUNCTIONS.js", function () {
                            $.getScript("js/GMAP.js", function () {
                                $.getScript("js/AJAX.js", function () {
                                    _GMAP.watchID = navigator.geolocation.watchPosition(_GMAP.onWatchPosition, _GMAP.onWatchPositionError, { maximumAge: 0, timeout: 30000, enableHighAccuracy: true });
                                    if (window.MobileAccessibility) { window.MobileAccessibility.usePreferredTextZoom(false); }
                                    _AJAX.Load("./fragments/login.html").then(function (data) {
                                        $(".login").html(data);
                                        _AJAX.initialize(null);
                                        $.material.init();
                                        FastClick.attach(document.body);
                                        _FUNCTIONS.onLoadInnerFrames();
                                        var _stored = window.localStorage.getItem("JELPER_credentials");
                                        var _json = JSON.parse(_stored);
                                        _FUNCTIONS.onAuthentication(_json);
                                    });
                                    _FUNCTIONS.connected.subscribe(function (data) {
                                        if (!data) {
                                            $(".splash").hide();
                                            $(".login").hide();
                                            $(".main").hide();
                                            $(".disconnected").fadeIn("fast");
                                            $(".fa-ban").show();
                                            $(".btnReconnect").addClass("btn-danger").removeClass("btn-success");
                                        } else {
                                            $(".fa-ban").hide();
                                            $(".btnReconnect").addClass("btn-success").removeClass("btn-danger");
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }, 5000);
}
setTimeout(function () { $(".waitNav").show(); }, 0);

/*
$(document).ready(function () {
    setTimeout(function () {
        onLoadFiles();
        FastClick.attach(document.body);
    }, 5000);
});
*/