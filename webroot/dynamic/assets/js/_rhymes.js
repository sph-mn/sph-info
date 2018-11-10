"use strict";

module.define("sph-info.other.rhymes", function() {
    var suggest_path = "/dynamic/json/rhymes/suggest/";
    function italic(a) {
        return function(b) {
            b.setAttribute("style", "font-style:italic");
            b.innerHTML = a;
            return b;
        }(document.createElement("span"));
    }
    var input_word = document.getElementById("word"), button_get = document.getElementById("get"), result_container = document.getElementById("result");
    function get_rhyming_words_ampersand(word, c) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", encodeURI(suggest_path + word));
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
                    if ("object" === typeof result && result.length) {
                        result_container.innerHTML = result.join(", ");
                    } else {
                        result_container.innerHTML = "";
                        result_container.appendChild(italic("no results"));
                    }
                    return console.log(result_container, italic("no results"));
                });
            } else {
                result_container.innerHTML = "";
                return result_container.appendChild(italic("invalid word"));
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
