/*!
 * stars.js
 * https://github.com/viniciusmichelutti/jquery-stars
 *
 * Released under the MIT license
 * https://github.com/viniciusmichelutti/jquery-stars/blob/master/LICENSE
 */
jQuery(function($) {
    
    $.fn.stars = function(options) {

        var settings = $.extend({
            stars: 5,
            emptyIcon: 'far fa-star',
            filledIcon: 'fas fa-star',
            color: '#E4AD22',
            starClass: '',
            value: 0,
            text: null,
            click: function() {}
        }, options);
        
        var block = this;
        
        for (var x = 0; x < settings.stars; x++) {
            var icon = $("<i>").addClass(settings.emptyIcon).addClass(settings.starClass);
            
            if (settings.text) {    
                icon.attr("data-rating-text", settings.text[x]);
            }
            
            if (settings.color !== "none") {
                icon.css("color", settings.color)
            }
            
            this.append(icon);
        }
        
        if (settings.text) {
            var textDiv = $("<div>").addClass("rating-text");
            this.append(textDiv);
        }
        
        var stars = this.find("i");

        stars.on("mouseover", function() {
            var index = $(this).index() + 1;
            var starsHovered = stars.slice(0, index);
            events.removeFilledStars(stars, settings);
            events.fillStars(starsHovered, settings);
            
            if (settings.text) block.find(".rating-text").html($(this).data("rating-text"));
        }).on("mouseout", function() {
            events.removeFilledStars(stars, settings);
            events.fillStars(stars.filter(".selected"), settings);
            if (settings.text) block.find(".rating-text").html("");
        }).on("click", function() {
            var index = $(this).index();
            settings.value = index + 1;
            stars.removeClass("selected").slice(0, settings.value).addClass("selected");
            settings.click.call(stars.get(index), settings.value);
        });
        
        events = {
            removeFilledStars: function(stars, s) {
                stars.removeClass(s.filledIcon).addClass(s.emptyIcon);
                return stars;
            },
            
            fillStars: function(stars, s) {
                stars.removeClass(s.emptyIcon).addClass(s.filledIcon);
                return stars;
            }
        };
        
        if (settings.value > 0) {
            var starsToSelect = stars.slice(0, settings.value);
            events.fillStars(starsToSelect, settings).addClass("selected");
        }
        
        return this;
    };
    
});