var input_state = 1;
var select_node = new Array();
var save_select_node = new Array();
var new_select = true;
var select_range;
var current_property = "";
var arrowCenter = 0;
var obj_rotate = false;
var click_child = false;
var old_obj = "";

$(document).ready(function(e) {
    $('.setting_part').each(function() {
        $(this).hide();
    });

    $('#setting_page').show();

    $('#insert_text').click(function() {
        jQuery('<div/>', {
                "class": 'object text',
                'tabindex': 1,
                "data-name": getObjName("text"),
                "css": {
                    "z-index": 1,
                }
            })
            .on({
                mousemove: function(event) {
                    if (isBorder(this, event, 8)) {
                        $(this).css('cursor', 'move');
                        $(this).draggable("enable");
                    } else {
                        $(this).css('cursor', 'text');
                        $(this).draggable("disable");
                    }
                },
            })
            .draggable({ revert: 'invalid' })
            .resizable({
                handles: "ne, se, sw, nw",
            })
            .click(function() {
                if (!click_child)
                    select_node = $(this);

                click_child = false;
                obj_click('setting_text', $(this));
                event.stopPropagation();
            })
            .click()
            .appendTo('.view > .page' + getCurrentPage())
            // .focus(function() {
            //     obj_click(true, 'setting_text', $(this));
            // })
            // .focusout(function() {
            //     obj_click(false, 'setting_text', $(this));
            // })
            .append(
                jQuery('<div/>', {
                    'class': 'w-100 h-100',
                    'contenteditable': 'true',
                })
                .on({
                    selectstart: function(event) {
                        $(this).one('mouseup', function() {
                            new_select = false;
                            $('.new_span').children().unwrap();
                            var sel = window.getSelection();

                            if (sel.toString().length > 0) {
                                select_range = sel.getRangeAt(0);
                                new_select = true;
                                select_node = select_range.cloneContents().childNodes;
                            } else {
                                select_node = [];
                                setCurrentSelect();
                            }
                        });
                    },
                    compositionstart: function(event) {
                        input_state = 0;
                    },
                    compositionend: function(event) {
                        input_state = 1;
                    },
                    keyup: function(event) {
                        if (input_state == 1 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 229) {
                            var text = $.parseHTML(event.target.innerHTML);
                            $(this).empty();

                            for (var i of text) {
                                if (i.nodeName.includes("text")) {
                                    for (var n of i.nodeValue) {
                                        var p = jQuery('<span/>', {
                                            text: n,
                                            css: {
                                                "font-family": getCurrentSelect("font-family"),
                                                "color": getCurrentSelect("text-color"),
                                                "font-size": getCurrentSelect("font-size"),
                                            }
                                        });
                                        $(this).append(p);
                                    }
                                } else if (i.nodeName == "SPAN") {
                                    if (i.innerText.length > 1) {
                                        for (var n of i.innerText) {
                                            var p = jQuery('<span/>', {
                                                text: n,
                                                css: {
                                                    "font-family": getCurrentSelect("font-family"),
                                                    "color": getCurrentSelect("text-color"),
                                                    "font-size": getCurrentSelect("font-size"),
                                                }
                                            });
                                            $(this).append(p);
                                        }
                                    } else $(this).append(i);
                                } else if (i.nodeName == "DIV") {
                                    var new_div = jQuery('<div/>');
                                    var div_text = $.parseHTML(i.innerHTML);
                                    for (var inn of div_text) {
                                        if (inn.nodeName.includes("text")) {
                                            for (var n of inn.nodeValue) {
                                                var p = jQuery('<span/>', {
                                                    text: n,
                                                    css: {
                                                        "font-family": getCurrentSelect("font-family"),
                                                        "color": getCurrentSelect("text-color"),
                                                        "font-size": getCurrentSelect("font-size"),
                                                    }
                                                });
                                                $(new_div).append(p);
                                            }
                                        } else if (inn.nodeName == "SPAN") {
                                            if (inn.innerText.length > 1) {
                                                for (var n of inn.innerText) {
                                                    var p = jQuery('<span/>', {
                                                        text: n,
                                                        css: {
                                                            "font-family": getCurrentSelect("font-family"),
                                                            "color": getCurrentSelect("text-color"),
                                                            "font-size": getCurrentSelect("font-size"),
                                                        }
                                                    });
                                                    $(new_div).append(p);
                                                }
                                            } else $(new_div).append(inn);
                                        }
                                    }

                                    $(this).append(new_div);
                                }
                            }
                            setEndOfContenteditable($(this).get(0));
                        }
                        setCurrentSelect();
                    },
                })
                .click(function() {
                    obj_click('setting_text', $(this).parent());
                    click_child = true;
                })
                // .focusout(function() {
                //     obj_click('setting_text', $(this).parent());
                // })
            )

    });

    $('#text-color-picker').spectrum({
        type: "text",
        showInput: "true",
        showInitial: "true",
        allowEmpty: "false",
        color: "black",
        move: function(color) {
            changeTextColor(color.toHexString(), false);
        },
        change: function(color) {
            changeTextColor(color.toHexString(), true);
            new_select = false;
        },
        hide: function(color) {
            // if(new_select)
            setTextInit();
        },
    });

    $('.view').click(function() {
        obj_click("","");
        $('.setting_part').each(function() {
            $(this).hide();
        });
        $('.select_ul').hide(0, setTextInit());
        // $('#setting_text > .select_font .select_ul').hide(0, setTextInit("font-size"));

        $('#setting_page').show();
    });

    $(".view").droppable({
        tolerance: 'fit',
    });

    $(".select_ul").hide();

    $(".select_input, .input_picker, .setting_btn_sm, .btn_img_sm").mousedown(function(e) {
        event.preventDefault();
    });

    // $(".obj_name").mousedown(function(e) {
    //     setEndOfContenteditable($(this));
    //     event.preventDefault();
    // });



    $(".select_input").click(function(e) {
        $(this).parents(".select_div").children(".select_ul").toggle();
    });

    $(".select_ul > li").click(function(e) {
        $(this).parents(".select_div").find(".select_input").html($(this).text());

        if ($(this).parent().parent().hasClass("select_font"))
            changeTextFont($(this).text(), true);
        else if ($(this).parent().hasClass("select_font_size"))
            changeTextSize($(this).text(), true);

        new_select = false;
    });

    $(".select_ul > li").hover(function(e) {
        if ($(this).parent().parent().hasClass("select_font"))
            changeTextFont($(this).text(), false);
        else if ($(this).parent().parent().hasClass("select_font_size"))
            changeTextSize($(this).text(), false);
    });

    $("#font_size_m").click(function() {
        var num = $(".select_font_size .select_input").text();
        if (num != 0) {
            $(".select_font_size .select_input").text(parseInt(num) - 1);
            changeTextSize(parseInt(num) - 1, true);
        }

        new_select = false;
    });

    $("#font_size_p").click(function() {
        var num = $(".select_font_size .select_input").text();
        $(".select_font_size .select_input").text(parseInt(num) + 1);
        changeTextSize(parseInt(num) + 1, true);
        new_select = false;
    });

    $('#pic_upload').on('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                jQuery('<div/>', {
                        "class": 'object pic',
                        'tabindex': 1,
                        'data-rotate': 0,
                        'data-scaleX': 1,
                        'data-scaleY': 1,
                        "data-name": getObjName("pic"),
                        'css': {
                            'cursor': 'move',
                            "z-index": 1,
                        },
                    })
                    .draggable({ revert: 'invalid' })
                    .resizable({
                        handles: "ne, se, sw, nw",
                    })
                    .click(function() {
                        // $(this).focus();
                        select_node = $(this);
                        obj_click('setting_pic', $(this));
                        event.stopPropagation();
                    })
                    .click()
                    .appendTo('.view > .page' + getCurrentPage())
                    // .focus(function() {
                    //     select_node = $(this);
                    //     obj_click(true, 'setting_pic', $(this));
                    // })
                    // .focusout(function() {
                    //     select_node = [];
                    //     obj_click(false, 'setting_pic', $(this));
                    // })
                    .append(
                        jQuery('<span/>', {
                            'text': "◆",
                            'class': 'rotate_btn',
                        })
                        // .on({
                        //     mousemove: function(event) {
                        //         $(this).css('cursor', 'crosshair');
                        //         arrowCenter = getCenter($(this).parent()[0]);
                        //         parent = event.target.parentNode;
                        //         const { left, top, width, height } = parent.getBoundingClientRect();

                        //         if (obj_rotate) {
                        //             var angle = Math.atan2((event.clientY-height) - arrowCenter.y, (event.clientX-width) - arrowCenter.x);
                        //             angle = angle * (180/Math.PI);

                        //             $(this).parent().attr("data-rotate", angle);
                        //             $(this).parent().css("transform", "rotate(" + angle + "deg)");
                        //         }
                        //     },
                        //     mousedown: function(event) {
                        //         obj_rotate = true;
                        //         $(this).parent().draggable("disable");
                        //     },
                        //     mouseup: function(event) {
                        //         obj_rotate = false; 
                        //         $(this).parent().draggable("enable");
                        //     },
                        // })
                    )
                    .append(
                        jQuery('<img/>', {
                            'src': e.target.result,
                            'class': 'w-100 h-100',
                        })
                    )
            }

            reader.readAsDataURL(this.files[0]);
        }
    });

    $('#img_left_rotate').click(function() {
        imgRotate("rotate", -90);
    });

    $('#img_right_rotate').click(function() {
        imgRotate("rotate", 90);
    });

    $('#img_hor_reverse').click(function() {
        imgRotate("scaleX", 0);
    });

    $('#img_vir_reverse').click(function() {
        imgRotate("scaleY", 0);
    });

    $('.layer_all_down').click(function() {
        if (select_node.length > 0) {
            setPageZindex($(select_node[0]), "min");
        }
    });

    $('.layer_one_down').click(function() {
        if (select_node.length > 0) {
            setPageZindex($(select_node[0]), "down");
        }
    });

    $('.layer_one_up').click(function() {
        if (select_node.length > 0) {
            setPageZindex($(select_node[0]), "up");
        }
    });

    $('.layer_all_up').click(function() {
        if (select_node.length > 0) {
            setPageZindex($(select_node[0]), "max");
        }
    });

    $('.obj_name').keyup(function() {
        if (select_node.length > 0 && $(select_node[0]).hasClass("object")) {
            $(select_node[0]).attr("data-name", $(this).text());
        }
    });
});

