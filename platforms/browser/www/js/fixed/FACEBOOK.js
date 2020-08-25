var _FACEBOOK = {
    login: function () {
        _ACTIONS.onSelectFacultades(function () {
            _ACTIONS.onHideLogin();
            try {
                if (window.cordova.platformId == "browser") {
                    var appId = _FACEBOOKAPPID;
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login(_FACEBOOKPERMISSIONS, _ACTIONS.onLoginSuccess, _ACTIONS.onDisplayResponse);
            } catch (err) {
                if (!_REMOTE_MODE) {
                    _ACTIONS.onLoginSuccess(_DEFAULT_TEST_USER);
                } else {
                    _ACTIONS.onDisplayResponse({ "message": "Falla en login.  Reintente #0" + err.message });
                }
            }
        });
    },
    logout: function () {
        _ACTIONS.onShowLogin(function (json) {
            try {
                facebookConnectPlugin.logout(_ACTIONS.onLogoutSuccess, null);
            } catch (err) {
                if (!_REMOTE_MODE) {
                    _ACTIONS.onLogoutSuccess(null);
                } else {
                    _ACTIONS.onDisplayResponse({ "message": "Falla en logout.  Reintente #0" });
                }
            }
            _IFACE.onCloseLeft();
        });
    },
    showDialog: function () {
        facebookConnectPlugin.showDialog({ method: "feed" },
            _ACTIONS.onDisplayResponse,
            _ACTIONS.onDisplayResponse);
    },
    apiTest: function () {
        facebookConnectPlugin.api("me/?fields=id,email", _FACEBOOKPERMISSIONS,
            _ACTIONS.onDisplayResponse,
            _ACTIONS.onDisplayResponse);
    },
    getAccessToken: function () {
        facebookConnectPlugin.getAccessToken(
            _ACTIONS.onDisplayResponse,
            _ACTIONS.onDisplayResponse);
    },
    getStatus: function () {
        facebookConnectPlugin.getLoginStatus(
            _ACTIONS.onDisplayResponse,
            _ACTIONS.onDisplayResponse);
    },
    invite: function () {
        try {
            facebookConnectPlugin.appInvite(
                {
                    url: _APP_INVITE_URL,
                    picture: "logo.png"
                },
                function (obj) {
                    if (obj) {
                        if (obj.completionGesture == "cancel") {
                            // user canceled, bad guy 
                        } else {
                            // user really invited someone :) 
                        }
                    } else {
                        // user just pressed done, bad guy 
                    }
                },
                function (obj) {
                    // error 
                    console.log(obj);
                }
            );
        } catch (rex) { }
    },
};
