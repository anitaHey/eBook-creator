$(document).ready(function(e) {
    $('.setting_part').each(function() {
        $(this).hide();
    });

    $('#setting_page').show();

    $('#insert_text').click(function() {
        jQuery('<div/>', {
                "class": 'object text',
                'contenteditable': 'true',
                'html': '&nbsp;'
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
                input: function(event) {
                    if(event.target.innerText.length == 0)
                        $(this).html('&nbsp;');

                    var text = getPlainText(event.target.innerHTML);
                    var old_text = $(this).text();
                    console.log();
                    $(this).text(old_text.slice(0, -(text.length)));

                    for(var i of text){
                        console.log(i);
                        jQuery('<span/>', {
                            'text': i,
                        }).appendTo($(this));
                    }
                }
            })
            .draggable({ revert: 'invalid' })
            .resizable({
                handles: "ne, se, sw, nw",
            })
            .click(function() {
                event.stopPropagation();
            })
            .appendTo('.view').focus(function() {
                $('.setting_part').each(function() {
                    $(this).hide();
                });

                $('#setting_text').show();
            }).focus();
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

function getPlainText(text) {
    var el = $("<div/>");
    el.html(text).children().remove();
    return el.text();
}