function getCurrentPage() {
    return $("#page_select").val();
}

function obj_click(id, obj) {
    $('.setting_part').each(function() {
        $(this).hide();
    });

    if (old_obj != "") $(old_obj).removeClass("object_focus");

    if (obj != "") {
        $('#' + id).show();
        $(obj).addClass("object_focus");
        old_obj = obj;
    } else {
        old_obj ="";
    }

    if ($(obj).hasClass("object")){
        $(".obj_name").text($(obj).attr("data-name"));
        $(".obj_height").text($(obj).css("height"));
        $(".obj_width").text($(obj).css("width"));
        $(".obj_X").text($(obj).css("left"));
        $(".obj_Y").text($(obj).css("top"));
    } 
}

function isBorder(obj, event, range) {
    var rect = obj.getBoundingClientRect();
    var x = event.clientX - rect.left,
        y = event.clientY - rect.top,
        w = rect.right - rect.left,
        h = rect.bottom - rect.top;

    if ((y < range) || (y > h - range) || (x < range) || (x > w - range))
        return true;
    else
        return false;
}

function changeTextFont(font, change) {
    if (select_node.length > 0) {
        var length = select_node.length;
        if (change) save_select_node = [];
        var node = document.createElement('span');
        $(node).addClass("new_span");

        font = removeQuotes(font);

        for (var i = 0; i < length; i++) {
            if (!change && new_select && save_select_node.length < length) {
                save_select_node.push(removeQuotes($(select_node[i]).css("font-family")));
                current_property = "font-family";
            }

            $(select_node[i]).css("font-family", font);
            node.appendChild($(select_node[i]).clone()[0]);
        }

        select_range.deleteContents();
        select_range.insertNode(node);

        if (change) {
            $('#setting_text > .select_font .select_ul').hide();
            current_property = "";
        }
    }
}

