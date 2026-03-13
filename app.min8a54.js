var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) {
    return a.raw = a
};
$jscomp.createTemplateTagFirstArgWithRaw = function (a, c) {
    a.raw = c;
    return a
};
var sitename = "Benjamin Wilkerson Tousley",
    view = view || {},
    events = events || {},
    utils = utils || {},
    windowObj = {},
    mouseObj = {},
    scrollPos = 0,
    themeOptions = ["mono", "dark", "light"],
    themeCurrent, projects, indexProject = 0,
    projectScrollTimer = 0,
    customEasing = $.bez([.45, .05, .125, 1]);
view.init = function () {
    "/" !== location.pathname ? (history.pushState({
        url: location.pathname
    }, sitename + " " + location.pathname, location.pathname), view.direct(location.pathname)) : history.pushState({
        url: "/"
    }, sitename, "/");
    "scrollRestoration" in history && (history.scrollRestoration = "manual");
    $(window).resize(function () {
        view.resizer()
    });
    view.resizer();
    utils.svg();
    view.themeGet();
    setTimeout(function () {
        $("body").removeClass("init")
    }, 50);
    view.indexGet();
    $("body").hasClass("projects") && (760 <= windowObj.w ? ($("body").hasClass("list"),
        events.projectListAnimate()) : events.scroll());
    $("body").hasClass("project") && (events.projectInit(), !1 === "ontouchstart" in document.documentElement && events.setProjectCursor(), events.projectColor(), events.projectVideo());
    $("body").hasClass("info") && events.infoListAnimate()
};
view.resizer = function () {
    windowObj.w = $(window).width();
    windowObj.h = $(window).height();
    vh = .01 * window.innerHeight;
    document.documentElement.style.setProperty("--vh", vh + "px")
};
view.direct = function (a) {};
view.load = function (a, c) {
    var d = window.location.pathname.replace(/^\/|\/$/g, "");
    "" == d && (d = "projects");
    $("body").addClass("loading");
    $.ajax({
        url: ajax_object.ajax_url,
        type: "post",
        data: {
            action: "page_load",
            url: d
        },
        success: function (e) {
            $("body").removeClass("loading projects project info category");
            0 !== e && (window.scrollTo(0, 0), $("main").html($.parseHTML(e.data.html)), $("main").find("img").each(function (f, g) {
                    g.outerHTML = g.outerHTML
                }), utils.svg(), $("body").addClass(e.data.css), indexProject = 0, e.data.css.includes("projects") ?
                (view.indexGet(), 760 <= windowObj.w ? events.projectListAnimate() : events.scroll(), events.projectColorReset()) : e.data.css.includes("project") ? (events.projectInit(), events.projectScroll(), !1 === "ontouchstart" in document.documentElement && events.setProjectCursor(), events.projectColor(), $("#project-info-counter span:eq(0)").text(1), events.projectVideo()) : e.data.css.includes("info") && (events.infoListAnimate(), events.projectColorReset()))
        },
        fail: {}
    });
    return !1
};
view.inViewport = function (a, c, d) {
    view.rect = a.getBoundingClientRect();
    view.html = document.documentElement;
    return view.rect.top >= 0 - c && view.rect.left >= 0 - d && view.rect.bottom <= (window.innerHeight || view.html.clientHeight) + c && view.rect.right <= (window.innerWidth || view.html.clientWidth) + d
};
view.themeGet = function () {
    null === localStorage.getItem("themeColor") && localStorage.setItem("themeColor", themeOptions[0]);
    themeCurrent = localStorage.getItem("themeColor");
    themeIndex = themeOptions.indexOf(themeCurrent);
    view.themeSet(themeOptions[themeIndex])
};
view.themeSet = function (a) {
    for (var c = 0; c < themeOptions.length; c++) a !== themeOptions[c] ? $("body").removeClass(themeOptions[c]) : ($("body").addClass(a), localStorage.setItem("themeColor", a), themeCurrent = a);
    $("body").hasClass("project") ? events.projectColor() : events.projectColorReset()
};
view.indexGet = function () {
    if (null === localStorage.getItem("indexView")) {
        var a = "list";
        localStorage.setItem("indexView", a)
    } else a = localStorage.getItem("indexView");
    $("body").addClass(a);
    null === localStorage.getItem("indexSort") ? (a = "date", localStorage.setItem("indexSort", a)) : (a = localStorage.getItem("indexSort"), "a_z" == a && view.indexSort("title", !1));
    $("body").addClass(a)
};
view.indexSort = function (a, c) {
    var d = $("nav");
    d.children().detach().sort(function (e, f) {
        return c ? $(f).get(0).getAttribute("data-" + a).localeCompare($(e).get(0).getAttribute("data-" + a)) : $(e).get(0).getAttribute("data-" + a).localeCompare($(f).get(0).getAttribute("data-" + a))
    }).appendTo(d);
    switch (a) {
        case "date":
            projects.sort(function (e, f) {
                return f[1].localeCompare(e[1])
            });
            break;
        case "title":
            projects.sort(function (e, f) {
                return e[5].localeCompare(f[5])
            })
    }
};
view.intro = function () {
    $("body").addClass("intro");
    $("#projects nav a").each(function (a) {
        $(this).find("img").delay(50 * a).show(0);
        $(this).find("> span").stop(!0, !1).css({
            opacity: 0
        }).delay(50 * a).animate({
            opacity: 1
        }, {
            duration: 300,
            easing: customEasing,
            complete: function () {
                var c = $(this).parent();
                a == $("#projects nav a").length - 1 ? ($("body").removeClass("intro"), c.find("img").animate({
                    opacity: 0
                }, {
                    duration: 150,
                    easing: "linear",
                    complete: function () {
                        $(this).removeAttr("style")
                    }
                })) : c.find("img").removeAttr("style")
            }
        })
    })
};
events.init = function () {
    window.onpopstate = function (a) {
        a.state && view.load(!1, !1)
    };
    $(window).scroll(function () {
        events.scroll()
    });
    $("header").on("click", ".js-async", function (a) {
        a.preventDefault();
        $("body").addClass("loading");
        a = $(this).attr("href");
        var c = $(this);
        history.pushState({
            url: a
        }, sitename + " " + a, a);
        view.load(c, !1)
    });
    $("main").on("click", ".js-async", function (a) {
        a.preventDefault();
        $("body").addClass("loading");
        a = $(this).attr("href");
        var c = $(this);
        history.pushState({
            url: a
        }, sitename + " " + a, a);
        view.load(c,
            !1)
    });
    $("header").on("click", ".js-theme", function (a) {
        a.preventDefault();
        themeIndex < themeOptions.length - 1 ? themeIndex++ : themeIndex = 0;
        view.themeSet(themeOptions[themeIndex])
    });
    $("header").on("click", ".js-index > li:eq(0) > a", function (a) {
        a.preventDefault();
        0 == $(this).index() ? ($("body").removeClass("list").addClass("grid"), localStorage.setItem("indexView", "grid")) : ($("body").removeClass("grid").addClass("list"), localStorage.setItem("indexView", "list"));
        760 <= windowObj.w || $("body").hasClass("grid") ? events.projectListAnimate() :
            events.scroll()
    });
    $("header").on("click", ".js-index > li:eq(1) > a", function (a) {
        a.preventDefault();
        0 == $(this).index() ? ($("body").removeClass("date").addClass("a_z"), localStorage.setItem("indexSort", "a_z"), view.indexSort("title", !1)) : ($("body").removeClass("a_z").addClass("date"), localStorage.setItem("indexSort", "date"), view.indexSort("date", !0));
        760 <= windowObj.w || $("body").hasClass("grid") ? events.projectListAnimate() : events.scroll()
    });
    $("main").on("click", "#project-slides", function (a) {
        $("#project").hasClass("details") ?
            $("#project-info-details a").click() : mouseObj.x < windowObj.w / 2 ? events.goPrevious() : events.goNext()
    });
    $("main").on("click", "#project-info-details > a", function (a) {
        a.preventDefault();
        a = $("#project");
        a.hasClass("details") ? (a.removeClass("details"), $("#project-info-details p").slideUp({
            duration: 600,
            easing: "easeOutCubic"
        })) : (a.addClass("details"), $("#project-info-details p").slideDown({
            duration: 600,
            easing: "easeOutCubic"
        }))
    });
    events.projectScroll();
    "ontouchstart" in document.documentElement || ($(document).mousemove(function (a) {
        mouseObj.x =
            a.pageX;
        mouseObj.y = a.pageY
    }), $("main").on("mouseenter", "#projects nav a", function (a) {
        $("body").hasClass("grid") && ($("#projects nav a").stop(!0, !1).animate({
            opacity: .05
        }, {
            duration: 300,
            easing: customEasing
        }), $(this).stop(!0, !1).css({
            opacity: 1
        }), $("#projects nav").addClass("faded"));
        $("body").hasClass("mono") ? (a = $(this).data("color"), document.querySelector(":root").style.setProperty("--background", a), a = utils.color(a, "#FFFFFF", "#000000"), document.querySelector(":root").style.setProperty("--color", a)) :
            $("body").hasClass("light") && (a = $(this).data("color"), $("header a.color").css({
                background: a
            }))
    }), $("main").on("mouseleave", "#projects nav a", function (a) {
        $("body").hasClass("grid") && ($("#projects nav a").stop(!0, !1).animate({
            opacity: 1
        }, {
            duration: 300,
            easing: customEasing
        }), $("#projects nav").removeClass("faded"));
        $("body").hasClass("mono") ? (a = document.querySelector(":root").style.getPropertyValue("--mono"), document.querySelector(":root").style.setProperty("--background", a), document.querySelector(":root").style.setProperty("--color",
            "#000")) : $("body").hasClass("light") && $("header a.color").removeAttr("style")
    }), $("main").on("mousemove", "#project-slides", function (a) {
        events.setProjectCursor()
    }), $(document).keydown(function (a) {
        switch (a.keyCode || a.which) {
            case 37:
                $("#project").length && (a.preventDefault(), $("body").hasClass("loading") || $("#project-slides").hasClass("disableSnapping") || events.goPrevious());
                break;
            case 39:
                $("#project").length && (a.preventDefault(), $("body").hasClass("loading") || $("#project-slides").hasClass("disableSnapping") ||
                    events.goNext());
                break;
            case 27:
                if ($("body").hasClass("project") || $("body").hasClass("info")) history.pushState({
                    url: "/"
                }, sitename + " /", "/"), view.load(!1, !1)
        }
    }))
};
events.scroll = function () {
    scrollPos = $(window).scrollTop();
    if (760 > windowObj.w) {
        var a = -1;
        $("main section nav a").each(function (d) {
            t = $(this).offset().top - windowObj.h / 2;
            b = $(this).offset().top - windowObj.h / 2 + $(this).outerHeight(!0);
            scrollPos > t && scrollPos < b ? (a = $(this).index(), $(this).hasClass("img") || ($(this).addClass("img"), $("body").hasClass("mono") && (d = $(this).data("color"), document.querySelector(":root").style.setProperty("--background", d), d = utils.color(d, "#FFFFFF", "#000000"), document.querySelector(":root").style.setProperty("--color",
                d)))) : $(this).removeClass("img")
        });
        if ($("body").hasClass("mono") && -1 === a) {
            var c = document.querySelector(":root").style.getPropertyValue("--mono");
            document.querySelector(":root").style.setProperty("--background", c);
            document.querySelector(":root").style.setProperty("--color", "#000")
        }
    }
    $("body").is(".grid") && $("#projects nav").is(".faded") && ($("#projects nav a").stop(!0, !1).animate({
        opacity: 1
    }, {
        duration: 300,
        easing: customEasing
    }), $("#projects nav").removeClass("faded"), $("body").hasClass("mono") ? (c = document.querySelector(":root").style.getPropertyValue("--mono"),
        document.querySelector(":root").style.setProperty("--background", c), document.querySelector(":root").style.setProperty("--color", "#000")) : $("body").hasClass("light") && $("header a.color").removeAttr("style"))
};
events.projectListAnimate = function () {
    $("#projects nav a").each(function (a) {
        $(this).stop(!0, !1).css({
            opacity: 0
        }).delay(20 * a).animate({
            opacity: 1
        }, {
            duration: 600,
            easing: customEasing,
            complete: function () {
                $(this).removeAttr("style")
            }
        })
    })
};
events.projectInit = function () {
    for (var a = $("#project").data("id"), c = 0, d = 0, e = projects.length; d < e; d++)
        if (projects[d][0] === a) {
            c = d < projects.length - 1 ? d + 1 : 0;
            break
        } a = projects[c][2];
    c = projects[c][3];
    $("#project-info-counter span.next").html("<span>" + a + "</span> <span>" + c + "</span>")
};
events.projectColor = function () {
    $("body").hasClass("light") ? $("#project").data("color") ? (a = $("#project").data("color"), $("header a.color").css({
        background: a
    })) : $("header a.color").removeAttr("style") : $("header a.color").removeAttr("style");
    if ($("body").hasClass("mono")) {
        var a = "";
        $("#project-slides > div:eq(" + indexProject + ")").data("color") ? a = $("#project-slides > div:eq(" + indexProject + ")").data("color") : $("#project").data("color") && (a = $("#project").data("color"));
        "" !== a ? (document.querySelector(":root").style.setProperty("--background",
            a), a = utils.color(a, "#FFFFFF", "#000000"), document.querySelector(":root").style.setProperty("--color", a)) : events.projectColorReset()
    }
};
events.projectColorReset = function () {
    if ($("body").hasClass("mono")) {
        var a = document.querySelector(":root").style.getPropertyValue("--mono");
        document.querySelector(":root").style.setProperty("--background", a);
        document.querySelector(":root").style.setProperty("--color", "#000")
    }
    $("header a.color").removeAttr("style")
};
events.goPrevious = function () {
    var a = $("#project-slides > div").length;

    // move backward, wrap around
    indexProject = (indexProject - 1 + a) % a;

    $("#project-info-counter span.next").stop(true, false).animate({
        width: 0
    }, {
        duration: 300,
        easing: customEasing
    });
    $("#project").removeClass("next");

    events.setProject();
};

