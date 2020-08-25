var _AJAX = {
    _telemetry: true,
    server: "https://intranet.credipaz.com/",
    //server: "http://localhost:1100/",
    _user_active: null,
    _ready: false,
    _compiled: true,
    _here: (window.location.protocol + "//" + window.location.host + "/"),
    _remote_mode: (typeof window.parent.ripple === "undefined"),
    _id_root : "appSML",
    _id_app : 6,
    _id_group : 0,
    _id_language: "es",
    _API_KEY: "",
    formatFixedParameters: function (_json) {
        try {
            _json["force"] = "force";
            _json["uid"] = 0;
        } catch (rex) {
            _json["uid"] = 0;
            _json["accessToken"] = "";
        }
        _json["id_credipaz"] = _FUNCTIONS._id_credipaz;
        _json["id_root"] = _AJAX._id_root;
        _json["id_app"] = _AJAX._id_app;
        _json["id_group"] = _AJAX._id_group;
        _json["language"] = _AJAX._id_language;
        _json["api_key"] = _AJAX._API_KEY;
        _json["id_user_active"] = _FUNCTIONS._auth_user_data.id;
        if (_FUNCTIONS._session_data != null) {
            _json["id_club_redondo"] = _FUNCTIONS._session_data.ClubRedondo;
            _json["codPersona"] = _FUNCTIONS._auth_user_data.codPersona;
        } else {
            _json["id_club_redondo"] = 0;
            _json["codPersona"] = 0;
        }
        if (_GMAP._TRACK_POSITION != null) {
            if (_GMAP._TRACK_POSITION.lat == undefined) { _GMAP._TRACK_POSITION.lat = 0; }
            if (_GMAP._TRACK_POSITION.lng == undefined) { _GMAP._TRACK_POSITION.lng = 0; }
            _json["lat"] = _GMAP._TRACK_POSITION.lat;
            _json["lng"] = _GMAP._TRACK_POSITION.lng;
        } else {
            _json["lat"] = 0;
            _json["lng"] = 0;
        }
        if (_json["exit"] == undefined) { _json["exit"] = "output"; } //download
        if (_json["mime"] == undefined) { _json["mime"] = "application/json"; } // "text/xml" or other (must be supported)
        if (_json["function"] == undefined) { _json["function"] = ""; }
        if (_json["model"] == undefined) { _json["model"] = ""; }
        if (_json["method"] == undefined) { _json["method"] = "api.backend/neocommand"; }
        return _json;
    },
    initialize: function (_user_model) {
        if (_AJAX._remote_mode) { if (!_AJAX._compiled && _AJAX._here.indexOf("localhost")) { _AJAX.server = _AJAX._here; } }
        if (_AJAX._user_active == null) { _AJAX._user_active = _user_model; }
        _AJAX._ready = true;
    },

    UiAuthenticateMobile: function (_param) {
        return new Promise(
            function (resolve, reject) {
                _param["module"] = "mod_backend";
                _param["table"] = "users";
                _param["model"] = "users";
                _param["function"] = "authenticateMobile";
                _AJAX.ExecuteDirect(_param, null).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
    },
    UiRestoreMobile: function (_param) {
        return new Promise(
            function (resolve, reject) {
                _param["module"] = "mod_club_redondo";
                _param["table"] = "external_sml";
                _param["model"] = "external_sml";
                _param["function"] = "restorePassword";
                _AJAX.ExecuteDirect(_param, null).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
    },
    UiNewPasswordMobile: function (_param) {
        return new Promise(
            function (resolve, reject) {
                _param["module"] = "mod_club_redondo";
                _param["table"] = "external_sml";
                _param["model"] = "external_sml";
                _param["function"] = "newPassword";
                _AJAX.ExecuteDirect(_param, null).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
    },
    UiUrlExists: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_backend";
                _json["table"] = "external";
                _json["model"] = "external";
                _json["function"] = "urlExists";
                _AJAX.ExecuteDirect(_json, "api.v1.wproxy/UiSysComm").then(function (data) {
                    resolve(data);
                }).catch(function (err) { reject(err); });
            });
    },
    UiGet: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["function"] = "get";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiSave: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["function"] = "save";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiDelete: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["function"] = "delete";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiTelemetry: function (_json) {
        return new Promise(
            function (resolve, reject) {
                if (_AJAX._telemetry) {
                    _AJAX._telemetry = false;
                    if (_json["module"] == undefined) { _json["module"] = "mod_backend"; }
                    if (_json["table"] == undefined) { _json["table"] = "telemetry"; }
                    if (_json["model"] == undefined) { _json["model"] = "telemetry"; }
                    if (_json["function"] == undefined) { _json["function"] = "save"; }
                    _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
                } else {
                    resolve(null);
                }
            });
    },
    UiGetWebPosts: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_web_posts";
                _json["table"] = "web_posts";
                _json["model"] = "web_posts";
                _json["function"] = "get";
                _json["where"] = ("id=" + _json["id"]);
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiGetTypeCategories: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiTransformedImage: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_backend";
                _json["table"] = "external";
                _json["model"] = "external";
                _json["function"] = "getTransformedImage";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiGetUserCredipazJelper: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_backend";
                _json["table"] = "external";
                _json["model"] = "external";
                _json["function"] = "getUserCredipazJelper";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiLogGeneral: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["method"] = "api.backend/logGeneral";
                _json["module"] = "mod_backend";
                _AJAX._waiter = true;
                _AJAX.ExecuteDirect(_json, null).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
    },
   
    UiApplicationMobileFunction: function (_json) {
        return new Promise(
            function (resolve, reject) {
                //log ACTIONS
                //_AJAX.UiLogGeneral({ "id": "0", "code": "APP-CLUBREDONDO", "description": "UiApplicationMobileFunction", "id_user": _FUNCTIONS._auth_user_data.id, "action": "applicationMobileFunction", "trace": _JSON.data_function, "id_rel": "0", "table_rel": "" })
                _json["module"] = "mod_backend";
                _json["table"] = "external";
                _json["model"] = "external";
                _json["function"] = "applicationMobileFunction";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiGetCupons: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_club_redondo";
                _json["table"] = "beneficios";
                _json["model"] = "beneficios";
                _json["function"] = "getCupons";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },
    UiGetImage: function (_json) {
        return new Promise(
            function (resolve, reject) {
                _json["module"] = "mod_club_redondo";
                _json["table"] = "beneficios";
                _json["model"] = "beneficios";
                _json["function"] = "getImage";
                _AJAX.ExecuteDirect(_json, null).then(function (data) { resolve(data); }).catch(function (err) { reject(err); });
            });
    },

    ExecuteDirect: function (_json, _method) {
        return new Promise(
            function (resolve, reject) {
                try {
                    if (_json["method"] != undefined && _json["method"] != null) { _json["method"] = _method; }
                    _AJAX.Execute(_json).then(function (datajson) {
                        if (datajson.status != undefined) {
                            if (datajson.status == "OK" || datajson.status == "OK") {
                                resolve(datajson);
                            } else {
                                if (parseInt(datajson.code) == -1) {
                                    $(".splash").remove();
                                    $(".login").remove();
                                    $(".main").remove();
                                    $(".deprecated").removeClass("hidden").fadeIn("fast");
                                }
                                reject(datajson);
                            }
                        } else {
                            resolve(datajson);
                        }
                    });
                } catch (rex) {
                    reject(rex);
                }
            });
    },
    Execute: function (_json) {
        return new Promise(
            function (resolve, reject) {
                try {
                    if (!_AJAX._ready) { _AJAX.initialize(null); }
                    var _tmp = JSON.stringify(_AJAX.formatFixedParameters(_json));
                    var ajaxRq = $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: (_AJAX.server + _json.method),
                        data: _json,
                        beforeSend: function () { },
                        error: function (xhr, ajaxOptions, thrownError) {
                            reject(thrownError);
                        },
                        success: function (datajson) {
                            if (datajson == null) {
                                datajson = { "results": null };
                                resolve(datajson);
                            } else {
                                if (datajson.compressed == null) { datajson.compressed = false; }
                                if (datajson.compressed == undefined) { datajson.compressed = false; }
                                if (datajson != null && datajson.compressed) {
                                    var zip = new JSZip();
                                    JSZip.loadAsync(_TOOLS.b64_to_utf8(datajson.message)).then(function (zip) {
                                        zip.file("compressed.tmp").async("string").then(
                                            function success(content) {
                                                datajson.message = content;
                                                resolve(datajson);
                                            },
                                            function error(err) { reject(err); });
                                    });
                                } else {
                                    resolve(datajson);
                                }
                            }
                        }
                    });
                } catch (rex) {
                    reject(rex);
                }
            }
        )
    },
    Load: function (_file) {
        return new Promise(
            function (resolve, reject) {
                var ajaxRq = $.ajax({
                    type: "GET",
                    timeout: 10000,
                    dataType: "html",
                    async: false,
                    cache: false,
                    url: _file,
                    success: function (data) { resolve(data); },
                    error: function (xhr, msg) { reject(msg); }
                });
            });
    },
};
