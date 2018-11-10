"use strict";

module.define("sph-info.time.calendar", function() {
    var web_base_path = "/dynamic/";
    var year_n_input = document.getElementById("year-n");
    function year_change_event_handler() {
        return window.location.assign(web_base_path + "time/calendar/" + year_n_input.value);
    }
    return year_n_input.addEventListener("change", year_change_event_handler);
});
