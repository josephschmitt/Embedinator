// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();


var Embedinator = {
		Util: {
			getEmbedsForService: function (service) {
				return service.matchFnc.call().map(function(match) {
					return {obj: match, val: Embedinator.Util.getValueFromObject(match)};
				});;
			},

			getValueFromObject: function (object) {
				var value = object.getAttribute('data') || object.querySelector('param[name*="src"], param[name*="movie"]').getAttribute('value') || '';
				return value;
			},
			
			/**
			 * 	data = {
			 * 		width: 500,
			 * 		height: 292,
			 * 		clip_id: 123456,
			 * 		props: [
			 * 			color: ffffff
			 * 		]
			 * 	}
			 */
			replaceEmbed: function(target, service, data) {
				var fragment = document.createElement(), iframe;
				fragment.innerHTML = tmpl(service.tmpl, data);
			
				iframe = fragment.childNodes[0];
				
				//insert iframe
	            target.parentNode.insertBefore(iframe, target);

	            //remove original
	            target.parentNode.removeChild(target);
			}
		},
		
		
// SERVICE PLUGINS _______________________________________

		YOUTUBE: {
			name: 'youtube',
			tmpl: '<iframe width="<%= width %>" height="<%= height %>" src="http://www.youtube.com/embed/<%= clip_id %>" frameborder="0" <%= fullscreen ? "allowfullscreen webkitallowfullscreen" : "" %>></iframe>',

			matchFnc: function (object) {
				return Array.prototype.slice.call(document.querySelectorAll('object')).filter(function(object, index) {
					return !!object.querySelector('param[value*="youtube.com/v"]');
				});
			},
			
			getData: function (object, value) {
					var clip_id = value.split('/v/')[1].split('&')[0],
						fsParam = object.querySelector('param[name="allowFullScreen"]'),
						allowFullscreen = fsParam ? fsParam.getAttribute('value') == "true" ? true : false : false,
		
					data = {
						width: object.getAttribute('width'),
						height: object.getAttribute('height'),
						clip_id: clip_id,
						fullscreen: allowFullscreen
					};
				
				return data;
	        }
		},

		VIMEO: {
			name: 'vimeo',
			tmpl: '<iframe src="http://player.vimeo.com/video/<%= clip_id %>?<%= qparams %>" width="<%= width %>" height="<%= height %>" frameborder="0" allowfullscreen webkitallowfullscreen></iframe>',

			matchFnc: function () {
				return Array.prototype.slice.call(document.querySelectorAll('object')).filter(function(object, index) {
					return !!object.querySelector('param[value*="moogaloop"]');
				});
			},
			
			getData: function (object, value) {
	            var paramsArr = value.split('?')[1].split('clip_id=')[1].split('&'),
	            	clip_id = paramsArr[0],
		            qparams = paramsArr[1],
		
					data = {
						width: object.getAttribute('width'),
						height: object.getAttribute('height'),
						clip_id: clip_id,
						qparams: qparams
					};
				
				return data;
	        }
		},

		supportedServices: []
	};
	
Embedinator.supportedServices = Embedinator.supportedServices.concat([Embedinator.VIMEO, Embedinator.YOUTUBE]);

function embedinate(services) {
	var i, 
		services = services || Embedinator.supportedServices,
		embeds = {};
	
	//Get matching Flash embeds
	for (i = 0; i < services.length; i++) {
		embeds[services[i].name] = {
			service: services[i],
			matches: Embedinator.Util.getEmbedsForService(services[i])
		};
	}
	
	// console.log('embeds', embeds);
	
	//Replace Flash embeds with HTML5-compatible embeds
	var match, embed, data;
	for (var serviceName in embeds) {
		embed = embeds[serviceName];
		for (i = 0; i < embed.matches.length; i++) {
			match = embed.matches[i];
			data = embed.service.getData(match.obj, match.val);
			
			//Replace!
			Embedinator.Util.replaceEmbed(match.obj, embed.service, data)
		}
	}
}