function modalAlert (_title, _body) {
    _FUNCTIONS.onDestroyModal("#alterModal");
    var _html = "<div class='modal fade' id='alterModal' role='dialog'>";
    _html += " <div class='modal-dialog modal-dialog-centered' role='document'>";
    _html += "  <div class='modal-content'>";
    _html += "    <div class='modal-header'>";
    _html += "      <h2 class='modal-title'>" + _title + "</h2>";
    _html += "    </div>";
    _html += "    <div class='modal-body'>";
    _html += _body;
    _html += "    </div>";
    _html += "    <div class='modal-footer font-weight-light'>";
    _html += "       <button type='button' class='btn-raised btn btn-cancel-alert btn-info btn-sm'><i class='material-icons'>done</i></span>Aceptar</button>";
    _html += "    </div>";
    _html += "  </div>";
    _html += " </div>";
    _html += "</div>";
    $("body").append(_html);
    $("body").off("click", ".btn-cancel-alert").on("click", ".btn-cancel-alert", function () {
        _FUNCTIONS.onDestroyModal("#alterModal");
    });
    $("#alterModal").modal({ backdrop: false, keyboard: true, show: true });
    return true;
}

(function () {
    var _idLazy = 0;
    var exitApp = false;
    var intval = setInterval(function () { exitApp = false; }, 1000);
    window.addEventListener('orientationchange', function () {
        _FUNCTIONS.onOrientationChange();
    });

    $("body").off("click", ".btnSaveAltaJelper").on("click", ".btnSaveAltaJelper", function () {
        _FUNCTIONS.onSaveAltaJelper($(this));
    });

    $("body").off("click", ".btnShare").on("click", ".btnShare", function () {
        _FUNCTIONS.onShare($(this));
    });
    $("body").off("click", ".closeScanner").on("click", ".closeScanner", function () {
        _FUNCTIONS.onCloseScanner($(this));
    });
    $("body").off("click", ".btnTerminos").on("click", ".btnTerminos", function () {
        _FUNCTIONS.onVerTerminosYCondiciones($(this));
    });
    $("body").off("click", ".btnMenu").on("click", ".btnMenu", function () {
        _FUNCTIONS.onClickToggleMenu($(this));
    });
    $("body").off("click", ".btnArea").on("click", ".btnArea", function () {
        _FUNCTIONS.onClickAreaItem($(this));
    });
    $("body").off("click", ".btnSorteos").on("click", ".btnSorteos", function () {
        _FUNCTIONS.onSorteos($(this));
    });
    $("body").off("click", ".btnAcercaDe").on("click", ".btnAcercaDe", function () {
        _FUNCTIONS.onAcercaDe($(this));
    });
    $("body").off("click", ".btnDatosPersonales").on("click", ".btnDatosPersonales", function () {
        _FUNCTIONS.onDatosPersonales($(this));
    });
    
    $("body").off("click", ".btnCambiarClave").on("click", ".btnCambiarClave", function () {
        _FUNCTIONS.onShowNewPassword($(this));
    });
    $("body").off("click", ".btnCompartir").on("click", ".btnCompartir", function () {
        _FUNCTIONS.onCompartir($(this));
    });
    $("body").off("click", ".closeBeneficio").on("click", ".closeBeneficio", function () {
        _FUNCTIONS.onCloseBeneficio($(this));
    });
    $("body").off("click", ".btnCanjearBeneficio").on("click", ".btnCanjearBeneficio", function () {
        _FUNCTIONS.onCanjearBeneficio({ "verification": "" });
    });
    $("body").off("click", ".btnReconnect").on("click", ".btnReconnect", function () {
        _FUNCTIONS.onCheckConnection().then(function (data) {
            if (data.connected) { _FUNCTIONS.onShowMain(); }
        });
    });
    $("body").off("click", ".card-categoria").on("click", ".card-categoria", function () {
        $("#coords").val("");
        _FUNCTIONS.onVerCategoria($(this));
    });
    $("body").off("click", ".btnCategoryBack").on("click", ".btnCategoryBack", function () {
        $("#coords").val("");
        _FUNCTIONS.onBackCategoria($(this));
    });
    $("body").off("click", ".btnSearchBeneficios").on("click", ".btnSearchBeneficios", function () {
        $("#coords").val("");
        _FUNCTIONS.onSearchBeneficios($(this));
    });
    $("body").off("click", ".btnCercaMio").on("click", ".btnCercaMio", function () {
        $("#coords").val("");
        _FUNCTIONS.onCercaMio($(this));
    });
    $("body").off("click", ".btnMisCupones").on("click", ".btnMisCupones", function () {
        $("#coords").val("");
        _FUNCTIONS.onVerMisCupones($(this));
    });
    $("body").off("keyup", ".coords").on("keyup", ".coords", function (e) {
        clearTimeout(_idLazy);
        _idLazy = setTimeout(function () {
            clearTimeout(_idLazy);
            _FUNCTIONS.onRefreshListBeneficios($(this));
        }, 1000);
    });

    $("body").off("click", ".btn-buscar").on("click", ".btn-buscar", function () {
        _FUNCTIONS.onBuscarWindows($(this));
    });
    $("body").off("click", ".nav a.btn").on("click", ".nav a.btn", function () {
        _FUNCTIONS.onClickNavItem();
    });
    $("body").off("click", ".btnLogin").on("click", ".btnLogin", function () {
        _FUNCTIONS.onClickLogin($(this));
    });
    $("body").off("click", ".btnActionModal").on("click", ".btnActionModal", function () {
        _FUNCTIONS.onActionModal($(this));
    });
    $("body").off("click", ".btnNobody").on("click", ".btnNobody", function () {
        _FUNCTIONS.onNobody($(this));
    });
    $("body").off("click", ".toggle-password").on("click", ".toggle-password", function () {
        _FUNCTIONS.onToggleSecret($(this), "#password");
    });
    $("body").off("click", ".toggle-confirm").on("click", ".toggle-confirm", function () {
        _FUNCTIONS.onToggleSecret($(this), "#confirm_password");
    });
    $("body").off("click", ".close-alert").on("click", ".close-alert", function () {
        _FUNCTIONS.onCloseAlert($(this));
    });
    $("body").off("click", ".btn-del-medio").on("click", ".btn-del-medio", function () {
        _FUNCTIONS.onDelMedioCarga($(this));
    });
    $("body").off("click", ".btnAdherirJelper").on("click", ".btnAdherirJelper", function () {
        _FUNCTIONS.onAdherirJelper($(this));
    });
    $("body").off("focusout", ".field-comun").on("focusout", ".field-comun", function () {
        setTimeout(function () { window.scrollTo(document.body.scrollLeft, document.body.scrollTop); }, 500);
    });
    $("body").off("click", ".btnScreenCapture").on("click", ".btnScreenCapture", function () {
        _FUNCTIONS.onScreenCapture($(this));
    });
    $("body").off("click", ".btnScreenCaptureAndShare").on("click", ".btnScreenCaptureAndShare", function () {
        _FUNCTIONS.onScreenCaptureAndShare($(this));
    });
    $("body").off("click", ".btn-participar-sorteo").on("click", ".btn-participar-sorteo", function () {
        _FUNCTIONS.onParticiparSorteos($(this));
    });
    $("body").off("click", ".btnCredencialVirtual").on("click", ".btnCredencialVirtual", function () {
        _FUNCTIONS.onCredencialVirtual($(this));
    });
    $("body").off("click", ".btn-filter-cupones").on("click", ".btn-filter-cupones", function () {
        _FUNCTIONS.onFilterCupons($(this));
    });
    $("body").off("click", ".btnVerCupon").on("click", ".btnVerCupon", function () {
        _FUNCTIONS.onVerCupon($(this));
    });
    $("body").off("click", ".btnReimprimirCupon").on("click", ".btnReimprimirCupon", function () {
        _FUNCTIONS.onReimprimirCupon($(this));
    });
    $("body").off("click", ".btnSolicitarBeneficio").on("click", ".btnSolicitarBeneficio", function () {
        _FUNCTIONS.onSolicitarBeneficio($(this));
    });
    $("body").off("click", ".btnSolicitarAsistencia").on("click", ".btnSolicitarAsistencia", function () {
        _FUNCTIONS.onSolicitarAsistencia($(this));
    });
    $("body").off("click", ".btnSolicitarSeguro").on("click", ".btnSolicitarSeguro", function () {
        _FUNCTIONS.onSolicitarSeguro($(this));
    });
    $("body").off("change", ".nearme").on("change", ".nearme", function () {
        _FUNCTIONS.onToggleNearMe($(this));
    });
    $("body").off("change", ".showmap").on("change", ".showmap", function () {
        _FUNCTIONS.onToggleShowMap($(this));
    });
    $("body").off("click", ".btn-resolve-inicio").on("click", ".btn-resolve-inicio", function () {
        _FUNCTIONS.onResolverInicio($(this));
    });
    $("body").off("click", ".btnReinit").on("click", ".btnReinit", function () {
        _FUNCTIONS.onReinit($(this));
    });
    $("body").off("click", ".btn-add-familiar").on("click", ".btn-add-familiar", function () {
        _FUNCTIONS.onModalFamiliares("ls-familiares",true);
    });

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        if (exitApp) {
            clearInterval(intval);
            try {
                cordova.plugins.exit();
            } catch (rex) {
                window.location.href = "index.html";
            }
        }
        else {
            exitApp = true;
            if (_FUNCTIONS._verificated) {
                if ($(".mainmenu").hasClass("hidden")) { $(".btnMenu").click(); }
            }
        }
    }, false);
})();
