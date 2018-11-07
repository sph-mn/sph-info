"use strict";

module.define("ytilitu.encoder", [ "ytilitu.lib.file_processor" ], function() {
    function initialise() {
        return [ "encode-base64", "encode-base91", "decode-base64", "decode-base91", "string-escape", "string-unescape" ].forEach(function(a) {
            return ytilitu.lib.file_processor.initialise_form("encoder-" + a);
        });
    }
    return initialise();
});
