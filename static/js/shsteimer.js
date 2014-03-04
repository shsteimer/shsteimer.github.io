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

	    	$('#cats-accordion').on('shown.bs.collapse', function (evt) {
				var shown = evt.target.id;
				ga('send', 'event', 'expandarchive', 'category: ' + shown); 
			});

			$('#tags-accordion').on('shown.bs.collapse', function (evt) {
			    var shown = evt.target.id;
				ga('send', 'event', 'expandarchive', 'tag: ' + shown);
			});
		}
	}
};

shsteimer.$ = jQuery.noConflict();