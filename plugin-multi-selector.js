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
                                        '<button class="multis-right-all"></button>' +
                                        '<button class="multis-right"></button>' +
                                        '<button class="multis-left"></button>' +
                                        '<button class="multis-left-all"></button>' +
                                '</div>' +
                                '<div class="m-selectable-to"><label for="m-selected"></label>' +
                                '<select multiple="multiple" id="m-selected"></select>' +
                                '</div>' +
                        '</div>',
                        selectableLabel: 'Selectable:',
                        selectedLabel: 'Selected:',
                        moveRightText: '<',
                        moveLeftText: '>',
                        moveRightAll: '>>',
                        moveLeftAll: '<<'
                }, options || {});
                this.initialise_dom_extents(); // extends dom add method sortOptions
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
                        m.down('.multis-right-all').update(this.options.moveRightAll);
                        m.down('.multis-left-all').update(this.options.moveLeftAll);

                        m2.update(this.getSelectedOptions(master));
                        m1.update(this.getNonSelectOptions(master));

                        m.down('.multis-right').observe('click', function(event){ event.stop(); this.moveRight(m1,m2,master)}.bind(this));
                        m.down('.multis-left').observe('click', function(event){ event.stop(); this.moveLeft(m1,m2,master)}.bind(this));
                        m.down('.multis-right-all').observe('click', function(event){ event.stop(); this.moveRightAll(m1,m2,master)}.bind(this));
                        m.down('.multis-left-all').observe('click', function(event){ event.stop(); this.moveLeftAll(m1,m2,master)}.bind(this));


                        m1.observe('dblclick', function(event){ this.moveRight(m1,m2,master)}.bind(this));
                        m2.observe('dblclick', function(event){ this.moveLeft(m1,m2,master)}.bind(this));

                        m1.sortOptions();
                        m2.sortOptions();

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
        moveAll : function(from, to, master, select){
                from.descendants().each(function(opt){
                        to.insert({bottom:opt});
                        var matchedElemTo = master.down('option[value="' + opt.value + '"]');
                        if (select) {
                                matchedElemTo.setAttribute('selected', 'selected');
                        } else {
                                matchedElemTo.removeAttribute('selected');
                        }
                });
                to.sortOptions();
                from.descendants().each(function(opt){
                        var matchedElemFrom = master.down('option[value="' + opt.value + '"]');
                        if (select) {
                                matchedElemFrom.setAttribute('selected', 'selected');
                        } else {
                                matchedElemFrom.removeAttribute('selected');
                        }
                        opt.remove();
                });
        },
        moveLeft : function(m1,m2,master){
                this.move(m2, m1, master, false);
        },
        moveRight : function(m1,m2,master){
                this.move(m1, m2, master, true);
        },
        moveRightAll : function(m1,m2,master){
                this.moveAll(m1, m2, master, true);
        },
        moveLeftAll : function(m1,m2,master){
                this.moveAll(m2, m1, master, false);
        },
        getSelectedOptions : function(select){
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
        getNonSelectOptions : function(select){
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
        },
        initialise_dom_extents : function(){
            Element.addMethods({
                sortOptions : function(element)
                {
                        var tmpAry = new Array();
                        for (var i=0;i<element.options.length;i++) {
                                tmpAry[i] = new Array();
                                tmpAry[i][0] = element.options[i].text;
                                tmpAry[i][1] = element.options[i].value;
                        }
                        tmpAry.sort();
                        while (element.options.length > 0) {
                                element.options[0] = null;
                        }
                        for (var i=0;i<tmpAry.length;i++) {
                                var op = new Option(tmpAry[i][0], tmpAry[i][1]);
                                element.options[i] = op;
                        }
                        return;
                }
            });
        }
});