function changeTextColor(color, change) {
    if (select_node.length > 0) {
        var length = select_node.length;
        if (change) save_select_node = [];
        var node = document.createElement('span');
        $(node).addClass("new_span");

        for (var i = 0; i < length; i++) {
            if (!change && new_select && save_select_node.length < length) {
                save_select_node.push($(select_node[i]).css("color"));
                current_property = "color";
            }

            $(select_node[i]).css("color", color);
            node.appendChild($(select_node[i]).clone()[0]);
        }

        select_range.deleteContents();
        select_range.insertNode(node);

        if (change) {
            $("#text-color-picker").spectrum("hide");
            current_property = "";
        }
    }
}

function changeTextSize(size, change) {
    if (select_node.length > 0) {
        var length = select_node.length;
        if (change) save_select_node = [];
        var node = document.createElement('span');
        $(node).addClass("new_span");

        for (var i = 0; i < length; i++) {
            if (!change && new_select && save_select_node.length < length) {
                save_select_node.push($(select_node[i]).css("font-size"));
                current_property = "font-size";
            }

            $(select_node[i]).css("font-size", parseInt(size));
            node.appendChild($(select_node[i]).clone()[0]);
        }

        select_range.deleteContents();
        select_range.insertNode(node);

        if (change) {
            $('#setting_text > .select_font_size .select_ul').hide();
            current_property = "";
        }
    }
}

