var _TOOLS = {
    observable: function (value) {
        var listeners = [];
        function notify(newValue) {
            listeners.forEach(function (listener) { listener(newValue); });
        }
        function accessor(newValue) {
            if (arguments.length && newValue !== value) {
                value = newValue;
                notify(newValue);
            }
            return value;
        }
        accessor.subscribe = function (listener) { listeners.push(listener); };
        return accessor;
    },
    todayYYYYMMDD: function (_separator) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) { day = "0" + day; }
        if (month < 10) { month = "0" + month; }
        return (year + _separator + month + _separator + day);
    },
    toDDMMYY: function (_date, _separator) {
        _date = _date.split("T")[0];
        var _v = _date.split("T")[0].split(_separator);
        return (_v[2] + "/" + _v[1] + "/" + _v[0]);
    },
    toDeg: function (r) { return r * 180 / Math.PI; },
    getNow: function () {
        var currentDate = new Date();
        var second = currentDate.getSeconds();
        var minute = currentDate.getMinutes();
        var hour = currentDate.getHours();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) { day = "0" + day; }
        if (month < 10) { month = "0" + month; }
        if (hour < 10) { hour = "0" + hour; }
        if (minute < 10) { minute = "0" + minute; }
        if (second < 10) { second = "0" + second; }
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    },
    isValidEmail: function (email) {
        var em = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return em.test(email);
    },
    validate: function (_selector) {
        var _ret = true;
        $(_selector).each(function () { _ret = _TOOLS.formatValidation($(this)) && _ret; });
        return _ret;
    },
    formatValidation: function (_obj) {
        var _ret = true;
        var _color = "transparent";
        var _color_alert = "rgba(251, 4, 11,0.25)";
        switch (_obj.prop("tagName")) {
            case "TEXTAREA":
            case "INPUT":
                switch (_obj.attr("type")) {
                    case "email":
                        if (!_TOOLS.isValidEmail(_obj.val())) {
                            _color = _color_alert;
                            _ret = false;
                            //_obj.val(_obj.val().toLowerCase());
                        }
                        break;
                    case "checkbox":
                        var _checked = _obj.is(":checked");
                        if (!_checked) {
                            _color = _color_alert;
                            _ret = false;
                            _obj.parent().css("color", _color);
                        } else {
                            _obj.parent().css("color", "transparent");
                        }
                        break;
                    default:
                        if (_obj.hasClass("data-list")) {
                            if (_obj.attr("data-selected-id") == "" || _obj.attr("data-selected-id") == undefined) { _color = _color_alert; _ret = false; }
                        } else {
                            if (_obj.val() == "") { _color = _color_alert; _ret = false; }
                        }
                        break;
                }
                break;
            case "SELECT":
                if (_obj.val() == "-1" || _obj.val() == undefined || _obj.val() == null) { _color = _color_alert; _ret = false; }
                break;
        }
        _obj.css("background-color", _color);
        return _ret;
    },
    getFormValues: function (_selector) {
        var _jsonSave = {};
        $(_selector).each(function () {
            var property = $(this).attr('name');
            var value = "";
            switch (true) {
                case $(this).hasClass("combo"):
                    if ($(this).length == 0) { value = ""; } else { value = $(this).val(); }
                    if (value == null || value == "-1" || value == "0" || value == "") { value = "-1"; }
                    break;
                case $(this).hasClass("check"):
                    if ($(this).prop("checked")) { value = $(this).val(); } else { value = ""; }
                    break;
                default:
                    value = $(this).val();
                    break;
            }
            _jsonSave[property] = value;
        });
        return _jsonSave;
    },
    UUID: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) { s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    },
    parsePhone: function (_number) {
        _number = _number.toString();
        var _ret = { "area": "", "phone": _number }
        var _area_codes = ["291", "11", "297", "345", "351", "3783", "3717", "3525", "2362", "221", "3822", "223", "261", "2324", "299", "343", "3752", "3722", "358", "2966", "341", "387", "628", "264", "2652", "408", "3461", "424", "2627", "342", "2954", "385", "3756", "2293", "2965", "2901", "2920", "3487"];
        var _area = _number.substr(0, 4);
        var _phone = _number.substr(4, _number.length);
        if (_area_codes.indexOf(_area) != -1) {
            _ret = { "area": _area, "phone": _phone };
        } else {
            _area = _number.substr(0, 3);
            _phone = _number.substr(3, _number.length);
            if (_area_codes.indexOf(_area) != -1) {
                _ret = { "area": _area, "phone": _phone };
            } else {
                _area = _number.substr(0, 2);
                _phone = _number.substr(2, _number.length);
                if (_area_codes.indexOf(_area) != -1) {
                    _ret = { "area": _area, "phone": _phone };
                }
            }
        }
        return _ret;
    },
    utf8_to_str: function (a) {
        for (var i = 0, s = ''; i < a.length; i++) {
            var h = a[i].toString(16)
            if (h.length < 2) h = '0' + h
            s += '%' + h
        }
        return decodeURI(s);
    },
    loadCombo: function (datajson, params) {
        return new Promise(
            function (resolve, reject) {
                try {
                    $(params.target).empty();
                    if (params.selected == -1) { $(params.target).append('<option selected value="-1">[Seleccione]</option>'); }
                    $.each(datajson.data, function (i, item) {
                        $(params.target).append('<option value="' + item[params.id] + '">' + item[params.description] + '</option>');
                    });
                    resolve(true);
                } catch (rex) {
                    reject(rex);
                }
            });
    },
    subeDV: function (entrada) {
        var sum = 0;
        var cantDigitos = entrada.length - 1;
        var alternate = true;
        for (i = cantDigitos; i >= 0; i--) {
            var n = parseInt(entrada.substring(i, (i + 1)));
            if (alternate == true) {
                alternate = false;
                n = n * 2;
                if (n > 9) {
                    var nx = n.toString();
                    n = (parseInt(nx.substring(0, 1))) + (parseInt(nx.substring(1, 2)));
                }
            }
            else { alternate = true; }
            sum = sum + n;
        }
        var d = sum % 10;
        var s = d.toString();
        var di = 10 - (parseInt(s.substring(s.length - 1)));
        if (di == 10) { di = 0; }
        return di;
    },
    extractNumbers: function (str) {
        var matches = str.match(/(\d+)/);
        return matches[0];
    },
    getPlatform: function () {
        try {
            if (typeof (device.platform) != "undefined") {
                return device.platform;
            } else {
                return "";
            }
        } catch (rex) {
            return "";
        }
    },
    stripHtml: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || "");
    },
    isElementVisible: function (el) {
        if (typeof jQuery !== 'undefined' && el instanceof jQuery) { el = el[0]; }
        var rect = el.getBoundingClientRect();
        var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        var windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        var vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    },
    utf8_to_b64: function (str) { return window.btoa(unescape(encodeURIComponent(str))); },
    b64_to_utf8: function (str) { str = str.replace(/\s/g, ''); return decodeURIComponent(escape(window.atob(str))); },
};
