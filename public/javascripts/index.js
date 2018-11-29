/**
 * Created by rossg on 11/4/2018.
 */
window.onscroll = function() {
    CheckStickyNav();
    CheckAnimations();
};

var nav = document.getElementById("nav");

var sticky = nav.offsetTop;

function CheckStickyNav() {
    if (window.pageYOffset >= sticky) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
}

var scroll_pos;
var animations = ["slide-in-left", "slide-in-right", "fade-in"];

function CheckAnimations() {
    scroll_pos = $(window).scrollTop() + $(window).height();

    for (var i = 0; i < animations.length; i++) {
        $(".will-"+animations[i]).each(function (j, obj) {
            if (scroll_pos > $(this).offset().top + ($(window).height()/3)) {
                $(this).addClass(animations[i]);
            }
        });
    }
}

$("#randomize-theme").click(RandomizeTheme);
function RandomizeTheme() {
    $.getJSON("http://node-express-env.tikhcr3v3q.us-west-2.elasticbeanstalk.com/color-theme", function( data ) {
        console.log(data);
    });
}

CheckAnimations();