/*
* onglet.js
* Prototype/Scriptaculous 1.7
* Simple tabs using prototype
* 20/12/2012
************************************************/
var Onglet = Class.create({
  initialize : function(element,options) {
		this.element = $(element);
		this.options = Object.extend({
		  fire_type: 'mouseover',
		  animation: 'fade',
		  duration: '0.5'
		}, options || {});
		
		this.onglets = this.element.select('a[href^="#"]');
		
		this.urls = this.onglets.map(function(elm){
		  return elm.href.match(/#(\w.+)/) ? RegExp.$1 : null;
		}).compact();
		
		this.on(this.onglets.first());
		this.onglets.each(function(elm){
			Event.observe(elm,'click',this.activate.bindAsEventListener(this))
			}.bind(this));
	},
	activate: function(elm) {
	  if(typeof elm == 'string') {
	    elm = this.element.select('a[href="#'+ elm +'"]')[0];
	  }
	  this.on(elm.target);
	  this.onglets.without(elm.target).each(this.off.bind(this));
	},
	off: function (elm) {
			$(elm).removeClassName('active-tab');
			var tabBody = $(this.getContent(elm));
			if (this.options.animation == 'fade') {
				new Effect.Fade(tabBody, {
					duration: this.options.duration,
					afterFinish: function () {
						tabBody.removeClassName('active-tab-body');
					}
				});	
			} else {
				tabBody.removeClassName('active-tab-body');
			}
		},
		on: function (elm) {
			
		  $(elm).addClassName('active-tab');
			var tabBody = $(this.getContent(elm));
			if (this.options.animation == 'fade') {
				new Effect.Appear(tabBody, {
				  duration: this.options.duration,
				  afterFinish: function () {
				  	tabBody.addClassName('active-tab-body');
				  }
				});
			} else {
				tabBody.addClassName('active-tab-body');
			}
		},
	getContent: function(elm) {
		return elm.href.match(this.re)[1];
	},
	re: /#(\.?\w.+)/
});

document.observe("dom:loaded", function(){ new Onglet('tabs');});
