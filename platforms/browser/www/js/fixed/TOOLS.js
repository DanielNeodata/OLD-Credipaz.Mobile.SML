var _TOOLS = {
    todayYYYYMMDD: function (_separator) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) { day = "0" + day; }
        if (month < 10) { month = "0" + month; }
        return (year + _separator + month + _separator + day);
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
};