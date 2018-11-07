"use strict";

module.define("ytilitu.lib.file_processor", function(exportx) {
    function xhr_form_result_ampersand(form, text, c) {
        var xhr = new XMLHttpRequest();
        xhr.open("post", encodeURI(form.action));
        xhr.onload = function() {
            if (200 === xhr.status) {
                return c(xhr.responseText);
            }
        };
        return xhr.send(new FormData(form));
    }
    function initialise_form(container_id, display_if_field_text_p) {
        var container = document.getElementById(container_id);
        if (!container) {
            return;
        }
        var input_file_clear = document.querySelector("#" + container_id + " .input-file-clear");
        var input_file = document.querySelector("#" + container_id + " .input-file"), input_text = document.querySelector("#" + container_id + " .input-text"), form = document.querySelector("#" + container_id + " form");
        input_file_clear.addEventListener("click", function() {
            return input_file.value = "";
        });
        input_text.addEventListener("change", function() {
            return input_file.value = "";
        });
        return form.addEventListener("submit", function(event) {
            if (display_if_field_text_p) {
                if (input_text.value) {
                    xhr_form_result_ampersand(form, input_text.value, function(result) {
                        if (result === "failure. syntax or other error.") {
                            return alert(result);
                        } else {
                            return input_text.value = result;
                        }
                    });
                }
                return event.preventDefault();
            } else {
                if (!(input_file.value || input_text.value)) {
                    return event.preventDefault();
                }
            }
        });
    }
    return exportx({
        initialise_form: initialise_form
    });
});
