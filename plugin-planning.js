/*
* planning_mix.js
* Prototype/Scriptaculous
* il s'est impliqué dans equipe -> planning
* @version 2.0
* @author Ning
* 20/09/2012
************************************************/
Planning_mix = Class.create();

Planning_mix.prototype = {

  /**
  * Private cache, Element Div Id pour un ticket
  */
  _id:      null,
  /**
  * Private cache, Element Div Title
  */
  _title:   null,
  /**
  * Private cache, Element Div Style
  */
  _style:   null,
  /**
  * Private cache, css height of Div ticket
  */
  _height:  null,
  /**
  * Private cache, css width of Div ticket, value default 111px
  */
  _width:   111, 
  /**
  * Private cache, css left of Div ticket
  */
  _left:    null,
  /**
  * Private cache, css top of Div ticket
  */
  _top:     null,
  /**
  * décalage des minutes, ex: 14:10 => 14:00 et _deca = 10
  */
  _deca:    0,
  /**
  * hauteur par minute, value default 1px
  */
  _height_unite: 1,
  /**
  * Private cache
  */
  _during_minites: null, 
  /**
  * Private cache
  */
  _start_time: null,
  /**
  * Private cache
  */
  _end_time: null,


  /**
  * Init function, Mettre en ordre
  */
  initialize: function(id, title){
	this.setId(id);
	this.setTitle(title);
        this.setDeca();
	this.setLeft();
	this.setTop();
	this.setStartTime();
	this.setEndTime();
	this.setDuringMinites();
	this.setHeight();
	this.setWidth();
       	this.show();
  },

  getId: function() {
    return this._id;
  },

  setId: function(id) {
    this._id = id;
  },

  getTitle: function() {
    return this._title;
  },

  setTitle: function(title) {
    var title_changed = ''
    var hhmm = title.split('-')[1];
    var hh = hhmm.split(':')[0];
    var mm = hhmm.split(':')[1];
    if(mm != '00' && mm != '30'){
	if(parseInt(mm)<30){
		mm = '00'
        	title_changed = title.split('-')[0]+'-'+hh+':'+mm;
	}else{
		mm = '30'
        	title_changed = title.split('-')[0]+'-'+hh+':'+mm;
	}
    }else{
	title_changed = title;
    }
    this._title = title_changed;
  },

  getLeft: function() {
    return this._left;
  },

  setLeft: function() {
    overlap = this.getId().split('-')[4];
/***
    Façon d'affichage, en divisant numbre des tickets dans la journée.

    if(parseInt(overlap.split('/')[0]) == 1){
        this._left = this.getTdPositionLeft();
    }else if(parseInt(overlap.split('/')[0]) != 1 && parseInt(overlap.split('/')[1]) > 0){
        this._left = parseInt(this.getTdPositionLeft())+(parseInt(this._width)/parseInt(overlap.split('/')[0]))*parseInt(overlap.split('/')[1]);
    }else{
	this._left = this.getTdPositionLeft();
    }

***/ 
    this._left = parseInt(this.getTdPositionLeft())+parseInt(overlap.split('/')[1])
  },

  getTop: function() {
    return this._top;
  },

  setTop: function() {
    this._top = parseInt(this.getTdPositionTop());
  },
  
  getDeca: function(){
    return this._deca;
  },

  setDeca: function() {
    var hhmm = this.getId().split('-')[2];
    var hh = hhmm.split(':')[0];
    var mm = hhmm.split(':')[1];
    
    if(mm != '00' && mm != '30'){
        if(parseInt(mm)<30){
		this._deca = Number(mm);	
        }else{
		this._deca = 30-(60-Number(mm));
        }
    }else{
	this._deca = 0;
    }
  },
  
  getHeight: function() {
    return this._height;
  },

  setHeight: function() {
    this._height = parseInt(this.getDuringMinites())*parseInt(this._height_unite);
  },
  
  getWidth: function() {
    return this._width;
  },

  setWidth: function() {
    overlap = this.getId().split('-')[4];
/***
    Façon d'affichage, en divisant numbre des tickets dans la journée.

    if(parseInt(overlap.split('/')[0]) == 1){
    	this._width = this._width;
    }else{
	this._width = parseInt(this._width)/parseInt(overlap.split('/')[0]);
    }
***/
    this._width = parseInt(overlap.split('/')[0])
  },

  getStartTime: function() {
    return this._start_time;
  },

  setStartTime: function() {
    this._start_time = this.getId().split('-')[2];
  },

  getEndTime: function() {
    return this._end_time;
  },

  setEndTime: function() {
    this._end_time = this.getId().split('-')[3];
  },

  getDuringMinites: function() {
    return this._during_minites;
  },

  setDuringMinites: function() {
    var d1 = this.toDate(this.getId(),this.getStartTime());
    var d2 = this.toDate(this.getId(),this.getEndTime());

    this._during_minites = Math.floor(((d2-d1)/1000)/60);
  },

  getNode: function() {
    return $(this.getId());
  },
  
  getTdPositionLeft: function() {
    return parseInt(Position.cumulativeOffset($(this.getTitle())).left)-parseInt(Position.cumulativeOffset($(this.getNode())).left);
  },

  getTdPositionTop: function() {
    return parseInt(Position.cumulativeOffset($(this.getTitle())).top)-parseInt(Position.cumulativeOffset($(this.getNode())).top);
  },

  getPosition: function() {
    return this.getNode.positionedOffset;
  },

  show: function() {
    this.getNode().setStyle({
                top:  this.getTop()+this.getDeca()+'px',
                left: this.getLeft()+'px',
		height: this.getHeight()+'px',
		width: this.getWidth()+'px',
        });
  
    new Effect.SlideDown(this.getNode(), {duration:3})

    this.getNode().observe('click',function(sible){
		var person_id = getPersonIdFromEvent(sible);
		var date = sible.target.title.split('-').first();
        	var time = sible.target.title.split('-').last();
        	var window_id = "individual_intervention_details_window";
		var className = sible.target.id.split('-').first();

        	// If window already exists, just center and quit.
        	var container = UI.defaultWM.getWindow(window_id)
        	if(container) {
          	  container.center();
                  return;
        	}

        	container = new UI.Window({
                      id: window_id,
                      theme:  "leopard",
                      shadow: true,
                      width:  800,
                      height: 600
                    });
		var url = '';
		if(className == 'CollectiveIntervention'){
			url = '/people/' + person_id + '/collective_interventions/';
		}else{
			url = '/people/' + person_id + '/individual_interventions/'
		}
        	container.center().setHeader("Informations détaillées de l'intervention");

        	container.setAjaxContent(url, {
          	  'method': 'get',
           	  'parameters': {
            	  'date': date,
            	  'time': time
          	  }
        	});

        	container.show().focus();
        	});
  },

  toDate: function(_string,time){
	var year = _string.split('-')[1].split('/')[2];
	var month = _string.split('-')[1].split('/')[1];
	var day = _string.split('-')[1].split('/')[0];
	var now = new Date(year+'/'+month+'/'+day+' '+time);
	return now;
  }

};

document.observe('dom:loaded', function(){
if($$("div.border_bottom_mix")){
  $$("div.border_bottom_mix").each(function(e){
	new Planning_mix(e.id,e.title);
	e.observe('mouseover', function(sible) {
      		e.setStyle({ 
			zIndex: 1,
			});
    	});
    	e.observe('mouseout', function(sible) {
		e.setStyle({
                        zIndex: 0,
                        });
    	});
  });
}
});
function getPersonIdFromEvent(event) {
  var node = event.target.up('DIV');
  return node.readAttribute('id').split('-').last();
} // getPersonIdFromEvent
