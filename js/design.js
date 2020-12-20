$(document).ready(function(e) {
    $('#insert_text').click(function() {
        jQuery('<div/>', {
            "class": 'object',
            'contenteditable': 'true',
            'html':'&nbsp;'
        })
        .on({
        	mousemove: function(event){
        		if(isBorder(this, event, 8)) {
        			$(this).css('cursor', 'move');
        			$(this).draggable("enable");
        		} else {
        			$(this).css('cursor', 'text');
        			$(this).draggable("disable");
        		}
        	}
        })
        .draggable({ revert: 'invalid' })
        .resizable({
        	handles: "ne, se, sw, nw",
        	
         })
        .appendTo('.view');
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