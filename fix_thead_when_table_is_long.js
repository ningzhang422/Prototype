function UpdateTableHeaders(paddingValue) {
     $$('.divTableWithFloatingHeaderClass').each(function(e,index){
        var div_wrap = $("divTableWithFloatingHeader"+'_'+index);
        var originalHeaderRow = $("tableFloatingHeaderOriginal"+'_'+index);
        var floatingHeaderRow = $("tableFloatingHeader"+'_'+index);
        var offset = div_wrap.cumulativeOffset();//Position.page(div_wrap);
        var scrollTop = document.viewport.getScrollOffsets()['top'];
                if ((scrollTop > offset.top) && (scrollTop < offset.top + div_wrap.getHeight()))
                {
                    floatingHeaderRow.setStyle({visibility: "visible",
                                                top: Math.min(scrollTop - offset.top, div_wrap.getHeight() - floatingHeaderRow.getHeight())-3 + "px",
                                                background: "#b9c9fe"});
                    floatingHeaderRow.down('tr').childElements().each(function(index,i) {
                        index.width = originalHeaderRow.down('tr').childElements()[i].getWidth()-parseInt(paddingValue);
                    });

                    // Copy row width from whole table
                    //floatingHeaderRow.setStyle({width: div_wrap.getWidth()});
                    //floatingHeaderRow.down('tr').setStyle({width: div_wrap.getWidth()});
                }
                else {
                    floatingHeaderRow.setStyle({
                        visibility: "hidden",
                        top: "0px",
                        background: "#b9c9fe"
                    });

                }
     });
}

// => start here:  Find all tables which has class tableWithFloatingHeader. and copy thead then creat a new one encapsulated in a New Div.
$$('.tableWithFloatingHeader').each(function(e,index){
        e.wrap(new Element('div', {
                  id: 'divTableWithFloatingHeader'+'_'+index,
                  class: 'divTableWithFloatingHeaderClass',
                  style: 'position:relative'
                }));

        var tr_origin = e.down('thead',0);
        var tr_first_clone = tr_origin.cloneNode(true);
        tr_first_clone.setStyle({ position: "absolute",top:"0px",left:"0px",visibility:"hidden" });
        tr_origin.insert({before:tr_first_clone});
        tr_first_clone.id='tableFloatingHeader'+'_'+index;
        tr_origin.id='tableFloatingHeaderOriginal'+'_'+index;
        UpdateTableHeaders(11);
        document.observe('scroll',function(e){
                UpdateTableHeaders(11);
        });

  });
