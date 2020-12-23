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
                    input: function(event) {
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
                        // SetCaretPosition($(this), -1);
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
});

function obj_click(focus, id, obj) {
    $('.setting_part').each(function() {
        $(this).hide();
    });

    if (focus) {
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

function changeFont(font) {
    var sel = window.getSelection();
    if (sel.rangeCount) {

        jQuery('<span/>', {
            html: sel.toString(),
            css: {
                "font-family": font.value
            }
        })

        var range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(e);
    }
}

function SetCaretPosition(el, pos) {

    // Loop through all child nodes
    for (var node of el.childNodes) {
        if (node.nodeType == 3) { // we have a text node
            if (node.length >= pos) {
                // finally add our range
                var range = document.createRange(),
                    sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            } else {
                pos -= node.length;
            }
        } else {
            pos = SetCaretPosition(node, pos);
            if (pos == -1) {
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
}