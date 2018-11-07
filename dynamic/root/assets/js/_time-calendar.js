"use strict";

module.define("ytilitu.time.calendar", function() {
    var year_n_input = document.getElementById("year-n");
    function year_change_event_handler() {
        return window.location.assign("/dynamic/ytilitu/time/calendar/" + year_n_input.value);
    }
    return year_n_input.addEventListener("change", year_change_event_handler);
});
