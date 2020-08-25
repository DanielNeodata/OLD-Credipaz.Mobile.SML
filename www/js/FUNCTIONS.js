var _FUNCTIONS = {
    _last_category: null,
    _logged: false,
    _SMSTimer: 0,
    _QRVerify: "https://www.jelper.com.ar",
    _QRLaser: 0,
    _credencial: null,
    _avoidChangeStatus: false,
    _modoFull: true, //false
    _verificated: false,
    _id_credipaz: 0,
    _id_solicitud: 0,
    _nombre: "",
    _viable: 0,
    _objSucursales: null,
    _noScroll: false,
    _resolving: false,
    _auth_user_data: { "id": 0, "esTitular": null, "estado": null, "nroCuenta": null, "codPersona": "", "fechaInicio": null },
    _session_data: { "DNI": null, "ApellidoNombre": null, "PANClub": null, "ClubRedondo": null, "id_credipaz": null },
    _last_index: "",
    _last_area: "",
    _last_filter: "",
    connected: _TOOLS.observable(true),
    onDestroyModal: function (_target) {
        $(_target).remove();
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
    },

    onCheckConnection: function () {
        return new Promise(
            function (resolve, reject) {
                var _ret = true;
                var _json = {};
                _json["connected"] = _ret;
                _json["error"] = null;
                try {
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
                        _json["connected"] = true;
                        _FUNCTIONS.connected(_json["connected"]);
                        resolve(_json);
                    } catch (err) {
                        var _params = { "url": (_AJAX.server + "favicon.ico") };
                        _AJAX.UiUrlExists(_params).then(function (datajson) {
                            _json["connected"] = datajson.connected;
                            _FUNCTIONS.connected(_json["connected"]);
                            resolve(_json);
                        });
                    }
                } catch (rex) {
                    _json["connected"] = false;
                    _FUNCTIONS.connected(_json["connected"]);
                    _json["error"] = rex;
                    reject(_json);
                }
            }
        )
    },
    onClickLogin: function (_this) {
        var _mode = _this.attr("data-provider");
        switch (_mode) {
            case "jelper":
                if (!_TOOLS.validate(".validateLogin")) { return false; };
                _FUNCTIONS.onAuthentication(_TOOLS.getFormValues(".dbaseLogin"));
                break;
            case "forget":
                _AJAX.Load("./fragments/forget_password.html").then(function (data) {
                    $("body").append(data);
                    $.material.init();
                    $("#modal_forget_password").modal({ "show": true, "keyboard": false, "backdrop": "static" });
                    $("#modal_forget_password").on('hidden.bs.modal', function () { });
                });
                break;
            case "quit":
                _AJAX.Load("./fragments/verify_out.html").then(function (data) {
                    $("body").append(data);
                    $.material.init();
                    $("#modal_verify_out").modal({ "show": true, "keyboard": false, "backdrop": "static" });
                    $("#modal_verify_out").on('hidden.bs.modal', function () { });
                });
                break;
        }
    },
    onAuthentication: function (_json) {
        if (_json != null) {
            var _stored = JSON.stringify(_json);
            _AJAX.UiAuthenticateMobile(_json)
                .then(function (data) {
                    if (data.status == "OK") {
                        _FUNCTIONS._auth_user_data = data.userdata;
                        if (_FUNCTIONS._auth_user_data.estado == "activo") {
                            window.localStorage.setItem("JELPER_credentials", _stored);
                            // Ir contra servicio de autenticacion Credipaz, para devolver el session state
                            _FUNCTIONS.onGetUserCredipazJelper();
                        }
                    } else {
                        _FUNCTIONS.onLogout(false);
                        modalAlert("", data.message);
                    }
                })
                .catch(function (err) {
                    modalAlert("", err.message);
                });
        } else {
            _FUNCTIONS.onInitializeViewport();
        }
    },
    onLogout: function (_exit) {
        _FUNCTIONS._logged = false;
        if (_exit) {
            if ($("#chkRecordarme").prop("checked") !== true) { window.localStorage.removeItem("JELPER_credentials"); }
            try {
                cordova.plugins.exit();
            } catch (rex) {
                window.location.href = "index.html";
            }
        } else {
            window.localStorage.removeItem("JELPER_credentials");
            _FUNCTIONS.onShowLogin();
        }
    },
    onSetupInterface: function () {
        return new Promise(
            function (resolve, reject) {
                try {
                    $(".label-sign").html("");
                    $(".waitNav").addClass("hidden");
                    $(".b-menu").removeClass("hidden");
                    if (_FUNCTIONS._session_data.ApellidoNombre == null) { _FUNCTIONS._session_data.ApellidoNombre = ""; }
                    if (typeof (_FUNCTIONS._session_data.ApellidoNombre) == "undefined") { _FUNCTIONS._session_data.ApellidoNombre = ""; }
                    var _name = _FUNCTIONS._session_data.ApellidoNombre;
                    if (_name.indexOf(",") > -1) { _name = _name.split(",")[1]; }
                    _name = _name.trim();
                    if (_name.indexOf(" ") > -1) { _name = _name.split(' ')[0]; }
                    if (_name != "") {
                        $(".apellido-nombre").html("Hola, " + _name);
                        if (_name.toUpperCase() == "PENDIENTE") { $(".apellido-nombre").html("Bienvenido"); }
                    }
                    if (_FUNCTIONS._session_data.CREDENCIALClub == undefined) { _FUNCTIONS._session_data.CREDENCIALClub = 0; }
                    if (_FUNCTIONS._session_data.NombreCredencial == undefined) { _FUNCTIONS._session_data.NombreCredencial = ""; }
                    if (_FUNCTIONS._session_data.PANClub == undefined) { _FUNCTIONS._session_data.PANClub = 0; }
                    if (_FUNCTIONS._session_data.ClubRedondo == undefined) { _FUNCTIONS._session_data.ClubRedondo = 0; }
                    if (!_FUNCTIONS._logged) {
                        $(".notloged").removeClass("hidden");
                        $(".loged").addClass("hidden");
                        $(".nosocio").removeClass("hidden");
                    } else {
                        $(".loged").removeClass("hidden");
                        $(".notloged").addClass("hidden");
                        if (_FUNCTIONS._session_data.ClubRedondo == 0) {
                            $(".nosocio").removeClass("hidden");
                            $(".socio").addClass("hidden");
                        } else {
                            $(".nosocio").addClass("hidden");
                            $(".socio").removeClass("hidden");
                        }
                    }
                    $(".btnInicio").click();
                    resolve(null);
                } catch (err) {
                    reject(err);
                }
            });
    },
    onGetUserCredipazJelper: function () {
        try {
            $(".waitNav").removeClass("hidden");
            _AJAX.UiGetUserCredipazJelper({ "IdExternal": _FUNCTIONS._auth_user_data.codPersona })
                .then(function (data) {
                    _FUNCTIONS._session_data = data.message;
                    _FUNCTIONS._logged = true;
                    _FUNCTIONS.onInitializeViewport();
                    _AJAX.UiTransformedImage(
                        {
                            "tipo_credencial": _FUNCTIONS._session_data.CREDENCIALClub,
                            "file": "credencial-jelper",
                            "overtext1": _FUNCTIONS._session_data.DNI,
                            "overtext2": _FUNCTIONS._session_data.NombreCredencial
                        }).then(function (data) {
                            _FUNCTIONS._credencial = (data.mime + "," + data.message);
                            $(".img-credencial").attr("src", _FUNCTIONS._credencial).removeClass("hidden");
                            _FUNCTIONS.onOrientationChange();
                            $.material.init();
                        });
                    _FUNCTIONS._nombre = _FUNCTIONS._session_data.ApellidoNombre;
                })
                .catch(function (data) {
                    //console.log(data);
                });
        } catch (rex) {
            modalAlert("", "GetUserCredipazJelper " + rex);
        }
    },
    onInitializeViewport: function () {
        _FUNCTIONS.onShowMain();
        _FUNCTIONS.onSetupInterface();
    },
    onShowNewPassword: function (_this) {
        _AJAX.Load("./fragments/newpassword.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_newpassword").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_newpassword").on('hidden.bs.modal', function () { });
        });
    },
    onShowLogin: function () {
        $(".page").hide();
        $(".splash").fadeIn("fast");
        $(".modal-backdrop").remove();
        $(".dbaseLogin").val("");
        $("#login").fadeIn(250, function () { $("#splash").fadeOut(100); });
    },
    onShowMain: function () {
        _FUNCTIONS._verificated = true;
        $(".waitForm").addClass("hidden");
        $("#splash").remove();
        $(".page").hide();
        $("#main").show();
        $(".inicio").show();
        $(".navbar-toggle").removeClass("hidden");
        $(".logForm").removeClass("hidden");
    },

    onReinit: function (_this) {
        $(".children-categories").html("");
        $(".search-controls").hide();
        $(".categorias-control").fadeIn("slow").removeClass("hidden");
    },
    onResolverInicio: function (_this) {
        $("#coords").val("");
        var _type = _this.attr("data-type");
        switch (_type) {
            case "asistencia":
                _FUNCTIONS.onVerCategoria($("<button class='btnArea btn-menu-subcategoria' data-id='-129' data-parent='-128' data-code='asistencia' data-description='Asistencia financiera'></button>"));
                break;
            case "seguro":
                _FUNCTIONS.onVerCategoria($("<button class='btnArea btn-menu-subcategoria' data-id='-130' data-parent='-128' data-code='seguro' data-description='Seguro'></button>"));
                break;
            case "farmacia":
                _FUNCTIONS.onVerCategoria($("<button class='btnArea' data-id='-125' data-code='farmacia' data-description='Farmacias'></button>"));
                break;
            case "cines":
                _FUNCTIONS.onVerCategoria($("<button class='btnArea' data-id='-99' data-code='cines' data-description='Cines'></button>"));
                break;
            case "categorias":
                $(".menu-inicio").fadeOut().addClass("hidden");
                $(".categorias-control").hide().removeClass("hidden").fadeIn("slow");
                var _top = ($(".full-primary").height() - 250);
                $(".carousel-indicators").css({ "position": "absolute", "top": _top + "px" });
                $(".carousel-control").css({ "position": "absolute", "top": _top + "px" });
                $(".inner-categorias").css({ "min-height": _top + "px", "height": _top + "px" });
                break;
        }
    },
    onClickAreaItem: function (_this) {
        $(".login").hide();
        clearInterval(_FUNCTIONS._timerInitForced);
        _FUNCTIONS.onClickNavItem();
        $(".alert-general").addClass("hidden");
        var _data_hide = _this.attr("data-hide");
        var _data_area = _this.attr("data-area");
        if (_FUNCTIONS._last_area != _data_area) { _FUNCTIONS._last_area = _data_area; }
        $(".area").css({ "top": "100px" });
        $(".area").hide();
        $(_data_area).show().css({ "top": "100px" });
        switch (_data_hide) {
            case "yes":
                _FUNCTIONS._noScroll = true;
                break;
            case "no":
                _FUNCTIONS._noScroll = false;
                break;
        }
        switch (_data_area) {
            case ".inicio":
                _FUNCTIONS.onShowMain();
                break;
        }
        //log ACTIONS
        _AJAX.UiLogGeneral({ "id": "0", "code": "APP-SML", "description": "onClickAreaItem", "id_user": _FUNCTIONS._auth_user_data.id, "action": "onClickAreaItem", "trace": _data_area, "id_rel": "0", "table_rel": "" });
    },
    onClickToggleMenu: function (_this) {
        if ($(".mainmenu").hasClass("hidden")) {
            //log ACTIONS
            _AJAX.UiLogGeneral({ "id": "0", "code": "APP-SML", "description": "onClickToggleMenu", "id_user": _FUNCTIONS._auth_user_data.id, "action": "onClickToggleMenu", "trace": "OPEN", "id_rel": "0", "table_rel": "" })
            $(_FUNCTIONS._last_area).animate({ "opacity": 0, "left": "1000px", "position": "absolute" }, 350, function () { });
            $(".mainmenu").css({ "opacity": 0, "left": "-500px", "position": "absolute" }).removeClass("hidden");
            $(".mainmenu").animate({ "opacity": 1, "left": "-30px", "position": "relative" }, 350, function () { });
        } else {
            //log ACTIONS
            _AJAX.UiLogGeneral({ "id": "0", "code": "APP-SML", "description": "onClickToggleMenu", "id_user": _FUNCTIONS._auth_user_data.id, "action": "onClickToggleMenu", "trace": "CLOSE", "id_rel": "0", "table_rel": "" })
            $(_FUNCTIONS._last_area).animate({ "opacity": 1, "left": "0px", "position": "relative" }, 350, function () { });
            $(".mainmenu").animate({ "opacity": 0, "left": "-500px", "position": "absolute" }, 350, function () {
                $(".mainmenu").addClass("hidden")
            });
        }
    },
    onClickNavItem: function (_this) {
        $(".list-beneficios").show();
        $(".area-cupon").addClass("hidden");
        if (!$(".mainmenu").hasClass("hidden")) { $(".btnMenu").trigger("click"); }
    },
    onLoadFrame: function (_area, _callBack) {
        _AJAX.Load("./fragments/" + _area + ".html").then(function (data) {
            //log ACTIONS
            //_AJAX.UiLogGeneral({ "id": "0", "code": "APP-CLUBREDONDO", "description": "onLoadFrame", "id_user": _FUNCTIONS._auth_user_data.id, "action": "onLoadFrame", "trace": _area, "id_rel": "0", "table_rel": "" })
            $("." + _area).html(data);
            $.material.init();
            if ($.isFunction(_callBack)) { _callBack(); }
        });
    },
    onLoadInnerFrames: function () {
        return new Promise(
            function (resolve, reject) {
                try {
                    _FUNCTIONS.onLoadFrame("navigation", function () {
                        _FUNCTIONS.onLoadFrame("disconnected", function () {
                            _FUNCTIONS.onLoadFrame("deprecated", function () {
                                _FUNCTIONS.onLoadFrame("datospersonales", function () {
                                    _FUNCTIONS.onLoadFrame("verbeneficios", function () {
                                        _FUNCTIONS.onLoadFrame("ticket", function () { });
                                        _FUNCTIONS.onLoadFrame("ticketshistorial", function () {
                                            _FUNCTIONS.onLoadFrame("ticketshistorial", function () {
                                                _FUNCTIONS.onLoadFrame("add_adherir_jelper", function () {
                                                    _FUNCTIONS.onInitializeViewport();
                                                    _FUNCTIONS.onLoadFrame("inicio", function () {
                                                        var _json = {
                                                            "module": "mod_club_redondo",
                                                            "table": "type_categories",
                                                            "model": "type_categories",
                                                            "function": "getMobile",
                                                            "order": ("priority ASC")
                                                        };
                                                        _AJAX.UiGetTypeCategories(_json).then(
                                                            function (data) {
                                                                _FUNCTIONS.onBuildTypeCategories(data, ".categorias-control");
                                                            }
                                                        ).catch(function (err) {
                                                            modalAlert("", err);
                                                        })
                                                    });
                                                });
                                                resolve(null);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                } catch (err) {
                    reject(err);
                }
            });
    },
    onReplaceImgPath: function (data) {
        var _html = data;
        return _html.replace(/assets/g, _AJAX.server + "assets");
    },
    onCleanCodes: function (_code) {
        _code = _code.replace(/ /g, '-');
        _code = _code.replace(/á/g, 'a');
        _code = _code.replace(/é/g, 'e');
        _code = _code.replace(/í/g, 'i');
        _code = _code.replace(/ó/g, 'o');
        _code = _code.replace(/ú/g, 'u');
        _code = _code.replace(/ñ/g, 'n');
        _code = _code.replace(/Ñ/g, 'N');
        return _code;
    },
    onBuildTypeCategories: function (data, _target) {
        //maximo por pagina original, para paginar
        //var _maxPerPage = 8;
        //$(_target + " .right").show();
        //$(_target + " .left").show();
        //$(_target + " .carousel-indicators").show();
        //var _widthTable = "85%";

        //control de one page!
        var _maxPerPage = 36;
        $(_target + " .right").hide();
        $(_target + " .left").hide();
        $(_target + " .carousel-indicators").hide();
        var _widthTable = "100%";

        var _maxPerLine = 2;
        var _indicators = "";
        var _items = "";
        var _occur = 0;
        var _active = "";
        var _page = 0;
        var _open = false;
        var _iter = 0;
        var _new = true;
        $.each(data.data, function (i, obj) {
            var _class = "card-categoria";
            obj.code = _FUNCTIONS.onCleanCodes(obj.code);
            switch (obj.code.toLowerCase()) {
                case "sorteos":
                    _class = "btnSorteos";
                    break;
            }
            if (i == 0) { _active = "active"; } else { _active = ""; }
            switch (_iter) {
                case 0:
                    _items += "<div class='item " + _active + "'>";
                    //Items forzados al incio de la lista!
                    if (_new) {
                        _new = false;
                        _items += "<table style='width:" + _widthTable + ";' align='center'>";
                        _items += "   <tr>";
                        _items += "      <td style='width:33%;padding:5px;' align='center'>";
                        _items += "         <a href='tel:08002221441'>";
                        _items += "            <img src='img/categories/emergencias.png' style='width:100%;'/>";
                        _items += "         </a>";
                        _items += "      </td>";
                        _items += "      <td style='width:33%;padding:5px;' align='center'>";
                        _items += "         <button class='btn-resolve-inicio' data-type='farmacia' style='background-color:transparent;border:solid 0px white;padding:0px;margin:0px;'><img src='./img/categories/farmacias.png' style='width:100%;'/></button>";
                        _items += "      </td>";
                        _items += "      <td style='width:33%;padding:5px;' align='center'>";
                        _items += "         <button class='" + _class + "' style='border:solid 0px white;background-color:transparent;padding:0px;margin:0px;' data-id='-126' data-parent='-1' data-code='atencion' data-description='Atención médica'><img src='./img/categories/atencion.png' style='width:100%;'/></button>";
                        _items += "      </td>";
                        _items += "   </tr>";
                        _items += "</table>";
                    }
                    _items += "<table style='width:" + _widthTable + ";' align='center'>";
                    _items += "<tr>";
                    _open = true;
                    break;
                case 3:
                    _items += "</tr>";
                    _items += "<tr>";
                    _open = true;
                    break;
            }
            _items += "<td style='width:33%;padding:5px;' align='center'>";
            _items += "   <button class='" + _class + "' style='border:solid 0px white;background-color:transparent;padding:0px;margin:0px;' data-id='" + obj.id + "' data-parent='0' data-code='" + obj.code.toLowerCase() + "' data-description='" + obj.description + "'><img src='./img/categories/" + obj.code.toLowerCase() + ".png' style='width:100%;'/></button>";
            _items += "</td>";
            if (_occur == _maxPerPage) {
                _items += "</tr>";
                _items += "</table>";
                _items += "</div>";
                _open = false;
            }
            if (_occur == 0) {
                _indicators += "<li data-target='#carouselInicio' data-slide-to='" + _page + "' class='" + _active + "'></li>";
                _page += 1;
            }
            _occur += 1;
            _iter += 1;
            if (_occur > _maxPerPage) { _occur = 0; }
            if (_iter > _maxPerLine) { _iter = 0; }
        });

        if (_open) {
            for (a = (_occur - 1); a <= _maxPerPage; a++) { _items += "<td style='width:33%;' align='center'><img src='./img/transparent.gif' style='width:100%;'/></td>"; }
            _items += "</tr>";
            _items += "</table>";
            _items += "</div>";
        }
        $(_target + " .carousel-indicators").html(_indicators);
        $(_target + " .carousel-inner").html(_items).css("padding-bottom", "20px");

        $(_target).carousel({ interval: false });
    },
    onBuildSorteos: function (data, _target) {
        var _json = _FUNCTIONS.onReplaceImgPath(data.data[0].body_post);
        _json = _json.replace("<p>", "");
        _json = _json.replace("</p>", "");
        _json = JSON.parse(_json);
        var _indicators = "";
        var _items = "";
        var _class = "";
        var _padding_bottom = "0px";
        if (_json.timer == undefined) { _json.timer = 5; }
        switch (_json.modo) {
            case "carousel":
                $.each(_json.items, function (i, obj) {
                    var _active = "";
                    if (i == 0) { _active = "active"; }
                    _items += "<div class='item " + _active + "'>";
                    if (obj.link != undefined && obj.link != "") { _items += "<a href='" + obj.link + "' target='_blank'>"; }
                    _items += "<img class='shadow img-thumbnail' src='" + obj.image + "' />";
                    if (obj.link != undefined && obj.link != "") { _items += "</a>"; }
                    if (obj.description != "") {
                        _padding_bottom = "0px";
                        _items += "  <div class='" + _class + " ' style='margin-top:10px;text-align:center;'>";
                        if (obj.link != undefined && obj.link != "") {
                            _items += "    <a href='#' data-sorteo='" + obj.link + "' class='btn-comun btn-participar-sorteo'>" + obj.description + "</a>";
                        } else {
                            _items += "<span class='btn-magenta' style='color:black;font-size:18px;'>" + obj.description + "</span>";
                        }
                        _items += "  </div>";
                    }
                    _items += "</div>";
                    _indicators += "<li data-target='" + _target + "' data-slide-to='" + i + "' class='" + _active + "'></li>";
                });
                $(_target + " .carousel-indicators").html(_indicators);
                $(_target + " .carousel-inner").html(_items).css("padding-bottom", _padding_bottom);
                $(_target).carousel({ swipe: 30 });
                $(".carousel-indicators").hide();
                $(".carousel-control").hide();
                break;
            case "redirect":
                $.each(_json.items, function (i, obj) {
                    _items += "<table style='width:100%;'>";
                    _items += "<tr><td align='center' style='padding-top:1px;'><a href='#' onClick='" + _FUNCTIONS.openExternalLink(obj.link) + "'><img src='" + obj.image + "' style='width:100%;'/></a></td></tr>";
                    _items += "<table>";
                });
                $(_target).remove();
                $(_target).carousel({ swipe: 30 });
                break;
        }
    },

    onModalFamiliares: function (selectId, _add) {
        try {
            var _title = "Nuevo familiar";
            var _placeholder = "Ingrese nuevo valor...";
            if (!_add) {
                _title = "Modificar familiar";
                _placeholder = "Modifique el valor...";
            }
            _FUNCTIONS.onDestroyModal("#familiarModal");
            var _html = "<div class='modal fade' id='familiarModal' role='dialog'>";
            _html += " <div class='modal-dialog modal-dialog-centered' role='document'>";
            _html += "  <div class='modal-content'>";
            _html += "    <div class='modal-header'>";
            _html += "      <h2 class='modal-title'>" + _title + "</h2>";
            _html += "    </div>";
            _html += "    <div class='modal-body'>";
            _html += "       <table style='width:100%;'>";
            _html += "          <tr><td><input type='text' class='form-control validateAddFamiliar dbasefamiliar IntegranteApellido' id='IntegranteApellido' name='IntegranteApellido' placeholder='Apellido' /></td></tr>";
            _html += "          <tr><td><input type='text' class='form-control validateAddFamiliar dbasefamiliar IntegranteNombre' id='IntegranteNombre' name='IntegranteNombre' placeholder='Nombre' /></td></tr>";
            _html += "          <tr><td><input type='date' class='form-control date validateAddFamiliar dbasefamiliar IntegranteFechaNacimiento' id='IntegranteFechaNacimiento' name='IntegranteFechaNacimiento' placeholder='Fecha de nacimiento' /></td></tr>";
            _html += "          <tr><td>";
            _html += "              <select class='form-control validateAddFamiliar dbasefamiliar IntegranteSexo' id='IntegranteSexo' name='IntegranteSexo'>";
            _html += "                  <option value='-1' selected>[Sexo]</option>";
            _html += "                  <option value='F'>Femenino</option>";
            _html += "                  <option value='M'>Masculino</option>";
            _html += "              </select>";
            _html += "          </td></tr>";
            _html += "          <tr>";
            _html += "             <td>";
            _html += "                <select class='form-control validateAddFamiliar dbasefamiliar IntegranteTipoDocumento' id='IntegranteTipoDocumento' name='IntegranteTipoDocumento'>";
            _html += "                   <option value='-1' selected>[Tipo documento]</option>";
            _html += "                   <option value='89'>LE";
            _html += "                   <option value='90'>LC</option>";
            _html += "                   <option value='94'>PASAPORTE</option>";
            _html += "                   <option value='96'>DNI</option>";
            _html += "                   <option value='97'>DNI extranjero</option>";
            _html += "                </select>";
            _html += "             </td>";
            _html += "          </tr>";
            _html += "          <tr>";
            _html += "             <td>";
            _html += "                <input type='number' class='form-control number validateAddFamiliar dbasefamiliar IntegranteNroDocumento' id='IntegranteNroDocumento' name='IntegranteNroDocumento' placeholder='Nº de documento' />";
            _html += "             </td>";
            _html += "          </tr>";
            _html += "          <tr>";
            _html += "             <td>";
            _html += "                <select class='form-control validateAddFamiliar dbasefamiliar IntegranteVinculo' id='IntegranteVinculo' name='IntegranteVinculo'>";
            _html += "                   <option value='-1' selected>[Vínculo]</option>";
            _html += "                   <option value='2'>CONYUGE</option>";
            _html += "                   <option value='3'>HIJO / A</option>";
            _html += "                   <option value='4'>OTROS</option>";
            _html += "                   <option value='5'>HIJO POLITICO / A</option>";
            _html += "                   <option value='6'>NIETO / A</option>";
            _html += "                   <option value='7'>MADRE</option>";
            _html += "                   <option value='8'>SOBRINO / A</option>";
            _html += "                   <option value='9'>OTROS FAMILIARES</option>";
            _html += "                   <option value='10'>MADRE POLITICA</option>";
            _html += "                   <option value='11'>FAMILIAR CON CAPACIDADES DIF.</option>";
            _html += "                   <option value='12'>PERSONA A CARGO HASTA 18 AÑOS</option>";
            _html += "                   <option value='14'>PADRE</option>";
            _html += "                </select>";
            _html += "             </td>";
            _html += "          </tr>";
            _html += "          <tr>";
            _html += "             <td>";
            _html += "                <input type='number' class='form-control number dbasefamiliar IntegranteEmail' id='IntegranteEmail' name='IntegranteEmail' placeholder='Email' />";
            _html += "             </td>";
            _html += "          </tr>";
            _html += "       </table>";
            _html += "    </div>";
            _html += "    <div class='modal-footer font-weight-light'>";
            _html += "       <button type='button' class='btn-raised btn-cancel-familiar btn btn-danger btn-sm'><i class='material-icons'>not_interested</i></span>Cancelar</button>";
            _html += "       <button type='button' class='btn-raised btn-accept-familiar btn btn-success btn-sm'><i class='material-icons'>done</i></span>Aceptar</button>";
            _html += "    </div>";
            _html += "  </div>";
            _html += " </div>";
            _html += "</div>";
            $("body").append(_html);
            $("body").off("click", ".btn-clear-familiar").on("click", ".btn-clear-familiar", function () {
                if (!confirm("Se eliminará este familiar.  ¿Confirma?")) { return false; }
                if ($("." + $(this).attr("data-uuid")).attr("data-status") == "add") {
                    $("." + $(this).attr("data-uuid")).remove();
                } else {
                    $("." + $(this).attr("data-uuid")).attr("data-status", "del").fadeOut("slow");
                }
            });
            $("body").off("click", ".btn-cancel-familiar").on("click", ".btn-cancel-familiar", function () {
                _FUNCTIONS.onDestroyModal("#familiarModal");
            });
            $("body").off("click", ".btn-accept-familiar").on("click", ".btn-accept-familiar", function () {
                if (!_TOOLS.validate(".validateAddFamiliar")) { return false; };
                var _json = _TOOLS.getFormValues(".dbasefamiliar");
                var _apenom = $("#IntegranteApellido").val() + ", " + $("#IntegranteNombre").val();
                var _vinculo = $("#IntegranteVinculo option:selected").text();
                var _uuid = _TOOLS.UUID();
                $("." + selectId).append("<li class='" + _uuid + " list-group-item item-familiar' data-status='add' data-record='" + _TOOLS.utf8_to_b64(JSON.stringify(_json)) + "'>" + _apenom + " <span class='badge bage-info'>" + _vinculo + "</span> <a href='#' data-target='ls-familiares' data-uuid='" + _uuid + "' class='btn btn-danger btn-xs btn-clear-familiar'><span class='material-icons'>clear</span></a></li>");
            });
            $("#familiarModal").modal({ backdrop: false, keyboard: true, show: true });
            return true;
        } catch (rex) {
            modalAlert("", rex.message);
            return false;
        }
    },
    onSaveAltaJelper: function (_this) {
        if (!$("#chkTerminosJelper").prop("checked") || $("#chkTerminosJelper").prop("checked") == undefined) { modalAlert("", "Debe aceptar los términos y condiciones"); return false; }
        if (!_TOOLS.validate(".validateAddJelper")) { return false; };
        _this.fadeOut("fast");
        $(".waitNav").removeClass("hidden");
        var _json = _TOOLS.getFormValues(".dbaseadherir");
        _json["data_function"] = "alta-comercial-jelper";
        var _records = [];
        $(".item-familiar").each(function () { _records.push(JSON.parse(_TOOLS.b64_to_utf8($(this).attr("data-record")))); });
        _json["GrupoIntegrante"] = _records;
        _AJAX.UiApplicationMobileFunction(_json).then(function (data) {
            if (data.message.message.CuentaSts != "Err") {
                modalAlert("", "Se ha procesado su pedido de adhesión.  Cuenta Nº " + data.message.message.CuentaNro);
                _FUNCTIONS.onDestroyModal("#familiarModal");
            } else {
                var _err = "";
                $.each(data.message.message.Errores, function (i, obj) { _err += obj.ErrorDescripcion + "\n"; });
                modalAlert("", _err);
            }
            _this.fadeIn("fast");
            $(".waitNav").addClass("hidden");
        }).catch(function (err) {
            modalAlert("", "ERR " + JSON.stringify(err));
            _this.fadeIn("fast");
        });
    },

    onActionModal: function (_this) {
        var _close = false;
        var _data_modal = _this.attr("data-modal");
        var _data_action = _this.attr("data-action");
        switch (_data_modal) {
            case "modal_newpassword":
                _close = true;
                switch (_data_action) {
                    case "save":
                        if (!_TOOLS.validate(".validateNewPassword")) { return false; };
                        var _json = _TOOLS.getFormValues(".dbaseNewPassword");
                        if (_json["new_password"] != _json["repeat_password"]) { modalAlert("", "La nueva contraseña y su confirmación no coinciden"); return false; }
                        var passw = /^(?=(?:.*?[0-9]){2})(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
                        if (!_json["new_password"].match(passw)) {modalAlert("", "La nueva contraseña debe contener al menos dos números, una letra mayúscula y una minúscula, con una longitud de al menos 6 caracteres"); return false;}
                        _AJAX.UiNewPasswordMobile(_json).then(function (data) {
                            if (data.status == "OK") {
                                modalAlert("", "La contraseña ha sido cambiada con éxito");
                                _FUNCTIONS.onLogout(false);
                            } else {
                                modalAlert("", "No se ha podido efectuar el cambio de contraseña");
                            }
                        }).catch(function (err) {
                            modalAlert("", "ERR " + JSON.stringify(err));
                        });
                        break;
                    case "drop":
                        _close = true;
                        break;
                }
                break;
            case "modal_verify_out":
                _close = true;
                switch (_data_action) {
                    case "save":
                        _FUNCTIONS.onLogout(true);
                        break;
                    case "drop":
                        break;
                }
                break;
            case "modal_terminos":
                _close = true;
                switch (_data_action) {
                    case "save":
                        $("#chkTerminosJelper").prop("checked", true);
                        $("#chkTerminosJelper").prop("checked", true);
                        break;
                    case "drop":
                        $("#chkTerminosJelper").prop("checked", false);
                        $("#chkTerminosJelper").prop("checked", false);
                        break;
                }
                break;
            case "modal_forget_password":
                switch (_data_action) {
                    case "save":
                        if (!_TOOLS.validate(".validateRecover")) { return false; };
                        _this.fadeOut("fast");
                        var _json = _TOOLS.getFormValues(".dbaseRecover");
                        _AJAX.UiRestoreMobile(_json).then(function (data) {
                            console.log(data);
                            if (data.status == "OK") {
                                $(".recover-in").addClass("hidden");
                                $(".recover-out").removeClass("hidden");
                                if (data.respuesta == "ERROR") {
                                    $(".modal-title").html("<h1>No se ha generado la contraseña</h1>");
                                    $(".modal-body").html("<div class='well text-center' style='padding:10px;boder:solid 2px #445bc1'><h1 style='color:#445bc1;'>El usuario ingresado no es válido</h1></div>");
                                } else {
                                    $(".modal-title").html("<h1>Nueva contraseña generada</h1>");
                                    $(".modal-body").html("<div class='well text-center' style='padding:10px;boder:solid 2px #445bc1'><h1 style='color:#445bc1;'>Se le ha enviado un email con la nueva clave</h1></div>");
                                }
                                _this.show();
                            } else {
                                throw data;
                            }
                        }).catch(function (err) {
                            _this.show();
                            modalAlert("", "ERR " + JSON.stringify(err));
                        });
                        break;
                    case "drop":
                        _close = true;
                        break;
                }
                break;
            default:
                _close = true;
                switch (_data_action) {
                    case "drop":
                        break;
                }
                break;
        }
        if (_close) {
            $("#" + _data_modal).modal("hide").remove();
            $(".modal-backdrop").remove();
        }
    },
    onAlert: function (_json) {
        $(".push-alert").remove();
        var _html = "<div class='push-alert alert " + _json["class"] + " alert-dismissible show' role='alert' style='position:fixed;left:0px;top:80px;width:100%;'>";
        _html += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>";
        _html += "<span aria-hidden='true'>&times;</span>";
        _html += "</button>";
        _html += _json["message"];
        _html += "</div>";
        $("body").append(_html);
    },
    onAlertGeneral: function (_json) {
        if (_json.text.indexOf("Error") == "-1") {
            $(".alert-general").removeClass("alert-danger").addClass("alert-success");
        } else {
            $(".alert-general").removeClass("alert-success").addClass("alert-danger");
        }
        $(".alert-general h4").html(_json.title);
        $(".alert-general p").html(_json.text).css({ "color": "white" });
        $(".alert-general").removeClass("hidden");
        setTimeout(function () { $(".alert-general").addClass("hidden"); }, 15000);
    },
    onVerTerminosYCondiciones: function (_this) {
        _AJAX.Load("./fragments/terminos.html").then(function (data) {
            $("body").append(data);
            _FUNCTIONS.onGetWebPosts({ "id": 10 }).then(function (data) {
                $("#modal_terminos .modal-body").html(_FUNCTIONS.onReplaceImgPath(data.data[0].body_post));
                $("#modal_terminos").modal({ "show": true, "keyboard": false, "backdrop": "static" });
                $("#modal_terminos").on('hidden.bs.modal', function () { });
            });
        });
    },
    openExternalLink: function (_url) {
        window.open(_url, '_system', 'location=yes');
    },
    onRefreshListBeneficios: function () {
        switch ($("#mode_categoria").val()) {
            case "categoria":
                _FUNCTIONS.onVerCategoria(null);
                break;
            case "buscar":
                _FUNCTIONS.onSearchBeneficios(null);
                break;
        }
    },
    onCercaMio: function (_this) {
        var _json = {
            "title_categoria": "Cerca mío",
            "img_categoria": "img/cercamio-inverse.png",
            "code_categoria": "",
            "type_categoria": "",
            "mode_categoria": "cercamio",
            "class_categoria": "back-buscar",
            "search": "",
            "coords": $("#coords").val(),
            "near": 1,
            "parent": "0",
        };
        _FUNCTIONS.onFilterCupons(_json);
    },
    onSearchBeneficios: function (_this) {
        var _search = $("#txt_search").val();
        if (_search == undefined) { _search = $(".coords").val(); }
        if (_search == undefined) { _search = ""; }
        var _json = {
            "title_categoria": "...búsqueda personalizada",
            "img_categoria": "img/lupa-inverse.png",
            "code_categoria": "",
            "type_categoria": "",
            "mode_categoria": "buscar",
            "description_categoria": "",
            "class_categoria": "back-buscar",
            "search": _search,
            "coords": $("#coords").val(),
            "near": $("#cercamio").val(),
            "parent": "0",
        };
        _FUNCTIONS.onFilterCupons(_json);
    },
    onVerCategoria: function (_this) {
        if (_this == null) { _this = _FUNCTIONS._last_category; }
        _FUNCTIONS._last_category = _this;
        var _id = 0;
        var _code = "";
        var _description = "";
        var _is_sub = false;
        if (_this != null) { _is_sub = _this.hasClass("btn-menu-subcategoria"); }
        if (_this == null) {
            _id = $("#type_categoria").val();
            _code = $("#code_categoria").val();
            _description = $("#description_categoria").val();
        } else {
            _id = _this.attr("data-id");
            _code = _this.attr("data-code").toLowerCase();
            _description = _this.attr("data-description");
        }
        var _class = _code;
        _class = _FUNCTIONS.onCleanCodes(_class);
        var _json = {
            "title_categoria": _description,
            "img_categoria": "img/categories/" + _code + "-i.png",
            "code_categoria": _code,
            "type_categoria": _id,
            "mode_categoria": "categoria",
            "description_categoria": _description,
            "class_categoria": "back-" + _class,
            "search": "",
            "coords": $("#coords").val(),
            "near": $("#cercamio").val(),
            "parent": _id,
            "is_sub": _is_sub,
        };
        _FUNCTIONS.onFilterCupons(_json);
    },
    onVerMisCupones: function (_this) {
        var _json = {
            "title_categoria": "Mis cupones",
            "img_categoria": "img/categories/otros-i.png",
            "code_categoria": "",
            "type_categoria": "",
            "mode_categoria": "miscupones",
            "description_categoria": "",
            "class_categoria": "back-buscar",
        };
        _FUNCTIONS.onFilterCupons(_json);
        $(".btnClose_modal_solicitar_beneficio").click();
        $(".cerrarVentanaCupon").click();
    },
    onFilterCupons: function (_json) {
        setTimeout(function () { $(".idle-search").removeClass("hidden"); }, 1);
        $(".children-categories").html("");
        $(".search-controls").hide();
        $(".list-beneficios").html("").hide();
        $("#code_categoria").val(_json.code_categoria);
        $("#description_categoria").val(_json.description_categoria);
        $("#type_categoria").val(_json.type_categoria);
        $("#mode_categoria").val(_json.mode_categoria);
        $("#classCategoria").removeClass();
        $(".img-categoria").attr("src", _json.img_categoria);
        var _descCat = _json.title_categoria.toUpperCase();
        if (_descCat == "ACOMPAÑANTE TERAPEUTICO") { _descCat = "ACOMP. TEREAPEUTICO"; }
        $(".title-categoria").html(_descCat);
        $(".title-categoria").css({ "color": "white" });
        if (_json.is_sub) {
            $(".title-categoria").css({ "color": "" });
            _json.class_categoria = _json.class_categoria.replace("back", "sub");
            _json.class_categoria += " sub-abstract";
        }
        $("#classCategoria").addClass(_json.class_categoria);
        $(".list-beneficios").css({ "width": "100%", "overflow": "auto", "height": "calc(100% - 190px)" });
        _json["lat"] = _GMAP._TRACK_POSITION.lat;
        _json["lng"] = _GMAP._TRACK_POSITION.lng;
        $("#showmap").prop("checked", false);
        _AJAX.UiGetCupons(_json).then(function (data) {
            if (data.status == "OK") {
                //Reset marks in maps
                for (var i = 0; i < _GMAP.markers.length; i++) { _GMAP.markers[i].setMap(null); }

                var _show_controls = false;
                var _children_categories = "";
                if (data.child_categories != null) {
                    $.each(data.child_categories.data, function (i, obj) {
                        obj.code = _FUNCTIONS.onCleanCodes(obj.code);
                        /*Botones de subcategorias! Cambiar el style de acuerdo al color de cada grupo!*/
                        var _style = "";
                        _class_look = "btn-menu-subcategoria sub-abstract sub-" + obj.code.toLowerCase();
                        _children_categories += "<button style='" + _style + "' data-parent='" + _json.parent + "' data-id='" + obj.id + "' data-code='" + obj.code.toLowerCase() + "' data-description='" + obj.description + "' class='card-categoria " + _class_look + " btn-resolve-inicio' data-type='" + obj.code.toLowerCase() + "'>";
                        _children_categories += "   <img src='img/categories/" + obj.code.toLowerCase() + "-i.png' class='img-menu pull-left' />";
                        var _desc = obj.description.toUpperCase();
                        if (_desc == "ACOMPAÑANTE TERAPEUTICO") {_desc = "ACOMP. TEREAPEUTICO";}
                        _children_categories += "   <span class='txt-menu-sub'>" + _desc + "</span>";
                        _children_categories += "</button>";
                    });
                }
                $(".children-categories").html(_children_categories);
                if (_children_categories == "") {
                    _GMAP.onCreateMap();
                    var _h = $("#area-footer").position().top - (50 * 6);
                    $("#map").css("height", _h + "px");
                    $(".search-controls").show();
                }
                var _html = "<ul class='list-group'>";
                $.each(data.message.data, function (i, obj) {
                    var _hidden = ""; 
                    var _itemColor = "transparent";
                    var _action = "btnVerCupon";
                    var _distance = "";
                    var _canjeado = "";
                    var _image = "";
                    var _image_apaisada = "";
                    var _address = "";
                    var _kms = Math.round((obj.kms + Number.EPSILON) * 100) / 100;
                    if (typeof (obj.id_canje) == "undefined") { obj.id_canje = 0; }
                    if (typeof (obj.verification) == "undefined") { obj.verification = ""; }
                    if (obj.id_canje != 0) { _action = "btnReimprimirCupon"; }
                    if (_json.mode_categoria == "miscupones") { _hidden = "hidden"; }
                    _image = obj.image;
                    if (_image == "null" || _image == null || _image == "") { _image = "img/categories/" + _json.code_categoria + ".png"; }
                    _image_apaisada = obj.image_apaisada;
                    if (_image_apaisada == "null" || _image_apaisada == null || _image_apaisada == "") { _image_apaisada = "img/categories/" + _json.code_categoria + ".png"; }
                    if (obj.amount == "null" || obj.amount == null) { obj.amount = ""; }
                    if (obj.description == "null" || obj.description == null || obj.description == "S/D") { obj.description = ""; }
                    if (obj.address == "null" || obj.address == null || obj.address == "S/D" || obj.address == "") { obj.address = ""; }
                    _address = obj.address;
                    if (obj.neighborhood == "null" || obj.neighborhood == null || obj.neighborhood == "S/D" || obj.neighborhood == "") { obj.neighborhood = ""; }
                    if (_address != "") { _address += ", "; };
                    _address += obj.neighborhood;
                    if (!isNaN(_kms) && _json.mode_categoria != "miscupones") {
                        if (_kms < 0) {
                            var _meters = (_kms * 1000);
                            _distance = " a <b>" + _meters + " mts</b>, de tu vos";
                        } else {
                            _distance = " a <b>" + _kms + " kms</b>, de vos";
                        }
                    } else {
                        _address = "";
                        _distance = "";
                        switch (parseInt(obj.id_type_status_canje)) {
                            case 1:
                                _canjeado = "<span class='label label-warning'>¡Hacé click para usarlo!</span> <span class='label label-info'>Canjeado el " + obj.date_canje + "</span>";
                                break;
                            case 2:
                                _canjeado = "<span class='label label-success'>¡Ya utilizaste este cupón el " + obj.date_fum + "!</span>";
                                break;
                            case 3:
                                _action = "";
                                _itemColor = "silver";
                                _canjeado = "<span class='label label-danger'>¡Este cupón ha vencido el " + obj.date_fum + "!</span> <span class='label label-info'>No podés usar este cupón</span>";
                                break;
                        }
                    }
                    _html += "<li style='border:solid 0px silver;background-color:" + _itemColor + ";padding:15px;'>";
                    _html += " <button class='item-cupon-" + obj.id + " item-cupon " + _action + "' data-img-ref='img-" + obj.id + "' data-record='" + _TOOLS.utf8_to_b64(JSON.stringify(obj)) + "' style='padding:7px;width:100%;height:100%;border-radius:25px 25px 25px 25px;background-color:white; '>";
                    _html += " <table style='width:100%;background-color:transparent;'>";
                    _html += "   <tr class='" + _hidden + "'>";
                    _html += "      <td valign='top' style='width:50%;' align='left'>";
                    if (_image != "") { _html += "<img src='placeholder.png' class='img-loader img-" + obj.id + "' data-load='" + _image + "' style='width:100%;border-radius:5px;'/>"; }
                    _html += "      </td>";
                    _html += "      <td valign='middle' style='width:25%;' align='center' style='padding-left:10px;'><span class='badge' style='font-size:20px;background-color:rgb(235, 0, 139);'>" + _TOOLS.stripHtml(obj.amount) + "</span></td>";
                    _html += "   </tr>";

                    if (obj.description != "null" || obj.description != null || obj.description != "") {
                        _html += "<tr>";
                        _html += "   <td colspan='3' valign='top' style='padding:0px;padding-top:5px;'><b>" + obj.description + "</b></td>";
                        _html += "</tr>";
                    }
                    if (obj.sinopsys != "null" || obj.sinopsys != null || obj.sinopsys != "") {
                        _html += "<tr class='" + _hidden + "'><td colspan='3' valign='top' style='padding:0px;padding-top:5px;'>" + obj.sinopsys + "</td></tr>";
                    }
                    if (_canjeado != "") {
                        _html += "<tr><td colspan='3' style='padding-bottom:10px;padding-top:20px;'>" + _canjeado + "</td></tr>";
                    } else {
                        if (_address != "" || (obj.lat != "0" && obj.lng != "0")) {
                            _html += "<tr>";
                            _html += "   <td colspan='3' style='padding-left:0px;' align='right'>";
                            _html += "      <i style='font-size:12px;'>";
                            if (_address != "") { _html += _address; }
                            if (obj.lat != "0" && obj.lng != "0") { _html += _distance; }
                            _html += "      </i>";
                            _html += "   </td>";
                            _html += "</tr>";
                        }
                    }
                    _html += " </table>";
                    _html += "</button>";
                    _html += "</li>";
                    if (obj.lat != "0" && obj.lng != "0") {
                        var _size = { width: 30, height: 36 };
                        var latLng = new google.maps.LatLng(obj.lat, obj.lng);
                        var _icon = { url: ("./markers/sml.png"), scaledSize: new google.maps.Size(_size.width, _size.height) };
                        var _class = "";//"no-marker-label";
                        var _content = "";
                        if (obj.description != "null" || obj.description != null || obj.description != "") { _content = obj.description; }
                        var marker = new MarkerWithLabel(
                            {
                                position: latLng,
                                animation: google.maps.Animation.DROP,
                                draggable: false,
                                map: _GMAP.map,
                                icon: _icon,
                                title: _content,
                                labelContent: _content,
                                labelAnchor: new google.maps.Point(-5, 5),
                                labelClass: _class,
                                labelInBackground: true
                            });
                        _GMAP.markers.push(marker);
                        marker.addListener('click', function (event) {
                            $(".item-cupon-" + obj.id).click();
                        });
                    }
                    _show_controls = true;
                });
                _html += "</ul>";
                if (_show_controls) {
                    switch (_json.mode_categoria) {
                        case "miscupones":
                        case "cercamio":
                            $(".search-controls").hide();
                            break;
                        default:
                            $(".search-controls").show();
                    }
                    switch (_json.code_categoria) {
                        case "asistencia":
                        case "seguro":
                            $(".search-controls").hide();
                            break;
                    }
                }
                $(".wait-canje").addClass("hidden");
                $(".mapaBeneficios").hide();
                $(".list-beneficios").html(_html).show();

                document.getElementById("listBeneficios").onscroll = function () { _FUNCTIONS.onLoadImagesInScreen(".img-loader"); };
                setTimeout(function () { _FUNCTIONS.onLoadImagesInScreen(".img-loader"); }, 100);
                $(".idle-search").addClass("hidden");
                $(".btnCerrarModalBuscar").click();
            }
        }).catch(function (err) {
            $(".list-beneficios").hide();
            $(".mapaBeneficios").hide();
            $(".btnCerrarModalBuscar").click();
            modalAlert("", "ERR " + JSON.stringify(err));
        });
        _FUNCTIONS.onClickAreaItem($("<a href='#' class='btnArea' data-hide='yes' data-area='.verbeneficios'></a>"));
    },
    onToggleNearMe: function (_this) {
        if (_this.is(':checked')) {
            $("#cercamio").val("1");
            $("#coords").val("");
            $("#coords").fadeOut("fast");
        } else {
            $("#cercamio").val("0");
            $("#coords").fadeIn("fast");
        }
        _FUNCTIONS.onRefreshListBeneficios();
    },
    onToggleShowMap: function (_this) {
        if (_this.is(':checked')) {
            $("#listBeneficios").hide();
            $("#mapaBeneficios").show();
        } else {
            $("#mapaBeneficios").hide();
            $("#listBeneficios").show();
        }
    },
    onBuscarWindows: function (_this) {
        _AJAX.Load("./fragments/verbuscar.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_buscar").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_buscar").on('hidden.bs.modal', function () { });
        });
    },
    onCredencialVirtual: function (_this) {
        _AJAX.Load("./fragments/vercredencial.html").then(function (data) {
            $("body").append(data);
            $(".footer-credencial").addClass("hidden");
            $(".img-credencial").attr("src", _FUNCTIONS._credencial).removeClass("hidden");
            _FUNCTIONS.onOrientationChange();
            $.material.init();
            $("#modal_credencial").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_credencial").on('hidden.bs.modal', function () { });
        });
    },
    onSorteos: function (_this) {
        if (_FUNCTIONS._session_data.ClubRedondo == 0) {
            $(".btnInicio").click();
            _FUNCTIONS.onAdherirJelper(null);
        } else {
            _AJAX.Load("./fragments/versorteos.html").then(function (data) {
                $("body").append(data);
                _FUNCTIONS.onGetWebPosts({ "id": 9 }).then(
                    function (data) {
                        _FUNCTIONS.onBuildSorteos(data, "#carouselSorteos");
                        $.material.init();
                        $("#modal_sorteos").modal({ "show": true, "keyboard": false, "backdrop": "static" });
                        $("#modal_sorteos").on('hidden.bs.modal', function () { });
                    });
            });
        }
    },
    onAcercaDe: function (_this) {
        _AJAX.Load("./fragments/veracercade.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_acercade").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_acercade").on('hidden.bs.modal', function () { });
        });
    },
    onDatosPersonales: function (_this) {
        _AJAX.Load("./fragments/verdatospersonales.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_datos_personales").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_datos_personales").on('hidden.bs.modal', function () { });
        });
    },
    onMisCupones: function (_this) {
        $(".btnClose_modal_ok").click();
        _AJAX.Load("./fragments/vermiscupones.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_miscupones").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_miscupones").on('hidden.bs.modal', function () { });
        });
    },
    onAdherirJelper: function (_this) {
        _FUNCTIONS.onClickAreaItem($("<a href='#' class='btnArea' data-hide='yes' data-area='.add_adherir_jelper'></a>"));
    },
    onGetWebPosts: function (_json) {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _records = [];
                    _AJAX.UiGetWebPosts(_json)
                        .then(function (data) {
                            $.each(data.data, function (i, msg) {
                                _records.push(JSON.stringify(msg));
                            });
                            resolve(data);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                } catch (rex) {
                    modalAlert("", "GLOBAL " + JSON.stringify(rex));
                    reject(rex);
                }
            })
    },
    onSendTelemetry: function (position) {
        var _json_telemetry = {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude,
            "altitude": position.coords.altitude,
            "accuracy": position.coords.accuracy,
            "heading": position.coords.heading,
            "speed": position.coords.speed,
            "timestamp": position.coords.timestamp
        }
        var _json = { "json_message": JSON.stringify(_json_telemetry) }
        _AJAX.UiTelemetry(_json)
            .then(function (data) { })
            .catch(function (err) { });
    },
    onSetUserWelcome: function (_name) {
        var _mr = "Bienvenida, ";
        switch (_FUNCTIONS._auth_user_data.sex) {
            case "M":
                _mr = "Bienvenido, ";
                break;
        }
        $(".btnUser").html(_mr + _name);
    },
    onToggleSecret: function (_this, _target) {
        _this.toggleClass("fa-eye fa-eye-slash");
        var input = $(_target);
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    },
    onCloseAlert: function (_this) {
        $(".alert").addClass("hidden");
    },
    onOrientationChange: function (_this) {
        var orientation = window.orientation % 180 === 0 ? 'portrait' : 'landscape'
        switch (orientation) {
            case "portrait":
                $(".header-credencial").css({ "height": "100%", "width": "" });
                $(".img-credencial").css({ "height": "", "width": "100%" });
                break;
            case "landscape":
                $(".header-credencial").css({ "height": window.innerHeight + "px", "width": "" });
                $(".img-credencial").css({ "height": "calc(100% - 50px)", "width": "" });
                break;
        }
    },
    onScreenCapture: function (_this) {
        $(".noshare").hide();
        navigator.screenshot.save(function (error, res) {
            $(".noshare").show();
            if (error) {
                _FUNCTIONS.onAlertGeneral({ "title": "", "text": "ERROR: No se ha podido realizar la captura de imagen" });
            } else {
                _FUNCTIONS.onAlertGeneral({ "title": "", "text": "La imagen se ha guardado en " + res.filePath });
            }
        }, 'jpg', 50, _this.attr("data-name"));
    },
    onScreenCaptureAndShare: function (_this) {
        $(".noshare").hide();
        navigator.screenshot.save(function (error, res) {
            $(".noshare").show();
            if (error) {
                _FUNCTIONS.onAlertGeneral({ "title": "", "text": "ERROR: No se ha podido realizar la captura de imagen" });
            } else {
                var imageLink = res.filePath;
                switch (_TOOLS.getPlatform()) {
                    case "Android":
                        window.plugins.socialsharing.share(null, null, 'file://' + imageLink, null);
                        break;
                    default: //For iOS
                        window.plugins.socialsharing.share(null, null, imageLink, null)
                        break;
                }
            }
        }, 'jpg', 50, 'JelperCupon');
    },
    onShare: function (_this) {
        window.plugins.socialsharing.share(
            _this.attr("data-message"),
            _this.attr("data-subject"),
            $("." + _this.attr("data-img")).attr("src"),
            _this.attr("data-link")
        );
    },
    onCompartir: function (_this) {
        _AJAX.Load("./fragments/vercompartir.html").then(function (data) {
            $("body").append(data);
            $.material.init();
            $("#modal_compartir").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_compartir").on('hidden.bs.modal', function () { });
        });
    },
    onParticiparSorteos: function (_this) {
        var _json = _TOOLS.getFormValues(".dbaseadherir");
        _json["data_function"] = "participar-sorteo";
        _AJAX.UiApplicationMobileFunction(_json).then(function (data) {
            if (data.status == "OK") {
                _FUNCTIONS.onAlertGeneral({ "title": "Se ha procesado su pedido", "text": data.message });
            }
            _this.fadeIn("fast");
        }).catch(function (err) {
            modalAlert("", "ERR " + JSON.stringify(err));
            _this.fadeIn("fast");
        });
    },
    onCloseBeneficio: function (_this) {
        $(".full-verbeneficios").css({ "opacity": 0, "left": "-1000px", "position": "relative" });
        $(".full-verbeneficios").animate({ "opacity": 1, "left": "0px", "position": "relative" }, 350, function () {
            $(".full-verbeneficios").show();
        });
        $(".area-cupon").animate({ "opacity": 0, "left": "-1000px", "position": "relative" }, 350, function () {
            $(".area-cupon").hide().html("").addClass("hidden");
        });
    },
    onVerCupon: function (_this) {
        var _title_action = "Solicitar beneficio";
        var _class_action = "btnSolicitarBeneficio";
        var _image = $("." + _this.attr("data-img-ref")).attr("src");
        $(".area-cupon").html("").hide();
        var obj = JSON.parse(_TOOLS.b64_to_utf8(_this.attr("data-record")));
        var _html = "<button type='button' class='close xcloseBeneficio btnActionModal cerrarVentanaCupon' data-modal='modal_canje' data-action='drop' style='font-size:28px;position:absolute;right:15px;top:15px;opacity:0.75;'>x</button>";

        _html += "<table style='width:100%;color:grey;'>";
        _html += "   <tr>";
        _html += "      <td valign='middle' style='width:100%;padding-top:3px;' align='center'>";
        _html += "         <img src='" + _image + "' style='width:100%;'/>";
        _html += "      </td>";
        _html += "   </tr>";
        _html += "</table>";
        switch (obj.id_type_category) {
            case -129: // asistencia financiera
                _title_action = "Solicitar asistencia financiera";
                _class_action = "btnSolicitarAsistencia";
                break;
            case -130: // seguro por enfermedad
                _title_action = "Solicitar seguro";
                _class_action = "btnSolicitarSeguro";
                break;
            default:
                break;
        }

        _html += "<table style='width:100%;color:grey;'>";
        _html += "   <tr>";
        _html += "      <td align='center' style='padding-top:5px;'>";
        _html += "          <b style='color:black;font-size:16px;'>" + obj.description + "</b>";
        _html += "      </td>";
        _html += "   </tr>";
        if (obj.sinopsys != "null" && obj.sinopsys != null || obj.sinopsys != "") {
            _html += "<tr>";
            _html += "   <td align='center'>" + obj.sinopsys + "</td>";
            _html += "</tr>";
        }
        //if (obj.legales != "null" && obj.legales != null && obj.legales != "") {
        //    _html += "   <tr>";
        //    _html += "      <td align='center'>" + obj.legales + "</td>";
        //    _html += "   </tr>";
        //}
        _html += "</table>";

        _html += "<table style='width:80%;margin-top:10px;' align='center'>";
        _html += "   <tr>";
        _html += "      <td valign='middle' style='width:100%;' align='center'>";
        _html += "         <a href='#' id='" + _class_action + "' class='btn-comun " + _class_action + "'>" + _title_action + "</a>";
        _html += "      </td>";
        _html += "   </tr>";
        _html += "</table>";

        _html += "<input type='hidden' id='id_canje' name='id_canje' value='" + obj.id_canje + "'/>";
        _html += "<input type='hidden' id='id_beneficio' name='id_beneficio' value='" + obj.id + "'/>";
        _html += "<input type='hidden' id='type_beneficio' name='id_type_beneficio' value='" + obj.type_beneficio + "'/>";
        _html += "<input type='hidden' id='id_type_status_canje' name='id_type_beneficio' value='" + obj.id_type_status_canje + "'/>";
        _html += "<input type='hidden' id='id_type_beneficio' name='id_type_beneficio' value='" + obj.id_type_beneficio + "'/>";
        _html += "<input type='hidden' id='type_execution' name='id_type_execution' value='" + obj.type_execution + "'/>";
        _html += "<input type='hidden' id='id_type_execution' name='id_type_execution' value='" + obj.id_type_execution + "'/>";
        _html += "<input type='hidden' id='verification' name='verification' value='" + obj.verification + "'/>";

        _AJAX.Load("./fragments/vercanje.html").then(function (data) {
            $("body").append(data);
            $(".detalle-canje").html(_html);
            $.material.init();
            $("#modal_canje").modal({ "show": true, "keyboard": false, "backdrop": "static" });
            $("#modal_canje").on('hidden.bs.modal', function () { });
        });
    },
    onReimprimirCupon: function (_this) {
        $(".area-cupon").html("").hide();
        var obj = JSON.parse(_TOOLS.b64_to_utf8(_this.attr("data-record")));
        var _image = $("." + _this.attr("data-img-ref")).attr("src");
        var _html = "<button type='button' class='close closeBeneficio' style='font-size:24px;position:absolute;right:15px;top:5px;opacity:0.75;'>x</button>";
        _html += "<table style='width:100%;color:grey;'>";
        _html += "   <tr>";
        _html += "      <td align='center' style='padding-top:5px;'>";
        _html += "          <b style='color:black;font-size:16px;'>" + obj.description + "</b>";
        _html += "      </td>";
        _html += "   </tr>";
        _html += "   <tr>";
        _html += "      <td colspan='2' valign='middle' style='width:100%;' align='center'>";
        _html += "         <div class='verification-msg'>Este es tu código de verificación<br/>¡Presentalo y disfrutá tu beneficio!</div>";
        _html += "         <div class='verification-code'>" + obj.verification + "</div>";
        _html += "      </td>";
        _html += "   </tr>";
        _html += "</table>";
        _html += "<table class='noshare' style='width:100%;margin-top:20px;' align='center'>";
        _html += "   <tr>";
        _html += "      <td valign='middle' style='width:100%;' align='center'>";
        _html += "         <a href='#' id='btnScreenCapture' class='btn btn-raised btnScreenCaptureAndShare' style='font-size:16px;color:darkgreen;'><i class='material-icons'>share</i> ¡Capturá y compartí!</a>";
        _html += "      </td>";
        _html += "   </tr>";
        _html += " </table>";

        _html += "<input type='hidden' id='id_canje' name='id_canje' value='" + obj.id_canje + "'/>";
        _html += "<input type='hidden' id='id_beneficio' name='id_beneficio' value='" + obj.id + "'/>";
        _html += "<input type='hidden' id='type_beneficio' name='id_type_beneficio' value='" + obj.type_beneficio + "'/>";
        _html += "<input type='hidden' id='id_type_status_canje' name='id_type_beneficio' value='" + obj.id_type_status_canje + "'/>";
        _html += "<input type='hidden' id='id_type_beneficio' name='id_type_beneficio' value='" + obj.id_type_beneficio + "'/>";
        _html += "<input type='hidden' id='type_execution' name='id_type_execution' value='" + obj.type_execution + "'/>";
        _html += "<input type='hidden' id='id_type_execution' name='id_type_execution' value='" + obj.id_type_execution + "'/>";
        _html += "<input type='hidden' id='verification' name='verification' value='" + obj.verification + "'/>";

        $(".area-cupon").css({ "opacity": 0, "left": "-1000px", "position": "relative" });
        $(".area-cupon").removeClass("hidden");
        $(".area-cupon").html(_html);
        _FUNCTIONS.onReimprimirCanje(null).then(function (data) { resolve(data); }).catch(function (err) { throw err; });
        $(".full-verbeneficios").animate({ "opacity": 0, "left": "-1000px", "position": "relative" }, 350, function () {
            $(".full-verbeneficios").hide();
        });
        $(".area-cupon").animate({ "opacity": 1, "left": "0px", "position": "relative" }, 350, function () {
            $(".area-cupon").show();
        });
    },
    /**
     * /
     * Solicitudes de acciones desde cada cupón!
     */
    onRunCanjeBeneficio: function (text, _platform) {
        _AJAX.Load("./fragments/solicitarbeneficio.html").then(function (data2) {
            $(".detalle-canje").addClass("hidden");
            $(".result-canje").html(data2).removeClass("hidden");
            var _json = {
                "id_beneficio": $("#id_beneficio").val(),
                "id_type_execution": $('#id_type_execution').val(),
                "data_function": "canjear-beneficio",
                "verified": text,
                "platform": _platform,
            };
            _AJAX.UiApplicationMobileFunction(_json).then(function (data) {
                if (data.additional.status == "OK") {
                    _FUNCTIONS.onOK(data);
                } else {
                    _FUNCTIONS.onNOTOK(data);
                }
            });
        });
    },
    onSendToServerQR: function (text, _platform) {
        _FUNCTIONS.onRunCanjeBeneficio(text, _platform);
    },
    onSolicitarBeneficio: function (_this) {
        try {
            var _platform = _TOOLS.getPlatform();
            if (!_FUNCTIONS._logged) {
                modalAlert("", "Por favor ingrese datos de acceso");
                $(".btnActionModal").click();
                _FUNCTIONS.onShowLogin();
            } else {
                if (_FUNCTIONS._session_data.ClubRedondo == 0) {
                    _FUNCTIONS.onAlertGeneral({ "title": "Alerta del sistema", "text": "Una vez procesado tu pago podrás acceder a los beneficios" });
                    $(".btnActionModal").click();
                    //_FUNCTIONS.onAdherirJelper(null);
                } else {
                    switch ($('#id_type_execution').val() * 1) {
                        case 2: //Mostrar credencial
                            _FUNCTIONS.onCredencialVirtual(null);
                            setTimeout(function () { $(".footer-credencial").removeClass("hidden"); }, 1000);
                            break;
                        case 1: //Leer QR Credipaz
                        case 3: //Leer QR Jelper
                            if (typeof (cordova) != "undefined") {
                                cordova.plugins.barcodeScanner.scan(
                                    function (result) {
                                        _FUNCTIONS.onSendToServerQR(result.text, _platform);
                                    },
                                    function (error) {
                                        modalAlert("", "Error en la lectura del código QR: " + error);
                                    },
                                    {
                                        preferFrontCamera: false, // iOS and Android
                                        showFlipCameraButton: true, // iOS and Android
                                        showTorchButton: true, // iOS and Android
                                        torchOn: false, // Android, launch with the torch switched on (if available)
                                        saveHistory: false, // Android, save scan history (default false)
                                        prompt: "Ubique el código QR en el área de detección", // Android
                                        resultDisplayDuration: 1000, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                                        disableAnimations: true, // iOS
                                        disableSuccessBeep: false // iOS and Android
                                    }
                                );
                            } else {
                                throw _platform + ".  No se ha podido habilitar el scanner QR";
                            }
                            break;
                        case 5: //API Externa Arben Group
                        case 6: //API Local Credipaz
                            _FUNCTIONS.onRunCanjeBeneficio("", _platform);
                            break;
                    }
                }
            }
        } catch (err) {
            _FUNCTIONS.onSendToServerQR("https://www.jelper.com.ar", _platform);//TEST! 
            if (err != "") { modalAlert("", err); }
        }
    },
    onSolicitarAsistencia: function (_this) {
        modalAlert("", "Acción a definir solicitando desde ASistencia financiera");
    },
    onSolicitarSeguro: function (_this) {
        modalAlert("", "Acción a definir solicitando desde Seguro por enfermedad");
    },
    onCanjearBeneficio: function (_json) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $(".btnClose_modal_solicitar_beneficio").click();
                    $(".btnInicio").click();
                    _FUNCTIONS.onConfirmarCanje(_json).then(function (data) { resolve(data); }).catch(function (err) { throw err; });
                } catch (err) {
                    reject(err);
                }
            });
    },
    onConfirmarCanje: function (_data) {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _json = {
                        "id": $("#id_canje").val(),
                        "id_beneficio": $("#id_beneficio").val(),
                        "data_function": "confirmar-canje",
                        "verification": _data
                    };
                    _AJAX.UiApplicationMobileFunction(_json).then(function (data) {
                        if (data.status == "OK") {
                            _FUNCTIONS.onOK(null);
                            resolve(data);
                        } else {
                            throw data.status;
                        }
                    }).catch(function (err) {
                        _FUNCTIONS.onNOTOK(null);
                        throw err;
                    });
                } catch (err) {
                    reject(err);
                }
            });
    },
    onReimprimirCanje: function (_json) {
        return new Promise(
            function (resolve, reject) {
                try {
                    var _lat = 0;
                    var _lng = 0;
                    if (_GMAP._TRACK_POSITION.lat == undefined) { _lat = 0; }
                    if (_GMAP._TRACK_POSITION.lng == undefined) { _lng = 0; }
                    var _json = {
                        "id": $("#id_canje").val(),
                        "id_beneficio": $("#id_beneficio").val(),
                        "data_function": "reimprimir-canje",
                        "lat": _lat,
                        "lng": _lng,
                    };
                    _AJAX.UiApplicationMobileFunction(_json).then(function (data) {
                        if (data.status == "OK") {
                            //si por regla de geo localizacion se cierra....
                            $(".item-cupon-" + $("#id_canje").val()).fadeOut("fast");
                            resolve(data);
                        } else {
                            //debe devolver error si no se cierra, para no eliminarlo de la lista!
                            throw data.status;
                        }
                    }).catch(function (err) {
                        throw err;
                    });
                } catch (err) {
                    reject(err);
                }
            });
    },
    onOK: function (data) {
        $(".verification-msg").html(data.additional.message_canje)
        $(".verification-code").html(data.additional.verification);
        $(".qr_code").attr("src", data.additional.qr_code);
        $(".title-canje").html("¡Ya tenés listo tu cupón!");
        $(".wait-canje").remove();
        $(".wait-message").remove();
        $(".ok-cupon").removeClass("hidden");
        $(".ok-message").removeClass("hidden");
        $(".ok-footer").removeClass("hidden");
    },
    onNOTOK: function (data) {
        $(".verification-code").html(data.message);
        $(".title-canje").html("¡Ops! Pasó algo que no esperábamos...");
        $(".wait-canje").remove();
        $(".wait-message").remove();
        $(".not-cupon").removeClass("hidden");
        $(".server-message").html(data.additional.message_canje);
    },
    onLoadImagesInScreen: function (_selector) {
        $(_selector).each(function () {
            var obj = $(this);
            if (obj.attr("src") == "placeholder.png") {
                if (_TOOLS.isElementVisible(obj[0])) {
                    var _data = obj.attr("data-load").split(":");
                    var _json = { "id": _data[1], "type": _data[0] };
                    _AJAX.UiGetImage(_json).then(function (data) {
                        if (data.status == "OK") {
                            obj.attr("src", data.data[0].image);
                        }
                    }).catch(function (err) { });
                }
            }
        });
    },
};
