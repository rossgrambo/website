/**
 * Created by rossg on 11/4/2018.
 */
var Theme = GetThemeFromCSS();

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
    var themeButton = document.getElementsByClassName("randomize-theme");
    var oldContent = replaceChildrenWithLoadingIcon(themeButton[0]);

    $.getJSON("http://node-express-env.tikhcr3v3q.us-west-2.elasticbeanstalk.com/color-theme", function( data ) {
        themeButton.innerHTML = oldContent;

        for (var i = 0; i < data.result.length; i++) {
            console.log(data.result[i]);
            document.body.style.setProperty("--color-" + i, "rgb(" + data.result[i][0] + "," + data.result[i][1] + "," + data.result[i][2]+")", "");
            console.log('Ye' + data.result[i]);
        }

        Theme = GetThemeFromCSS();
        initHome();
        initAbout();
    });
}

function replaceChildrenWithLoadingIcon(element) {
    var oldContent = element.innerHTML;

    for (var j = 0; j < element.children.length; j++) {
        element = element.removeChild(element.children[0]);
    }
    var loadingImg = document.createElement('img');
    loadingImg.src = 'images/spinner-loading.gif';
    element.appendChild(loadingImg);

    return oldContent;
}

function GetThemeFromCSS() {
    var bodyStyle = getComputedStyle(document.body);

    return [
        bodyStyle.getPropertyValue("--color-0"),
        bodyStyle.getPropertyValue("--color-1"),
        bodyStyle.getPropertyValue("--color-2"),
        bodyStyle.getPropertyValue("--color-3"),
        bodyStyle.getPropertyValue("--color-4")
    ];
}

CheckAnimations();