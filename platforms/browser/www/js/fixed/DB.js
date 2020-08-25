var _DB = {
    db: null,
    onInit: function (_params, _callBackOk, _callBackReady, _callBackError) {
        _DB.db = window.openDatabase(_params.schema, _params.version, _params.schema + " DB", _params.size);
        $.each(_APP_TABLES.tables, function (i, obj) {
            var _sql = ("drop table if exists " + obj.name);
            if (_REINIT_DATABASE) { _DB.onExecuteSql(_sql); }
            _sql = ("create table if not exists " + obj.name + obj.script);
            _DB.onExecuteSql(_sql,
                function () { if ($.isFunction(_callBackOk)) { _callBackOk(); } },
                function () { if ($.isFunction(_callBackReady)) { _callBackReady(); } },
                function (err) { if ($.isFunction(_callBackError)) { _callBackError(err); } }
                );
        });
        $.each(_APP_TABLES.index, function (i, obj) { _DB.onExecuteSql(obj.script); });
    },
    onExecuteSql: function (_sql, _callBackOk, _callBackReady, _callBackError) {
        _DB.db.transaction(
            function (tx) { tx.executeSql(_sql, [], function (tx, results) { if ($.isFunction(_callBackOk)) { _callBackOk(results); } }); },
            function (err) { if ($.isFunction(_callBackError)) { _callBackError(err); } },
            function () { if ($.isFunction(_callBackReady)) { _callBackReady(); } }
            );
    },
    Set: function (_key, _json_value) {
        try {
            localStorage.setItem(_key, JSON.stringify(_json_value));
            return true;
        } catch (err) {
            return false;
        }
    },
    Get: function (_key) {
        try {
            return JSON.parse(localStorage.getItem(_key));
        } catch (err) {
            return null;
        }
    },
    Remove: function (_key) {
        try {
            localStorage.removeItem(_key);
            return true;
        } catch (err) {
            return false;
        }
    },
};
