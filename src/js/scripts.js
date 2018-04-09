/**
 * Initialise Selectors to use 
 * in scripts.
 */
var selectors = {
    display_type    : '#project_type',
    dropdown_toggle : '.dash-nav--dropdown-toggle',
    dropdown_menu   : '.dash-nav--dropdown-menu'
}

/**
 * Handle dropdown on dashboard.
 */
$(selectors.dropdown_toggle).on('click', function() {
    $(this).siblings(selectors.dropdown_menu).slideToggle();
});

/**
 * If the display type selector 
 * is available on the document, 
 * hide the elements that aren't 
 * related to the value of the 
 * selector.
 *  
 * If the selector value changes, 
 * display the relevant elements 
 * and  hide the irrelevant 
 * elements.
 */
if ($(selectors.display_type).length) {
    var keywords = {
        image: 'Image',
        video: 'Youtube'
    }

    var els = {
        /**
         * The selectors used within the
         * .siblings() method searches for 
         * any element that contains a 
         * specified string.
         */
        image: $(selectors.display_type).parent().siblings(':contains(' + keywords.image + ')'),
        video: $(selectors.display_type).parent().siblings(':contains(' + keywords.video + ')')
    }
    
    if ($(selectors.display_type).val() === 'image') {
        els.video.hide();
    } else if ($(selectors.display_type).val() === 'video') {
        els.image.hide();
    }

    $(selectors.display_type).on('change', function() {
        els.video.toggle();
        els.image.toggle();
    });
}

/**
 * Navbar Selectors
 */
var nav_selectors = {
    dropdown: '.navbar--dropdown-toggle',
    dropdown_menu: '.navbar--dropdown'
}

if ($(nav_selectors.dropdown_menu.length)) {
    $(nav_selectors.dropdown_menu).hide();

    $(nav_selectors.dropdown).on('click', function() {
        $(this).siblings(nav_selectors.dropdown_menu).slideToggle();
    });
}


