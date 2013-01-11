Toggler = Class.create();

Toggler.prototype = {
  _states:  null,
  _id:      null,
  _key:     null,

  /*
  * Usage: new Toggler('node', { 'a': 'b', 'c': 'd' });
  * Will fire a toggler:a event when clicked, switch to the next state (b) and update node content to d.
  */
  initialize: function(id, states) {
    this.setId(id);
    this.setStates(states);

    var node = this.getNode();
    if(node) {
      var toggler = this;
      this.initializeKey();

      var current_state_value = this.getCurrentStateValue();

      node.observe("click", function(event) {
        toggler.toggle();
      });

      // node.observe("mouseover", function(event) {
      //   node.addClassName("highlight");
      //   toggler.setContent(toggler.getNextStateValue());
      // })
      //
      // node.observe("mouseout", function(event) {
      //   node.removeClassName("highlight");
      //   toggler.setContent(toggler.getStateOf(toggler.getKey()));
      // });

      // Dynamic method, permit my_toggler.a()
      this.getStatesKeys().each(function(key) {
        Toggler.prototype[key] = function() {
          return toggler.getKey() == key;
        }
      });
    }
  },

  getStates: function() {
    return this._states;
  },

  setStates: function(states) {
    this._states = new Hash(states);
  },

  getId: function() {
    return this._id;
  },

  setId: function(id) {
    this._id = id;
  },

  getKey: function() {
    return this._key;
  },

  setKey: function(key) {
    this._key = key
  },

  getNode: function(id) {
    return $(this.getId());
  },

  getContent: function() {
    return this.getNode().innerHTML;
  },

  setContent: function(content) {
    this.getNode().innerHTML = content;
  },

  getStatesKeys: function() {
    return this.getStates().keys();
  },

  getStatesValues: function() {
    return this.getStates().values();
  },

  getStatesCount: function() {
    return this.getStates().size();
  },

  getStateOf: function(key) {
    return this.getStates().get(key);
  },

  initializeKey: function() {
    var state = false;
    var local = this;
    this.getStatesKeys().each(function(key) {
      if(local.getContent() == local.getStateOf(key))
        return local.setKey(key);
    });
    return false;
  },

  getCurrentStateValue: function() {
    return this.getContent();
  },

  getCurrentKeyIndex: function() {
    return this.getStatesKeys().indexOf(this.getKey());
  },

  getNextKeyIndex: function() {
    return (this.getStatesKeys().indexOf(this.getKey()) + 1) % this.getStatesCount();
  },

  getNextKey: function() {
    return this.getStatesKeys()[this.getNextKeyIndex()];
  },

  getNextStateValue: function() {
    return this.getStatesValues()[this.getNextKeyIndex()]
  },

  nextState: function() {
    var current_index = this.getCurrentKeyIndex();
    var current_key   = this.getStatesKeys()[current_index];
    var next_index    = (current_index + 1) % this.getStatesCount();
    var next_key      = this.getStatesKeys()[next_index];

    if(current_key) {
      this.setContent(this.getStatesValues()[next_index]);
      this.setKey(next_key);
      this.getNode().fire("toggler:" + current_key);
    }
  },

  toggle: function() {
    this.nextState();
  },

  unregistered: function() {
    return ! this.getNode();
  }
};