function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    var length = $(contentEditableElement)[0].childNodes.length;
    if (document.createRange) {
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents($(contentEditableElement)[0].childNodes[length - 1]); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) {
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText($(contentEditableElement)[0].childNodes[length - 1]); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
    }
}

function getSelectionOffsetRelativeTo(parentElement, currentNode) {
    var currentSelection, currentRange,
        offset = 0,
        prevSibling,
        nodeContent;

    if (!currentNode) {
        currentSelection = window.getSelection();
        currentRange = currentSelection.getRangeAt(0);
        currentNode = currentRange.startContainer;
        offset += currentRange.startOffset;
    }

    if (currentNode === parentElement) return offset;
    if (!parentElement.contains(currentNode)) return -1;

    while (prevSibling = (prevSibling || currentNode).previousSibling) {
        nodeContent = prevSibling.innerText || prevSibling.nodeValue || "";
        offset += nodeContent.length;
    }

    return offset + getSelectionOffsetRelativeTo(parentElement, currentNode.parentNode);
}

function getCurrentSelect(property) {
    if (property == "font-family")
        return removeQuotes($('#setting_text > .select_font .select_input').text());
    else if (property == "text-color")
        return $("#text-color-picker").spectrum("get");
    else if (property == "font-size")
        return parseInt($('#setting_text > .select_font_size .select_input').text());

    return "";
}

function setCurrentSelect() {
    var currentSelection, currentRange, font_family, text_color, font_size;

    currentSelection = window.getSelection();
    currentRange = currentSelection.getRangeAt(0);
    if (currentRange.startContainer.nodeName.includes("text")) {
        font_family = $(currentRange.startContainer.parentNode).css("font-family");
        text_color = $(currentRange.startContainer.parentNode).css("color");
        font_size = $(currentRange.startContainer.parentNode).css("font-size");
    } else {
        font_family = $(currentRange.startContainer).css("font-family");
        text_color = $(currentRange.startContainer).css("color");
        font_size = $(currentRange.startContainer).css("font-size");
    }

    $('#setting_text > .select_font .select_input').text(removeQuotes(font_family));
    $("#text-color-picker").spectrum("set", text_color);
    $('#setting_text > .select_font_size .select_input').text(font_size);
}

