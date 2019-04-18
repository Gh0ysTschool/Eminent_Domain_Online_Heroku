"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var app = function () {
  'use strict';

  function noop() {}

  function assign(tar, src) {
    for (var k in src) {
      tar[k] = src[k];
    }

    return tar;
  }

  function addLoc(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: {
        file: file,
        line: line,
        column: column,
        char: char
      }
    };
  }

  function run(fn) {
    fn();
  }

  function append(target, node) {
    target.appendChild(node);
  }

  function insert(target, node, anchor) {
    target.insertBefore(node, anchor);
  }

  function detachNode(node) {
    node.parentNode.removeChild(node);
  }

  function destroyEach(iterations, detach) {
    for (var i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detach);
    }
  }

  function createElement(name) {
    return document.createElement(name);
  }

  function createText(data) {
    return document.createTextNode(data);
  }

  function createComment() {
    return document.createComment('');
  }

  function addListener(node, event, handler, options) {
    node.addEventListener(event, handler, options);
  }

  function removeListener(node, event, handler, options) {
    node.removeEventListener(event, handler, options);
  }

  function setAttribute(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);else node.setAttribute(attribute, value);
  }

  function setData(text, data) {
    text.data = '' + data;
  }

  function setStyle(node, key, value) {
    node.style.setProperty(key, value);
  }

  function blankObject() {
    return Object.create(null);
  }

  function destroy(detach) {
    this.destroy = noop;
    this.fire('destroy');
    this.set = noop;

    this._fragment.d(detach !== false);

    this._fragment = null;
    this._state = {};
  }

  function destroyDev(detach) {
    destroy.call(this, detach);

    this.destroy = function () {
      console.warn('Component was already destroyed');
    };
  }

  function _differs(a, b) {
    return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
  }

  function fire(eventName, data) {
    var handlers = eventName in this._handlers && this._handlers[eventName].slice();

    if (!handlers) return;

    for (var i = 0; i < handlers.length; i += 1) {
      var handler = handlers[i];

      if (!handler.__calling) {
        try {
          handler.__calling = true;
          handler.call(this, data);
        } finally {
          handler.__calling = false;
        }
      }
    }
  }

  function flush(component) {
    component._lock = true;
    callAll(component._beforecreate);
    callAll(component._oncreate);
    callAll(component._aftercreate);
    component._lock = false;
  }

  function get() {
    return this._state;
  }

  function init(component, options) {
    component._handlers = blankObject();
    component._slots = blankObject();
    component._bind = options._bind;
    component._staged = {};
    component.options = options;
    component.root = options.root || component;
    component.store = options.store || component.root.store;

    if (!options.root) {
      component._beforecreate = [];
      component._oncreate = [];
      component._aftercreate = [];
    }
  }

  function on(eventName, handler) {
    var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
    handlers.push(handler);
    return {
      cancel: function cancel() {
        var index = handlers.indexOf(handler);
        if (~index) handlers.splice(index, 1);
      }
    };
  }

  function set(newState) {
    this._set(assign({}, newState));

    if (this.root._lock) return;
    flush(this.root);
  }

  function _set(newState) {
    var oldState = this._state,
        changed = {},
        dirty = false;
    newState = assign(this._staged, newState);
    this._staged = {};

    for (var key in newState) {
      if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
    }

    if (!dirty) return;
    this._state = assign(assign({}, oldState), newState);

    this._recompute(changed, this._state);

    if (this._bind) this._bind(changed, this._state);

    if (this._fragment) {
      this.fire("state", {
        changed: changed,
        current: this._state,
        previous: oldState
      });

      this._fragment.p(changed, this._state);

      this.fire("update", {
        changed: changed,
        current: this._state,
        previous: oldState
      });
    }
  }

  function _stage(newState) {
    assign(this._staged, newState);
  }

  function setDev(newState) {
    if (_typeof(newState) !== 'object') {
      throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
    }

    this._checkReadOnly(newState);

    set.call(this, newState);
  }

  function callAll(fns) {
    while (fns && fns.length) {
      fns.shift()();
    }
  }

  function _mount(target, anchor) {
    this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
  }

  var protoDev = {
    destroy: destroyDev,
    get: get,
    fire: fire,
    on: on,
    set: setDev,
    _recompute: noop,
    _set: _set,
    _stage: _stage,
    _mount: _mount,
    _differs: _differs
  };
  /* src\App.html generated by Svelte v2.16.1 */

  var methods = {
    choosewrapper: function choosewrapper(c, zone) {
      if (app.get().game.displayinfo.selectionzone == zone && (app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name || !app.get().lobby.online)) {
        if (app.get().game.displayinfo.allowformultipleselections) {
          app.multiplechoose(c);
        } else {
          app.choose([c]);
        }
      }
    },
    multiplechoose: function multiplechoose(choice) {
      var game = app.get().game;

      if (app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name || !app.get().lobby.online) {
        if (!game[game.displayinfo.choicelabel].includes(choice)) {
          game[game.displayinfo.choicelabel].push(choice);
          choice.selected = true;

          if (choice.type !== 'planet' && choice.type !== 'fertile' && choice.type !== 'metallic' && choice.type !== 'advanced' && choice.name != 'Skip') {
            choice.final_destination_label = 'discard';
            game.players[game.acting_player_index].limbo.push(choice);
            game.players[game.acting_player_index].hand = game.players[game.acting_player_index].hand.filter(function (el) {
              return el.identifier != choice.identifier;
            });
          }
        } else {
          //let i = game[game.displayinfo.choicelabel].indexOf(choice);
          choice.selected = false; //game[game.displayinfo.choicelabel].splice(i,1);

          if (choice.type !== 'planet' && choice.type !== 'fertile' && choice.type !== 'metallic' && choice.type !== 'advanced' && choice.name != 'Skip') {
            game[game.displayinfo.choicelabel] = game[game.displayinfo.choicelabel].filter(function (el) {
              return el.identifier != choice.identifier;
            });
            game.players[app.get().game.acting_player_index].hand.push(choice);
            game.players[app.get().game.acting_player_index].limbo = game.players[game.acting_player_index].limbo.filter(function (el) {
              return el.identifier != choice.identifier;
            });
          }
        }

        app.set({
          'game': game
        });
      }
    },
    choose: function choose(choices) {
      if (app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name || !app.get().lobby.online) {
        var _game = app.get().game;
        _game.options = [];

        for (var i in choices) {
          choices[i].selected = false;
        }

        _game[_game.displayinfo.choicelabel] = choices;
        app.set({
          'game': _game
        });
        app.phasefinishfunction();
      }
    },
    unchoose: function unchoose(choice) {
      if (app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name || !app.get().lobby.online) {
        var _game2 = app.get().game;

        if (_game2[_game2.displayinfo.choicelabel].includes(choice)) {
          choice.selected = false;
          _game2.players[_game2.acting_player_index].limbo = _game2.players[_game2.acting_player_index].limbo.filter(function (el) {
            return el.identifier != choice.identifier;
          });
          _game2[_game2.displayinfo.choicelabel] = _game2[_game2.displayinfo.choicelabel].filter(function (el) {
            return el.identifier != choice.identifier;
          });
          choice.final_destination_label = '';

          _game2.players[_game2.acting_player_index].hand.push(choice);

          app.set({
            game: _game2
          });
        }
      }
    },
    offer: function offer(skippable
    /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
    , multiple
    /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
    , _ref
    /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
    , choice_label
    /* label for where the choice is stored | set with game[label]=*/
    , callback
    /*callback that handles the choice or finishes the phase*/
    ) {
      var _ref2 = _slicedToArray(_ref, 2),
          field_label = _ref2[0],
          choices = _ref2[1];

      var game = app.get().game;
      game.displayinfo.selectionzone = field_label;
      game.displayinfo.allowformultipleselections = multiple;
      game.displayinfo.showoptiontoskip = skippable;
      game.displayinfo.choicelabel = choice_label; //game.displayinfo.callback=callback;

      if (field_label == 'hand') {
        choices = app.get().game.players[app.get().game.acting_player_index].hand;
      } else if (field_label == 'research') {
        choices = app.get().game.research_deck;
      } else if (field_label == 'discard') {
        choices = app.get().game.players[app.get().game.acting_player_index].discard;
      } else if (field_label == 'planets') {
        choices = app.get().game.planet_deck;
      } else if (field_label == 'rolecards') {
        choices = app.get().game.stacks.rolecards;
        game.displayinfo.center_or_planets = true;
      } else if (field_label == 'unsettled_planets') {
        choices = app.get().game.players[app.get().game.acting_player_index].unsettled_planets;
        game.displayinfo.center_or_planets = false;
      } else if (field_label == 'settled_planets') {
        choices = app.get().game.players[app.get().game.acting_player_index].settled_planets;
        game.displayinfo.center_or_planets = false;
      } else if (field_label == 'conquered_planets') {
        choices = app.get().game.players[app.get().game.acting_player_index].conquered_planets;
        game.displayinfo.center_or_planets = false;
      } else if (field_label == 'settled_&_conquered_planets') {
        choices = [].concat(_toConsumableArray(app.get().game.players[app.get().game.acting_player_index].settled_planets), _toConsumableArray(app.get().game.players[app.get().game.acting_player_index].conquered_planets));
        game.displayinfo.center_or_planets = false;
      }

      game[choice_label] = [];
      app.set({
        'game': game
      }); //if (skippable) {choices.push({'name':"Skip"})};
      //if (multiple) {choices.push({'name':"Choose All Selected"})};

      app.present_as_choice(choices);
    },
    discard: function discard(source_array, destination_array, identifier) {
      var temp_array = [];
      var removed = false;

      for (var i in source_array) {
        var elem = source_array.pop();

        if (identifier == elem.identifier && !removed) {
          destination_array.push(elem);
          removed = true;
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i2 in temp_array) {
        source_array.push(totstemp_array[_i2]);
      }
    },
    //draw deck->hand
    totalinfluence: function totalinfluence() {
      var players = app.get().game.players;

      for (var i in players) {
        var arr = [].concat(_toConsumableArray(players[i].deck), _toConsumableArray(players[i].discard), _toConsumableArray(players[i].limbo), _toConsumableArray(players[i].hand));

        for (var _j in arr) {
          if (arr[_j].influence >= 1) {
            players[i].influence.push(arr[_j].influence);
          }
        }

        var inf = 0;

        for (var l in players[i].influence) {
          inf += players[i].influence[l];
        }

        players[i].influence = inf;
      }

      app.set({
        'game': { ...app.get().game,
          'players': players
        }
      });
    },
    endgame: function endgame() {
      //display victor
      var scores = app.get().game.players.map(function (e) {
        return e.influence;
      });
      var winner = '';
      var highest = scores[0];
      app.get().game.players.map(function (e) {
        if (highest < e.influence) {
          winner = e.name;
          highest = e.influence;
        }
      });
      app.send({
        'game': { ...app.get().game,
          'winner': winner
        }
      });
      app.get().ws.send(JSON.stringify({ ...app.get().game,
        header: 'remove'
      }));
    },
    checkforendgame: function checkforendgame() {
      var depletedstacks = 0;

      for (var el in app.get().game.stacks.pilecount) {
        if (app.get().game.stacks.pilecount[el] < 1) {
          depletedstacks++;
        }
      }

      var stacklimit = 0;

      if (app.get().game.number_of_players == 1 || app.get().game.number_of_players == 2) {
        stacklimit = 1;
      } else if (app.get().game.number_of_players == 3 || app.get().game.number_of_players == 4) {
        stacklimit = 2;
      }

      if (stacklimit <= depletedstacks || app.get().game.influence.length == 0) {
        return true;
      } else {
        return false;
      }
    },
    draw: function draw(player) {
      var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      for (var i = 0; i < quantity; i++) {
        if (player.deck.length != 0) {
          player.hand.push(player.deck.pop());
        } else {
          for (var _j2 in player.discard) {
            player.deck.push(player.discard.pop());
          }

          player.deck = app.knuthshuffle(player.deck);
          player.hand.push(player.deck.pop());
        }
      }

      return player;
    },
    play: function play(source_array, destination_array, final_destination_label, identifier) {
      var temp_array = [];
      var removed = false;
      var iterations = source_array.length;

      for (var i = 0; i < iterations; i++) {
        var elem = source_array.pop();

        if (identifier == elem.identifier && !removed) {
          elem.final_destination_label = final_destination_label;
          destination_array.push(elem);
          removed = true;
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i3 in temp_array) {
        source_array.push(temp_array[_i3]);
      }
    },
    send: function send(state) {
      app.set(state);

      if (app.get().ws !== undefined) {
        app.sendstate();
      }
    },
    generate_research_card: function generate_research_card(name) {
      var _card2;

      var _card = (_card2 = {
        name: name,
        type: name,
        identifier: app.generate_unique_identifier(),
        icons: {
          'survey': 0,
          'warfare': 0,
          'colonize': 0,
          'produce': 0,
          'trade': 0,
          'research': 0
        },
        planet_requirements: {
          'advanced': 0,
          'metallic': 0,
          'fertile': 0
        },
        research_cost: 0,
        action: function action() {},
        is_permanent: false,
        is_doublesided: false,
        imgurl: "./images/",
        Influence_value: 0,
        img: function img(im) {
          this.imgurl += im;
          return this;
        },
        influence: function influence(inf) {
          this.influence_value = inf;
          return this;
        },
        metallic: function metallic(met) {
          this.planet_requirements.metallic = met;
          return this;
        },
        advanced: function advanced(adv) {
          this.planet_requirements.advanced = adv;
          return this;
        },
        fertile: function fertile(fer) {
          this.planet_requirements.fertile = fer;
          return this;
        },
        research: function research(res) {
          this.research_cost = res;
          return this;
        },
        permanent: function permanent() {
          this.is_permanent = true;
          return this;
        },
        doubleside: function doubleside() {
          this.is_doublesided = true;
          return this;
        }
      }, _defineProperty(_card2, "icons", function icons(_icons) {
        this.icons = Object.assign(this.icons, _icons);
        return this;
      }), _defineProperty(_card2, "improved_colonize", function improved_colonize() {
        this.research(3);
        this.imgurl += "improvedcolonize";
        return this;
      }), _defineProperty(_card2, "improved_survey", function improved_survey() {
        this.research(3);
        this.imgurl += "improvedsurvey";
        return this;
      }), _defineProperty(_card2, "improved_research", function improved_research() {
        this.research(3);
        this.imgurl += "improvedresearch";
        return this;
      }), _defineProperty(_card2, "improved_warfare", function improved_warfare() {
        this.research(3);
        this.imgurl += "improvedwarfare";
        return this;
      }), _defineProperty(_card2, "improved_production", function improved_production() {
        this.research(3);
        this.imgurl += "improvedproduction";
        return this;
      }), _defineProperty(_card2, "improved_trade", function improved_trade() {
        this.research(3);
        this.imgurl += "improvedtrade";
        return this;
      }), _defineProperty(_card2, "surveyteam", function surveyteam() {
        return this.research(5).metallic(2).influence(2).icons({
          'survey': 2
        }).img('surveyteam');
      }), _defineProperty(_card2, "warpath", function warpath() {
        return this.research(5).metallic(2).influence(2).icons({
          'warfare': 2
        }).img('warpath');
      }), _defineProperty(_card2, "terraforming", function terraforming() {
        return this.research(5).fertile(2).influence(2).icons({
          'colonize': 2
        }).img('terraforming');
      }), _defineProperty(_card2, "geneticengineering", function geneticengineering() {
        return this.research(5).fertile(2).influence(2).icons({
          'produce': 2
        }).img('geneticengineering');
      }), _defineProperty(_card2, "artificialintelligence", function artificialintelligence() {
        return this.research(5).fertile(2).influence(2).icons({
          'colonize': 1,
          'produce': 1
        }).img('artificialintelligence');
      }), _defineProperty(_card2, "diversemarkets", function diversemarkets() {
        return this.research(5).advanced(2).influence(2).icons({
          'research': 1,
          'trade': 1
        }).img('diversemarkets');
      }), _defineProperty(_card2, "specialization", function specialization() {
        return this.research(5).advanced(2).influence(2).icons({
          'trade': 2
        }).img('specialization');
      }), _defineProperty(_card2, "mobilization", function mobilization() {
        return this.research(5).metallic(2).influence(2).icons({
          'survey': 1,
          'warfare': 1
        }).img('mobilization');
      }), _defineProperty(_card2, "datanetwork", function datanetwork() {
        return this.research(5).advanced(2).influence(2).icons({
          'research': 2
        }).img('datanetwork');
      }), _defineProperty(_card2, "abundance", function abundance() {
        this.research(5);
        this.imgurl += "abundance";
        this.is_doublesided = true;
        this.is_permanent = true;
        return this.fertile(2).influence(2);
      }), _defineProperty(_card2, "adaptability", function adaptability() {
        this.research(7);
        this.imgurl += "adaptability";
        this.is_doublesided = true;
        this.is_permanent = true;
        return this.advanced(3).influence(5);
      }), _defineProperty(_card2, "bureaucracy", function bureaucracy() {
        this.research(7);
        this.imgurl += "bureaucracy";
        this.is_doublesided = true;
        this.is_permanent = true;
        return this.fertile(3).influence(5);
      }), _defineProperty(_card2, "dissension", function dissension() {
        return this.research(7).fertile(3).influence(5).permanent().doubleside().img('dissension');
      }), _defineProperty(_card2, "hyperefficiency", function hyperefficiency() {
        return this.research(7).advanced(3).influence(5).permanent().doubleside().img('hyperefficiency');
      }), _defineProperty(_card2, "imperialism", function imperialism() {
        return this.research(5).metallic(2).influence(2).permanent().doubleside().img('imperialism').icons({
          'survey': 1,
          'trade': 1,
          'warfare': 1
        });
      }), _defineProperty(_card2, "logistics", function logistics() {
        return this.research(7).metallic(3).influence(5).permanent().doubleside().img('logistics');
      }), _defineProperty(_card2, "productivity", function productivity() {
        return this.research(7).metallic(3).influence(5).permanent().doubleside().img('productivity');
      }), _defineProperty(_card2, "scorchedearthpolicy", function scorchedearthpolicy() {
        return this.research(5).metallic(2).influence(2).permanent().doubleside().img('scorchedearthpolicy');
      }), _defineProperty(_card2, "streamlining", function streamlining() {
        return this.research(5).advanced(2).influence(2).permanent().doubleside().img('streamlining');
      }), _defineProperty(_card2, "weaponsemporium", function weaponsemporium() {
        return this.research(5).advanced(2).influence(2).permanent().doubleside().img('weaponemporium');
      }), _defineProperty(_card2, "fertilegrounds", function fertilegrounds() {
        return this.research(5).fertile(2).influence(2).permanent().doubleside().img('fertilegrounds').icons({
          'research': 1,
          'colonize': 1,
          'produce': 1
        });
      }), _card2);

      return _card;
    },
    generate_research_deck: function generate_research_deck() {
      var _deck = [app.generate_research_card('improved_production').metallic(1).icons({
        'warfare': 1,
        'produce': 1
      }).improved_production().img("wp100.png"), app.generate_research_card('improved_production').metallic(1).icons({
        'survey': 1,
        'produce': 1
      }).improved_production().img("sp100.png"), app.generate_research_card('improved_trade').metallic(1).icons({
        'survey': 1,
        'trade': 1
      }).improved_trade().img("st100.png"), app.generate_research_card('improved_trade').metallic(1).icons({
        'warfare': 1,
        'trade': 1
      }).improved_trade().img("wt100.png"), app.generate_research_card('improved_research').metallic(1).icons({
        'warfare': 1,
        'research': 1
      }).improved_research().img("wr100.png"), app.generate_research_card('improved_research').metallic(1).icons({
        'survey': 1,
        'research': 1
      }).improved_research().img("sr100.png"), app.generate_research_card('improved_colonize').metallic(1).icons({
        'warfare': 1,
        'colonize': 1
      }).improved_colonize().img("wc100.png"), app.generate_research_card('improved_colonize').metallic(1).icons({
        'survey': 1,
        'colonize': 1
      }).improved_colonize().img("sc100.png"), app.generate_research_card('improved_warfare').fertile(1).icons({
        'produce': 1,
        'warfare': 1
      }).improved_warfare().img("pw100.png"), app.generate_research_card('improved_warfare').fertile(1).icons({
        'colonize': 1,
        'warfare': 1
      }).improved_warfare().img("cw100.png"), app.generate_research_card('improved_trade').fertile(1).icons({
        'produce': 1,
        'trade': 1
      }).improved_trade().img("pt100.png"), app.generate_research_card('improved_trade').fertile(1).icons({
        'colonize': 1,
        'trade': 1
      }).improved_trade().img("ct100.png"), app.generate_research_card('improved_research').fertile(1).icons({
        'produce': 1,
        'research': 1
      }).improved_research().img("pr100.png"), app.generate_research_card('improved_research').fertile(1).icons({
        'colonize': 1,
        'research': 1
      }).improved_research().img("cr100.png"), app.generate_research_card('improved_survey').fertile(1).icons({
        'produce': 1,
        'survey': 1
      }).improved_survey().img("ps100.png"), app.generate_research_card('improved_survey').fertile(1).icons({
        'colonize': 1,
        'survey': 1
      }).improved_survey().img("cs100.png"), app.generate_research_card('improved_production').advanced(1).icons({
        'research': 1,
        'produce': 1
      }).improved_production().img("rp100.png"), app.generate_research_card('improved_production').advanced(1).icons({
        'trade': 1,
        'produce': 1
      }).improved_production().img("tp100.png"), app.generate_research_card('improved_warfare').advanced(1).icons({
        'warfare': 1,
        'trade': 1
      }).improved_warfare().img("tw100.png"), app.generate_research_card('improved_warfare').advanced(1).icons({
        'research': 1,
        'warfare': 1
      }).improved_warfare().img("rw100.png"), app.generate_research_card('improved_colonize').advanced(1).icons({
        'colonize': 1,
        'trade': 1
      }).improved_colonize().img("tc100.png"), app.generate_research_card('improved_colonize').advanced(1).icons({
        'research': 1,
        'colonize': 1
      }).improved_colonize().img("rc100.png"), app.generate_research_card('improved_survey').advanced(1).icons({
        'trade': 1,
        'survey': 1
      }).improved_survey().img("ts100.png"), app.generate_research_card('improved_survey').advanced(1).icons({
        'research': 1,
        'survey': 1
      }).improved_survey().img("rs100.png"), app.generate_research_card('survey_team').surveyteam().img("100.png"), app.generate_research_card('war_path').warpath().img("100.png"), app.generate_research_card('terraforming').terraforming().img("100.png"), app.generate_research_card('genetic_engineering').geneticengineering().img("100.png"), app.generate_research_card('artificial_intelligence').artificialintelligence().img("100.png"), app.generate_research_card('diverse_markets').diversemarkets().img("100.png"), app.generate_research_card('specialization').specialization().img("100.png"), app.generate_research_card('mobilization').mobilization().img("100.png"), app.generate_research_card('data_network').datanetwork().img("100.png"), app.generate_research_card('abundance').abundance().img("100.png"), app.generate_research_card('adaptability').adaptability().img("100.png"), app.generate_research_card('bureaucracy').bureaucracy().img("100.png"), app.generate_research_card('dissension').dissension().img("100.png"), app.generate_research_card('hyperefficiency').hyperefficiency().img("100.png"), app.generate_research_card('imperialism').imperialism().img("100.png"), app.generate_research_card('logistics').logistics().img("100.png"), app.generate_research_card('productivity').productivity().img("100.png"), app.generate_research_card('scorched_earth_policy').scorchedearthpolicy().img("100.png"), app.generate_research_card('streamlining').streamlining().img("100.png"), app.generate_research_card('weapons_emporium').weaponsemporium().img("100.png"), app.generate_research_card('fertile_grounds').fertilegrounds().img("100.png")];
      var game = app.get().game;
      game.research_deck = _deck;
      app.set({
        'game': game
      });
    },
    generateplayer: function generateplayer(_id) {
      var _player2;

      var game = app.get().game;

      var _player = (_player2 = {
        'id': _id,
        'actionrolesequence': 'ar',
        //can be ar. ra, aar, ara, raa
        'specialization': '',
        'available': true,
        'rounds': 0,
        'limbo': [],
        'deck': [],
        'hand': [],
        'permanents': [],
        'discard': [],
        'handsize': 5,
        'activeaction': null,
        'activerole': ''
      }, _defineProperty(_player2, "handsize", 5), _defineProperty(_player2, 'boostingicons', {
        'survey': 0,
        'warfare': 0,
        'colonize': 0,
        'produce': 0,
        'trade': 0,
        'research': 0
      }), _defineProperty(_player2, 'unsettled_planets', []), _defineProperty(_player2, 'settled_planets', []), _defineProperty(_player2, 'conquered_planets', []), _defineProperty(_player2, 'starfighters', {
        'small': 0,
        'medium': 0,
        'large': 0
      }), _defineProperty(_player2, 'combatvalue', 0), _defineProperty(_player2, 'influence', []), _player2);

      _player.deck = app.generatenewdeck();
      _player.deck = app.knuthshuffle(_player.deck);
      _player = app.draw(_player, _player.handsize);

      _player.unsettled_planets.push(game.stacks.startingplanets.pop());

      game.players.push(_player);
      app.set({
        'game': game
      });
    },
    generateplanet: function generateplanet(name_in) {
      var _planet = {
        identifier: app.generate_unique_identifier(),
        name: name_in,
        type: 'planet',
        settle_cost: 2,
        settled: false,
        conquer_cost: 2,
        production_zones: [],
        influence_value: 2,
        icons: {
          'survey': 0,
          'warfare': 0,
          'colonize': 0,
          'produce': 0,
          'trade': 0,
          'research': 0
        },
        handsize_modifier: 0,
        hosted_colonies: [],
        metallic: function metallic() {
          this.type = 'metallic';
          return this;
        },
        advanced: function advanced() {
          this.type = 'advanced';
          return this;
        },
        fertile: function fertile() {
          this.type = 'fertile';
          return this;
        },
        icon: function icon(icon_name) {
          this.icons[icon_name]++;
          return this;
        },
        handsize: function handsize(modifier) {
          this.handsize_modifier = modifier;
          return this;
        },
        influence: function influence(_influence) {
          this.influence_value = _influence;
          return this;
        },
        settle: function settle(cost) {
          this.settle_cost = cost;
          return this;
        },
        conquer: function conquer(cost) {
          this.conquer_cost = cost;
          return this;
        },
        zone: function zone(_zone) {
          this.production_zones.push({
            type: _zone,
            filled: false
          });
          return this;
        }
      };
      return _planet;
    },
    generateplanetdeck: function generateplanetdeck() {
      var game = app.get().game;
      game.planet_deck = [//fertile planets
      app.generateplanet('MISHBURR ITO-A').fertile().settle(5).conquer(4).zone('green').influence(3).icon('produce'), app.generateplanet('STYKU').fertile().settle(4).conquer(5).zone('blue').influence(3).icon('colonize'), app.generateplanet('ANGUS DUFFY').fertile().settle(3).conquer(6).zone('green').zone('blue').influence(3), app.generateplanet('GERDLAND').fertile().settle(4).conquer(5).zone('blue').influence(3).icon('produce'), app.generateplanet('MIK-MIK').fertile().settle(5).conquer(4).zone('green').influence(3).icon('colonize'), app.generateplanet('NELOS IV').fertile().settle(5).conquer(4).zone('green').influence(2).handsize(1), app.generateplanet('SPIELBANY VI').fertile().settle(4).conquer(5).zone('blue').influence(2).handsize(1), app.generateplanet('NEW TEXAS').fertile().settle(3).conquer(6).zone('green').zone('blue').influence(2).icon('colonize'), app.generateplanet('ARTIGAS GNS-111').fertile().settle(3).conquer(6).zone('green').zone('blue').influence(2).icon('produce'), //advanced planets
      app.generateplanet('HANOJ - T').advanced().settle(5).conquer(4).influence(3).zone('purple').icon('trade'), app.generateplanet('OKNOW').advanced().settle(4).conquer(5).influence(2).zone('purple').handsize(1), app.generateplanet('SROD AVEIN N2').advanced().settle(3).conquer(6).influence(4).icon('research'), app.generateplanet("RAL GAI'GAW").advanced().settle(4).conquer(5).influence(3).zone('purple').icon('trade'), app.generateplanet('ECHO ROSE').advanced().settle(5).conquer(4).influence(3).zone('purple').icon('research'), app.generateplanet('SHOLMICAN').advanced().settle(3).conquer(6).influence(4).zone('purple'), app.generateplanet('ZEPHAN').advanced().settle(3).conquer(6).influence(4).icon('trade'), app.generateplanet('SIMA-07C').advanced().settle(5).conquer(4).influence(2).zone('purple').handsize(1), app.generateplanet('LYTTLE').advanced().settle(4).conquer(5).influence(3).zone('purple').icon('research'), //mettalic planets
      app.generateplanet('KYRIE & JUNO').metallic().settle(3).conquer(6).influence(4).icon('survey'), app.generateplanet('MARGHANNAH PRIME').metallic().settle(4).conquer(5).influence(3).handsize(1), app.generateplanet('TANKAHSHIN').metallic().settle(4).conquer(5).influence(3).zone('red').icon('warfare'), app.generateplanet('VOSON').metallic().settle(4).conquer(5).influence(3).zone('red').icon('survey'), app.generateplanet('PINK SONAR').metallic().settle(5).conquer(4).influence(3).zone('red').icon('survey'), app.generateplanet("OVERLORD BETZEL'S DOMAIN").metallic().settle(3).conquer(6).influence(4).icon('warfare'), app.generateplanet('8910 SPIELEN').metallic().settle(4).conquer(5).influence(2).zone('red').handsize(1), app.generateplanet('IDROYOS').metallic().settle(3).conquer(6).influence(5), app.generateplanet('ERKAM-W').metallic().settle(5).conquer(4).influence(3).zone('red').icon('warfare')];
      game.planet_deck = app.knuthshuffle(game.planet_deck);
      game.stacks.startingplanets = [app.generateplanet('MESIA SEDNIM').fertile().settle(2).conquer(2).influence(2).zone('blue'), app.generateplanet('DRAWDE').fertile().settle(2).conquer(2).influence(2).zone('green'), app.generateplanet('LIAGIBA').advanced().settle(2).conquer(2).influence(2).zone('purple'), app.generateplanet('POMERENE').advanced().settle(2).conquer(2).influence(2).zone('purple'), app.generateplanet('CHRISPEN').metallic().settle(2).conquer(2).influence(2).zone('red'), app.generateplanet('PIEDRA SECA').metallic().settle(2).conquer(2).influence(2).zone('red')], game.stacks.startingplanets = app.knuthshuffle(game.stacks.startingplanets);
      app.set({
        'game': game
      });
    },
    cleanup: function cleanup() {
      var game = app.get().game;
      var source_array = game.players[app.get().game.acting_player_index].limbo;
      var destinations_host = game.players[app.get().game.acting_player_index];
      var iterations = source_array.length;

      for (var i = 0; i < iterations; i++) {
        var elem = source_array.pop();
        destinations_host[elem.final_destination_label].push(elem);
      }

      app.set({
        'game': game
      });
    },
    purchase: function purchase(source_array, destination_array, final_destination_label, identifier) {
      var temp_array = [];
      var removed = false;

      for (var i = 0; i < source_array.length; i++) {
        var elem = source_array.pop();

        if (identifier == elem.identifier && !removed) {
          elem.final_destination_label = final_destination_label;
          destination_array.push(elem);
          removed = true;
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i4 in temp_array) {
        source_array.push(temp_array[_i4]);
      }
    },
    //remove_from_game hand->exile
    remove_from_game: function remove_from_game(source_array, identifier) {
      var temp_array = [];
      var removed = false;

      for (var i = 0; i < source_array.length; i++) {
        var elem = source_array.pop();

        if (identifier == elem.identifier && !removed) {
          removed = true;
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i5 in temp_array) {
        source_array.push(temp_array[_i5]);
      }
    },
    present_as_choice: function present_as_choice(options) {
      var game = app.get().game;
      game.options = options;
      app.send({
        'game': game
      });
    },
    settle_colonies: function settle_colonies(planet, possessing_player) {
      var planets = [].concat(_toConsumableArray(possessing_player.settled_planets), _toConsumableArray(possessing_player.conquered_planets));
      var reduction = 0;
      var game = app.get().game;

      for (var p in planets) {
        reduction += planets[p].icons.colonize;
      }

      for (var _p in game.players[game.leading_player_index].permanents) {
        reduction += permanents[_p].icons.colonize;
      }

      if (planet.settle_cost - reduction <= planet.hosted_colonies.length) {
        if (app.get().game.players[app.get().game.acting_player_index].permanents.filter(function (el) {
          return el.type == 'abundance';
        }).length != 0) {
          if (planet.production_zones.length != 0) {
            planet.production_zones = planet.production_zones.map(function (pz) {
              return {
                type: pz.type,
                filled: true
              };
            });
          }
        }

        for (var i in planet.hosted_colonies) {
          possessing_player.discard.push(planet.hosted_colonies.pop());
        }

        var temp_array = [];
        var removed = false;

        for (var _i6 = 0; _i6 < possessing_player.unsettled_planets.length; _i6++) {
          var elem = possessing_player.unsettled_planets.pop();

          if (planet.identifier == elem.identifier && !removed) {
            elem.settled = true;
            possessing_player.settled_planets.push(elem);
            removed = true;
          } else {
            temp_array.push(elem);
          }
        }

        for (var _i7 in temp_array) {
          possesing_player.unsettled_planets.push(temp_array[_i7]);
        }
      }
    },
    //pass_turn leadingplayer->nextplayer
    pass_turn: function pass_turn() {
      if (!app.get().lobby.online || app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name) {
        //app.togglepasstoplayer();
        var _game3 = app.get().game;
        _game3.passt = false;
        _game3.leading_player_index = (_game3.leading_player_index + 1) % _game3.number_of_players;
        _game3.acting_player_index = _game3.leading_player_index;
        _game3.leadingplayer = _game3.players[_game3.leading_player_index];
        _game3.acting_player = _game3.players[_game3.leading_player_index];
        app.set({
          'game': _game3
        });
        app.phasefinishfunction();
      }
    },
    //pass_priority actingplayer->nextplayer
    pass_priority: function pass_priority() {
      if (!app.get().lobby.online || app.get().lobby.screenname == app.get().game.players[app.get().game.acting_player_index].name) {
        //app.togglepasstoplayer();
        var _game4 = app.get().game;
        _game4.passp = false;
        _game4.acting_player_index = (_game4.acting_player_index + 1) % _game4.number_of_players;
        _game4.acting_player = _game4.players[_game4.acting_player_index];
        app.set({
          'game': _game4
        });
        app.phasefinishfunction();
      }
    },
    //determine_number_of_players logic->options->choice->number_of_players
    determine_number_of_players: function determine_number_of_players(callback) {
      var game = app.get().game;
      game.minimum_number_of_players = 2;
      game.maximum_number_of_players = 4;
      var options = [];

      for (var i = game.minimum_number_of_players; i <= game.maximum_number_of_players; i++) {
        options.push(i);
      }

      var callbackwrapper = function callbackwrapper() {
        var game = app.get().game;
        game.number_of_players = game.choices;
        document.removeEventListener('choicemade', callbackwrapper);
        app.set({
          'game': game
        });
        callback();
      };

      document.addEventListener('choicemade', callbackwrapper);
      app.present_as_choice(options);
    },
    //produce poduction_pile->host
    produce: function produce(planets) {
      var resources = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var game = app.get().game;
      var prd = {
        blue: 0,
        green: 0,
        purple: 0,
        red: 0
      };

      for (var _j3 in planets) {
        if (resources > 0) {
          for (var i = 0; i < planets[_j3].production_zones.length; i++) {
            if (!planets[_j3].production_zones[i].filled) {
              planets[_j3].production_zones[i].filled = true;
              prd[planets[_j3].production_zones[i].type]++;
              resources--;
              break;
            }
          }
        }
      } //loop through planet in acting player thing and set it
      // for planet in args
      // playerplanets.filter where id not equal id
      // afterloop, append arg planets


      var _loop = function _loop(_i8) {
        var p = planets[_i8];
        game.players[game.acting_player_index].settled_planets = game.players[game.acting_player_index].settled_planets.filter(function (e) {
          return e.identifier != p.identifier;
        });
        game.players[game.acting_player_index].conquered_planets = game.players[game.acting_player_index].conquered_planets.filter(function (e) {
          return e.identifier != p.identifier;
        });
      };

      for (var _i8 in planets) {
        _loop(_i8);
      }

      game.players[game.acting_player_index].settled_planets = [].concat(_toConsumableArray(game.players[game.acting_player_index].settled_planets), _toConsumableArray(planets));
      game.players[game.acting_player_index].conquered_planets = [].concat(_toConsumableArray(game.players[game.acting_player_index].conquered_planets), _toConsumableArray(planets));
      app.set({
        'game': game
      });
      return prd;
    },
    //trade host->production_pile, influence_pile->player_influence
    trade: function trade(planets, player) {
      var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var game = app.get().game;
      var prd = {
        blue: 0,
        green: 0,
        purple: 0,
        red: 0
      };

      for (var _j4 in planets) {
        if (resources > 0) {
          for (var i = 0; i < planets[_j4].production_zones.length; i++) {
            if (planets[_j4].production_zones[i].filled) {
              planets[_j4].production_zones[i].filled = false;
              prd[planets[_j4].production_zones[i].type]++;

              players[_j4].influence.push(game.influence.pop());

              resources--;
              break;
            }
          }
        }
      }

      var _loop2 = function _loop2(_i9) {
        var p = planets[_i9];
        game.players[game.acting_player_index].planets = game.players[game.acting_player_index].planets.filter(function (e) {
          return e.identifier != p.identifier;
        });
      };

      for (var _i9 in planets) {
        _loop2(_i9);
      }

      game.players[game.acting_player_index].planets = [].concat(_toConsumableArray(game.players[game.acting_player_index].planets), _toConsumableArray(planets));
      app.set({
        'game': game
      });
      return prd;
    },
    //politics hand->limbo->exile, stacks->hand
    politics: function politics(politics_card, selected_center_card, player) {
      app.play(player.hand, player.limbo, 'exile', politics_card.identifier);
      var game = app.get().game;

      if (game.stacks.pilecount[selected_center_card.type] >= 1) {
        player.hand.push(Object.assign({
          'identifier': app.generate_unique_identifier()
        }, game.stacks.rolecards[game.stacks[selected_center_card.type]]));
        game.stacks.pilecount[selected_center_card.type]--;
      }

      app.set({
        'game': game
      });
    },
    //research hand->exile
    research: function research(cards, player) {
      var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      for (var i = 0; i < cards.length && i < limit; i++) {
        app.remove_from_game(player.limbo, cards[i].identifier);
      }
    },
    //boost logic->player_icons
    boost: function boost(cards, player) {
      for (var i = 0; i < cards.length; i++) {
        for (var _j5 = 0; _j5 < cards[i].icons.length; _j5++) {
          var _cards$i$icons$_j = _slicedToArray(cards[i].icons[_j5], 2),
              key = _cards$i$icons$_j[0],
              value = _cards$i$icons$_j[1];

          player.boostingicons[key] += value;
        }
      }
    },
    //survey deck->hand
    survey: function survey(player) {
      player = app.draw(player, 2);
    },
    //colonize hand/limbo->host
    colonize: function colonize(planet, source_array, card) {
      var isRole = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var temp_array = [];
      var removed = false;
      var totalIteration = 1;

      if (isRole) {
        totalIteration = app.get().game.players[app.get().game.acting_player_index].boostingicons.colonize;
      }

      var iterations = source_array.length;

      for (var i = 0; i < iterations; i++) {
        var elem = source_array.pop();

        if (card.type == elem.type && card.final_destination_label != 'exile' && !removed) {
          planet.hosted_colonies.push(elem);
          totalIteration--;

          if (totalIteration == 0) {
            removed = true;
          }
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i10 in temp_array) {
        source_array.push(temp_array[_i10]);
      }
    },
    //warfare starship_pile->player_starship_pile
    warfare: function warfare(player) {
      var game = app.get().game;
      player.starfighters.small++;
      app.set({
        'game': game
      });
    },
    //conquer player_starship_pile->starship_pile, player_unconquered_planets->player_conquered_planets
    conquer: function conquer(planet, player) {
      if (app.get().game.players[app.get().game.acting_player_index].permanents.filter(function (el) {
        return el.type == 'scorched_earth_policy';
      }).length != 0) {
        planet.production_zones = [];
        planet.conquer_cost -= 2;

        if (planet.conquer_cost < 0) {
          planet.conquer_cost = 0;
        }
      }

      if (player.starfighters.small >= planet.conquer_cost) {
        if (app.get().game.players[app.get().game.acting_player_index].permanents.filter(function (el) {
          return el.type == 'abundance';
        }).length != 0) {
          if (planet.production_zones.length != 0) {
            planet.production_zones = planet.production_zones.map(function (pz) {
              return {
                type: pz.type,
                filled: true
              };
            });
          }
        }

        player.starfighters.small -= planet.conquer_cost;
        planet = app.select_via_identifier(player.unsettled_planets, planet.identifier);
        planet.conquered = true;
        player.conquered_planets.push(planet);
      }
    },
    //offer_to_boost present_as_choice, choose, boost
    offer_to_boost: function offer_to_boost(player) {
      var game = app.get().game;
      game.displayinfo.selectionzone = 'hand';
      game.displayinfo.allowformultipleselections = true;
      game.displayinfo.showoptiontoskip = true;
      app.present_as_choice(player.hand);

      var callbackwrapper = function callbackwrapper() {
        document.removeEventListener('choicemade', callbackwrapper);
        var game = app.get().game;
        app.boost(game.choices, player);
        app.set({
          'game': game
        });
      };

      document.addEventListener('choicemade', callbackwrapper);
    },
    select_via_identifier: function select_via_identifier(source, identifier) {
      var temp_array = [];
      var removed = false;
      var selected_item = null;
      var iterations = source.length;

      for (var i = 0; i < iterations; i++) {
        var elem = source.pop();

        if (identifier == elem.identifier && !removed) {
          selected_item = elem;
          removed = true;
        } else {
          temp_array.push(elem);
        }
      }

      for (var _i11 in temp_array) {
        source.push(temp_array[_i11]);
      }

      return selected_item;
    },
    boostrolewithcards: function boostrolewithcards(choices) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var game = app.get().game;
      var cards = choices;
      var iterations = cards.length;

      if (cards[0].name != 'Skip') {
        for (var i = 0; i < iterations; i++) {
          game.players[app.get().game.acting_player_index].boostingicons[cards[i].type]++;
          app.set({
            'game': game
          });
          app.play(game.players[app.get().game.acting_player_index].hand, game.players[app.get().game.acting_player_index].limbo, 'discard', cards[i].identifier);
        }
      }

      app.set({
        'game': game
      });
      callback();
    },
    generate_unique_identifier: function generate_unique_identifier() {
      var game = app.get().game;
      game.nonce++;
      app.set({
        'game': game
      });
      return game.nonce;
    },
    performleaderrole: function performleaderrole() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var game = app.get().game;
      game.players[app.get().game.acting_player_index].activerole.role.role.leader(callback);
      app.set({
        'game': game
      });
    },
    performfollowerrole: function performfollowerrole() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var game = app.get().game;
      game.players[game.acting_player_index].activerole.set(game.players[game.leading_player_index].activerole.role);
      game.players[game.acting_player_index].activerole.role.role.follower(callback);
      app.set({
        'game': game
      });
    },
    explore_planet: function explore_planet(player) {
      var game = app.get().game;
      var planet = game.planet_deck.pop();
      player.limbo.push({
        'final_destination_label': 'planetdeck',
        ...planet
      });
      game.options.push(planet);
      app.set({
        'game': game
      });
    },
    catalog_planet: function catalog_planet(player) {
      var game = app.get().game;
      var planet = game.choices[0];
      player.unsettled_planets.push(planet);
      planet = app.select_via_identifier(player.limbo, planet.identifier);
      var temparray = [];
      var iterations = player.limbo.length;

      for (var i = 0; i >= iterations; i++) {
        var card = player.limbo.pop();

        if (card.final_destination_label = 'planetdeck') {
          game.planet_deck.push(card);
        } else {
          temparray.push(card);
        }
      }

      for (var el in temparray) {
        player.limbo.push(temparray.pop());
      }

      app.set({
        'game': game
      });
    },
    followcentercardrole: function followcentercardrole(choices) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var game = app.get().game;
      var card = choices[0];
      game.players[app.get().game.acting_player_index].activerole.set(card);

      if (game.stacks.pilecount[card.type] >= 1) {
        game.players[app.get().game.acting_player_index].boostingicons[card.type]++;
        game.players[app.get().game.acting_player_index].limbo.push(Object.assign({
          'identifier': app.generate_unique_identifier(),
          'final_destination_label': 'discard'
        }, game.stacks.rolecards[game.stacks[card.type]]));
        game.stacks.pilecount[card.type]--;
      }

      var _arguments = Array.prototype.slice.call(arguments),
          arr = _arguments.slice(2);

      app.set({
        'game': game
      });
      callback(card, arr);
    },
    discardcardsfromhand: function discardcardsfromhand(choices) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var game = app.get().game;

      if (choices[0].name != "Skip") {
        for (var i = 0; i < choices.length; i++) {
          app.discard(game.players[app.get().game.acting_player_index].hand, game.players[app.get().game.acting_player_index].discard, choices[i].identifier);
        }
      }

      var _arguments2 = Array.prototype.slice.call(arguments),
          arr = _arguments2.slice(2);

      app.set({
        'game': game
      });
      callback(choices, arr);
    },
    phasefinishfunction: function phasefinishfunction() {
      var send = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      //check for game end condition
      //if met, start a turn countdown to make sure everyone has had the same number of turns
      //also track who started the game
      //we can probably just track this as a total_rounds property of the player object, incrementing every time pass_turn is called
      // just check that all are equal
      var game = app.get().game;
      game.currentphase = (game.currentphase + 1) % game.gamesequence.length;
      var jsobj = game.gamesequence[game.currentphase];
      var nextphase;

      for (var key in jsobj) {
        game.messagetoplayer.push(key);
        nextphase = jsobj[key];
      }

      if (game.nextphase !== app.endgame) {
        game.nextphase = nextphase;
      } // if (app.get().game.started && app.checkforendgame() && (game.players.reduce((t,p)=>{return t+p.rounds},0))%game.number_of_players == 0){
      // 	app.totalinfluence();
      // 	nextphase = app.endgame;
      // }


      if (send) {
        app.send({
          'game': game
        });
      } else {
        app.set({
          'game': game
        });
      }

      game.nextphase();
    },
    generategamesequence: function generategamesequence() {
      var game = app.get().game;
      var _gamesequence = [];
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[0].start), _gamesequence); //ar. ra, aar, ara, raa

      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[1].action), _gamesequence, function () {
        return app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'aar';
      });
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[1].action), _gamesequence, function () {
        return app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'aar' || app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'ar';
      });
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[2].role), _gamesequence);
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[3].lead), _gamesequence);

      for (var i = 1; i < game.number_of_players; i++) {
        _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[4].follow), _gamesequence);
      }

      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[1].action), _gamesequence, function () {
        return app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'raa' || app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'ara';
      });
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[1].action), _gamesequence, function () {
        return app.get().game.players[app.get().game.acting_player_index].actionrolesequence == 'raa';
      });
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[5].discard), _gamesequence);
      _gamesequence = app.gshelper(_toConsumableArray(game.gamephases[6].cleanup), _gamesequence);
      game.gamesequence = _gamesequence;
      app.set({
        'game': game,
        'phases': _gamesequence
      });
    },
    gshelper: function gshelper(source_array, destination_array) {
      var wrapperfunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      for (var i in source_array) {
        if (wrapperfunction) {
          (function () {
            var jsobj = source_array[i];
            var func = void 0,
                key = void 0;
            var item = {};

            for (key in jsobj) {
              func = jsobj[key];
            }

            item[key] = function () {
              if (wrapperfunction()) {
                func();
              } else {
                app.phasefinishfunction();
              }
            };

            destination_array.push(item);
          })();
        } else {
          destination_array.push(source_array[i]);
        }
      }

      return destination_array;
    },
    generatenewdeck: function generatenewdeck() {
      var game = app.get().game;
      var deck = [Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.survey]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.survey]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.warfare]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.producetrade]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.producetrade]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.colonize]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.colonize]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.research]), Object.assign({
        'identifier': app.generate_unique_identifier()
      }, game.stacks.rolecards[game.stacks.research]), {
        'identifier': app.generate_unique_identifier(),
        type: 'politics',
        'selected': false,
        action: function action(callback) {
          var callbackwrapper = function callbackwrapper() {
            document.removeEventListener('choicemade', callbackwrapper);
            var game = app.get().game;
            app.politics(game.players[game.acting_player_index].activeaction, game.choices[0], game.players[game.acting_player_index]);
            callback();
          };

          var game = app.get().game;
          game.displayinfo.center_or_planets = true;
          game.displayinfo.selectionzone = 'rolecards';
          game.displayinfo.allowformultipleselections = false;
          game.displayinfo.showoptiontoskip = false;
          game.messagetoplayer.push('choose a card from the center row to add to your hand');
          app.set({
            'game': game
          });
          document.addEventListener('choicemade', callbackwrapper);
          app.present_as_choice(game.stacks.rolecards);
        },
        role: null,
        icons: {
          'survey': 0,
          'warfare': 0,
          'colonize': 0,
          'produce': 0,
          'trade': 0,
          'research': 0,
          'politics': 1
        },
        name: 'Politics',
        image: null
      }];
      app.set({
        'game': game
      });
      return deck;
    },
    phaseincrement: function phaseincrement() {
      var game = app.get().game;
      game.currentphase++;
      app.set({
        'game': game
      });
    },
    newgame: function newgame(number_of_players) {
      var sets = app.get().lobby.sets; //returns {game_id, game_name, number_of_players, slots}

      var ws = new WebSocket(app.get().lobby.url); //let ws = new io(app.get().lobby.url);

      var lobby = app.get().lobby;
      lobby.online = true;
      app.set({
        'lobby': lobby
      });
      app.initgame(number_of_players);

      ws.onmessage = function (evt) {
        // on receiving a message, add it to the list of messages
        var game = app.get().game;
        var lobby = app.get().lobby;
        game.game_id = JSON.parse(evt.data);
        game.header = '';
        lobby.existinggames.push(game);
        lobby.online = true;
        game.currentphase++;
        app.set({
          'game': game,
          'lobby': lobby
        });
        ws.close(); //app.enterexistinggame(app.get().game);
      };

      ws.onopen = function (evt) {
        if (ws.readyState == 1) {
          ws.send(JSON.stringify({
            'header': 'newgame',
            game: app.get().game,
            sets: sets,
            number_of_players: number_of_players
          }));
        }
      };
    },
    fetchexistinggames: function fetchexistinggames() {
      //returns list of [{game_id, game_name, number_of_players, slots},...]
      var ws = new WebSocket(app.get().lobby.url); //let ws = new io(app.get().lobby.url);

      ws.onmessage = function (evt) {
        var game = app.get().game;
        game.currentphase = -2;
        app.set({
          'game': game
        });
        var lobby = app.get().lobby;
        lobby.existinggames = JSON.parse(evt.data).map(function (el) {
          return el.game;
        }).filter(function (el) {
          return el.players.filter(function (ll) {
            return ll.available;
          }).length > 0;
        });
        lobby.online = true;
        app.set({
          'lobby': lobby
        });
        ws.close();
      };

      ws.onopen = function (evt) {
        if (ws.readyState == 1) {
          ws.send(JSON.stringify({
            'header': 'fetchexisting'
          }));
        }
      };
    },
    enterexistinggame: function enterexistinggame(g) {
      var game_id = g.game_id;
      var slot = 0,
          player_name = app.get().lobby.screename;

      for (var i = 0; i < g.players.length; i++) {
        if (g.players[i].available) {
          slot = i;
          break;
        }
      }

      if (!app.get().lobby.init) {
        app.initgame(g.number_of_players);
      }

      var ws = new WebSocket(app.get().lobby.url); //let ws = new io(app.get().lobby.url);

      ws.onmessage = function (evt) {
        // on receiving a message, add it to the list of messages
        var game = JSON.parse(evt.data);
        game.gamesequence = app.get().phases;

        if (game.currentphase != 0) {
          game.currentphase = -1;
        }

        app.set({
          'game': game
        });
        ws.close();
        var lobby = app.get().lobby;
        lobby.online = true;
        lobby.player_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
        app.set({
          'lobby': lobby
        });

        if (game.currentphase != 0) {
          app.phasefinishfunction();
        }
      };

      ws.onopen = function (evt) {
        if (ws.readyState == 1) {
          ws.send(JSON.stringify({
            'header': 'enterexisting',
            game_id: game_id,
            player_name: player_name,
            slot: slot
          }));
        }
      };
    },
    initgame: function initgame(number_of_players) {
      var lobby = app.get().lobby;
      lobby.init = true;
      app.set({
        'lobby': lobby
      });
      app.generateplanetdeck();

      for (var i = 0; i < number_of_players; i++) {
        app.generateplayer(i);
      }

      app.generate_research_deck();
      app.generategamesequence(); //app.makews('ws://192.168.1.6:3030');
      //'ws://temperate-isle.herokuapp.com/:3030';

      if (app.get().lobby.online) app.makews(location.origin.replace(/^http/, 'ws'));

      if (!app.get().lobby.online) {
        app.generate_game_id();
        app.generate_player_names();
      } //app.phasefinishfunction();

    },
    generate_player_names: function generate_player_names() {
      var game = app.get().game;

      for (var i in game.players) {
        game.players[i].name = 'Player ' + (i + 1);
      }

      app.set({
        game: game
      });
    },
    toggle_center_or_planets: function toggle_center_or_planets() {
      var game = app.get().game;
      game.displayinfo.center_or_planets = !game.displayinfo.center_or_planets;
      app.set({
        'game': game
      });
    },
    togglepasstoplayer: function togglepasstoplayer() {
      var game = app.get().game;
      game.passtoplayer = !game.passtoplayer;
      app.set({
        'game': game
      });
      app.openFullscreen();
    },
    class_gen: function class_gen(zone, item) {
      return app.get().game.displayinfo.selectionzone == zone ? item.selected ? "selected" : "selectable" : "bordered";
    },
    makews: function makews() {
      var game = app.get().game;
      var ws = new WebSocket(app.get().lobby.url);

      var ping = function ping() {
        setTimeout(function () {
          ws.send(JSON.stringify({
            header: 'ping'
          }));
          ping();
        }, 2000);
      };

      ws.onmessage = function (evt) {
        // on receiving a message, add it to the list of messages
        var game = JSON.parse(evt.data);

        if (game.game_id == app.get().game.game_id && game.sender != app.get().lobby.player_id) {
          game.gamesequence = app.get().phases;
          app.set({
            'game': game
          });
        }
      };

      ws.onopen = function (evt) {
        ping();
      };

      ws.onclose = function () {};

      app.set({
        'game': game,
        'ws': ws
      });
    },
    sendstate: function sendstate() {
      var ws = app.get().ws;

      if (ws.readyState == 1) {
        ws.send(JSON.stringify({ ...app.get().game,
          'header': 'set',
          'sender': app.get().lobby.player_id
        }));
      }
    },
    generate_game_id: function generate_game_id() {
      var game = app.get().game;
      game.game_id = ''; //for(let i = 0; i < game.nonce; i++){

      game.game_id += Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10); //}

      app.set({
        'game': game
      });
    },
    knuthshuffle: function knuthshuffle(array) {
      var currentIndex = array.length;
      var temporaryValue, randomIndex; // While there remain elements to shuffle...

      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1; // And swap it with the current element.

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    drag: function drag(evt, item) {
      var game = app.get().game;
      game.displayinfo.dragged = item;
      app.set({
        'game': game
      });
    },
    drop: function drop(evt, zone) {
      var el = document.getElementById('playedcards').getBoundingClientRect();

      if (evt.changedTouches[0].clientX > el.left && evt.changedTouches[0].clientX < el.left + el.width && evt.changedTouches[0].clientY < el.top + el.height && evt.changedTouches[0].clientY > el.top) {
        var _game5 = app.get().game;
        if (_game5.displayinfo.dragged !== null) app.choosewrapper(_game5.displayinfo.dragged, zone);
        _game5.displayinfo.dragged != null;
        app.set({
          'game': _game5
        });
      }

      var ll = document.querySelector('#dragged');
      ll.style.visibility = "hidden";
    },
    move: function move(evt, img) {
      var touch = evt.targetTouches[0]; // Place element where the finger is

      var el = document.querySelector('#dragged');
      el.style.position = "absolute";
      el.style.visibility = "visible";
      el.style.top = touch.pageY - 75 + 'px';
      el.style.left = touch.pageX - 50 + 'px';
      el.style.width = "100px";
      el.style.height = "137px";
      el.style.zIndex = "4";
      el.style.backgroundImage = "url('" + img + "')"; //evt.target.style.transform = "translate(" + touch.pageX + 'px,' + touch.pageY + 'px);';
    },
    newoffline: function newoffline() {
      var _app$get = app.get(),
          game = _app$get.game,
          lobby = _app$get.lobby;

      lobby.online = false;
      game.currentphase = -1;
      app.set({
        'game': game
      });
      app.initgame(2);
      app.phasefinishfunction();
    },
    setplayername: function setplayername(name) {
      var _app$get2 = app.get(),
          lobby = _app$get2.lobby,
          game = _app$get2.game;

      lobby.screename = name;
      game.currentphase++;
      app.set({
        'lobby': lobby,
        'game': game
      });
    },
    openFullscreen: function openFullscreen() {
      var elem = document.getElementById("screen");

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    registerws: function registerws() {
      if (app.get().ws.readyState == 1) {
        app.get().ws.send(JSON.stringify({ ...app.get().game,
          'header': 'register',
          'sender': app.get().lobby.player_id
        }));
      }
    }
  };
  var file = "src\\App.html";

  function tap_handler_15(event) {
    var _this$_svelte = this._svelte,
        component = _this$_svelte.component,
        ctx = _this$_svelte.ctx;
    component.choosewrapper(ctx.option, 'options');
  }

  function click_handler_15(event) {
    var _this$_svelte2 = this._svelte,
        component = _this$_svelte2.component,
        ctx = _this$_svelte2.ctx;
    component.choosewrapper(ctx.option, 'options');
  }

  function tap_handler_14(event) {
    var _this$_svelte3 = this._svelte,
        component = _this$_svelte3.component,
        ctx = _this$_svelte3.ctx;
    component.choosewrapper(ctx.option, 'options');
  }

  function click_handler_14(event) {
    var _this$_svelte4 = this._svelte,
        component = _this$_svelte4.component,
        ctx = _this$_svelte4.ctx;
    component.choosewrapper(ctx.option, 'options');
  }

  function get_each_context_7(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.zone = list[i];
    return child_ctx;
  }

  function get_each_context_6(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.option = list[i];
    return child_ctx;
  }

  function tap_handler_13(event) {
    var _this$_svelte5 = this._svelte,
        component = _this$_svelte5.component,
        ctx = _this$_svelte5.ctx;
    component.choosewrapper(ctx.card, 'hand');
  }

  function touchmove_handler_2(event) {
    var _this$_svelte6 = this._svelte,
        component = _this$_svelte6.component,
        ctx = _this$_svelte6.ctx;
    component.move(event, './images/' + ctx.card.type + '100.png', 'hand');
  }

  function click_handler_13(event) {
    var _this$_svelte7 = this._svelte,
        component = _this$_svelte7.component,
        ctx = _this$_svelte7.ctx;
    component.choosewrapper(ctx.card, 'hand');
  }

  function touchend_handler_2(event) {
    var component = this._svelte.component;
    component.drop(event, 'hand');
  }

  function touchstart_handler_2(event) {
    var _this$_svelte8 = this._svelte,
        component = _this$_svelte8.component,
        ctx = _this$_svelte8.ctx;
    component.drag(event, ctx.card, 'hand');
  }

  function tap_handler_12(event) {
    var _this$_svelte9 = this._svelte,
        component = _this$_svelte9.component,
        ctx = _this$_svelte9.ctx;
    component.choosewrapper(ctx.card, 'hand');
  }

  function click_handler_12(event) {
    var _this$_svelte10 = this._svelte,
        component = _this$_svelte10.component,
        ctx = _this$_svelte10.ctx;
    component.choosewrapper(ctx.card, 'hand');
  }

  function touchmove_handler_1(event) {
    var _this$_svelte11 = this._svelte,
        component = _this$_svelte11.component,
        ctx = _this$_svelte11.ctx;
    component.move(event, ctx.card.imgurl, 'hand');
  }

  function touchend_handler_1(event) {
    var component = this._svelte.component;
    component.drop(event, 'hand');
  }

  function touchstart_handler_1(event) {
    var _this$_svelte12 = this._svelte,
        component = _this$_svelte12.component,
        ctx = _this$_svelte12.ctx;
    component.drag(event, ctx.card, 'hand');
  }

  function get_each2_context(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.card = list[i];
    return child_ctx;
  }

  function tap_handler_11(event) {
    var _this$_svelte13 = this._svelte,
        component = _this$_svelte13.component,
        ctx = _this$_svelte13.ctx;
    component.choose(ctx.game[ctx.game.displayinfo.choicelabel]);
  }

  function click_handler_11(event) {
    var _this$_svelte14 = this._svelte,
        component = _this$_svelte14.component,
        ctx = _this$_svelte14.ctx;
    component.choose(ctx.game[ctx.game.displayinfo.choicelabel]);
  }

  function tap_handler_10(event) {
    var component = this._svelte.component;
    component.pass_turn();
  }

  function click_handler_10(event) {
    var component = this._svelte.component;
    component.pass_turn();
  }

  function tap_handler_9(event) {
    var component = this._svelte.component;
    component.pass_priority();
  }

  function click_handler_9(event) {
    var component = this._svelte.component;
    component.pass_priority();
  }

  function tap_handler_8(event) {
    var _this$_svelte15 = this._svelte,
        component = _this$_svelte15.component,
        ctx = _this$_svelte15.ctx;
    component.unchoose(ctx.card);
  }

  function click_handler_8(event) {
    var _this$_svelte16 = this._svelte,
        component = _this$_svelte16.component,
        ctx = _this$_svelte16.ctx;
    component.unchoose(ctx.card);
  }

  function tap_handler_7(event) {
    var _this$_svelte17 = this._svelte,
        component = _this$_svelte17.component,
        ctx = _this$_svelte17.ctx;
    component.unchoose(ctx.card);
  }

  function click_handler_7(event) {
    var _this$_svelte18 = this._svelte,
        component = _this$_svelte18.component,
        ctx = _this$_svelte18.ctx;
    component.unchoose(ctx.card);
  }

  function get_each1_context_1(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.card = list[i];
    return child_ctx;
  }

  function tap_handler_6(event) {
    var component = this._svelte.component;
    component.choose([{
      name: 'Skip'
    }]);
  }

  function click_handler_6(event) {
    var component = this._svelte.component;
    component.choose([{
      name: 'Skip'
    }]);
  }

  function tap_handler_5(event) {
    var _this$_svelte19 = this._svelte,
        component = _this$_svelte19.component,
        ctx = _this$_svelte19.ctx;
    component.choosewrapper(ctx.planet, 'settled_&_conquered_planets');
  }

  function click_handler_5(event) {
    var _this$_svelte20 = this._svelte,
        component = _this$_svelte20.component,
        ctx = _this$_svelte20.ctx;
    component.choosewrapper(ctx.planet, 'settled_&_conquered_planets');
  }

  function get_each_context_5(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.zone = list[i];
    return child_ctx;
  }

  function get_each1_context(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.planet = list[i];
    return child_ctx;
  }

  function tap_handler_4(event) {
    var _this$_svelte21 = this._svelte,
        component = _this$_svelte21.component,
        ctx = _this$_svelte21.ctx;
    component.choosewrapper(ctx.planet, 'unsettled_planets');
  }

  function click_handler_4(event) {
    var _this$_svelte22 = this._svelte,
        component = _this$_svelte22.component,
        ctx = _this$_svelte22.ctx;
    component.choosewrapper(ctx.planet, 'unsettled_planets');
  }

  function get_each0_context_1(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.planet = list[i];
    return child_ctx;
  }

  function get_each_context_4(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.card = list[i];
    return child_ctx;
  }

  function touchend_handler(event) {
    var component = this._svelte.component;
    component.drop(event, 'rolecards');
  }

  function touchstart_handler(event) {
    var _this$_svelte23 = this._svelte,
        component = _this$_svelte23.component,
        ctx = _this$_svelte23.ctx;
    component.drag(event, ctx.card, 'rolecards');
  }

  function touchmove_handler(event) {
    var _this$_svelte24 = this._svelte,
        component = _this$_svelte24.component,
        ctx = _this$_svelte24.ctx;
    component.move(event, './images/' + ctx.card.type + '100.png', 'rolecards');
  }

  function tap_handler_3(event) {
    var _this$_svelte25 = this._svelte,
        component = _this$_svelte25.component,
        ctx = _this$_svelte25.ctx;
    component.choosewrapper(ctx.card, 'rolecards');
  }

  function click_handler_3(event) {
    var _this$_svelte26 = this._svelte,
        component = _this$_svelte26.component,
        ctx = _this$_svelte26.ctx;
    component.choosewrapper(ctx.card, 'rolecards');
  }

  function get_each_context_3(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.card = list[i];
    return child_ctx;
  }

  function tap_handler_2(event) {
    var _this$_svelte27 = this._svelte,
        component = _this$_svelte27.component,
        ctx = _this$_svelte27.ctx;
    component.choosewrapper(ctx.card, 'research');
  }

  function click_handler_2(event) {
    var _this$_svelte28 = this._svelte,
        component = _this$_svelte28.component,
        ctx = _this$_svelte28.ctx;
    component.choosewrapper(ctx.card, 'research');
  }

  function get_each_context_2(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.card = list[i];
    return child_ctx;
  }

  function tap_handler_1(event) {
    var component = this._svelte.component;
    component.toggle_center_or_planets();
  }

  function click_handler_1(event) {
    var component = this._svelte.component;
    component.toggle_center_or_planets();
  }

  function get_each0_context(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.p = list[i];
    return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.player = list[i];
    return child_ctx;
  }

  function tap_handler(event) {
    var _this$_svelte29 = this._svelte,
        component = _this$_svelte29.component,
        ctx = _this$_svelte29.ctx;
    component.enterexistinggame(ctx.g.game_id);
  }

  function click_handler(event) {
    var _this$_svelte30 = this._svelte,
        component = _this$_svelte30.component,
        ctx = _this$_svelte30.ctx;
    component.enterexistinggame(ctx.g);
  }

  function get_each_context(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.g = list[i];
    return child_ctx;
  }

  function create_main_fragment(component, ctx) {
    var if_block_anchor, current;

    function select_block_type(ctx) {
      if (ctx.game.currentphase == -4) return create_if_block;
      if (ctx.game.currentphase == -3) return create_if_block_1;
      if (ctx.game.currentphase == -2) return create_if_block_2;
      if (ctx.game.currentphase == -1) return create_if_block_3;
      if (ctx.game.passtoplayer && !ctx.lobby.online) return create_if_block_4;
      if (!!ctx.game.winner) return create_if_block_5;
      return create_else_block;
    }

    var current_block_type = select_block_type(ctx);
    var if_block = current_block_type(component, ctx);
    return {
      c: function create() {
        if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(target, anchor) {
        if (current) return;
        this.m(target, anchor);
      },
      o: run,
      d: function destroy(detach) {
        if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (42:0) {:else}


  function create_else_block(component, ctx) {
    var div, text;
    var each_value_1 = ctx.game.players;
    var each_blocks = [];

    for (var i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_3(component, get_each_context_1(ctx, each_value_1, i));
    }

    var if_block = ctx.game.displayinfo.selectionzone == 'options' && create_if_block_6(component, ctx);
    return {
      c: function create() {
        div = createElement("div");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        text = createText("\n\t\t\n\t\t");
        if (if_block) if_block.c();
        div.id = "screen";
        setStyle(div, "height", "100%");
        setStyle(div, "width", "100%");
        div.className = "flex";
        addLoc(div, file, 42, 1, 1599);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }

        append(div, text);
        if (if_block) if_block.m(div, null);
      },
      p: function update(changed, ctx) {
        if (changed.game || changed.undefined || changed.lobby) {
          each_value_1 = ctx.game.players;

          for (var i = 0; i < each_value_1.length; i += 1) {
            var child_ctx = get_each_context_1(ctx, each_value_1, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_3(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, text);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_1.length;
        }

        if (ctx.game.displayinfo.selectionzone == 'options') {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block_6(component, ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each_blocks, detach);
        if (if_block) if_block.d();
      }
    };
  } // (38:23) 


  function create_if_block_5(component, ctx) {
    var div,
        text0_value = ctx.game.winner,
        text0,
        text1;
    return {
      c: function create() {
        div = createElement("div");
        text0 = createText(text0_value);
        text1 = createText(" WON!!!!");
        div.className = "passtoplayer";
        addLoc(div, file, 38, 1, 1531);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, text0);
        append(div, text1);
      },
      p: function update(changed, ctx) {
        if (changed.game && text0_value !== (text0_value = ctx.game.winner)) {
          setData(text0, text0_value);
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }
      }
    };
  } // (34:44) 


  function create_if_block_4(component, ctx) {
    var div;

    function click_handler_1(event) {
      component.togglepasstoplayer();
    }

    function tap_handler_1(event) {
      component.togglepasstoplayer();
    }

    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "pass to next player";
        addListener(div, "click", click_handler_1);
        addListener(div, "tap", tap_handler_1);
        div.className = "passtoplayer";
        addLoc(div, file, 34, 4, 1384);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_1);
        removeListener(div, "tap", tap_handler_1);
      }
    };
  } // (27:31) 


  function create_if_block_3(component, ctx) {
    var div, p, text_1;
    var each_value = ctx.lobby.existinggames;
    var each_blocks = [];

    for (var i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
    }

    return {
      c: function create() {
        div = createElement("div");
        p = createElement("p");
        p.textContent = "Choose a Game to Join";
        text_1 = createText("\n\t\t");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        addLoc(p, file, 28, 2, 1155);
        div.className = "playercountselector";
        addLoc(div, file, 27, 1, 1119);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, p);
        append(div, text_1);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p: function update(changed, ctx) {
        if (changed.lobby) {
          each_value = ctx.lobby.existinggames;

          for (var i = 0; i < each_value.length; i += 1) {
            var child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each_blocks, detach);
      }
    };
  } // (21:31) 


  function create_if_block_2(component, ctx) {
    var div,
        p0,
        text1,
        input,
        input_updating = false,
        text2,
        p1;

    function input_input_handler() {
      input_updating = true;
      ctx.lobby.screenname = input.value;
      component.set({
        lobby: ctx.lobby
      });
      input_updating = false;
    }

    function click_handler(event) {
      component.setplayername(ctx.lobby.screenname);
    }

    function tap_handler(event) {
      component.setplayername(ctx.lobby.screenname);
    }

    return {
      c: function create() {
        div = createElement("div");
        p0 = createElement("p");
        p0.textContent = "Choose your Screen Name";
        text1 = createText("\t\n\t");
        input = createElement("input");
        text2 = createText("\n\t");
        p1 = createElement("p");
        p1.textContent = "Finished";
        addLoc(p0, file, 22, 1, 896);
        addListener(input, "input", input_input_handler);
        setAttribute(input, "type", "text");
        addLoc(input, file, 23, 1, 930);
        addListener(p1, "click", click_handler);
        addListener(p1, "tap", tap_handler);
        addLoc(p1, file, 24, 1, 979);
        div.className = "playercountselector";
        addLoc(div, file, 21, 0, 861);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, p0);
        append(div, text1);
        append(div, input);
        input.value = ctx.lobby.screenname;
        append(div, text2);
        append(div, p1);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        if (!input_updating && changed.lobby) input.value = ctx.lobby.screenname;
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(input, "input", input_input_handler);
        removeListener(p1, "click", click_handler);
        removeListener(p1, "tap", tap_handler);
      }
    };
  } // (14:31) 


  function create_if_block_1(component, ctx) {
    var div, p0, text1, p1, text3, p2, text5, p3;

    function click_handler(event) {
      component.newgame(2);
    }

    function tap_handler(event) {
      component.newgame(2);
    }

    function click_handler_1(event) {
      component.newgame(3);
    }

    function tap_handler_1(event) {
      component.newgame(3);
    }

    function click_handler_2(event) {
      component.newgame(4);
    }

    function tap_handler_2(event) {
      component.newgame(4);
    }

    return {
      c: function create() {
        div = createElement("div");
        p0 = createElement("p");
        p0.textContent = "Choose your Game's number of Players";
        text1 = createText("\n\t");
        p1 = createElement("p");
        p1.textContent = "2";
        text3 = createText("\n\t");
        p2 = createElement("p");
        p2.textContent = "3";
        text5 = createText("\n\t");
        p3 = createElement("p");
        p3.textContent = "4";
        addLoc(p0, file, 15, 1, 621);
        addListener(p1, "click", click_handler);
        addListener(p1, "tap", tap_handler);
        addLoc(p1, file, 16, 1, 667);
        addListener(p2, "click", click_handler_1);
        addListener(p2, "tap", tap_handler_1);
        addLoc(p2, file, 17, 1, 719);
        addListener(p3, "click", click_handler_2);
        addListener(p3, "tap", tap_handler_2);
        addLoc(p3, file, 18, 1, 771);
        div.className = "playercountselector";
        addLoc(div, file, 14, 0, 586);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, p0);
        append(div, text1);
        append(div, p1);
        append(div, text3);
        append(div, p2);
        append(div, text5);
        append(div, p3);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(p1, "click", click_handler);
        removeListener(p1, "tap", tap_handler);
        removeListener(p2, "click", click_handler_1);
        removeListener(p2, "tap", tap_handler_1);
        removeListener(p3, "click", click_handler_2);
        removeListener(p3, "tap", tap_handler_2);
      }
    };
  } // (8:0) {#if game.currentphase==-4}


  function create_if_block(component, ctx) {
    var div, p0, text1, p1, text3, p2;

    function click_handler(event) {
      component.phaseincrement();
    }

    function tap_handler(event) {
      component.phaseincrement();
    }

    function click_handler_1(event) {
      component.fetchexistinggames();
    }

    function tap_handler_1(event) {
      component.fetchexistinggames();
    }

    function click_handler_2(event) {
      component.newoffline();
    }

    function tap_handler_2(event) {
      component.newoffline();
    }

    return {
      c: function create() {
        div = createElement("div");
        p0 = createElement("p");
        p0.textContent = "Start a New Online Game";
        text1 = createText("\n\t");
        p1 = createElement("p");
        p1.textContent = "Join an Existing Online Game";
        text3 = createText("\n\t");
        p2 = createElement("p");
        p2.textContent = "Start a New Offline Game";
        addListener(p0, "click", click_handler);
        addListener(p0, "tap", tap_handler);
        addLoc(p0, file, 9, 1, 284);
        addListener(p1, "click", click_handler_1);
        addListener(p1, "tap", tap_handler_1);
        addLoc(p1, file, 10, 1, 370);
        addListener(p2, "click", click_handler_2);
        addListener(p2, "tap", tap_handler_2);
        addLoc(p2, file, 11, 1, 469);
        div.className = "playercountselector";
        addLoc(div, file, 8, 0, 249);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, p0);
        append(div, text1);
        append(div, p1);
        append(div, text3);
        append(div, p2);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(p0, "click", click_handler);
        removeListener(p0, "tap", tap_handler);
        removeListener(p1, "click", click_handler_1);
        removeListener(p1, "tap", tap_handler_1);
        removeListener(p2, "click", click_handler_2);
        removeListener(p2, "tap", tap_handler_2);
      }
    };
  } // (45:3) {#if game.players[game.acting_player_index]!==undefined && ((lobby.screenname==player.name && lobby.online) || (game.players[game.acting_player_index].id==player.id && !lobby.online)) }


  function create_if_block_15(component, ctx) {
    var div9,
        div0,
        text0,
        div1,
        text1,
        div2,
        text2,
        text3_value = ctx.game.displayinfo.center_or_planets ? "planets" : "center row",
        text3,
        text4,
        text5,
        text6,
        div3,
        text7,
        text8,
        text9,
        div4,
        text10_value = ctx.game.messagetoplayer[ctx.game.messagetoplayer.length - 1],
        text10,
        text11,
        div8,
        div5,
        text12,
        text13_value = ctx.player.deck.length,
        text13,
        text14,
        div6,
        text15,
        div7,
        text16,
        text17_value = ctx.player.discard.length,
        text17;
    var each0_value = ctx.game.players;
    var each0_blocks = [];

    for (var i = 0; i < each0_value.length; i += 1) {
      each0_blocks[i] = create_each_block_12(component, get_each0_context(ctx, each0_value, i));
    }

    function select_block_type_1(ctx) {
      if (ctx.game.displayinfo.selectionzone == 'research') return create_if_block_33;
      if (ctx.game.displayinfo.center_or_planets) return create_if_block_34;
    }

    var current_block_type = select_block_type_1(ctx);
    var if_block0 = current_block_type && current_block_type(component, ctx);
    var if_block1 = !ctx.game.displayinfo.center_or_planets && create_if_block_25(component, ctx);

    function select_block_type_3(ctx) {
      if (ctx.game.displayinfo.showoptiontoskip) return create_if_block_24;
      return create_else_block_5;
    }

    var current_block_type_1 = select_block_type_3(ctx);
    var if_block2 = current_block_type_1(component, ctx);
    var each1_value_1 = ctx.game.players[ctx.game.acting_player_index].limbo;
    var each1_blocks = [];

    for (var i = 0; i < each1_value_1.length; i += 1) {
      each1_blocks[i] = create_each_block_5(component, get_each1_context_1(ctx, each1_value_1, i));
    }

    function select_block_type_5(ctx) {
      if (ctx.game.passp) return create_if_block_19;
      if (ctx.game.passt) return create_if_block_20;
      if (ctx.game.displayinfo.allowformultipleselections && ctx.game.choices.length > 0) return create_if_block_21;
      return create_else_block_4;
    }

    var current_block_type_2 = select_block_type_5(ctx);
    var if_block3 = current_block_type_2(component, ctx);
    var each2_value = ctx.player.hand;
    var each2_blocks = [];

    for (var i = 0; i < each2_value.length; i += 1) {
      each2_blocks[i] = create_each_block_4(component, get_each2_context(ctx, each2_value, i));
    }

    return {
      c: function create() {
        div9 = createElement("div");
        div0 = createElement("div");
        text0 = createText("\n\t\t\t\t\t");
        div1 = createElement("div");

        for (var i = 0; i < each0_blocks.length; i += 1) {
          each0_blocks[i].c();
        }

        text1 = createText("\n\t\t\t\t\t\n\t\t\t\t\t");
        div2 = createElement("div");
        text2 = createText("show ");
        text3 = createText(text3_value);
        text4 = createText("\n\t\t\t\t\t\n\t\t\t\t\t");
        if (if_block0) if_block0.c();
        text5 = createText("\n\t\t\t\t\t");
        if (if_block1) if_block1.c();
        text6 = createText("\n\t\t\t\t\t\n\t\t\t\t\t");
        div3 = createElement("div");
        if_block2.c();
        text7 = createText("\n\t\t\t\t\t\t");

        for (var i = 0; i < each1_blocks.length; i += 1) {
          each1_blocks[i].c();
        }

        text8 = createText("\n\t\t\t\t\t\t");
        if_block3.c();
        text9 = createText("\n\t\t\t\t\t");
        div4 = createElement("div");
        text10 = createText(text10_value);
        text11 = createText("\n\t\t\t\t\t\n\t\t\t\t\t");
        div8 = createElement("div");
        div5 = createElement("div");
        text12 = createText("cards remaining in deck: ");
        text13 = createText(text13_value);
        text14 = createText("\n                        ");
        div6 = createElement("div");

        for (var i = 0; i < each2_blocks.length; i += 1) {
          each2_blocks[i].c();
        }

        text15 = createText("\n\t\t\t\t\t\t");
        div7 = createElement("div");
        text16 = createText("cards in discard pile: ");
        text17 = createText(text17_value);
        div0.id = "dragged";
        addLoc(div0, file, 46, 5, 1929);
        div1.className = "playerinfo bordered";
        addLoc(div1, file, 47, 5, 1959);
        div2._svelte = {
          component: component
        };
        addListener(div2, "click", click_handler_1);
        addListener(div2, "tap", tap_handler_1);
        addLoc(div2, file, 59, 5, 2792);
        div3.id = "playedcards";
        div3.className = "flex zone playedcards";
        addLoc(div3, file, 151, 5, 7901);
        div4.className = "messagetoplayer bordered";
        addLoc(div4, file, 179, 5, 9547);
        div5.className = "bordered deck";
        addLoc(div5, file, 182, 6, 9710);
        div6.className = "hand";
        addLoc(div6, file, 183, 24, 9814);
        div7.className = "bordered discard";
        addLoc(div7, file, 200, 6, 11298);
        div8.className = "flex zone ownedcards";
        addLoc(div8, file, 181, 5, 9669);
        div9.className = "bordered playingfield";
        addLoc(div9, file, 45, 4, 1888);
      },
      m: function mount(target, anchor) {
        insert(target, div9, anchor);
        append(div9, div0);
        append(div9, text0);
        append(div9, div1);

        for (var i = 0; i < each0_blocks.length; i += 1) {
          each0_blocks[i].m(div1, null);
        }

        append(div9, text1);
        append(div9, div2);
        append(div2, text2);
        append(div2, text3);
        append(div9, text4);
        if (if_block0) if_block0.m(div9, null);
        append(div9, text5);
        if (if_block1) if_block1.m(div9, null);
        append(div9, text6);
        append(div9, div3);
        if_block2.m(div3, null);
        append(div3, text7);

        for (var i = 0; i < each1_blocks.length; i += 1) {
          each1_blocks[i].m(div3, null);
        }

        append(div3, text8);
        if_block3.m(div3, null);
        append(div9, text9);
        append(div9, div4);
        append(div4, text10);
        append(div9, text11);
        append(div9, div8);
        append(div8, div5);
        append(div5, text12);
        append(div5, text13);
        append(div8, text14);
        append(div8, div6);

        for (var i = 0; i < each2_blocks.length; i += 1) {
          each2_blocks[i].m(div6, null);
        }

        append(div8, text15);
        append(div8, div7);
        append(div7, text16);
        append(div7, text17);
      },
      p: function update(changed, ctx) {
        if (changed.game || changed.undefined) {
          each0_value = ctx.game.players;

          for (var i = 0; i < each0_value.length; i += 1) {
            var child_ctx = get_each0_context(ctx, each0_value, i);

            if (each0_blocks[i]) {
              each0_blocks[i].p(changed, child_ctx);
            } else {
              each0_blocks[i] = create_each_block_12(component, child_ctx);
              each0_blocks[i].c();
              each0_blocks[i].m(div1, null);
            }
          }

          for (; i < each0_blocks.length; i += 1) {
            each0_blocks[i].d(1);
          }

          each0_blocks.length = each0_value.length;
        }

        if (changed.game && text3_value !== (text3_value = ctx.game.displayinfo.center_or_planets ? "planets" : "center row")) {
          setData(text3, text3_value);
        }

        if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
          if_block0.p(changed, ctx);
        } else {
          if (if_block0) if_block0.d(1);
          if_block0 = current_block_type && current_block_type(component, ctx);
          if (if_block0) if_block0.c();
          if (if_block0) if_block0.m(div9, text5);
        }

        if (!ctx.game.displayinfo.center_or_planets) {
          if (if_block1) {
            if_block1.p(changed, ctx);
          } else {
            if_block1 = create_if_block_25(component, ctx);
            if_block1.c();
            if_block1.m(div9, text6);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (current_block_type_1 !== (current_block_type_1 = select_block_type_3(ctx))) {
          if_block2.d(1);
          if_block2 = current_block_type_1(component, ctx);
          if_block2.c();
          if_block2.m(div3, text7);
        }

        if (changed.game || changed.undefined) {
          each1_value_1 = ctx.game.players[ctx.game.acting_player_index].limbo;

          for (var i = 0; i < each1_value_1.length; i += 1) {
            var _child_ctx = get_each1_context_1(ctx, each1_value_1, i);

            if (each1_blocks[i]) {
              each1_blocks[i].p(changed, _child_ctx);
            } else {
              each1_blocks[i] = create_each_block_5(component, _child_ctx);
              each1_blocks[i].c();
              each1_blocks[i].m(div3, text8);
            }
          }

          for (; i < each1_blocks.length; i += 1) {
            each1_blocks[i].d(1);
          }

          each1_blocks.length = each1_value_1.length;
        }

        if (current_block_type_2 === (current_block_type_2 = select_block_type_5(ctx)) && if_block3) {
          if_block3.p(changed, ctx);
        } else {
          if_block3.d(1);
          if_block3 = current_block_type_2(component, ctx);
          if_block3.c();
          if_block3.m(div3, null);
        }

        if (changed.game && text10_value !== (text10_value = ctx.game.messagetoplayer[ctx.game.messagetoplayer.length - 1])) {
          setData(text10, text10_value);
        }

        if (changed.game && text13_value !== (text13_value = ctx.player.deck.length)) {
          setData(text13, text13_value);
        }

        if (changed.game || changed.undefined) {
          each2_value = ctx.player.hand;

          for (var i = 0; i < each2_value.length; i += 1) {
            var _child_ctx2 = get_each2_context(ctx, each2_value, i);

            if (each2_blocks[i]) {
              each2_blocks[i].p(changed, _child_ctx2);
            } else {
              each2_blocks[i] = create_each_block_4(component, _child_ctx2);
              each2_blocks[i].c();
              each2_blocks[i].m(div6, null);
            }
          }

          for (; i < each2_blocks.length; i += 1) {
            each2_blocks[i].d(1);
          }

          each2_blocks.length = each2_value.length;
        }

        if (changed.game && text17_value !== (text17_value = ctx.player.discard.length)) {
          setData(text17, text17_value);
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div9);
        }

        destroyEach(each0_blocks, detach);
        removeListener(div2, "click", click_handler_1);
        removeListener(div2, "tap", tap_handler_1);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if_block2.d();
        destroyEach(each1_blocks, detach);
        if_block3.d();
        destroyEach(each2_blocks, detach);
      }
    };
  } // (50:6) {#each game.players as p}


  function create_each_block_12(component, ctx) {
    var div3,
        div0,
        text0,
        text1_value = ctx.p.starfighters.small,
        text1,
        text2,
        div1,
        text3,
        text4_value = ctx.p.influence.length,
        text4,
        text5,
        div2,
        text6_value = ctx.p.name,
        text6,
        div3_class_value;
    return {
      c: function create() {
        div3 = createElement("div");
        div0 = createElement("div");
        text0 = createText("Military Might ");
        text1 = createText(text1_value);
        text2 = createText("\n\t\t\t\t\t\t\t\t");
        div1 = createElement("div");
        text3 = createText("Galactic Influence ");
        text4 = createText(text4_value);
        text5 = createText("\n\t\t\t\t\t\t\t\t");
        div2 = createElement("div");
        text6 = createText(text6_value);
        setStyle(div0, "width", "33%");
        setStyle(div0, "text-align", "center");
        div0.className = "bordered";
        addLoc(div0, file, 51, 8, 2252);
        setStyle(div1, "width", "33%");
        setStyle(div1, "text-align", "center");
        div1.className = "bordered";
        addLoc(div1, file, 52, 8, 2366);
        setStyle(div2, "width", "33%");
        setStyle(div2, "text-align", "center");
        div2.className = "bordered";
        addLoc(div2, file, 53, 8, 2482);
        setStyle(div3, "width", "" + 100 / ctx.game.number_of_players + "%");
        div3.className = div3_class_value = "flex " + (ctx.game.players[ctx.game.acting_player_index] !== ctx.undefined && ctx.p.name == ctx.game.players[ctx.game.acting_player_index].name ? 'selectable' : 'bordered');
        addLoc(div3, file, 50, 7, 2039);
      },
      m: function mount(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div0);
        append(div0, text0);
        append(div0, text1);
        append(div3, text2);
        append(div3, div1);
        append(div1, text3);
        append(div1, text4);
        append(div3, text5);
        append(div3, div2);
        append(div2, text6);
      },
      p: function update(changed, ctx) {
        if (changed.game && text1_value !== (text1_value = ctx.p.starfighters.small)) {
          setData(text1, text1_value);
        }

        if (changed.game && text4_value !== (text4_value = ctx.p.influence.length)) {
          setData(text4, text4_value);
        }

        if (changed.game && text6_value !== (text6_value = ctx.p.name)) {
          setData(text6, text6_value);
        }

        if (changed.game) {
          setStyle(div3, "width", "" + 100 / ctx.game.number_of_players + "%");
        }

        if ((changed.game || changed.undefined) && div3_class_value !== (div3_class_value = "flex " + (ctx.game.players[ctx.game.acting_player_index] !== ctx.undefined && ctx.p.name == ctx.game.players[ctx.game.acting_player_index].name ? 'selectable' : 'bordered'))) {
          div3.className = div3_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div3);
        }
      }
    };
  } // (72:49) 


  function create_if_block_34(component, ctx) {
    var div;

    function select_block_type_2(ctx) {
      if (ctx.game.displayinfo.selectionzone == 'rolecards') return create_if_block_35;
      return create_else_block_6;
    }

    var current_block_type = select_block_type_2(ctx);
    var if_block = current_block_type(component, ctx);
    return {
      c: function create() {
        div = createElement("div");
        if_block.c();
        div.className = "flex zone centerrow";
        addLoc(div, file, 72, 6, 3537);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        if_block.m(div, null);
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(div, null);
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        if_block.d();
      }
    };
  } // (64:5) {#if game.displayinfo.selectionzone=='research'}


  function create_if_block_33(component, ctx) {
    var div;
    var each_value_2 = ctx.game.research_deck;
    var each_blocks = [];

    for (var i = 0; i < each_value_2.length; i += 1) {
      each_blocks[i] = create_each_block_9(component, get_each_context_2(ctx, each_value_2, i));
    }

    return {
      c: function create() {
        div = createElement("div");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        div.className = "zone researchrow";
        addLoc(div, file, 64, 24, 3060);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p: function update(changed, ctx) {
        if (changed.game) {
          each_value_2 = ctx.game.research_deck;

          for (var i = 0; i < each_value_2.length; i += 1) {
            var child_ctx = get_each_context_2(ctx, each_value_2, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_9(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_2.length;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each_blocks, detach);
      }
    };
  } // (81:7) {:else}


  function create_else_block_6(component, ctx) {
    var each_anchor;
    var each_value_4 = ctx.game.stacks.rolecards;
    var each_blocks = [];

    for (var i = 0; i < each_value_4.length; i += 1) {
      each_blocks[i] = create_each_block_11(component, get_each_context_4(ctx, each_value_4, i));
    }

    return {
      c: function create() {
        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_anchor = createComment();
      },
      m: function mount(target, anchor) {
        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(target, anchor);
        }

        insert(target, each_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game) {
          each_value_4 = ctx.game.stacks.rolecards;

          for (var i = 0; i < each_value_4.length; i += 1) {
            var child_ctx = get_each_context_4(ctx, each_value_4, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_11(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_anchor.parentNode, each_anchor);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_4.length;
        }
      },
      d: function destroy(detach) {
        destroyEach(each_blocks, detach);

        if (detach) {
          detachNode(each_anchor);
        }
      }
    };
  } // (74:7) {#if game.displayinfo.selectionzone=='rolecards'}


  function create_if_block_35(component, ctx) {
    var each_anchor;
    var each_value_3 = ctx.game.stacks.rolecards;
    var each_blocks = [];

    for (var i = 0; i < each_value_3.length; i += 1) {
      each_blocks[i] = create_each_block_10(component, get_each_context_3(ctx, each_value_3, i));
    }

    return {
      c: function create() {
        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_anchor = createComment();
      },
      m: function mount(target, anchor) {
        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(target, anchor);
        }

        insert(target, each_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game) {
          each_value_3 = ctx.game.stacks.rolecards;

          for (var i = 0; i < each_value_3.length; i += 1) {
            var child_ctx = get_each_context_3(ctx, each_value_3, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_10(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_anchor.parentNode, each_anchor);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_3.length;
        }
      },
      d: function destroy(detach) {
        destroyEach(each_blocks, detach);

        if (detach) {
          detachNode(each_anchor);
        }
      }
    };
  } // (82:8) {#each game.stacks.rolecards as card}


  function create_each_block_11(component, ctx) {
    var div1,
        img,
        img_class_value,
        img_src_value,
        img_alt_value,
        text0,
        div0,
        text1_value = ctx.game.stacks.pilecount[ctx.card.type],
        text1;
    return {
      c: function create() {
        div1 = createElement("div");
        img = createElement("img");
        text0 = createText("\n\t\t\t\t\t\t\t\t\t");
        div0 = createElement("div");
        text1 = createText(text1_value);
        img.className = img_class_value = ctx.game.displayinfo.selectionzone == 'rolecards' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered';
        img.src = img_src_value = "./images/" + ctx.card.type + "100.png";
        img.alt = img_alt_value = ctx.card.name;
        addLoc(img, file, 83, 9, 4301);
        div0.className = "pilecount";
        addLoc(div0, file, 84, 9, 4486);
        addLoc(div1, file, 82, 8, 4286);
      },
      m: function mount(target, anchor) {
        insert(target, div1, anchor);
        append(div1, img);
        append(div1, text0);
        append(div1, div0);
        append(div0, text1);
      },
      p: function update(changed, ctx) {
        if (changed.game && img_class_value !== (img_class_value = ctx.game.displayinfo.selectionzone == 'rolecards' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered')) {
          img.className = img_class_value;
        }

        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.card.type + "100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && text1_value !== (text1_value = ctx.game.stacks.pilecount[ctx.card.type])) {
          setData(text1, text1_value);
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div1);
        }
      }
    };
  } // (75:8) {#each game.stacks.rolecards as card}


  function create_each_block_10(component, ctx) {
    var div1,
        img,
        img_class_value,
        img_src_value,
        img_alt_value,
        text0,
        div0,
        text1_value = ctx.game.stacks.pilecount[ctx.card.type],
        text1;
    return {
      c: function create() {
        div1 = createElement("div");
        img = createElement("img");
        text0 = createText("\n\t\t\t\t\t\t\t\t\t");
        div0 = createElement("div");
        text1 = createText(text1_value);
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "click", click_handler_3);
        addListener(img, "tap", tap_handler_3);
        addListener(img, "touchmove", touchmove_handler);
        addListener(img, "touchstart", touchstart_handler);
        addListener(img, "touchend", touchend_handler);
        img.className = img_class_value = ctx.game.displayinfo.selectionzone == 'rolecards' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered';
        img.src = img_src_value = "./images/" + ctx.card.type + "100.png";
        img.alt = img_alt_value = ctx.card.name;
        addLoc(img, file, 76, 9, 3697);
        div0.className = "pilecount";
        addLoc(div0, file, 77, 9, 4121);
        addLoc(div1, file, 75, 8, 3682);
      },
      m: function mount(target, anchor) {
        insert(target, div1, anchor);
        append(div1, img);
        append(div1, text0);
        append(div1, div0);
        append(div0, text1);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_class_value !== (img_class_value = ctx.game.displayinfo.selectionzone == 'rolecards' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered')) {
          img.className = img_class_value;
        }

        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.card.type + "100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && text1_value !== (text1_value = ctx.game.stacks.pilecount[ctx.card.type])) {
          setData(text1, text1_value);
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div1);
        }

        removeListener(img, "click", click_handler_3);
        removeListener(img, "tap", tap_handler_3);
        removeListener(img, "touchmove", touchmove_handler);
        removeListener(img, "touchstart", touchstart_handler);
        removeListener(img, "touchend", touchend_handler);
      }
    };
  } // (66:7) {#each game.research_deck as card}


  function create_each_block_9(component, ctx) {
    var div, img, img_src_value, img_class_value, img_alt_value;
    return {
      c: function create() {
        div = createElement("div");
        img = createElement("img");
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "click", click_handler_2);
        addListener(img, "tap", tap_handler_2);
        img.src = img_src_value = ctx.card.imgurl;
        img.className = img_class_value = ctx.game.displayinfo.selectionzone == 'research' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered';
        img.alt = img_alt_value = ctx.card.name;
        addLoc(img, file, 67, 32, 3178);
        addLoc(div, file, 66, 7, 3140);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_src_value !== (img_src_value = ctx.card.imgurl)) {
          img.src = img_src_value;
        }

        if (changed.game && img_class_value !== (img_class_value = ctx.game.displayinfo.selectionzone == 'research' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered')) {
          img.className = img_class_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(img, "click", click_handler_2);
        removeListener(img, "tap", tap_handler_2);
      }
    };
  } // (91:5) {#if !game.displayinfo.center_or_planets}


  function create_if_block_25(component, ctx) {
    var div, text;
    var each0_value_1 = ctx.player.unsettled_planets;
    var each0_blocks = [];

    for (var i = 0; i < each0_value_1.length; i += 1) {
      each0_blocks[i] = create_each_block_8(component, get_each0_context_1(ctx, each0_value_1, i));
    }

    var each1_value = [].concat(_toConsumableArray(ctx.player.settled_planets), _toConsumableArray(ctx.player.conquered_planets));
    var each1_blocks = [];

    for (var i = 0; i < each1_value.length; i += 1) {
      each1_blocks[i] = create_each_block_6(component, get_each1_context(ctx, each1_value, i));
    }

    return {
      c: function create() {
        div = createElement("div");

        for (var i = 0; i < each0_blocks.length; i += 1) {
          each0_blocks[i].c();
        }

        text = createText("\n\t\t\t\t\t\t\t");

        for (var i = 0; i < each1_blocks.length; i += 1) {
          each1_blocks[i].c();
        }

        div.className = "flex zone centerrow";
        addLoc(div, file, 91, 6, 4672);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);

        for (var i = 0; i < each0_blocks.length; i += 1) {
          each0_blocks[i].m(div, null);
        }

        append(div, text);

        for (var i = 0; i < each1_blocks.length; i += 1) {
          each1_blocks[i].m(div, null);
        }
      },
      p: function update(changed, ctx) {
        if (changed.game) {
          each0_value_1 = ctx.player.unsettled_planets;

          for (var i = 0; i < each0_value_1.length; i += 1) {
            var child_ctx = get_each0_context_1(ctx, each0_value_1, i);

            if (each0_blocks[i]) {
              each0_blocks[i].p(changed, child_ctx);
            } else {
              each0_blocks[i] = create_each_block_8(component, child_ctx);
              each0_blocks[i].c();
              each0_blocks[i].m(div, text);
            }
          }

          for (; i < each0_blocks.length; i += 1) {
            each0_blocks[i].d(1);
          }

          each0_blocks.length = each0_value_1.length;
        }

        if (changed.game) {
          each1_value = [].concat(_toConsumableArray(ctx.player.settled_planets), _toConsumableArray(ctx.player.conquered_planets));

          for (var i = 0; i < each1_value.length; i += 1) {
            var _child_ctx3 = get_each1_context(ctx, each1_value, i);

            if (each1_blocks[i]) {
              each1_blocks[i].p(changed, _child_ctx3);
            } else {
              each1_blocks[i] = create_each_block_6(component, _child_ctx3);
              each1_blocks[i].c();
              each1_blocks[i].m(div, null);
            }
          }

          for (; i < each1_blocks.length; i += 1) {
            each1_blocks[i].d(1);
          }

          each1_blocks.length = each1_value.length;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each0_blocks, detach);
        destroyEach(each1_blocks, detach);
      }
    };
  } // (93:7) {#each player.unsettled_planets as planet}


  function create_each_block_8(component, ctx) {
    var div3,
        img,
        img_src_value,
        img_alt_value,
        text0,
        div0,
        text1_value = ctx.planet.settle_cost,
        text1,
        text2,
        div1,
        text3_value = ctx.planet.conquer_cost,
        text3,
        text4,
        div2,
        text5_value = ctx.planet.hosted_colonies.length,
        text5,
        text6,
        div3_class_value;
    return {
      c: function create() {
        div3 = createElement("div");
        img = createElement("img");
        text0 = createText("\n                                    ");
        div0 = createElement("div");
        text1 = createText(text1_value);
        text2 = createText("\n                                    ");
        div1 = createElement("div");
        text3 = createText(text3_value);
        text4 = createText("\n\t\t\t\t\t\t\t\t\t");
        div2 = createElement("div");
        text5 = createText(text5_value);
        text6 = createText(" colonies");
        img.src = img_src_value = "./images/" + ctx.planet.type + "back100.png";
        img.alt = img_alt_value = "" + ctx.planet.settle_cost + " " + ctx.planet.type + " " + ctx.planet.conquer_cost;
        addLoc(img, file, 94, 9, 5046);
        div0.className = "settle_cost";
        addLoc(div0, file, 95, 36, 5191);
        div1.className = "conquer_cost";
        addLoc(div1, file, 96, 36, 5280);
        div2.className = "hosted_colonies";
        addLoc(div2, file, 97, 9, 5344);
        div3._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(div3, "click", click_handler_4);
        addListener(div3, "tap", tap_handler_4);
        div3.className = div3_class_value = " unsettled " + (ctx.game.displayinfo.selectionzone == 'unsettled_planets' ? ctx.planet.selected ? 'selected' : 'selectable' : 'bordered');
        addLoc(div3, file, 93, 32, 4788);
      },
      m: function mount(target, anchor) {
        insert(target, div3, anchor);
        append(div3, img);
        append(div3, text0);
        append(div3, div0);
        append(div0, text1);
        append(div3, text2);
        append(div3, div1);
        append(div1, text3);
        append(div3, text4);
        append(div3, div2);
        append(div2, text5);
        append(div2, text6);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;

        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.planet.type + "back100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = "" + ctx.planet.settle_cost + " " + ctx.planet.type + " " + ctx.planet.conquer_cost)) {
          img.alt = img_alt_value;
        }

        if (changed.game && text1_value !== (text1_value = ctx.planet.settle_cost)) {
          setData(text1, text1_value);
        }

        if (changed.game && text3_value !== (text3_value = ctx.planet.conquer_cost)) {
          setData(text3, text3_value);
        }

        if (changed.game && text5_value !== (text5_value = ctx.planet.hosted_colonies.length)) {
          setData(text5, text5_value);
        }

        div3._svelte.ctx = ctx;

        if (changed.game && div3_class_value !== (div3_class_value = " unsettled " + (ctx.game.displayinfo.selectionzone == 'unsettled_planets' ? ctx.planet.selected ? 'selected' : 'selectable' : 'bordered'))) {
          div3.className = div3_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div3);
        }

        removeListener(div3, "click", click_handler_4);
        removeListener(div3, "tap", tap_handler_4);
      }
    };
  } // (110:11) {#if planet.icons.survey > 0}


  function create_if_block_32(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/surveyicon100.png";
        img.alt = "survey";
        addLoc(img, file, 110, 12, 6404);
        addLoc(br, file, 110, 64, 6456);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (113:11) {#if planet.icons.warfare > 0}


  function create_if_block_31(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/warfareicon100.png";
        img.alt = "warfare";
        addLoc(img, file, 113, 12, 6532);
        addLoc(br, file, 113, 66, 6586);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (116:11) {#if planet.icons.colonize > 0}


  function create_if_block_30(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/colonizeicon100.png";
        img.alt = "colonize";
        addLoc(img, file, 116, 12, 6663);
        addLoc(br, file, 116, 68, 6719);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (119:11) {#if planet.icons.research > 0}


  function create_if_block_29(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/researchicon100.png";
        img.alt = "research";
        addLoc(img, file, 119, 12, 6796);
        addLoc(br, file, 119, 68, 6852);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (122:11) {#if planet.icons.trade > 0}


  function create_if_block_28(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/tradeicon100.png";
        img.alt = "trade";
        addLoc(img, file, 122, 12, 6926);
        addLoc(br, file, 122, 62, 6976);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (125:11) {#if planet.icons.produce > 0}


  function create_if_block_27(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/produceicon100.png";
        img.alt = "produce";
        addLoc(img, file, 125, 12, 7052);
        addLoc(br, file, 125, 66, 7106);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (129:11) {#each planet.production_zones as zone}


  function create_each_block_7(component, ctx) {
    var img, img_src_value, img_alt_value, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = img_src_value = "./images/" + ctx.zone.type + "productionzoneicon.png";
        img.alt = img_alt_value = "" + ctx.zone.type + " zone";
        addLoc(img, file, 129, 12, 7228);
        addLoc(br, file, 129, 90, 7306);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.zone.type + "productionzoneicon.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = "" + ctx.zone.type + " zone")) {
          img.alt = img_alt_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (133:11) {#if planet.handsize_modifier > 0}


  function create_if_block_26(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/handsizeicon100.png";
        img.alt = "produce";
        addLoc(img, file, 133, 12, 7423);
        addLoc(br, file, 133, 67, 7478);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (101:7) {#each [...player.settled_planets, ...player.conquered_planets] as planet}


  function create_each_block_6(component, ctx) {
    var div4,
        div3,
        img0,
        img0_src_value,
        img0_alt_value,
        text0,
        div2,
        text1,
        text2,
        text3,
        text4,
        text5,
        text6,
        text7,
        text8,
        div0,
        text9_value = ctx.planet.influence_value,
        text9,
        text10,
        img1,
        text11,
        div1,
        text12_value = ctx.planet.name,
        text12,
        div4_class_value;
    var if_block0 = ctx.planet.icons.survey > 0 && create_if_block_32(component, ctx);
    var if_block1 = ctx.planet.icons.warfare > 0 && create_if_block_31(component, ctx);
    var if_block2 = ctx.planet.icons.colonize > 0 && create_if_block_30(component, ctx);
    var if_block3 = ctx.planet.icons.research > 0 && create_if_block_29(component, ctx);
    var if_block4 = ctx.planet.icons.trade > 0 && create_if_block_28(component, ctx);
    var if_block5 = ctx.planet.icons.produce > 0 && create_if_block_27(component, ctx);
    var each_value_5 = ctx.planet.production_zones;
    var each_blocks = [];

    for (var i = 0; i < each_value_5.length; i += 1) {
      each_blocks[i] = create_each_block_7(component, get_each_context_5(ctx, each_value_5, i));
    }

    var if_block6 = ctx.planet.handsize_modifier > 0 && create_if_block_26(component, ctx);
    return {
      c: function create() {
        div4 = createElement("div");
        div3 = createElement("div");
        img0 = createElement("img");
        text0 = createText("\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t");
        div2 = createElement("div");
        if (if_block0) if_block0.c();
        text1 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block1) if_block1.c();
        text2 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block2) if_block2.c();
        text3 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block3) if_block3.c();
        text4 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block4) if_block4.c();
        text5 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block5) if_block5.c();
        text6 = createText("\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        text7 = createText("\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t");
        if (if_block6) if_block6.c();
        text8 = createText("\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t");
        div0 = createElement("div");
        text9 = createText(text9_value);
        text10 = createText("\n\t\t\t\t\t\t\t\t\t\t\t");
        img1 = createElement("img");
        text11 = createText("\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t");
        div1 = createElement("div");
        text12 = createText(text12_value);
        img0.src = img0_src_value = "./images/" + ctx.planet.type + "100.png";
        img0.alt = img0_alt_value = "" + ctx.planet.settle_cost + " " + ctx.planet.type + " " + ctx.planet.conquer_cost;
        addLoc(img0, file, 105, 10, 6098);
        addLoc(div0, file, 136, 11, 7547);
        img1.src = "./images/influenceicon.png";
        img1.alt = "influence";
        addLoc(img1, file, 139, 11, 7619);
        addLoc(div1, file, 141, 11, 7712);
        div2.className = "planetfrontinfo";
        addLoc(div2, file, 108, 10, 6321);
        div3.className = "planetfront";
        setStyle(div3, "font-size", "160%");
        addLoc(div3, file, 104, 9, 6036);
        div4._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(div4, "click", click_handler_5);
        addListener(div4, "tap", tap_handler_5);
        div4.className = div4_class_value = ctx.game.displayinfo.selectionzone == 'settled_&_conquered_planets' ? ctx.planet.selected ? 'selected' : 'selectable' : 'bordered';
        addLoc(div4, file, 103, 8, 5759);
      },
      m: function mount(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div3);
        append(div3, img0);
        append(div3, text0);
        append(div3, div2);
        if (if_block0) if_block0.m(div2, null);
        append(div2, text1);
        if (if_block1) if_block1.m(div2, null);
        append(div2, text2);
        if (if_block2) if_block2.m(div2, null);
        append(div2, text3);
        if (if_block3) if_block3.m(div2, null);
        append(div2, text4);
        if (if_block4) if_block4.m(div2, null);
        append(div2, text5);
        if (if_block5) if_block5.m(div2, null);
        append(div2, text6);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div2, null);
        }

        append(div2, text7);
        if (if_block6) if_block6.m(div2, null);
        append(div2, text8);
        append(div2, div0);
        append(div0, text9);
        append(div2, text10);
        append(div2, img1);
        append(div2, text11);
        append(div2, div1);
        append(div1, text12);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;

        if (changed.game && img0_src_value !== (img0_src_value = "./images/" + ctx.planet.type + "100.png")) {
          img0.src = img0_src_value;
        }

        if (changed.game && img0_alt_value !== (img0_alt_value = "" + ctx.planet.settle_cost + " " + ctx.planet.type + " " + ctx.planet.conquer_cost)) {
          img0.alt = img0_alt_value;
        }

        if (ctx.planet.icons.survey > 0) {
          if (!if_block0) {
            if_block0 = create_if_block_32(component, ctx);
            if_block0.c();
            if_block0.m(div2, text1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (ctx.planet.icons.warfare > 0) {
          if (!if_block1) {
            if_block1 = create_if_block_31(component, ctx);
            if_block1.c();
            if_block1.m(div2, text2);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (ctx.planet.icons.colonize > 0) {
          if (!if_block2) {
            if_block2 = create_if_block_30(component, ctx);
            if_block2.c();
            if_block2.m(div2, text3);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (ctx.planet.icons.research > 0) {
          if (!if_block3) {
            if_block3 = create_if_block_29(component, ctx);
            if_block3.c();
            if_block3.m(div2, text4);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }

        if (ctx.planet.icons.trade > 0) {
          if (!if_block4) {
            if_block4 = create_if_block_28(component, ctx);
            if_block4.c();
            if_block4.m(div2, text5);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }

        if (ctx.planet.icons.produce > 0) {
          if (!if_block5) {
            if_block5 = create_if_block_27(component, ctx);
            if_block5.c();
            if_block5.m(div2, text6);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }

        if (changed.game) {
          each_value_5 = ctx.planet.production_zones;

          for (var i = 0; i < each_value_5.length; i += 1) {
            var child_ctx = get_each_context_5(ctx, each_value_5, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_7(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div2, text7);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_5.length;
        }

        if (ctx.planet.handsize_modifier > 0) {
          if (!if_block6) {
            if_block6 = create_if_block_26(component, ctx);
            if_block6.c();
            if_block6.m(div2, text8);
          }
        } else if (if_block6) {
          if_block6.d(1);
          if_block6 = null;
        }

        if (changed.game && text9_value !== (text9_value = ctx.planet.influence_value)) {
          setData(text9, text9_value);
        }

        if (changed.game && text12_value !== (text12_value = ctx.planet.name)) {
          setData(text12, text12_value);
        }

        div4._svelte.ctx = ctx;

        if (changed.game && div4_class_value !== (div4_class_value = ctx.game.displayinfo.selectionzone == 'settled_&_conquered_planets' ? ctx.planet.selected ? 'selected' : 'selectable' : 'bordered')) {
          div4.className = div4_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div4);
        }

        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
        if (if_block3) if_block3.d();
        if (if_block4) if_block4.d();
        if (if_block5) if_block5.d();
        destroyEach(each_blocks, detach);
        if (if_block6) if_block6.d();
        removeListener(div4, "click", click_handler_5);
        removeListener(div4, "tap", tap_handler_5);
      }
    };
  } // (155:6) {:else}


  function create_else_block_5(component, ctx) {
    var div;
    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "[____]";
        setStyle(div, "margin-right", "auto");
        div.className = "bordered pass";
        addLoc(div, file, 155, 7, 8172);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }
      }
    };
  } // (153:6) {#if game.displayinfo.showoptiontoskip}


  function create_if_block_24(component, ctx) {
    var div;
    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "[Choose None]";
        div._svelte = {
          component: component
        };
        addListener(div, "click", click_handler_6);
        addListener(div, "tap", tap_handler_6);
        setStyle(div, "margin-right", "auto");
        div.className = "selectable pass";
        addLoc(div, file, 153, 7, 8008);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_6);
        removeListener(div, "tap", tap_handler_6);
      }
    };
  } // (163:94) 


  function create_if_block_23(component, ctx) {
    var div, img, img_src_value, img_alt_value;
    return {
      c: function create() {
        div = createElement("div");
        img = createElement("img");
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "click", click_handler_8);
        addListener(img, "tap", tap_handler_8);
        img.className = "minicard";
        img.src = img_src_value = "./images/" + ctx.card.type + "100.png";
        img.alt = img_alt_value = ctx.card.name;
        addLoc(img, file, 164, 10, 8668);
        div.className = "bordered";
        addLoc(div, file, 163, 9, 8635);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.card.type + "100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(img, "click", click_handler_8);
        removeListener(img, "tap", tap_handler_8);
      }
    };
  } // (159:8) {#if card.research_cost !== undefined}


  function create_if_block_22(component, ctx) {
    var div, img, img_src_value, img_alt_value;
    return {
      c: function create() {
        div = createElement("div");
        img = createElement("img");
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "click", click_handler_7);
        addListener(img, "tap", tap_handler_7);
        img.className = "minicard";
        img.src = img_src_value = ctx.card.imgurl;
        img.alt = img_alt_value = ctx.card.name;
        addLoc(img, file, 160, 9, 8404);
        div.className = "bordered";
        addLoc(div, file, 159, 8, 8372);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_src_value !== (img_src_value = ctx.card.imgurl)) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(img, "click", click_handler_7);
        removeListener(img, "tap", tap_handler_7);
      }
    };
  } // (158:6) {#each game.players[game.acting_player_index].limbo as card}


  function create_each_block_5(component, ctx) {
    var if_block_anchor;

    function select_block_type_4(ctx) {
      if (ctx.card.research_cost !== ctx.undefined) return create_if_block_22;
      if (ctx.card.type != "advanced" && ctx.card.type != "fertile" && ctx.card.type != "metallic") return create_if_block_23;
    }

    var current_block_type = select_block_type_4(ctx);
    var if_block = current_block_type && current_block_type(component, ctx);
    return {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if (if_block) if_block.d(1);
          if_block = current_block_type && current_block_type(component, ctx);
          if (if_block) if_block.c();
          if (if_block) if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      d: function destroy(detach) {
        if (if_block) if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (176:6) {:else}


  function create_else_block_4(component, ctx) {
    var div;
    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "[______]";
        div.className = "bordered pass";
        addLoc(div, file, 176, 7, 9475);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }
      }
    };
  } // (174:84) 


  function create_if_block_21(component, ctx) {
    var div;
    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "[Choose Selected]";
        div._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(div, "click", click_handler_11);
        addListener(div, "tap", tap_handler_11);
        setStyle(div, "margin-left", "auto");
        div.className = "selectable pass";
        addLoc(div, file, 174, 7, 9270);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        div._svelte.ctx = ctx;
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_11);
        removeListener(div, "tap", tap_handler_11);
      }
    };
  } // (172:26) 


  function create_if_block_20(component, ctx) {
    var div;
    return {
      c: function create() {
        div = createElement("div");
        div.textContent = "[End Turn]";
        div._svelte = {
          component: component
        };
        addListener(div, "click", click_handler_10);
        addListener(div, "tap", tap_handler_10);
        setStyle(div, "margin-left", "auto");
        div.className = "selectable pass";
        addLoc(div, file, 172, 7, 9063);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_10);
        removeListener(div, "tap", tap_handler_10);
      }
    };
  } // (170:6) {#if game.passp }


  function create_if_block_19(component, ctx) {
    var div, text0, br, text1;
    return {
      c: function create() {
        div = createElement("div");
        text0 = createText("[Pass to ");
        br = createElement("br");
        text1 = createText(" Next Player]");
        addLoc(br, file, 170, 121, 9005);
        div._svelte = {
          component: component
        };
        addListener(div, "click", click_handler_9);
        addListener(div, "tap", tap_handler_9);
        setStyle(div, "margin-left", "auto");
        div.className = "selectable pass";
        addLoc(div, file, 170, 7, 8891);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, text0);
        append(div, br);
        append(div, text1);
      },
      p: noop,
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_9);
        removeListener(div, "tap", tap_handler_9);
      }
    };
  } // (195:9) {:else}


  function create_else_block_3(component, ctx) {
    var img, img_src_value, img_alt_value, img_class_value;
    return {
      c: function create() {
        img = createElement("img");
        img.src = img_src_value = "./images/" + ctx.card.type + "100.png";
        img.alt = img_alt_value = ctx.card.name;
        img.className = img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered');
        addLoc(img, file, 195, 10, 11037);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.card.type + "100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && img_class_value !== (img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered'))) {
          img.className = img_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
        }
      }
    };
  } // (193:9) {#if card.research_cost !== undefined}


  function create_if_block_18(component, ctx) {
    var img, img_src_value, img_alt_value, img_class_value;
    return {
      c: function create() {
        img = createElement("img");
        img.src = img_src_value = ctx.card.imgurl;
        img.alt = img_alt_value = ctx.card.name;
        img.className = img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered');
        addLoc(img, file, 193, 10, 10845);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game && img_src_value !== (img_src_value = ctx.card.imgurl)) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && img_class_value !== (img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'selected' : 'selectable' : 'bordered'))) {
          img.className = img_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
        }
      }
    };
  } // (186:8) {#if game.displayinfo.selectionzone=='hand'}


  function create_if_block_16(component, ctx) {
    var if_block_anchor;

    function select_block_type_7(ctx) {
      if (ctx.card.research_cost !== ctx.undefined) return create_if_block_17;
      return create_else_block_2;
    }

    var current_block_type = select_block_type_7(ctx);
    var if_block = current_block_type(component, ctx);
    return {
      c: function create() {
        if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      d: function destroy(detach) {
        if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (189:9) {:else}


  function create_else_block_2(component, ctx) {
    var img, img_src_value, img_alt_value, img_class_value;
    return {
      c: function create() {
        img = createElement("img");
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "touchstart", touchstart_handler_2);
        addListener(img, "touchend", touchend_handler_2);
        addListener(img, "click", click_handler_13);
        addListener(img, "touchmove", touchmove_handler_2);
        addListener(img, "tap", tap_handler_13);
        img.src = img_src_value = "./images/" + ctx.card.type + "100.png";
        img.alt = img_alt_value = ctx.card.name;
        img.className = img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'hidden' : 'selectable' : 'bordered');
        addLoc(img, file, 189, 10, 10365);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.card.type + "100.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && img_class_value !== (img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'hidden' : 'selectable' : 'bordered'))) {
          img.className = img_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
        }

        removeListener(img, "touchstart", touchstart_handler_2);
        removeListener(img, "touchend", touchend_handler_2);
        removeListener(img, "click", click_handler_13);
        removeListener(img, "touchmove", touchmove_handler_2);
        removeListener(img, "tap", tap_handler_13);
      }
    };
  } // (187:9) {#if card.research_cost !== undefined}


  function create_if_block_17(component, ctx) {
    var img, img_src_value, img_alt_value, img_class_value;
    return {
      c: function create() {
        img = createElement("img");
        img._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(img, "touchstart", touchstart_handler_1);
        addListener(img, "touchend", touchend_handler_1);
        addListener(img, "touchmove", touchmove_handler_1);
        addListener(img, "click", click_handler_12);
        addListener(img, "tap", tap_handler_12);
        img.src = img_src_value = ctx.card.imgurl;
        img.alt = img_alt_value = ctx.card.name;
        img.className = img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'hidden' : 'selectable' : 'bordered');
        addLoc(img, file, 187, 10, 9979);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;
        img._svelte.ctx = ctx;

        if (changed.game && img_src_value !== (img_src_value = ctx.card.imgurl)) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = ctx.card.name)) {
          img.alt = img_alt_value;
        }

        if (changed.game && img_class_value !== (img_class_value = "cutcard " + (ctx.game.displayinfo.selectionzone == 'hand' ? ctx.card.selected ? 'hidden' : 'selectable' : 'bordered'))) {
          img.className = img_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
        }

        removeListener(img, "touchstart", touchstart_handler_1);
        removeListener(img, "touchend", touchend_handler_1);
        removeListener(img, "touchmove", touchmove_handler_1);
        removeListener(img, "click", click_handler_12);
        removeListener(img, "tap", tap_handler_12);
      }
    };
  } // (185:7) {#each player.hand as card}


  function create_each_block_4(component, ctx) {
    var if_block_anchor;

    function select_block_type_6(ctx) {
      if (ctx.game.displayinfo.selectionzone == 'hand') return create_if_block_16;
      if (ctx.card.research_cost !== ctx.undefined) return create_if_block_18;
      return create_else_block_3;
    }

    var current_block_type = select_block_type_6(ctx);
    var if_block = current_block_type(component, ctx);
    return {
      c: function create() {
        if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type_6(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      d: function destroy(detach) {
        if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (44:2) {#each game.players as player}


  function create_each_block_3(component, ctx) {
    var if_block_anchor;
    var if_block = ctx.game.players[ctx.game.acting_player_index] !== ctx.undefined && (ctx.lobby.screenname == ctx.player.name && ctx.lobby.online || ctx.game.players[ctx.game.acting_player_index].id == ctx.player.id && !ctx.lobby.online) && create_if_block_15(component, ctx);
    return {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (ctx.game.players[ctx.game.acting_player_index] !== ctx.undefined && (ctx.lobby.screenname == ctx.player.name && ctx.lobby.online || ctx.game.players[ctx.game.acting_player_index].id == ctx.player.id && !ctx.lobby.online)) {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block_15(component, ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d: function destroy(detach) {
        if (if_block) if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (207:2) {#if game.displayinfo.selectionzone=='options'}


  function create_if_block_6(component, ctx) {
    var div, div_class_value;
    var each_value_6 = ctx.game.options;
    var each_blocks = [];

    for (var i = 0; i < each_value_6.length; i += 1) {
      each_blocks[i] = create_each_block_1(component, get_each_context_6(ctx, each_value_6, i));
    }

    return {
      c: function create() {
        div = createElement("div");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        div.className = div_class_value = ctx.game.options[0] !== ctx.undefined && ctx.game.options[0].type !== ctx.undefined ? 'talloptions' : 'options';
        addLoc(div, file, 207, 3, 11501);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p: function update(changed, ctx) {
        if (changed.game || changed.undefined) {
          each_value_6 = ctx.game.options;

          for (var i = 0; i < each_value_6.length; i += 1) {
            var child_ctx = get_each_context_6(ctx, each_value_6, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_1(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_6.length;
        }

        if ((changed.game || changed.undefined) && div_class_value !== (div_class_value = ctx.game.options[0] !== ctx.undefined && ctx.game.options[0].type !== ctx.undefined ? 'talloptions' : 'options')) {
          div.className = div_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each_blocks, detach);
      }
    };
  } // (267:5) {:else}


  function create_else_block_1(component, ctx) {
    var div,
        text0_value = ctx.option.name,
        text0,
        text1,
        div_class_value;
    return {
      c: function create() {
        div = createElement("div");
        text0 = createText(text0_value);
        text1 = createText("\n\t\t\t\t\t\t");
        div._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(div, "click", click_handler_15);
        addListener(div, "tap", tap_handler_15);
        div.className = div_class_value = "pass " + (ctx.game.displayinfo.selectionzone == 'options' ? ctx.option.selected ? 'selected' : 'selectable' : 'bordered');
        addLoc(div, file, 267, 6, 14016);
      },
      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, text0);
        append(div, text1);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;

        if (changed.game && text0_value !== (text0_value = ctx.option.name)) {
          setData(text0, text0_value);
        }

        div._svelte.ctx = ctx;

        if (changed.game && div_class_value !== (div_class_value = "pass " + (ctx.game.displayinfo.selectionzone == 'options' ? ctx.option.selected ? 'selected' : 'selectable' : 'bordered'))) {
          div.className = div_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, "click", click_handler_15);
        removeListener(div, "tap", tap_handler_15);
      }
    };
  } // (210:5) {#if option.type !== undefined}


  function create_if_block_7(component, ctx) {
    var div7,
        div3,
        img0,
        img0_src_value,
        img0_alt_value,
        text0,
        div2,
        text1,
        text2,
        text3,
        text4,
        text5,
        text6,
        text7,
        text8,
        div0,
        text9_value = ctx.option.influence_value,
        text9,
        text10,
        img1,
        text11,
        div1,
        text12_value = ctx.option.name,
        text12,
        text13,
        div6,
        div5,
        img2,
        img2_src_value,
        img2_alt_value,
        text14,
        div4,
        span0,
        text15_value = ctx.option.settle_cost,
        text15,
        text16,
        span1,
        text17_value = ctx.option.conquer_cost,
        text17,
        text18,
        div7_class_value;
    var if_block0 = ctx.option.icons.survey > 0 && create_if_block_14(component, ctx);
    var if_block1 = ctx.option.icons.warfare > 0 && create_if_block_13(component, ctx);
    var if_block2 = ctx.option.icons.colonize > 0 && create_if_block_12(component, ctx);
    var if_block3 = ctx.option.icons.research > 0 && create_if_block_11(component, ctx);
    var if_block4 = ctx.option.icons.trade > 0 && create_if_block_10(component, ctx);
    var if_block5 = ctx.option.icons.produce > 0 && create_if_block_9(component, ctx);
    var each_value_7 = ctx.option.production_zones;
    var each_blocks = [];

    for (var i = 0; i < each_value_7.length; i += 1) {
      each_blocks[i] = create_each_block_2(component, get_each_context_7(ctx, each_value_7, i));
    }

    var if_block6 = ctx.option.handsize_modifier > 0 && create_if_block_8(component, ctx);
    return {
      c: function create() {
        div7 = createElement("div");
        div3 = createElement("div");
        img0 = createElement("img");
        text0 = createText("\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t");
        div2 = createElement("div");
        if (if_block0) if_block0.c();
        text1 = createText("\n\t\t\t\t\t\t\t\t");
        if (if_block1) if_block1.c();
        text2 = createText("\n\t\t\t\t\t\t\t\t");
        if (if_block2) if_block2.c();
        text3 = createText("\n\t\t\t\t\t\t\t\t");
        if (if_block3) if_block3.c();
        text4 = createText("\n\t\t\t\t\t\t\t\t");
        if (if_block4) if_block4.c();
        text5 = createText("\n\t\t\t\t\t\t\t\t");
        if (if_block5) if_block5.c();
        text6 = createText("\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        text7 = createText("\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t");
        if (if_block6) if_block6.c();
        text8 = createText("\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t");
        div0 = createElement("div");
        text9 = createText(text9_value);
        text10 = createText("\n\t\t\t\t\t\t\t\t");
        img1 = createElement("img");
        text11 = createText("\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t");
        div1 = createElement("div");
        text12 = createText(text12_value);
        text13 = createText("\n\t\t\t\t\t\t");
        div6 = createElement("div");
        div5 = createElement("div");
        img2 = createElement("img");
        text14 = createText("\n\t\t\t\t\t\t\t\t");
        div4 = createElement("div");
        span0 = createElement("span");
        text15 = createText(text15_value);
        text16 = createText("\n\t\t\t\t\t\t\t\t\t");
        span1 = createElement("span");
        text17 = createText(text17_value);
        text18 = createText("\n\t\t\t\t\t");
        img0.src = img0_src_value = "./images/" + ctx.option.type + "100.png";
        img0.alt = img0_alt_value = "" + ctx.option.settle_cost + " " + ctx.option.type + " " + ctx.option.conquer_cost;
        addLoc(img0, file, 213, 7, 11964);
        addLoc(div0, file, 244, 8, 13320);
        img1.src = "./images/influenceicon.png";
        img1.alt = "influence";
        addLoc(img1, file, 247, 8, 13383);
        addLoc(div1, file, 249, 8, 13470);
        div2.className = "planetfrontinfo";
        addLoc(div2, file, 216, 7, 12178);
        div3.className = "planetfront";
        addLoc(div3, file, 212, 6, 11929);
        img2.src = img2_src_value = "./images/" + ctx.option.type + "back100.png";
        img2.alt = img2_alt_value = "" + ctx.option.settle_cost + " " + ctx.option.type + " " + ctx.option.conquer_cost;
        addLoc(img2, file, 258, 8, 13656);
        span0.className = "mini_settle_cost";
        addLoc(span0, file, 260, 9, 13812);
        span1.className = "mini_conquer_cost";
        addLoc(span1, file, 261, 9, 13881);
        div4.className = "unsettled_costs";
        addLoc(div4, file, 259, 8, 13773);
        div5.className = "mini_unsettled";
        addLoc(div5, file, 257, 7, 13619);
        addLoc(div6, file, 254, 6, 13547);
        div7._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(div7, "click", click_handler_14);
        addListener(div7, "tap", tap_handler_14);
        div7.className = div7_class_value = "bordered flex " + (ctx.game.displayinfo.selectionzone == 'options' ? ctx.option.selected ? 'selected' : 'selectable' : 'bordered');
        addLoc(div7, file, 211, 5, 11700);
      },
      m: function mount(target, anchor) {
        insert(target, div7, anchor);
        append(div7, div3);
        append(div3, img0);
        append(div3, text0);
        append(div3, div2);
        if (if_block0) if_block0.m(div2, null);
        append(div2, text1);
        if (if_block1) if_block1.m(div2, null);
        append(div2, text2);
        if (if_block2) if_block2.m(div2, null);
        append(div2, text3);
        if (if_block3) if_block3.m(div2, null);
        append(div2, text4);
        if (if_block4) if_block4.m(div2, null);
        append(div2, text5);
        if (if_block5) if_block5.m(div2, null);
        append(div2, text6);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div2, null);
        }

        append(div2, text7);
        if (if_block6) if_block6.m(div2, null);
        append(div2, text8);
        append(div2, div0);
        append(div0, text9);
        append(div2, text10);
        append(div2, img1);
        append(div2, text11);
        append(div2, div1);
        append(div1, text12);
        append(div7, text13);
        append(div7, div6);
        append(div6, div5);
        append(div5, img2);
        append(div5, text14);
        append(div5, div4);
        append(div4, span0);
        append(span0, text15);
        append(div4, text16);
        append(div4, span1);
        append(span1, text17);
        append(div7, text18);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;

        if (changed.game && img0_src_value !== (img0_src_value = "./images/" + ctx.option.type + "100.png")) {
          img0.src = img0_src_value;
        }

        if (changed.game && img0_alt_value !== (img0_alt_value = "" + ctx.option.settle_cost + " " + ctx.option.type + " " + ctx.option.conquer_cost)) {
          img0.alt = img0_alt_value;
        }

        if (ctx.option.icons.survey > 0) {
          if (!if_block0) {
            if_block0 = create_if_block_14(component, ctx);
            if_block0.c();
            if_block0.m(div2, text1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (ctx.option.icons.warfare > 0) {
          if (!if_block1) {
            if_block1 = create_if_block_13(component, ctx);
            if_block1.c();
            if_block1.m(div2, text2);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (ctx.option.icons.colonize > 0) {
          if (!if_block2) {
            if_block2 = create_if_block_12(component, ctx);
            if_block2.c();
            if_block2.m(div2, text3);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (ctx.option.icons.research > 0) {
          if (!if_block3) {
            if_block3 = create_if_block_11(component, ctx);
            if_block3.c();
            if_block3.m(div2, text4);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }

        if (ctx.option.icons.trade > 0) {
          if (!if_block4) {
            if_block4 = create_if_block_10(component, ctx);
            if_block4.c();
            if_block4.m(div2, text5);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }

        if (ctx.option.icons.produce > 0) {
          if (!if_block5) {
            if_block5 = create_if_block_9(component, ctx);
            if_block5.c();
            if_block5.m(div2, text6);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }

        if (changed.game) {
          each_value_7 = ctx.option.production_zones;

          for (var i = 0; i < each_value_7.length; i += 1) {
            var child_ctx = get_each_context_7(ctx, each_value_7, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block_2(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div2, text7);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value_7.length;
        }

        if (ctx.option.handsize_modifier > 0) {
          if (!if_block6) {
            if_block6 = create_if_block_8(component, ctx);
            if_block6.c();
            if_block6.m(div2, text8);
          }
        } else if (if_block6) {
          if_block6.d(1);
          if_block6 = null;
        }

        if (changed.game && text9_value !== (text9_value = ctx.option.influence_value)) {
          setData(text9, text9_value);
        }

        if (changed.game && text12_value !== (text12_value = ctx.option.name)) {
          setData(text12, text12_value);
        }

        if (changed.game && img2_src_value !== (img2_src_value = "./images/" + ctx.option.type + "back100.png")) {
          img2.src = img2_src_value;
        }

        if (changed.game && img2_alt_value !== (img2_alt_value = "" + ctx.option.settle_cost + " " + ctx.option.type + " " + ctx.option.conquer_cost)) {
          img2.alt = img2_alt_value;
        }

        if (changed.game && text15_value !== (text15_value = ctx.option.settle_cost)) {
          setData(text15, text15_value);
        }

        if (changed.game && text17_value !== (text17_value = ctx.option.conquer_cost)) {
          setData(text17, text17_value);
        }

        div7._svelte.ctx = ctx;

        if (changed.game && div7_class_value !== (div7_class_value = "bordered flex " + (ctx.game.displayinfo.selectionzone == 'options' ? ctx.option.selected ? 'selected' : 'selectable' : 'bordered'))) {
          div7.className = div7_class_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(div7);
        }

        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
        if (if_block3) if_block3.d();
        if (if_block4) if_block4.d();
        if (if_block5) if_block5.d();
        destroyEach(each_blocks, detach);
        if (if_block6) if_block6.d();
        removeListener(div7, "click", click_handler_14);
        removeListener(div7, "tap", tap_handler_14);
      }
    };
  } // (218:8) {#if option.icons.survey > 0}


  function create_if_block_14(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/surveyicon100.png";
        img.alt = "survey";
        addLoc(img, file, 218, 9, 12255);
        addLoc(br, file, 218, 61, 12307);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (221:8) {#if option.icons.warfare > 0}


  function create_if_block_13(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/warfareicon100.png";
        img.alt = "warfare";
        addLoc(img, file, 221, 9, 12374);
        addLoc(br, file, 221, 63, 12428);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (224:8) {#if option.icons.colonize > 0}


  function create_if_block_12(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/colonizeicon100.png";
        img.alt = "colonize";
        addLoc(img, file, 224, 9, 12496);
        addLoc(br, file, 224, 65, 12552);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (227:8) {#if option.icons.research > 0}


  function create_if_block_11(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/researchicon100.png";
        img.alt = "research";
        addLoc(img, file, 227, 9, 12620);
        addLoc(br, file, 227, 65, 12676);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (230:8) {#if option.icons.trade > 0}


  function create_if_block_10(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/tradeicon100.png";
        img.alt = "trade";
        addLoc(img, file, 230, 9, 12741);
        addLoc(br, file, 230, 59, 12791);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (233:8) {#if option.icons.produce > 0}


  function create_if_block_9(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/produceicon100.png";
        img.alt = "produce";
        addLoc(img, file, 233, 9, 12858);
        addLoc(br, file, 233, 63, 12912);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (237:8) {#each option.production_zones as zone}


  function create_each_block_2(component, ctx) {
    var img, img_src_value, img_alt_value, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = img_src_value = "./images/" + ctx.zone.type + "productionzoneicon.png";
        img.alt = img_alt_value = "" + ctx.zone.type + " zone";
        addLoc(img, file, 237, 9, 13022);
        addLoc(br, file, 237, 87, 13100);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      p: function update(changed, ctx) {
        if (changed.game && img_src_value !== (img_src_value = "./images/" + ctx.zone.type + "productionzoneicon.png")) {
          img.src = img_src_value;
        }

        if (changed.game && img_alt_value !== (img_alt_value = "" + ctx.zone.type + " zone")) {
          img.alt = img_alt_value;
        }
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (241:8) {#if option.handsize_modifier > 0}


  function create_if_block_8(component, ctx) {
    var img, br;
    return {
      c: function create() {
        img = createElement("img");
        br = createElement("br");
        img.src = "./images/handsizeicon100.png";
        img.alt = "produce";
        addLoc(img, file, 241, 9, 13205);
        addLoc(br, file, 241, 64, 13260);
      },
      m: function mount(target, anchor) {
        insert(target, img, anchor);
        insert(target, br, anchor);
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(img);
          detachNode(br);
        }
      }
    };
  } // (209:4) {#each game.options as option}


  function create_each_block_1(component, ctx) {
    var if_block_anchor;

    function select_block_type_8(ctx) {
      if (ctx.option.type !== ctx.undefined) return create_if_block_7;
      return create_else_block_1;
    }

    var current_block_type = select_block_type_8(ctx);
    var if_block = current_block_type(component, ctx);
    return {
      c: function create() {
        if_block.c();
        if_block_anchor = createComment();
      },
      m: function mount(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function update(changed, ctx) {
        if (current_block_type === (current_block_type = select_block_type_8(ctx)) && if_block) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      d: function destroy(detach) {
        if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (30:2) {#each lobby.existinggames as g}


  function create_each_block(component, ctx) {
    var p,
        text_value = ctx.g.game_id,
        text;
    return {
      c: function create() {
        p = createElement("p");
        text = createText(text_value);
        p._svelte = {
          component: component,
          ctx: ctx
        };
        addListener(p, "click", click_handler);
        addListener(p, "tap", tap_handler);
        addLoc(p, file, 30, 9, 1228);
      },
      m: function mount(target, anchor) {
        insert(target, p, anchor);
        append(p, text);
      },
      p: function update(changed, _ctx) {
        ctx = _ctx;

        if (changed.lobby && text_value !== (text_value = ctx.g.game_id)) {
          setData(text, text_value);
        }

        p._svelte.ctx = ctx;
      },
      d: function destroy(detach) {
        if (detach) {
          detachNode(p);
        }

        removeListener(p, "click", click_handler);
        removeListener(p, "tap", tap_handler);
      }
    };
  }

  function App(options) {
    this._debugName = '<App>';

    if (!options || !options.target && !options.root) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign({
      undefined: undefined
    }, options.data);
    if (!('game' in this._state)) console.warn("<App> was created without expected data property 'game'");
    if (!('lobby' in this._state)) console.warn("<App> was created without expected data property 'lobby'");
    this._intro = !!options.intro;
    this._fragment = create_main_fragment(this, this._state);

    if (options.target) {
      if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");

      this._fragment.c();

      this._mount(options.target, options.anchor);
    }

    this._intro = true;
  }

  assign(App.prototype, protoDev);
  assign(App.prototype, methods);

  App.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  var nonce = 0;
  var game = {
    passtoplayer: false,
    nonce: 0,
    displayinfo: {
      selectionzone: "",
      dragged: null,
      showoptiontoskip: false,
      allowformultipleselections: false,
      center_or_planets: true,
      //true = center, false = planets
      choicelabel: "choices"
    },
    subchoices: [],
    influence: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    messagetoplayer: [],
    options: [],
    planet_deck: [],
    currentphase: -4,
    leading_player_index: 0,
    acting_player_index: 0,
    number_of_players: 2,
    started: false,
    gamephases: [//logic for detecting startofgame, endofgame, changeofpriority, and reseting the phasequeue
    {
      start: [{
        "set active player": function setActivePlayer() {
          if (!app$1.get().game.started) {
            var _game6 = app$1.get().game;
            _game6.started = true;
            _game6.passt = false;
            app$1.set({
              game: _game6
            });
            _game6 = app$1.get().game;
            _game6.leading_player_index = (_game6.leading_player_index + 1) % _game6.number_of_players;
            _game6.acting_player_index = _game6.leading_player_index;
            _game6.leadingplayer = _game6.players[_game6.leading_player_index];
            _game6.acting_player = _game6.players[_game6.leading_player_index];
            app$1.set({
              game: _game6
            });
            app$1.openFullscreen();
          }

          var game = app$1.get().game;

          if (game.leadingplayer.rounds !== undefined) {
            game.players[game.leading_player_index].rounds++;
          }

          var planets = [].concat(_toConsumableArray(game.players[game.leading_player_index].settled_planets), _toConsumableArray(game.players[game.leading_player_index].conquered_planets));

          for (var p in planets) {
            game.players[game.leading_player_index].icons.survey += planets[p].icons.survey;
            game.players[game.leading_player_index].icons.warfare += planets[p].icons.warfare;
            game.players[game.leading_player_index].icons.trade += planets[p].icons.trade;
            game.players[game.leading_player_index].icons.produce += planets[p].icons.produce;
            game.players[game.leading_player_index].icons.research += planets[p].icons.research;
          }

          for (var _p2 in game.players[game.leading_player_index].permanents) {
            game.players[game.leading_player_index].icons.survey += permanents[_p2].icons.survey;
            game.players[game.leading_player_index].icons.warfare += permanents[_p2].icons.warfare;
            game.players[game.leading_player_index].icons.trade += permanents[_p2].icons.trade;
            game.players[game.leading_player_index].icons.produce += permanents[_p2].icons.produce;
            game.players[game.leading_player_index].icons.research += permanents[_p2].icons.research;
          }

          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }, {
        Productivity: function Productivity() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "productivity";
          }).length != 0) {
            var _game7 = app$1.get().game;
            _game7.players[app$1.get().game.acting_player_index].actionrolesequence = "aar";
            app$1.set({
              game: _game7
            });
          }

          app$1.phasefinishfunction();
        }
      }, {
        "Choose an Order to Perform Your Action and Role Phases": function ChooseAnOrderToPerformYourActionAndRolePhases() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "logistics";
          }).length != 0) {
            var options = [{
              name: "Action Phase then Role Phase"
            }, {
              name: "Role Phase then Action Phase"
            }];

            if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
              return el.type == "productivity";
            }).length != 0) {
              //add aar,ara,and raa as options
              options.push({
                name: "Action Phase then another Action Phase then Role Phase"
              });
              options.push({
                name: "Action Phase then Role Phase then another Action Phase"
              });
              options.push({
                name: "Role Phase then Action Phase then another Action Phase"
              });
            } //offer ar or ra


            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", options]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          } else {
            app$1.phasefinishfunction();
          }
        }
      }, {
        Logistics: function Logistics() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "logistics";
          }).length != 0) {
            var _game8 = app$1.get().game;

            if (app$1.get().game.choices[0].name == "Action Phase then Role Phase") {
              _game8.players[app$1.get().game.acting_player_index].actionrolesequence = "ar";
            } else if (app$1.get().game.choices[0].name == "Role Phase then Action Phase") {
              _game8.players[app$1.get().game.acting_player_index].actionrolesequence = "ra";
            } else if (app$1.get().game.choices[0].name == "Action Phase then another Action Phase then Role Phase") {
              _game8.players[app$1.get().game.acting_player_index].actionrolesequence = "aar";
            } else if (app$1.get().game.choices[0].name == "Action Phase then Role Phase then another Action Phase") {
              _game8.players[app$1.get().game.acting_player_index].actionrolesequence = "ara";
            } else if (app$1.get().game.choices[0].name == "Role Phase then Action Phase then another Action Phase") {
              _game8.players[app$1.get().game.acting_player_index].actionrolesequence = "raa";
            }

            app$1.set({
              game: _game8
            });
            app$1.phasefinishfunction(true);
          } else {
            app$1.phasefinishfunction();
          }
        }
      }]
    }, //check for permanent tech logistics
    //offer wether to perform the role or the action phases first
    //simply add an extra action phase that occurs if the role was choosen first, set all action phase one's to cancel if role was choosen first
    // action : 2
    //      choose from hand an action to play or skip
    //      -> set as activeaction
    {
      action: [//check for permanent tech productivity
      //add an extra action
      {
        "Choose an Action to Play": function ChooseAnActionToPlay() {
          app$1.offer(true
          /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
          , false
          /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
          , ["hand"]
          /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
          , "choices"
          /* label for where the choice is stored | set with game[label]=*/
          , app$1.phasefinishfunction
          /*callback that handles the choice or finishes the phase*/
          );
        }
      }, {
        "Playing your Action": function PlayingYourAction() {
          if (app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get = app$1.get(),
                _game9 = _app$1$get.game,
                _app$1$get$game = _app$1$get.game,
                player = _app$1$get$game.acting_player,
                _app$1$get$game$actin = _app$1$get$game.acting_player,
                limbo = _app$1$get$game$actin.limbo,
                hand = _app$1$get$game$actin.hand,
                _app$1$get$game$choic = _slicedToArray(_app$1$get$game.choices, 1),
                card = _app$1$get$game$choic[0];

            player = _game9.players[_game9.acting_player_index];
            limbo = player.limbo;
            hand = player.hand;
            player.activeaction = card.type;
            limbo = limbo.filter(function (el) {
              return card.identifier != el.identifier;
            });
            limbo.push({
              final_destination_label: "discard",
              ...card
            });
            hand = hand.filter(function (el) {
              return card.identifier != el.identifier;
            });
            player.limbo = limbo;
            player.hand = hand;
            _game9.players[app$1.get().game.acting_player_index] = player;
            app$1.set({
              game: _game9
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // colonize : 5 (can conjoin to 4)
      //     settle or colonize
      //      -> choose planet
      //         -> settle
      //      -> choose planet
      //         -> colonize
      {
        "Choose between Settling or Colonizing a Planet": function ChooseBetweenSettlingOrColonizingAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Colonize"
            }, {
              name: "Settle Colonies"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose an Unsettled Planet to Settle": function ChooseAnUnsettledPlanetToSettle() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Settling your Planet": function SettlingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.settle_colonies(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose an Unsettled Planet to Colonize": function ChooseAnUnsettledPlanetToColonize() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Colonizing your Planet": function ColonizingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.colonize(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index].limbo, app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
              return el.type == "colonize";
            })[0]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // producetrade : 5
      //      produce or trade
      //      -> select an empty productionzone
      //          -> produce
      //      -> select an occupied productionzone
      //          -> trade
      {
        "Choose between Producing or Trading Resources": function ChooseBetweenProducingOrTradingResources() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "producetrade") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "produce"
            }, {
              name: "trade"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Planet to Produce Resources on": function ChooseAPlanetToProduceResourcesOn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "producetrade" || app$1.get().game.choices[0].name != "produce") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Producing a Resource": function ProducingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "producetrade" || app$1.get().game.choices[0].name != "produce") {
            app$1.phasefinishfunction();
          } else {
            app$1.produce(app$1.get().game.subchoices);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Trade Resources from": function ChooseAPlanetToTradeResourcesFrom() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "producetrade" || app$1.get().game.choices[0].name != "trade") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Trading a Resource": function TradingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "producetrade" || app$1.get().game.choices[0].name != "trade") {
            app$1.phasefinishfunction();
          } else {
            app$1.trade(app$1.get().game.subchoices, app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, //#######################################################################################################################################################################################
      // politics : 2
      //      choose card from center row
      //          -> politics
      {
        "Choose a Role Card to Replace Politics with": function ChooseARoleCardToReplacePoliticsWith() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "politics") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["rolecards"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Swapping the Role Card for your Politics Card": function SwappingTheRoleCardForYourPoliticsCard() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "politics") {
            app$1.phasefinishfunction();
          } else {
            app$1.politics(app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
              return el.type == "politics";
            })[0], app$1.get().game.choices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // research : 2
      //      choose card(s) from hand
      //      -> research
      {
        "Choose up to 2 Cards from your Hand to Remove from the Game": function ChooseUpTo2CardsFromYourHandToRemoveFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "research") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Removing your Cards from the Game": function RemovingYourCardsFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "research") {
            app$1.phasefinishfunction();
          } else {
            app$1.research(app$1.get().game.choices, app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // survey : 1
      //      -> survey
      {
        "Surveying your Empire": function SurveyingYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "survey") {
            app$1.phasefinishfunction();
          } else {
            app$1.survey(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // warfare : 4
      //      attack or collect
      //          -> collect
      //          -> choose planet
      //              -> conquer
      {
        "Choose between Collecting a Starfighter or Conquering a Planet": function ChooseBetweenCollectingAStarfighterOrConqueringAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "warfare") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Conquer a Planet"
            }, {
              name: "Collect a Starfighter"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding a Starfighter to your Fleet": function AddingAStarfighterToYourFleet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "warfare" || app$1.get().game.choices[0].name != "Collect a Starfighter") {
            app$1.phasefinishfunction();
          } else {
            app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]); //check for permanent tech scorched earth policy
            //remove production zone from planet

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_colonize : 8
      //      optional settle or no
      //      -> choose planet
      //         -> settle
      //      settle or colonize
      //      -> choose planet
      //         -> settle
      //      -> choose planet
      //         -> colonize
      {
        "Choose wether or not to Settle a Planet ": function ChooseWetherOrNotToSettleAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "settle"
            }, {
              name: "Skip"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Planet to Settle": function ChooseAPlanetToSettle() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "settle") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Settling your Planet": function SettlingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "settle") {
            app$1.phasefinishfunction();
          } else {
            app$1.settle_colonies(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]); // check for permanent tech abundance
            // change production slots to filled

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose between Settling or Colonizing a Planet": function ChooseBetweenSettlingOrColonizingAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Colonize"
            }, {
              name: "Settle Colonies"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose an Unsettled Planet to Settle": function ChooseAnUnsettledPlanetToSettle() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Settling your Planet": function SettlingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.settle_colonies(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]); // check for permanent tech abundance
            // change production slots to filled

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose an Unsettled Planet to Colonize": function ChooseAnUnsettledPlanetToColonize() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Colonizing your Planet": function ColonizingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.colonize(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index].limbo, app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
              return el.type == "improved_colonize";
            })[0]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_produce : 4
      //      -> select an empty productionzone (optional)
      //          -> produce
      //              -> select an empty productionzone (optional)
      //                  -> produce
      {
        "Choose an empty Production Zone to Produce in": function ChooseAnEmptyProductionZoneToProduceIn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_production") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Producing your Resource": function ProducingYourResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_production" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.produce(app$1.get().game.choices);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose an empty Production Zone to Produce in": function ChooseAnEmptyProductionZoneToProduceIn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_production") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Producing your Resource": function ProducingYourResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_production" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.produce(app$1.get().game.choices);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_trade : 1
      //      -> improved_trade
      {
        "Trading your Stocks and Bonds": function TradingYourStocksAndBonds() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_trade") {
            app$1.phasefinishfunction();
          } else {
            var _game10 = app$1.get().game;

            _game10.players[app$1.get().game.acting_player_index].influence.push(_game10.influence.pop());

            app$1.set({
              game: _game10
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_research : 2
      //      choose card(s) from hand
      //      -> improved_research
      {
        "Choose up to 3 Cards from your Hand to Remove from the Game": function ChooseUpTo3CardsFromYourHandToRemoveFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_research") {
            app$1.phasefinishfunction();
          } else {
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Removing your Cards from the Game": function RemovingYourCardsFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_research") {
            app$1.phasefinishfunction();
          } else {
            research(app$1.get().game.choices, app$1.get().game.players[app$1.get().game.acting_player_index], 3);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_survey : 1
      //      -> improved_survey
      {
        "Drawing your Cards": function DrawingYourCards() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_survey") {
            app$1.phasefinishfunction();
          } else {
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // improved_warfare : 4
      //      attack or collect
      //      -> collect
      //      -> choose planet
      //           -> conquer
      {
        "Choose between Collecting a Starfighter or Conquering a Planet": function ChooseBetweenCollectingAStarfighterOrConqueringAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_warfare") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Conquer a Planet"
            }, {
              name: "Collect a Starfighter"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding a Starfighter to your Fleet": function AddingAStarfighterToYourFleet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_warfare" || app$1.get().game.choices[0].name != "Collect a Starfighter") {
            app$1.phasefinishfunction();
          } else {
            app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "improved_warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // mobilization : 4
      //      -> mobilization
      //      choose wether to attack (post role phase)
      //      -> choose planet
      //          -> conquer
      {
        "Collecting your Star Fighters": function CollectingYourStarFighters() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "mobilization") {
            app$1.phasefinishfunction();
          } else {
            app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // survey_team : 1
      //      -> survey_team
      {
        "Adding Top Card of the Planet deck to your Empire": function AddingTopCardOfThePlanetDeckToYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "survey_team") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get2 = app$1.get(),
                _game11 = _app$1$get2.game,
                _app$1$get2$game = _app$1$get2.game,
                player = _app$1$get2$game.acting_player,
                planet_deck = _app$1$get2$game.planet_deck;

            player = _game11.players[_game11.acting_player_index];
            var planet = planet_deck.pop();
            player.unsettled_planets.push(planet);
            app$1.set({
              game: _game11
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // war_path : 4
      //      choose a planet (optional)
      //         -> conquer
      //              choose a planet (optional)
      //                  -> conquer
      {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "war_path") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "war_path" || app$1.get().game.choices[0].name != "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.choices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "war_path") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "war_path" || app$1.get().game.choices[0].name != "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.choices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // terraforming : 2
      //      choose planet
      //      -> terraforming
      {
        "Choose an Unsettled Planet to Terraform": function ChooseAnUnsettledPlanetToTerraform() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "terraforming") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Terraforming your Planet": function TerraformingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "terraforming" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.colonize(app$1.get().game.choices[0], app$1.get().game.players[app$1.get().game.acting_player_index].limbo, app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
              return el.type == "terraforming";
            })[0]);

            if (app$1.get().game.choices[0].hosted_colonies.length > 0) {
              var c = app$1.get().game.choices[0].hosted_colonies.reduce(function (acc, cur) {
                acc + cur.icons.colonize;
              });

              if (c >= app$1.get().game.choices[0].settle_cost) {
                app$1.settle_colonies(app$1.get().game.choices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
              }
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // genetic_engineering :1
      //      -> genetic_engineering
      {
        "Engineering Genetics": function EngineeringGenetics() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "genetic_engineering") {
            app$1.phasefinishfunction();
          } else {
            app$1.phasefinishfunction();
          }
        }
      }, // #######################################################################################################################################################################################
      // artificial_intelligence : 4
      //      choose center row card
      //          -> artificial_intelligence
      //              choose center row card
      //                  -> artificial_intelligence
      {
        "Select a Role Card to take into your Hand": function SelectARoleCardToTakeIntoYourHand() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "artificial_intelligence") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["rolecards"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding Role Card to your Machine Learning Model": function AddingRoleCardToYourMachineLearningModel() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "artificial_intelligence") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get3 = app$1.get(),
                _game12 = _app$1$get3.game,
                player = _app$1$get3.game.acting_player;

            player = _game12.players[_game12.acting_player_index];

            if (_game12.stacks.pilecount[_game12.choices[0].type] >= 1) {
              player.hand.push(Object.assign({
                identifier: app$1.generate_unique_identifier()
              }, _game12.stacks.rolecards[_game12.stacks[_game12.choices[0].type]]));
              _game12.stacks.pilecount[_game12.choices[0].type]--;
            }

            app$1.set({
              game: _game12
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Select a Role Card to take into your Hand": function SelectARoleCardToTakeIntoYourHand() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "artificial_intelligence") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["rolecards"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding Role Card to your Machine Learning Model": function AddingRoleCardToYourMachineLearningModel() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "artificial_intelligence") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get4 = app$1.get(),
                _game13 = _app$1$get4.game,
                player = _app$1$get4.game.acting_player;

            player = _game13.players[_game13.acting_player_index];

            if (_game13.stacks.pilecount[_game13.choices[0].type] >= 1) {
              player.hand.push(Object.assign({
                identifier: app$1.generate_unique_identifier()
              }, _game13.stacks.rolecards[_game13.stacks[_game13.choices[0].type]]));
              _game13.stacks.pilecount[selected_center_card.type]--;
            }

            app$1.set({
              game: _game13
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // diverse_markets : 1
      //      -> diverse_markets
      {
        "Diversifying Markets": function DiversifyingMarkets() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "diverse_markets") {
            app$1.phasefinishfunction();
          } else {
            app$1.phasefinishfunction();
          }
        }
      }, // #######################################################################################################################################################################################
      // specialization : 2
      //      choose resource type
      //          -> specialization
      {
        "Choose a Resource to Specialize in": function ChooseAResourceToSpecializeIn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "specialization") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "red"
            }, {
              name: "blue"
            }, {
              name: "gren"
            }, {
              name: "purple"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Specializaing in your Seleted Resource": function SpecializaingInYourSeletedResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "specialization") {
            app$1.phasefinishfunction();
          } else {
            var _game14 = app$1.get().game;
            _game14.players[app$1.get().game.acting_player_index].specialization = _game14.choices[0].name;
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // data_network : 3
      //      -> data_network
      //      choose card(s) from hand
      //          -> research
      {
        "Drawing Your Cards": function DrawingYourCards() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "data_network") {
            app$1.phasefinishfunction();
          } else {
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose any number of Cards from your Hand to Remove from the Game": function ChooseAnyNumberOfCardsFromYourHandToRemoveFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "data_network") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Removing the Selected Cards from the Game": function RemovingTheSelectedCardsFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "data_network" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get5 = app$1.get(),
                _game15 = _app$1$get5.game,
                _app$1$get5$game = _app$1$get5.game,
                choices = _app$1$get5$game.choices,
                player = _app$1$get5$game.acting_player;

            player = _game15.players[_game15.acting_player_index];
            app$1.research(choices, player, choices.length);
            app$1.phasefinishfunction(true);
          }
        }
      }]
    }, // choose role : 2
    //      choose between center rolecards to lead with
    //      -> lead with role
    // boosting cards :2
    //      choose card(s) from hand to boost with
    //      -> boost role
    {
      role: [{
        "Choose a Role Card to Lead with": function ChooseARoleCardToLeadWith() {
          app$1.offer(false
          /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
          , false
          /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
          , ["rolecards"]
          /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
          , "choices"
          /* label for where the choice is stored | set with game[label]=*/
          , app$1.phasefinishfunction
          /*callback that handles the choice or finishes the phase*/
          );
        }
      }, {
        "Performing your Role": function PerformingYourRole() {
          var _app$1$get6 = app$1.get(),
              game = _app$1$get6.game,
              _app$1$get6$game$choi = _slicedToArray(_app$1$get6.game.choices, 1),
              card = _app$1$get6$game$choi[0];

          if (game.stacks.pilecount[card.type] >= 1) {
            game.players[app$1.get().game.acting_player_index].boostingicons[card.type]++;
            var newcard = Object.assign({
              identifier: app$1.generate_unique_identifier(),
              final_destination_label: "discard",
              selected: true
            }, game.stacks.rolecards[game.stacks[card.type]]);
            game.players[app$1.get().game.acting_player_index].limbo.push(newcard);
            game.stacks.pilecount[card.type]--;
          } else if (card.type != "colonize") {
            game.players[app$1.get().game.acting_player_index].boostingicons[card.type]++;
          }

          game.players[app$1.get().game.acting_player_index].activerole = card.type;
          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }]
    }, // colonize : 5 (can conjoin to 4)
    //     settle or colonize
    //      -> choose planet
    //         -> settle
    //      -> choose planet
    //         -> colonize
    // producetrade : 5
    //      produce or trade
    //      -> select an empty productionzone
    //          -> produce
    //      -> select an occupied productionzone
    //          -> trade
    // research : 2
    //      choose card(s) from hand
    //      -> research
    // survey : 1
    //      -> survey
    // warfare : 4
    //      attack or collect
    //          -> collect
    //          -> choose planet
    //              -> conquer
    {
      lead: [{
        "Choose cards from your hand to Boost the effectiveness of your Role": function ChooseCardsFromYourHandToBoostTheEffectivenessOfYourRole() {
          app$1.offer(true
          /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
          , true
          /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
          , ["hand"]
          /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
          , "choices"
          /* label for where the choice is stored | set with game[label]=*/
          , app$1.phasefinishfunction
          /*callback that handles the choice or finishes the phase*/
          );
        }
      }, {
        "Boosting your Role": function BoostingYourRole() {
          var _app$1$get7 = app$1.get(),
              game = _app$1$get7.game,
              _app$1$get7$game = _app$1$get7.game,
              player = _app$1$get7$game.acting_player,
              _app$1$get7$game$acti = _app$1$get7$game.acting_player,
              limbo = _app$1$get7$game$acti.limbo,
              hand = _app$1$get7$game$acti.hand,
              cards = _app$1$get7$game.choices;

          player = game.players[game.acting_player_index];
          limbo = player.limbo;
          hand = player.hand;

          if (cards[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            for (var i in cards) {
              player.boostingicons[cards[i].type]++;
              cards[i].final_destination_label = 'discard'; // check for permanent tech adaptability
              // add one of each other icon to the player
              // also change so that it will simply merge the card's icons with the player's, cuz this way doesnt count technology card's icons
              //     limbo.push(
              //         {'final_destination_label':'discard',
              //         ...hand.filter(
              //             (el)=>{return cards[i].identifier == el.identifier;}
              //         )[0]
              //         }
              //     );
              //     hand = hand.filter(
              //         (el)=>{return cards[i].identifier != el.identifier}
              //     );
            }

            player.hand = hand; //TODO: tally up icons on planets
            //TODO: tally up icons on technologies

            app$1.set({
              game: game
            });
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // colonize : 5 (can conjoin to 4)
      //     settle or colonize
      //      -> choose planet
      //         -> settle
      //      -> choose planet
      //         -> colonize
      {
        "Choose between Settling or Colonizing a Planet": function ChooseBetweenSettlingOrColonizingAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Colonize"
            }, {
              name: "Settle Colonies"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose an Unsettled Planet to Settle": function ChooseAnUnsettledPlanetToSettle() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Settling your Planet": function SettlingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.settle_colonies(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]); // check for permanent tech abundance
            // change production slots to filled

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose an Unsettled Planet to Colonize": function ChooseAnUnsettledPlanetToColonize() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Colonizing your Planet": function ColonizingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            var _j6 = 0;

            var planet = app$1.get().game.subchoices[_j6];

            for (var i = 0; i < app$1.get().game.players[app$1.get().game.acting_player_index].boostingicons.colonize; i++) {
              if (planet.hosted_colonies.length > 0) {
                if (planet.hosted_colonies.reduce(function (acc, cur) {
                  return acc + cur.icons.colonize;
                }) >= planet.settle_cost && _j6 < app$1.get().game.subchoices.length - 1) {
                  _j6++;
                  planet = app$1.get().game.subchoices[_j6];
                }
              }

              app$1.colonize(planet, app$1.get().game.players[app$1.get().game.acting_player_index].limbo, app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
                return el.type == "colonize";
              })[0]);
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // producetrade : 5
      //      produce or trade
      //      -> select an empty productionzone
      //          -> produce
      //      -> select an occupied productionzone
      //          -> trade
      {
        "Choose between Producing or Trading Resources": function ChooseBetweenProducingOrTradingResources() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "producetrade") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "produce"
            }, {
              name: "trade"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Planet to Produce Resources on": function ChooseAPlanetToProduceResourcesOn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "producetrade" || app$1.get().game.choices[0].name != "produce") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Producing a Resource": function ProducingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "producetrade" || app$1.get().game.choices[0].name != "produce") {
            app$1.phasefinishfunction();
          } else {
            ///app.set( {'game': { 'acting_player':{ 'activerole':'produce' } , ...app.get().game} } )
            var _game16 = app$1.get().game;
            _game16.players[app$1.get().game.acting_player_index].activerole = "produce";
            app$1.set({
              game: _game16
            });
            var prd = app$1.produce(_game16.subchoices, _game16.players[app$1.get().game.acting_player_index].boostingicons.produce);

            if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction = "genetic_engineering") {
              for (var i in prd) {
                if (prd[i] > 1) {
                  players[j].influence.push(_game16.influence.pop());
                }
              }
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Trade Resources from": function ChooseAPlanetToTradeResourcesFrom() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "producetrade" || app$1.get().game.choices[0].name != "trade") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Trading a Resource": function TradingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "producetrade" || app$1.get().game.choices[0].name != "trade") {
            app$1.phasefinishfunction();
          } else {
            var _game17 = app$1.get().game;
            _game17.players[app$1.get().game.acting_player_index].activerole = "trade";
            app$1.set({
              game: _game17
            });
            var prd = app$1.trade(_game17.subchoices, _game17.players[app$1.get().game.acting_player_index], _game17.players[app$1.get().game.acting_player_index].boostingicons.trade);

            if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction = "diverse_markets") {
              for (var i in prd) {
                if (prd[i] > 1) {
                  app$1.get().game.players[app$1.get().game.acting_player_index].influence.push(app$1.get().game.influence.pop());
                }
              }
            }

            if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction = "specialization") {
              for (var _i12 in Array.from(prd[app$1.get().game.players[app$1.get().game.acting_player_index].specialization])) {
                app$1.get().game.players[app$1.get().game.acting_player_index].influence.push(app$1.get().game.influence.pop());
              }
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // research : 2
      //      choose technologies from market
      //      -> research
      {
        "Choose a Technology to Research": function ChooseATechnologyToResearch() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "research") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["research"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Researching your Technology": function ResearchingYourTechnology() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "research") {
            app$1.phasefinishfunction();
          } else {
            var _game18 = app$1.get().game;

            if (_game18.choices[0].name != "Skip") {
              //TODO check research card requirements
              //check for number of planets and type of planets
              var p = {
                advanced: 0,
                metallic: 0,
                fertile: 0
              };
              [].concat(_toConsumableArray(_game18.players[app$1.get().game.acting_player_index].settled_planets), _toConsumableArray(_game18.players[app$1.get().game.acting_player_index].conquered_planets)).map(function (el) {
                p[el.type]++;
              });
              var condition = true;

              for (var i in _game18.choices[0].planet_requirements) {
                if (_game18.choices[0].planet_requirements[i] > p[i]) {
                  condition = false;
                }
              }

              if (condition && _game18.players[app$1.get().game.acting_player_index].boostingicons.research >= _game18.choices[0].research_cost) {
                if (_game18.choices[0].is_permanent) {
                  app$1.play(_game18.research_deck, _game18.players[app$1.get().game.acting_player_index].permanents, "", _game18.choices[0].identifier);
                } else {
                  app$1.play(_game18.research_deck, _game18.players[app$1.get().game.acting_player_index].limbo, "discard", _game18.choices[0].identifier);
                }
              }
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // survey : 2
      //      choose planet
      //      -> survey
      {
        "Choose a Planet from your Galaxy to Explore": function ChooseAPlanetFromYourGalaxyToExplore() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "survey") {
            app$1.phasefinishfunction();
          } else {
            var _game19 = app$1.get().game; //survey_role purchase, offer_to_boost explore_planet, present_as_choice, choose, catalog_planet, discard

            for (var i = 0; i < app$1.get().game.players[app$1.get().game.acting_player_index].boostingicons.survey; i++) {
              app$1.explore_planet(_game19.players[app$1.get().game.acting_player_index]);
            }

            app$1.set({
              game: _game19
            });
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", app$1.get().game.options]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Surveying your Empire": function SurveyingYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "survey" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.catalog_planet(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // warfare : 4
      //      attack or collect
      //          -> collect
      //          -> choose planet
      //              -> conquer
      {
        "Choose between Collecting Starfighters or Conquering a Planet": function ChooseBetweenCollectingStarfightersOrConqueringAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Conquer a Planet"
            }, {
              name: "Collect Starfighters"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding Starfighters to your Fleet": function AddingStarfightersToYourFleet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Collect Starfighters") {
            app$1.phasefinishfunction();
          } else {
            for (var i = 0; i < app$1.get().game.players[app$1.get().game.acting_player_index].boostingicons.warfare; i++) {
              app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Pass the device to the Next Player": function PassTheDeviceToTheNextPlayer() {
          var game = app$1.get().game;
          game.displayinfo.selectionzone = "";
          game.passp = true;
          app$1.set({
            game: game
          });
        }
      }, {
        "You passed Priority": function YouPassedPriority() {
          var game = app$1.get().game; //app.togglepasstoplayer();

          game.passp = false;
          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }]
    }, // dissent : 2
    //      choose between dissent or follow
    //      -> dissent
    //      -> follow
    // boosting cards :2
    //      choose card(s) from hand to boost with
    //      -> boost role
    // action name : total subphases
    // colonize : 5 (can conjoin to 4)
    //     settle or colonize
    //      -> choose planet
    //         -> settle
    //      -> choose planet
    //         -> colonize for each symbol
    // produce : 2
    //      -> select an empty productionzone for each symbol
    //          -> produce
    // trade : 2
    //      -> select an occupied productionzone for each symbol
    //          -> trade
    // research : 2
    //      choose card from research pile
    //      -> choose side (situational)
    //          -> research
    // survey : 1
    //      -> explore for each symbol
    //      choose planet
    //      -> survey
    // warfare : 4
    //      attack or collect
    //          -> collect fighter for each symbols
    //          -> choose planet
    //              -> conquer
    {
      follow: [{
        "Choose between Following or Dissent the Leading Role": function ChooseBetweenFollowingOrDissentTheLeadingRole() {
          app$1.offer(false
          /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
          , false
          /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
          , ["options", [{
            name: "dissent"
          }, {
            name: app$1.get().game.players[app$1.get().game.leading_player_index].activerole
          }]]
          /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
          , "choices"
          /* label for where the choice is stored | set with game[label]=*/
          , app$1.phasefinishfunction
          /*callback that handles the choice or finishes the phase*/
          );
        }
      }, {
        Dissenting: function Dissenting() {
          var game = app$1.get().game;
          game.players[game.acting_player_index].activerole = game.choices[0].name;
          app$1.set({
            game: game
          });

          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "dissent") {
            var _app$1$get8 = app$1.get(),
                _game20 = _app$1$get8.game,
                _app$1$get8$game$choi = _slicedToArray(_app$1$get8.game.choices, 1),
                card = _app$1$get8$game$choi[0];

            if (_game20.stacks.pilecount[card.name] >= 1) {
              _game20.players[app$1.get().game.acting_player_index].boostingicons[card.name]++;
              var newcard = Object.assign({
                identifier: app$1.generate_unique_identifier(),
                final_destination_label: "discard",
                selected: true
              }, _game20.stacks.rolecards[_game20.stacks[card.name]]);

              _game20.players[app$1.get().game.acting_player_index].limbo.push(newcard);

              _game20.stacks.pilecount[card.name]--;
            } else if (card.name != "colonize") {
              _game20.players[_game20.acting_player_index].boostingicons[card.name]++;
            }

            app$1.set({
              game: _game20
            });
            app$1.phasefinishfunction(true);
          } else {
            app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);

            if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
              return el.type == "dissension";
            }).length != 0) {
              app$1.draw(app$1.get().game.players[app$1.get().game.acting_player_index]);
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, //will auto pass to next phase if follow has been selected
      {
        "Choose cards from your hand to Boost the effectiveness of your Role": function ChooseCardsFromYourHandToBoostTheEffectivenessOfYourRole() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole == "dissent") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Boosting your Role": function BoostingYourRole() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole == "dissent") {
            app$1.phasefinishfunction();
          } else {
            var _app$1$get9 = app$1.get(),
                _game21 = _app$1$get9.game,
                _app$1$get9$game = _app$1$get9.game,
                player = _app$1$get9$game.acting_player,
                _app$1$get9$game$acti = _app$1$get9$game.acting_player,
                limbo = _app$1$get9$game$acti.limbo,
                hand = _app$1$get9$game$acti.hand,
                cards = _app$1$get9$game.choices;

            player = _game21.players[_game21.acting_player_index];
            limbo = player.limbo;
            hand = player.hand;

            if (cards[0].name == "Skip") {
              app$1.phasefinishfunction();
            } else {
              for (var i in cards) {
                player.boostingicons[cards[i].type]++; // check for permanent tech adaptability
                // add one of each other icon to the player
                // also change so that it will simply merge the card's icons with the player's, cuz this way doesnt count technology card's icons
                // limbo.push(
                //     {'final_destination_label':'discard',
                //     ...hand.filter(
                //         (el)=>{return cards[i].identifier == el.identifier;}
                //     )[0]
                //     }
                // );
                // hand = hand.filter(
                //     (el)=>{return cards[i].identifier != el.identifier}
                // );
              }

              player.hand = hand; //TODO: tally up icons on planets
              //TODO: tally up icons on technologies

              app$1.set({
                game: _game21
              });
              app$1.phasefinishfunction(true);
            }
          }
        }
      }, // #######################################################################################################################################################################################
      // colonize : 5 (can conjoin to 4)
      //     settle or colonize
      //      -> choose planet
      //         -> settle
      //      -> choose planet
      //         -> colonize
      {
        "Choose between Settling or Colonizing a Planet": function ChooseBetweenSettlingOrColonizingAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize") {
            app$1.phasefinishfunction();
          } else if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "bureaucracy";
          }).length == 0) {
            var _game22 = app$1.get().game;
            _game22.choices = [{
              name: "Colonize"
            }];
            app$1.set({
              game: _game22
            });
            app$1.phasefinishfunction(true);
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Colonize"
            }, {
              name: "Settle Colonies"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose an Unsettled Planet to Settle": function ChooseAnUnsettledPlanetToSettle() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Settling your Planet": function SettlingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Settle Colonies") {
            app$1.phasefinishfunction();
          } else {
            app$1.settle_colonies(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]); // check for permanent tech abundance
            // change production slots to filled

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose an Unsettled Planet to Colonize": function ChooseAnUnsettledPlanetToColonize() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Colonizing your Planet": function ColonizingYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "colonize" || app$1.get().game.choices[0].name != "Colonize") {
            app$1.phasefinishfunction();
          } else {
            var _j7 = 0;

            var planet = app$1.get().game.subchoices[_j7];

            for (var i = 0; i < app$1.get().game.players[app$1.get().game.acting_player_index].boostingicons.colonize; i++) {
              if (planet.hosted_colonies.length > 0) {
                if (planet.hosted_colonies.reduce(function (acc, cur) {
                  acc + cur.icons.colonize;
                }) >= planet.settle_cost && _j7 < app$1.get().game.subchoices.length - 1) {
                  _j7++;
                  planet = app$1.get().game.subchoices[_j7];
                }
              }

              app$1.colonize(planet, app$1.get().game.players[app$1.get().game.acting_player_index].limbo, app$1.get().game.players[app$1.get().game.acting_player_index].limbo.filter(function (el) {
                return el.type == "colonize";
              })[0]);
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // producetrade : 5
      //      produce or trade
      //      -> select an empty productionzone
      //          -> produce
      //      -> select an occupied productionzone
      //          -> trade
      {
        "Choose a Planet to Produce Resources on": function ChooseAPlanetToProduceResourcesOn() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "produce") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Producing a Resource": function ProducingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "produce") {
            app$1.phasefinishfunction();
          } else {
            ///app.set( {'game': { 'acting_player':{ 'activerole':'produce' } , ...app.get().game} } )
            var _game23 = app$1.get().game;
            _game23.players[app$1.get().game.acting_player_index].activerole = "produce";
            app$1.set({
              game: _game23
            });
            app$1.produce(_game23.subchoices, _game23.players[app$1.get().game.acting_player_index].boostingicons.produce);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Trade Resources from": function ChooseAPlanetToTradeResourcesFrom() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "trade") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["settled_&_conquered_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Trading a Resource": function TradingAResource() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "trade") {
            app$1.phasefinishfunction();
          } else {
            var _game24 = app$1.get().game;
            _game24.players[app$1.get().game.acting_player_index].activerole = "trade";
            app$1.set({
              game: _game24
            });
            app$1.trade(_game24.subchoices, _game24.players[app$1.get().game.acting_player_index], _game24.players[app$1.get().game.acting_player_index].boostingicons.trade);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // research : 2
      //      choose technologies from market
      //      -> research
      {
        "Choose a Technology to Research": function ChooseATechnologyToResearch() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "research") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["research"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Researching your Technology": function ResearchingYourTechnology() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "survey") {
            app$1.phasefinishfunction();
          } else {
            var _game25 = app$1.get().game;

            if (_game25.choices[0].name != "Skip") {
              var p = {
                advanced: 0,
                metallic: 0,
                fertile: 0
              };
              [].concat(_toConsumableArray(_game25.players[app$1.get().game.acting_player_index].settled_planets), _toConsumableArray(_game25.players[app$1.get().game.acting_player_index].conquered_planets)).map(function (el) {
                p[el.type]++;
              });
              var condition = true;

              for (var i in _game25.choices[0].planet_requirements) {
                if (_game25.choices[0].planet_requirements[i] > p[i]) {
                  condition = false;
                }
              }

              if (condition && _game25.players[app$1.get().game.acting_player_index].boostingicons.research >= _game25.choices[0].research_cost) {
                app$1.play(_game25.research_deck, _game25.players[app$1.get().game.acting_player_index].limbo, "discard", _game25.choices[0].identifier);
              }
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // survey : 2
      //      choose planet
      //      -> survey
      {
        "Choose a Planet from your Galaxy to Explore": function ChooseAPlanetFromYourGalaxyToExplore() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "survey") {
            app$1.phasefinishfunction();
          } else {
            var _game26 = app$1.get().game; //survey_role purchase, offer_to_boost explore_planet, present_as_choice, choose, catalog_planet, discard

            for (var i = 0; i < _game26.players[app$1.get().game.acting_player_index].boostingicons.survey - 1; i++) {
              app$1.explore_planet(_game26.players[app$1.get().game.acting_player_index]);
            }

            app$1.set({
              game: _game26
            });
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Surveying your Empire": function SurveyingYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "survey" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.catalog_planet(app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, // #######################################################################################################################################################################################
      // warfare : 4
      //      attack or collect
      //          -> collect
      //          -> choose planet
      //              -> conquer
      {
        "Choose between Collecting Starfighters or Conquering a Planet": function ChooseBetweenCollectingStarfightersOrConqueringAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare") {
            app$1.phasefinishfunction();
          } else if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "bureaucracy";
          }).length == 0) {
            var _game27 = app$1.get().game;
            _game27.choices = [{
              name: "Collect Starfighters"
            }];
            app$1.set({
              game: _game27
            });
            app$1.phasefinishfunction(true);
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Conquer a Planet"
            }, {
              name: "Collect Starfighters"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Adding Starfighters to your Fleet": function AddingStarfightersToYourFleet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Collect Starfighters") {
            app$1.phasefinishfunction();
          } else {
            for (var i = 0; i < app$1.get().game.players[app$1.get().game.acting_player_index].boostingicons.warfare; i++) {
              app$1.warfare(app$1.get().game.players[app$1.get().game.acting_player_index]);
            }

            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Choose a Planet to Conquer": function ChooseAPlanetToConquer() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Conquering your planet": function ConqueringYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activerole != "warfare" || app$1.get().game.choices[0].name != "Conquer a Planet") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Pass the device to the Next Player": function PassTheDeviceToTheNextPlayer() {
          var game = app$1.get().game;
          game.displayinfo.selectionzone = "";
          game.passp = true;
          app$1.set({
            game: game
          });
        }
      }, {
        "You passed Priority": function YouPassedPriority() {
          var game = app$1.get().game;
          game.passp = false;
          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }]
    }, //discard : 2
    //  select card(s) from hand
    //  -> discard
    {
      discard: [{
        "Would you like to Mobilize against a Planet": function WouldYouLikeToMobilizeAgainstAPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "mobilization") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "mobilize"
            }, {
              name: "skip"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Planet to Mobilize Against": function ChooseAPlanetToMobilizeAgainst() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "mobilization" || app$1.get().game.choices[0].name != "mobilize") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["unsettled_planets"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Mobalizing against your Planet": function MobalizingAgainstYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "mobilization") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Mobalizing against your Planet": function MobalizingAgainstYourPlanet() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].activeaction != "mobilization") {
            app$1.phasefinishfunction();
          } else {
            app$1.conquer(app$1.get().game.subchoices[0], app$1.get().game.players[app$1.get().game.acting_player_index]);
            app$1.phasefinishfunction(true);
          }
        }
      }, {
        "Would you like to Streamline Your Empire": function WouldYouLikeToStreamlineYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "streamlining";
          }).length == 0) {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Decline"
            }, {
              name: "Streamline Empire"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Card from Your Hand to Remove from the Game": function ChooseACardFromYourHandToRemoveFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "streamlining";
          }).length == 0 || app$1.get().game.choices[0].name != "Streamline Empire") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Streamlining Your Empire": function StreamliningYourEmpire() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "streamlining";
          }).length == 0 || app$1.get().game.choices[0].name != "Streamline Empire" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.research(app$1.get().game.choices, app$1.get().game.players[app$1.get().game.acting_player_index], 1);
          }
        }
      }, {
        "Would you like to Utilize Your Empire's Hyperefficiency": function WouldYouLikeToUtilizeYourEmpireSHyperefficiency() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "hyperefficiency";
          }).length == 0) {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(false
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , false
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["options", [{
              name: "Decline"
            }, {
              name: "Utilize Hyperefficiency"
            }]]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "choices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Choose a Card from Your Hand to Remove from the Game": function ChooseACardFromYourHandToRemoveFromTheGame() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "hyperefficiency";
          }).length == 0 || app$1.get().game.choices[0].name != "Utilize Hyperefficiency") {
            app$1.phasefinishfunction();
          } else {
            app$1.offer(true
            /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
            , true
            /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
            , ["hand"]
            /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
            , "subchoices"
            /* label for where the choice is stored | set with game[label]=*/
            , app$1.phasefinishfunction
            /*callback that handles the choice or finishes the phase*/
            );
          }
        }
      }, {
        "Your Empire is Hyperefficient": function YourEmpireIsHyperefficient() {
          if (app$1.get().game.players[app$1.get().game.acting_player_index].permanents.filter(function (el) {
            return el.type == "hyperefficiency";
          }).length == 0 || app$1.get().game.choices[0].name != "Utilize Hyperefficiency" || app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            app$1.research(app$1.get().game.choices, app$1.get().game.players[app$1.get().game.acting_player_index], app$1.get().game.choices.length);
          }
        }
      }, {
        "Choose any Cards you would like to Discard": function ChooseAnyCardsYouWouldLikeToDiscard() {
          app$1.offer(true
          /*option to skip | sets game.displayinfo.showoptiontoskip=boolean */
          , true
          /*allows multiple choices | sets game.displayinfo.allowformultipleselections=boolean */
          , ["hand"]
          /* available cards to choose from | game.displayinfo.selectionzone={'hand|discard|options|planets|research|rolecards'}, sets choices=array if specified*/
          , "choices"
          /* label for where the choice is stored | set with game[label]=*/
          , app$1.phasefinishfunction
          /*callback that handles the choice or finishes the phase*/
          );
        }
      }, {
        "Discarding your Selected Cards": function DiscardingYourSelectedCards() {
          if (app$1.get().game.choices[0].name == "Skip") {
            app$1.phasefinishfunction();
          } else {
            var _game28 = app$1.get().game;

            for (var i in _game28.choices) {
              // obsolete after drag and dop additions game.players[app.get().game.acting_player_index].hand = game.players[app.get().game.acting_player_index].hand.filter((el)=>{return el.identifier != game.choices[i].identifier});
              _game28.players[app$1.get().game.acting_player_index].discard.push(_game28.choices[i]);
            }

            app$1.set({
              game: _game28
            });
            app$1.phasefinishfunction(true);
          }
        }
      }]
    }, //cleanup : 1
    //  -> cleanup
    {
      cleanup: [{
        "Drawing up to your Hand Size": function DrawingUpToYourHandSize() {
          app$1.cleanup();
          var game = app$1.get().game;
          var handsize = game.players[app$1.get().game.acting_player_index].handsize;

          for (var index in game.players[app$1.get().game.acting_player_index].settled_planets) {
            handsize += game.players[app$1.get().game.acting_player_index].settled_planets[index].handsize_modifier;
          }

          for (var _index in game.players[app$1.get().game.acting_player_index].conquered_planets) {
            handsize += game.players[app$1.get().game.acting_player_index].conquered_planets[_index].handsize_modifier;
          }

          var l = game.players[app$1.get().game.acting_player_index].hand.length;

          if (l < handsize) {
            app$1.draw(game.players[app$1.get().game.acting_player_index], handsize - l);
          }

          for (var i in game.players) {
            game.players[i].boostingicons = {
              survey: 0,
              warfare: 0,
              colonize: 0,
              produce: 0,
              trade: 0,
              research: 0
            };
          }

          if (app$1.get().game.started && app$1.checkforendgame() && game.players.reduce(function (t, p) {
            return t + p.rounds;
          }, 0) % game.number_of_players == 0) {
            app$1.totalinfluence();
            game.nextphase = app$1.endgame;
          }

          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }, {
        "Pass the device to the Next Player": function PassTheDeviceToTheNextPlayer() {
          var game = app$1.get().game;
          game.displayinfo.selectionzone = "";
          game.displayinfo.showoptiontoskip = false;
          game.displayinfo.allowformultipleselections = false;
          game.passp = false;
          game.passt = true;
          app$1.set({
            game: game
          });
        }
      }, {
        "You passed the Turn": function YouPassedTheTurn() {
          var game = app$1.get().game; //app.togglepasstoplayer();

          game.passt = false;
          app$1.set({
            game: game
          });
          app$1.phasefinishfunction(true);
        }
      }]
    }],
    players: [],
    winner: false,
    stacks: {
      pilecount: {
        research: 20,
        producetrade: 16,
        colonize: 20,
        warfare: 16,
        survey: 20
      },
      survey: 0,
      warfare: 1,
      colonize: 2,
      producetrade: 3,
      research: 4,
      rolecards: [{
        type: "survey",
        selected: false,
        icons: {
          survey: 1,
          warfare: 0,
          colonize: 0,
          produce: 0,
          trade: 0,
          research: 0
        },
        name: "Survey",
        image: null
      }, {
        type: "warfare",
        selected: false,
        icons: {
          survey: 0,
          warfare: 1,
          colonize: 0,
          produce: 0,
          trade: 0,
          research: 0
        },
        name: "Warfare",
        image: null
      }, {
        type: "colonize",
        selected: false,
        icons: {
          survey: 0,
          warfare: 0,
          colonize: 1,
          produce: 0,
          trade: 0,
          research: 0
        },
        name: "Colonize",
        image: null
      }, {
        type: "producetrade",
        selected: false,
        icons: {
          survey: 0,
          warfare: 0,
          colonize: 0,
          produce: 1,
          trade: 1,
          research: 0
        },
        name: "Produce / Trade",
        image: null
      }, {
        type: "research",
        selected: false,
        icons: {
          survey: 0,
          warfare: 0,
          colonize: 0,
          produce: 0,
          trade: 0,
          research: 1
        },
        name: "Research",
        image: null,
        research_deck: []
      }]
    }
  }; //let url = 'ws://temperate-isle.herokuapp.com:3030';

  var url = location.origin.replace(/^http/, "ws"); //'ws://192.168.1.6:3030';

  var lobby = {
    screenname: "",
    url: url,
    sets: ["Base Game"],
    number_of_players: [2, 3, 4],
    existinggames: []
  };
  game.nonce = nonce;
  var app$1 = new App({
    target: document.body,
    data: {
      lobby: lobby,
      game: game,
      phases: game.gamephases
    }
  });
  return app$1;
}();