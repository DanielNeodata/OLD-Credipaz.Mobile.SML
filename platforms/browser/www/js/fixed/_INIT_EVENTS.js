(function () {
    "use strict";
    $(document).ready(function () {
        document.addEventListener("deviceready", onDeviceReady.bind(this), false);
    });
    function onInit() {
        _AJAX.Load("fragments/map-bar.html", function (data) { $("#main").append(data); });
        _AJAX.Load("fragments/left-sidebar.html", function (data) { $("#main").append(data); });
        _AJAX.Load("fragments/right-sidebar.html", function (data) { $("#main").append(data); });
        _AJAX.Load("fragments/external.html", function (data) { $("#main").append(data); });
        _AJAX.Load("fragments/messages.html", function (data) { $("#main").append(data); });
        _AJAX.Load("fragments/map-footer.html", function (data) { $("#main").append(data); });

        document.addEventListener("pause", _ACTIONS.onPause.bind(this), false);
        document.addEventListener("resume", _ACTIONS.onResume.bind(this), false);
        $("body").off("click", ".btnOpenLeft").on("click", ".btnOpenLeft", function () {
            _IFACE.onOpenLeft();
        });
        $("body").off("click", ".btnOpenRight").on("click", ".btnOpenRight", function () {
            _IFACE.onOpenRight();
        });
        $("body").off("click", ".btnCloseLeft").on("click", ".btnCloseLeft", function () {
            _IFACE.onCloseAll();
        });
        $("body").off("click", ".btnLogout").on("click", ".btnLogout", function () {
            _FACEBOOK.logout();
        });
        $("body").off("click", ".btnCloseRight").on("click", ".btnCloseRight", function () {
            _IFACE.onCloseAll();
        });
        $("body").off("click", ".btnInvite").on("click", ".btnInvite", function () {
            _FACEBOOK.invite();
        });
        $("body").off("click", ".btnCloseExternal").on("click", ".btnCloseExternal", function () {
            _IFACE.onCloseExternal();
        });
        $("body").off("click", ".btnCloseMessages").on("click", ".btnCloseMessages", function () {
            _IFACE.onCloseMessages();
        });
        $("body").off("click", ".btnLogin").on("click", ".btnLogin", function () {
            _FACEBOOK.login();
        });
        $("body").off("click", ".btnLoginAnonym").on("click", ".btnLoginAnonym", function () {
            _ACTIONS.onLoginSuccess(_DEFAULT_ANON_USER);
        });
        $("body").off("click", ".btnReconnect").on("click", ".btnReconnect", function () {
            _ACTIONS.onReload();
        });
        $("body").off("click", ".btnSedeTrack").on("click", ".btnSedeTrack", function () {
            _ACTIONS.onTrackSede();
        });
        $("body").off("click", ".btnMeTrack").on("click", ".btnMeTrack", function () {
            _ACTIONS.onTrackMe();
        });
        $("body").off("click", ".btnRoutes").on("click", ".btnRoutes", function () {
            _ACTIONS.onPlaceRoutes(_OBJ);
        });
        $("body").off("click", ".btnDetails").on("click", ".btnDetails", function () {
            _ACTIONS.onPlaceDetails(_OBJ);
        });
        $("body").off("click", ".send-message").on("click", ".send-message", function () {
            _IFACE.onSendMessage(null, 1, null);
        });
        $("body").off("click", ".img-place").on("click", ".img-place", function () {
            _IFACE.onSelectImage($(this));
        });
        $("body").off("click", ".btnItem").on("click", ".btnItem", function () {
            _IFACE.onOpenItem($(this));
        });
        $("body").off("click", ".btnOpenMessages").on("click", ".btnOpenMessages", function () {
            _IFACE.onOpenMessages($(this));
        });
        $("body").off("click", ".btnMoreMessages").on("click", ".btnMoreMessages", function (event) {
            _IFACE.onPageMessages(null);
        });
        $("body").off("click", ".btnModeRoute").on("click", ".btnModeRoute", function () {
            _IFACE.onModeRoute($(this));
        });
        $("body").off("click", ".btnSearchPlaces").on("click", ".btnSearchPlaces", function () {
            _ACTIONS.onSearchPlaces($(this));
        });
        $("body").off("click", ".btnBlogOpen").on("click", ".btnBlogOpen", function () {
            _ACTIONS.onShowBlog();
        });
        $("body").off("click", ".btnToggleItemBlog").on("click", ".btnToggleItemBlog", function () {
            _ACTIONS.onToggleItemBlog($(this));
        });
        $("body").off("click", ".btnBlogClose").on("click", ".btnBlogClose", function () {
            _ACTIONS.onHideBlog();
        });
        $("body").off("click", ".btnUp").on("click", ".btnUp", function () {
            _IFACE.onFullDetails();
        });
        $("body").off("click", ".btnDown").on("click", ".btnDown", function () {
            _IFACE.onShowMapFooter();
        });
        $("body").off("change", ".cboFacultades").on("change", ".cboFacultades", function () {
            _ACTIONS.onSelectFacultades();
        });
        $("body").off("keyup", ".search").on("keyup", ".search", function (event) {
            _ACTIONS.onSearchAddress($(this), event);
        });
        $("body").off("keyup", ".search-friends").on("keyup", ".search-friends", function (event) {
            _ACTIONS.onFilterFriends($(this));
        });
        $("body").off("keyup", ".message").on("keyup", ".message", function (event) {
            _IFACE.onSendMessage(null, 1, event);
        });
        $("body").off("focus", ".message").on("focus", ".message", function () {
            _IFACE.onShowKeyboard();
        });
        $("body").off("blur", ".message").on("blur", ".message", function () {
            _IFACE.onHideKeyboard();
        });
        $("body").off("blur", ".search").on("blur", ".search", function (event) {
            _ACTIONS.onSearchAddress($(this), null);
        });

        _ACTIONS.onCheckConnection(function (data) {
            if (data) {
                _ACTIONS.onLoadAllApps(function () {
                    _ACTIONS.onActionsInit();
                });
            };
        });
    }
    function onDeviceReady() {
        $.getScript("js/fixed/DB.js", function (data, textStatus, jqxhr) {
            $.getScript("js/fixed/AJAX.js", function (data, textStatus, jqxhr) {
                $.getScript("js/fixed/TOOLS.js", function (data, textStatus, jqxhr) {
                    $.getScript("js/fixed/ACTIONS.js", function (data, textStatus, jqxhr) {
                        $.getScript("js/fixed/IFACE.js", function (data, textStatus, jqxhr) {
                            $.getScript("js/fixed/FACEBOOK.js", function (data, textStatus, jqxhr) {
                                onInit();
                            });
                        });
                    });
                });
            });
        });
    };
})();
