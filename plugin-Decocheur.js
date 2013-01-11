var Decocheur = Class.create({
        initialize : function(element,options) {
                this.element = $(element);
                this.elements_cible = this.element.select('ul.decocheur');
                this.options = Object.extend({}, options || {});

                var onAction = function(event) {
                  if(event.target.id){
                        var elm = event.findElement("ul");
                        this.elements_cible.without(elm).each(this.onDecocher.bind(this));
                  }
                };
                this.elements_cible.each(function(elm){
                        Event.observe(elm,'click', onAction.bindAsEventListener(this))
                }.bind(this));
        },
        onDecocher: function(elm) {
                $(elm).select('input[type=checkbox]').each(function(e){
                        e.checked = false;
                });
        }
});

document.observe("dom:loaded", function(){ new Decocheur('analysis_form'); });