function removeQuotes(str) {
    if (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"')
        return str.substr(1, str.length - 2);
    else
        return str;
}

function setTextInit() {
    if (select_node.length > 0 && current_property != "") {
        var length = select_node.length;
        var node = document.createElement('span');
        $(node).addClass("new_span");

        for (var i = 0; i < length; i++) {
            $(select_node[i]).css(current_property, save_select_node[i]);
            node.appendChild($(select_node[i]).clone()[0]);
        }

        select_range.deleteContents();
        select_range.insertNode(node);

        select_node = [];
        save_select_node = [];
    }
}

function imgRotate(type, num) {
    if (select_node.length > 0) {
        var rotate = parseInt($(select_node[0]).attr("data-rotate"));
        var scaleX = parseInt($(select_node[0]).attr("data-scaleX"));
        var scaleY = parseInt($(select_node[0]).attr("data-scaleY"));

        if (type == "rotate") rotate = rotate + num;
        else if (type == "scaleX") scaleX = -(scaleX);
        else if (type == "scaleY") scaleY = -(scaleY);

        $(select_node[0]).attr("data-rotate", rotate);
        $(select_node[0]).attr("data-scaleX", scaleX);
        $(select_node[0]).attr("data-scaleY", scaleY);

        $(select_node[0]).css("transform", "rotate(" + rotate + "deg)");
        $(select_node[0]).children("img").css("transform", "scaleX(" + scaleX + ") scaleY(" + scaleY + ")");
    }
}

function getCenter(element) {
    const { left, top, width, height } = element.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2 }
}

function setPageZindex(node, type) {
    var childNodes = $(node).parents(".page")[0].childNodes;
    var z_arr = [];
    for (var a = 0; a < childNodes.length; a++) {
        if (childNodes[a] != node[0])
            z_arr.push([$(childNodes[a]), parseInt($(childNodes[a]).css("z-index"))]);
    }

    z_arr.sort(function(a, b) {
        return a[1] - b[1]
    });

    if (type == "max")
        $(node).css("z-index", z_arr[z_arr.length - 1][1] + 1);
    else if (type == "min") {
        if (z_arr[0][1] == 1) {
            if (z_arr[0][1] == 1) {
                for (var a = 0; a < z_arr.length; a++) {
                    $(z_arr[a][0]).css("z-index", z_arr[a][1] + 1);
                }
            }
        } else
            $(node).css("z-index", z_arr[0][1] - 1);
    } else if (type == "down") {
        if ($(node).css("z-index") == 1) {
            if (z_arr[0][1] == 1) {
                for (var a = 0; a < z_arr.length; a++) {
                    $(z_arr[a][0]).css("z-index", z_arr[a][1] + 1);
                }
            }
        } else {
            var tem = $(node).css("z-index");
            $(node).css("z-index", tem - 1);
        }
    } else if (type == "up") {
        var tem = $(node).css("z-index");
        $(node).css("z-index", tem + 1);
    }
}

function getObjName(type) {
    var childNodes = $(".page" + getCurrentPage())[0].childNodes;
    var count = 1;
    for (var a = 0; a < childNodes.length; a++) {
        if ($(childNodes[a]).hasClass(type)) count++;
    }

    return getTypeLang("chi", type) + count;
}

function getTypeLang(lang, type) {
    if (type == "text") {
        if (lang == "eng") return "Text";
        else if (lang == "chi") return "文字";
    } else if (type == "pic") {
        if (lang == "eng") return "Image";
        else if (lang == "chi") return "圖片";
    }

    return "";
}