"use strict";

module.define("ytilitu.converter", "ytilitu.lib.file-processor", function() {
    function initialise() {
        return [ "sc-c", "documents", "json-xml", "xml-json", "sxml-xml", "xml-sxml", "sescript-javascript", "coffeescript-javascript" ].forEach(function(a) {
            return ytilitu.lib.file_processor.initialise_form("converter-" + a);
        });
    }
    return initialise();
});
