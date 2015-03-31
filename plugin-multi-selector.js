/*
 * Multi-selector prototype plugin
 * Amélioration <select multiple>
 * Author Ning ZHANG, 2015
 * Version 0.0.1
 * no license yet.
 */
var Multiselector = Class.create({
        initialize : function(options){
          if($$('.multi-selector') == undefined){
                return false;
          }else{
                var elements = $$('.multi-selector');
                this.options = Object.extend({
                        template: '<div class="multiselectable">' +
                                '<div class="m-selectable-from"><label for="m-selectable"></label>' +
                                '<select multiple="multiple" id="m-selectable"></select>' +
                                '</div>' +
                                '<div class="m-selectable-controls">' +
                                        '<button class="multis-right"></button>' +
                                        '<button class="multis-left"></button>' +
                                '</div>' +
                                '<div class="m-selectable-to"><label for="m-selected"></label>' +
                                '<select multiple="multiple" id="m-selected"></select>' +
                                '</div>' +
                        '</div>',
                        selectableLabel: 'Selectable:',
                        selectedLabel: 'Selected:',
                        moveRightText: '→',
                        moveLeftText: '←'
                }, options || {});
                return elements.each(function(elm){
                        var master = elm;
                        var template = this.options.template;
                        var num = 1;
                        master.hide();
                        master.insert ({'after':template});

                        var size = master.readAttribute('size');
                        var m = master.next();
                        var m1 = m.down('.m-selectable-from select');
                        var m2 = m.down('.m-selectable-to select');

                        m1.setAttribute('size',size);
                        m2.setAttribute('size',size);

                        m.down('.m-selectable-from label').update(this.options.selectableLabel);
                        m.down('.m-selectable-to label').update(this.options.selectedLabel);
                        m.down('.multis-right').update(this.options.moveRightText);
                        m.down('.multis-left').update(this.options.moveLeftText);

                        m2.update(this.getSelectedOptions(master));
                        m1.update(this.getNonSelectOptions(master));

                        m.down('.multis-right').observe('click', function(event){ event.stop(); this.moveRight(m1,m2,master)}.bind(this));
                        m.down('.multis-left').observe('click', function(event){ event.stop(); this.moveLeft(m1,m2,master)}.bind(this));

                       }.bind(this));
          }
        },
        move : function(from, to, master, select){
                this.getSelectedOptions(from).each(function(opt){
                        to.insert({bottom:opt});
                        from.descendants().each(function(opt_from){
                                if(opt_from.outerHTML == opt){
                                        var matchedElem = master.down('option[value="' + opt_from.value + '"]');
                                        if (select) {
                                                matchedElem.setAttribute('selected', 'selected');
                                        } else {
                                                matchedElem.removeAttribute('selected');
                                        }
                                        opt_from.remove();
                                }
                        })
                });
        },
        moveLeft : function(m1,m2,master){

                this.move(m2, m1, master, false);
        },
        moveRight : function(m1,m2,master){
                this.move(m1, m2, master, true);
        },
        getSelectedOptions(select){
                var result = [];
                var options = select && select.options;
                var opt;

                for (var i=0, iLen=options.length; i<iLen; i++) {
                        opt = options[i];

                        if (opt.selected) {
                                result.push(opt.outerHTML.replace('selected=""',''));
                        }
                }
                return result;
        },
        getNonSelectOptions(select){
                var result = [];
                var options = select && select.options;
                var opt;

                for (var i=0, iLen=options.length; i<iLen; i++) {
                        opt = options[i];

                        if (!opt.selected) {
                                result.push(opt.outerHTML);
                        }
                }
                return result;
        }
});
