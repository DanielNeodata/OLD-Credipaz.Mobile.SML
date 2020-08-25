var _AJAX = {
    server: _API_SERVER,
    Activate: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/Activate",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    Deactivate: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/Deactivate",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    License: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/License",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    Authenticate: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/Authenticate",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    Login: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/Login",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    Logout: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/Logout",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiExport: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiExport",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlain: function (_json, _callBackOk, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlain",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiBrow: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiBrow",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiEdit: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiEdit",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiSave: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiSave",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiRemove: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiRemove",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiStatus: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiStatus",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiTelemetry: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiTelemetry",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiDirections: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiDirections",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlaces: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlaces",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlacesMim: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlacesMim",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlacesUrl: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlacesUrl",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlaceDelete: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlaceDelete",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlaceSave: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlaceSave",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlaceReverse: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlaceReverse",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiFriendsStatus: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiFriendsStatus",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiMyStatus: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiMyStatus",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiPlaceDetails: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiPlaceDetails",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiMessageSend: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiMessageSend",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiMessagesGet: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiMessagesGet",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiMessagesUnread: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiMessagesUnread",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiCheckUser: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiCheckUser",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiUnread: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiUnread",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiUrlExists: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiUrlExists",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiAppDetail: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiAppDetail",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiMenuByUser: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiMenuByUser",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },
    UiTokenFireCloud: function (_json, _callBackOk, _callBackDeny, _callBackError) {
        _AJAX.ExecuteDirect(_json, "api.v1/UiTokenFireCloud",
            function (data) { if ($.isFunction(_callBackOk)) { _callBackOk(data); } },
            function (data) { if ($.isFunction(_callBackDeny)) { _callBackDeny(data); } },
            function (data) { if ($.isFunction(_callBackError)) { _callBackError(data); } }
            );
    },

    ExecuteDirect: function (_json, _method, _callBackOk, _callBackDeny, _callBackError) {
        try {
            _json["method"] = _method;
            _AJAX.Execute(_json, function (datajson) {
                if (datajson.status != undefined) {
                    if (datajson.status == "AK" || datajson.status == "OK") {
                        if ($.isFunction(_callBackOk)) { _callBackOk(datajson); }
                    } else {
                        if ($.isFunction(_callBackDeny)) { _callBackDeny(datajson); }
                    }
                } else {
                    if ($.isFunction(_callBackOk)) { _callBackOk(datajson); }
                }
            });
        } catch (rex) {
            if ($.isFunction(_callBackError)) { _callBackError(rex); }
        }
    },
    Execute: function (_json, _callBackOk, _callBackError) {
        _json["id_user"] = _ID_USER;
        _json["id_app"] = _ID_APP;
        _json["id_group"] = _ID_GROUP;
        _json["language"] = _LANGUAGE;
        _json["valid_token"] = _USERDATA['accesstoken'];
        var _tmp = JSON.stringify(_json);
        var ajaxRq = $.ajax({
            type: "POST",
            dataType: "json",
            url: (_AJAX.server + _json.method),
            data: _json,
            beforeSend: function () { },
            error: function (xhr, ajaxOptions, thrownError) { if ($.isFunction(_callBackError)) { _callBackError(thrownError); }; },
            success: function (datajson) {
                //alert(_tmp + " " + JSON.stringify(datajson));
                if (datajson == null) {
                    datajson = { "results": null };
                    if ($.isFunction(_callBackOk)) { _callBackOk(datajson); };
                } else {
                    if (datajson.compressed == null) { datajson.compressed = false; }
                    if (datajson.compressed == undefined) { datajson.compressed = false; }
                    if (datajson != null && datajson.compressed) {
                        var zip = new JSZip();
                        JSZip.loadAsync(atob(datajson.message)).then(function (zip) {
                            zip.file("compressed.tmp").async("string").then(
                                function success(content) {
                                    datajson.message = content;
                                    if ($.isFunction(_callBackOk)) { _callBackOk(datajson); };
                                },
                                function error(err) {
                                    if ($.isFunction(_callBackError)) { _callBackError(err); };
                                });
                        });
                    } else {
                        if ($.isFunction(_callBackOk)) { _callBackOk(datajson); };
                    }
                }
            }
        });
    },
    Load: function (_file, _callBackOk, _callBackError) {
        var ajaxRq = $.ajax({
            type: "GET",
            timeout: 10000,
            dataType: "html",
            async: false,
            cache: false,
            url: _file,
            success: function (data) {
                if ($.isFunction(_callBackOk)) { _callBackOk(data); };
            },
            error: function (xhr, msg) {
                if ($.isFunction(_callBackError)) { _callBackError(msg); };
            }
        });
    },
};