events.goNext = function () {
    var a = $("#project-slides > div").length;

    // move forward, wrap around
    indexProject = (indexProject + 1) % a;

    // optional: remove any "next project" UI if present
    $("#project-info-counter span.next").stop(true, false).animate({
        width: 0
    }, {
        duration: 300,
        easing: customEasing
    });
    $("#project").removeClass("next");

    events.setProject();
};

events.projectScroll = function () {
    $("#project-slides").scroll(function (a) {
        a = $(this);
        var c = a.scrollLeft(),
            d = $("#project-slides > div").length,
            e = a.get(0).scrollWidth;
        clearTimeout(projectScrollTimer);
        projectScrollTimer = setTimeout(function () {
            indexProject = Math.round(c / e * d);
            $("#project-info-counter span:eq(0)").text(indexProject + 1);
            events.projectColor();
            events.projectVideo()
        }, 100)
    })
};
events.projectVideo = function () {
    $("#project-slides video").each(function (a) {
        a = $(this).get(0);
        a.paused || a.pause()
    });
    $("#project-slides > div:eq(" + indexProject + ")").find("video").each(function (a) {
        a = $(this).get(0);
        0 < a.currentTime && !a.paused && !a.ended && 2 < a.readyState || a.play()
    })
};
events.setProject = function () {
    $("#project-info-counter span:eq(0)").text(indexProject + 1);
    events.projectColor();
    $("#project-slides").addClass("disableSnapping");
    $("#project-slides").stop(!0, !1).animate({
        scrollLeft: indexProject * windowObj.w
    }, {
        duration: 1200,
        easing: customEasing,
        complete: function () {
            $("#project-slides").removeClass("disableSnapping")
        }
    })
};
events.setProjectCursor = function () {
    $("#project").hasClass("details") || ($obj = $("#project-slides"), mouseObj.x < windowObj.w / 2 ? $obj.hasClass("left") || ($obj.addClass("left"), $obj.removeClass("right")) : $obj.hasClass("right") || ($obj.addClass("right"), $obj.removeClass("left")))
};
events.infoListAnimate = function () {
    $("main ul li").each(function (a) {
        var c = $(this).css("opacity");
        $(this).stop(!0, !1).css({
            opacity: 0
        }).delay(20 * a).animate({
            opacity: c
        }, {
            duration: 600,
            easing: customEasing,
            complete: function () {
                $(this).removeAttr("style")
            }
        })
    })
};
utils.color = function (a, c, d) {
    var e = "#" === a.charAt(0) ? a.substring(1, 7) : a;
    a = parseInt(e.substring(0, 2), 16);
    var f = parseInt(e.substring(2, 4), 16);
    e = parseInt(e.substring(4, 6), 16);
    a = [a / 255, f / 255, e / 255].map(function (g) {
        return .03928 >= g ? g / 12.92 : Math.pow((g + .055) / 1.055, 2.4)
    });
    return .179 < .2126 * a[0] + .7152 * a[1] + .0722 * a[2] ? d : c
};
utils.svg = function () {
    $("img.svg").each(function () {
        var a = $(this),
            c = a.attr("id"),
            d = a.attr("class"),
            e = a.attr("src");
        $.get(e, function (f) {
            f = $(f).find("svg");
            "undefined" !== typeof c && (f = f.attr("id", c));
            "undefined" !== typeof d && (f = f.attr("class", d + " replaced-svg"));
            f = f.removeAttr("xmlns:a");
            !f.attr("viewBox") && f.attr("height") && f.attr("width") && f.attr("viewBox", "0 0 " + f.attr("height") + " " + f.attr("width"));
            a.replaceWith(f)
        }, "xml")
    })
};
$(document).ready(function () {
    view.init();
    events.init()
});