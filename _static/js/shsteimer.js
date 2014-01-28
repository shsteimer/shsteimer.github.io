shsteimer = {

	init: function(){

		!(function($) {
  			$.each(window._q,function(index,f){
  				f();
  			});
  		})(shsteimer.$);
	},

	archives: {
		init: function() {
			var href = location.href;
	    	var split = href.split("#");
	    	var elem = shsteimer.$('#collapse-' + split[1]);
	    	if(elem && elem.hasClass('panel-collapse')) {
	    		elem.collapse('show');
	    	}
		}
	}
};

shsteimer.$ = jQuery.noConflict();