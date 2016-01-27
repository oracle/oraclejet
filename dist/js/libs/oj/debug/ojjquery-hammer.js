/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs'], function(oj, $, Hammer) 
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

// Forked from Version 2.0.0 of https://github.com/hammerjs/jquery.hammer.js, retrieved 2/4/2015.

if (Hammer) {
    /** @export */
    $.fn.ojHammer = function(options) {
        // $(...).ojHammer("instance") returns the Hammer instance previously instantiated on this element via $(...).ojHammer(options), or undefined if none.
        if (options == "instance")
            return this.data("ojHammer");
        
        // $(...).ojHammer(options) instantiates Hammer on this element, and stores it for later retrieval via $(...).ojHammer("instance")
        return this.each(function() {
            var $el = $(this);
            if(!$el.data("ojHammer")) {
                $el.data("ojHammer", new Hammer["Manager"]($el[0], options));
            }
        });
    };

    // extend the emit method to also trigger jQuery events
    Hammer["Manager"]["prototype"]["emit"] = (function(originalEmit) {
        return function(type, data) {
            originalEmit.call(this, type, data);
//            $(this.element).trigger(type, data); // TODO: REMOVE IF NOT USING.  
            $(this.element).trigger({
                "type": type,
                "gesture": data
            });
        };
    })(Hammer["Manager"]["prototype"]["emit"]);
    
} else {
    oj.Logger.warn("Hammer jQuery extension loaded without Hammer.");
}

});
