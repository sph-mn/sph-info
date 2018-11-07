"use strict";

module.define("ytilitu.other.dice", function() {
    var input_sides = document.getElementById("sides"), button_roll = document.getElementById("roll"), result_container = document.getElementById("result");
    function random_integer(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }
    function dice_roll(sides) {
        if (sides > 0) {
            return random_integer(1, 1 + sides);
        } else {
            if (sides < 0) {
                return random_integer(0, sides);
            } else {
                return 0;
            }
        }
    }
    return button_roll.addEventListener("click", function() {
        result_container.innerHTML = "";
        return setTimeout(function() {
            return result_container.innerHTML = dice_roll(parseInt(input_sides.value));
        }, 200);
    });
});
