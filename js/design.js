var input_state = 1;
var select_node = new Array();
var save_select_node = new Array();
var new_select = true;
var select_range;


$(document).ready(function(e) {
    $('.setting_part').each(function() {
        $(this).hide();
    });

    $('#setting_page').show();

    $('#insert_text').click(function() {
        jQuery('<div/>', {
                "class": 'object text',
                'tabindex': 1,
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
                event.stopPropagation();
            })
            .appendTo('.view')
            .focus(function() {
                obj_click(true, 'setting_text', $(this));
            })
            .focusout(function() {
                obj_click(false, 'setting_text', $(this));
            })
            .append(
                jQuery('<div/>', {
                    'class': 'w-100 h-100',
                    'contenteditable': 'true',
                })
                .on({
                    selectstart: function(event) {
                        $(document).one('mouseup', function() {
                            new_select = false;
                            var sel = this.getSelection();

                            if (sel.toString().length > 0) {
                                select_range = sel.getRangeAt(0);
                                new_select = true;
                                select_node = select_range.cloneContents().childNodes;
                                console.log(select_node);
                            } else {
                                select_node = [];
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
                        if (input_state == 1) {
                            var text = $.parseHTML(event.target.innerHTML);
                            $(this).empty();

                            for (var i of text) {
                                if (i.nodeName.includes("text")) {
                                    for (var n of i.nodeValue) {
                                        var p = "<span>" + n + "</span>";
                                        $(this).append(p);
                                    }
                                } else if (i.nodeName == "SPAN") {
                                    if (i.innerText.length > 1) {
                                        for (var n of i.innerText) {
                                            var p = "<span>" + n + "</span>";
                                            $(this).append(p);
                                        }
                                    } else $(this).append(i);
                                } else if (i.nodeName == "DIV") {
                                    var new_div = jQuery('<div/>');
                                    var div_text = $.parseHTML(i.innerHTML);
                                    for (var inn of div_text) {
                                        if (inn.nodeName.includes("text")) {
                                            for (var n of inn.nodeValue) {
                                                var p = "<span>" + n + "</span>";
                                                $(new_div).append(p);
                                            }
                                        } else if (inn.nodeName == "SPAN") {
                                            if (inn.innerText.length > 1) {
                                                for (var n of inn.innerText) {
                                                    var p = "<span>" + n + "</span>";
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

                    }
                })
                .click(function() {
                    obj_click(true, 'setting_text', $(this).parent());
                })
                .focusout(function() {
                    obj_click(false, 'setting_text', $(this).parent());
                })
            )
            .focus();

    });

    $('.view').click(function() {
        $('.setting_part').each(function() {
            $(this).hide();
        });

        $('#setting_page').show();
    });

    $(".view").droppable({
        tolerance: 'fit',
    });

    $(".select_ul").hide();

    $(".select_div > div").mousedown(function(e) {
        event.preventDefault();
    });

    $(".select_div > div").click(function(e) {
        $(this).next().toggle();
    });

    $(".select_ul > li").click(function(e) {
        $(this).parent().prev().html($(this).text());
        changeFont($(this).text(), true);
        new_select = false;
    });

    $(".select_ul > li").hover(function(e) {
        changeFont($(this).text(), false);
    });
});

function obj_click(focus, id, obj) {
    if (focus) {
        $('.setting_part').each(function() {
            $(this).hide();
        });

        $('#' + id).show();
        $(obj).addClass("object_focus");
    } else $(obj).removeClass("object_focus");

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



function changeFont(font, change) {
    if (select_node.length > 0) {
        var length = select_node.length;
        if (change) save_select_node.clear();
        var node = document.createElement('span');

        console.log(select_node);
        for (var i = 0; i < length; i++) {
            if (!change && new_select && save_select_node.length < length) {
                save_select_node.push($(select_node[i]).css("font-family"));
            }

            select_node[i].style.fontFamily = font;
            node.appendChild($(select_node[i]).clone()[0]);
        }

        // console.log(save_select_node);
        // console.log(node);
        select_range.deleteContents();
        // select_range.insertNode(node);
        for (var i = length - 1; i >= 0; i--) {
            select_range.insertNode(select_node[i]);
        }
    }
}

function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) {
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) {
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
    }
}