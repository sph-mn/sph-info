"use strict";

module.define("sph-info.other.operations", function() {
    var descriptions = {
        remove_hash_commment_lines: 'removes all lines that start with a "#" character',
        compress_whitespace_vertical: "reduces multiple successive newlines",
        compress_whitespace_horizontal: "reduces multiple successive spaces and tabs on lines",
        camelcase_to_dashes: 'converts notation like this "networkMessageAdapter" to this "network-message-adapter"'
    };
    function newlines_to_commas(a) {
        return a.replace(/\n/g, ", ");
    }
    function commas_to_newlines(a) {
        return a.replace(/, */g, "\n");
    }
    function commas_to_spaces(a) {
        return a.replace(/, */g, " ");
    }
    function spaces_to_commas(a) {
        return a.replace(/ /g, ", ");
    }
    function newlines_to_spaces(a) {
        return a.replace(/\n/g, " ");
    }
    function spaces_to_newlines(a) {
        return a.replace(/ /g, "\n");
    }
    function remove_hash_commment_lines(a) {
        return a.split("\n").reduce(function(r, a) {
            if (a.length && "#" === a[0]) {
                return r;
            } else {
                r.push(a);
                return r;
            }
        }, []).join("\n");
    }
    function lowercase(a) {
        return a.toLowerCase();
    }
    function randomise_lines(a) {
        return function(lines) {
            return lines.map(function(a) {
                return [ random_integer(0, lines.length), a ];
            }).sort(function(a, b) {
                return a[0] < b[0];
            }).map(function(a) {
                return a[1];
            }).join("\n");
        }(a.split("\n"));
    }
    function compress_whitespace_vertical(a) {
        return a.replace(/\n\n+/g, "\n");
    }
    function camelcase_to_dashes(a) {
        return a.replace(/(\s|^)[A-Z]/g, function(match) {
            return match.toLowerCase();
        }).replace(/[A-Z]/g, function(match) {
            return "-" + match.toLowerCase();
        });
    }
    function compress_whitespace_horizontal(a) {
        return string_join(a.split("\n").map(function(a) {
            return a.replace(/( |\t)+/g, " ");
        }), "\n");
    }
    var button_apply = document.getElementById("apply"), container_description = document.getElementById("description"), container_description_text = document.getElementById("description-text"), button_undo = document.getElementById("undo"), textarea = document.getElementById("text"), select_operation = document.getElementById("operations"), undo_history = [];
    function random_integer(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }
    function update_description() {
        console.log("change");
        var description = descriptions[select_operation.value];
        if (description) {
            container_description.innerHTML = description;
            return container_description.style.display = "block";
        } else {
            return container_description.style.display = "none";
        }
    }
    select_operation.addEventListener("change", update_description);
    button_undo.addEventListener("click", function() {
        if (undo_history.length) {
            return textarea.value = undo_history.pop();
        }
    });
    return button_apply.addEventListener("click", function() {
        var proc = eval(select_operation.value);
        if (proc) {
            undo_history.push(textarea.value);
            return textarea.value = proc(textarea.value);
        }
    });
});
