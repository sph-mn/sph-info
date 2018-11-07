"use strict";

module.define("ytilitu.other.rhymes", function() {
    var input_word = document.getElementById("word"), button_get = document.getElementById("get"), result_container = document.getElementById("result");
    function get_rhyming_words_ampersand(word, c) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", encodeURI("/dynamic/ytilitu/json/other/rhymes/suggest/" + word));
        xhr.onload = function() {
            if (200 === xhr.status) {
                return c(JSON.parse(xhr.responseText));
            }
        };
        return xhr.send();
    }
    function update_rhyming_words() {
        result_container.innerHTML = "";
        var word = input_word.value;
        if (word) {
            if (word && word.length < 30 && /^[a-zA-Z]+$/.test(word)) {
                return get_rhyming_words_ampersand(word, function(result) {
                    if ("object" === typeof result) {
                        return setTimeout(function() {
                            return result_container.innerHTML = result.join(", ");
                        }, 100);
                    } else {
                        return result_container.innerHTML = result;
                    }
                });
            } else {
                return result_container.innerHTML = "invalid word";
            }
        }
    }
    input_word.addEventListener("keypress", function(event, other) {
        if (event && "Enter" === event.key) {
            return update_rhyming_words();
        }
    });
    return button_get.addEventListener("click", update_rhyming_words);
});
