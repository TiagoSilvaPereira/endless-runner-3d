/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Game);

    /**
     * Sets game options
     */
    this.options = options;
    /**
     * Keyboard pressed keys
     */

    this.keys = {};
    /**
     * Is game paused?
     */

    this.paused = false;
    /**
     * Can be used to log objects and debug the game
     */

    this.log = new Log();
    /**
     * Starts the BABYLON engine on the Canvas element
     */

    this.canvas = document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.currentLevel = null;
    this.currentLevelName = 'HomeMenuLevel';
    this.levels = {
      'HomeMenuLevel': new HomeMenuLevel(),
      'CreditsLevel': new CreditsLevel(),
      'RunnerLevel': new RunnerLevel()
    };
  }

  _createClass(Game, [{
    key: "start",
    value: function start() {
      this.listenKeys();
      this.lintenTouchEvents();
      this.listenOtherEvents();
      this.startLevel();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.paused;
    }
  }, {
    key: "resume",
    value: function resume() {
      this.paused = false;
    }
  }, {
    key: "listenKeys",
    value: function listenKeys() {
      document.addEventListener('keydown', keyDown.bind(this));
      document.addEventListener('keyup', keyUp.bind(this));
      this.keys.up = false;
      this.keys.down = false;
      this.keys.left = false;
      this.keys.right = false;

      function keyDown(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
          //Arrow Up
          this.keys.up = 1;
        } else if (e.keyCode == 83 || e.keyCode == 40) {
          //Arrow Down
          this.keys.down = 1;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
          //Arrow Left
          this.keys.left = 1;
        } else if (e.keyCode == 68 || e.keyCode == 39) {
          //Arrow Right
          this.keys.right = 1;
        }
      }

      function keyUp(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
          //Arrow Up
          this.keys.up = 0;
        } else if (e.keyCode == 83 || e.keyCode == 40) {
          //Arrow Down
          this.keys.down = 0;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
          //Arrow Left
          this.keys.left = 0;
        } else if (e.keyCode == 68 || e.keyCode == 39) {
          //Arrow Right
          this.keys.right = 0;
        }
      }
    }
  }, {
    key: "lintenTouchEvents",
    value: function lintenTouchEvents() {
      var _this = this;

      var hammertime = new Hammer(document.body);
      hammertime.get('swipe').set({
        direction: Hammer.DIRECTION_ALL
      });
      hammertime.on('swipeup', function (ev) {
        _this.keys.up = 1; // Resets the key after some milleseconds

        setTimeout(function () {
          _this.keys.up = 0;
        }, 150);
      });
      hammertime.on('swipedown', function (ev) {
        _this.keys.down = 1;
        setTimeout(function () {
          _this.keys.down = 0;
        }, 100);
      });
      hammertime.on('swipeleft', function (ev) {
        _this.keys.left = 2;
        setTimeout(function () {
          _this.keys.left = 0;
        }, 150);
      });
      hammertime.on('swiperight', function (ev) {
        _this.keys.right = 2;
        setTimeout(function () {
          _this.keys.right = 0;
        }, 150);
      });
    }
  }, {
    key: "listenOtherEvents",
    value: function listenOtherEvents() {
      var _this2 = this;

      window.addEventListener('blur', function () {
        _this2.pause();
      });
      window.addEventListener('focus', function () {
        _this2.resume();
      });
    }
  }, {
    key: "goToLevel",
    value: function goToLevel(levelName) {
      if (!this.levels[levelName]) {
        console.error('A level with name ' + levelName + ' does not exists');
        return;
      }

      if (this.currentLevel) {
        this.currentLevel.exit();
      }

      this.currentLevelName = levelName;
      this.startLevel();
    }
  }, {
    key: "startLevel",
    value: function startLevel() {
      this.currentLevel = this.levels[this.currentLevelName];
      this.currentLevel.start();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.startRenderLoop();
      window.addEventListener("resize", function () {
        _this3.engine.resize();
      });
    }
  }, {
    key: "startRenderLoop",
    value: function startRenderLoop() {
      var _this4 = this;

      this.engine.runRenderLoop(function () {
        _this4.currentLevel.scene.render();
      });
    }
  }, {
    key: "stopRenderLoop",
    value: function stopRenderLoop() {
      this.engine.stopRenderLoop();
    }
  }]);

  return Game;
}();

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Base Logic
__webpack_require__(/*! ./base/Log.js */ "./src/base/Log.js");

__webpack_require__(/*! ./base/UI.js */ "./src/base/UI.js");

var Level = __webpack_require__(/*! ./base/Level.js */ "./src/base/Level.js");

__webpack_require__(/*! ./base/AssetsDatabase.js */ "./src/base/AssetsDatabase.js"); // Game Logic


__webpack_require__(/*! ./game/Player.js */ "./src/game/Player.js");

__webpack_require__(/*! ./game/Monster.js */ "./src/game/Monster.js"); // Game Levels


__webpack_require__(/*! ./game/levels/HomeMenuLevel.js */ "./src/game/levels/HomeMenuLevel.js");

__webpack_require__(/*! ./game/levels/CreditsLevel.js */ "./src/game/levels/CreditsLevel.js");

__webpack_require__(/*! ./game/levels/generators/TilesGenerator.js */ "./src/game/levels/generators/TilesGenerator.js");

__webpack_require__(/*! ./game/levels/RunnerLevel.js */ "./src/game/levels/RunnerLevel.js"); // The Game main class


__webpack_require__(/*! ./Game.js */ "./src/Game.js");

/***/ }),

/***/ "./src/base/AssetsDatabase.js":
/*!************************************!*\
  !*** ./src/base/AssetsDatabase.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AssetsDatabase =
/*#__PURE__*/
function () {
  function AssetsDatabase(scene, finishCallback) {
    _classCallCheck(this, AssetsDatabase);

    this.scene = scene;
    this.meshes = [];
    this.sounds = [];
    this.manager = new BABYLON.AssetsManager(this.scene);

    this.manager.onFinish = function (tasks) {
      if (finishCallback) finishCallback(tasks);
    };
  }
  /**
   * Adds a sound to be loaded
   * @param {*} name 
   * @param {*} file 
   * @param {*} options 
   */


  _createClass(AssetsDatabase, [{
    key: "addSound",
    value: function addSound(name, file, options) {
      var _this = this;

      var fileTask = this.manager.addBinaryFileTask(name + '__SoundTask', file);

      fileTask.onSuccess = function (task) {
        _this.sounds[name] = new BABYLON.Sound(name, task.data, _this.scene, null, options); // Execute a success callback

        if (options.onSuccess) {
          options.onSuccess(_this.sounds[name]);
        }
      };

      return this.sounds[name];
    }
    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */

  }, {
    key: "addMusic",
    value: function addMusic(name, file) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.loop = typeof options.loop !== 'undefined' ? options.loop : true;
      options.volume = typeof options.volume !== 'undefined' ? options.volume : 0.5;
      options.autoplay = typeof options.autoplay !== 'undefined' ? options.autoplay : true;
      return this.addSound(name, file, options);
    }
  }, {
    key: "addMesh",
    value: function addMesh() {// To be implemented
    }
  }, {
    key: "getMesh",
    value: function getMesh(name) {
      return this.meshes[name];
    }
  }, {
    key: "getSound",
    value: function getSound(name) {
      return this.sounds[name];
    }
  }, {
    key: "load",
    value: function load() {
      this.manager.load();
    }
  }]);

  return AssetsDatabase;
}();

/***/ }),

/***/ "./src/base/Level.js":
/*!***************************!*\
  !*** ./src/base/Level.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Level =
/*#__PURE__*/
function () {
  function Level() {
    _classCallCheck(this, Level);

    /**
     * We can use this object to store materials that can be reused along the game
     */
    this.materials = {};
    this.scene = null;
    this.assets = null;
  }

  _createClass(Level, [{
    key: "start",
    value: function start() {
      GAME.resume();
      GAME.stopRenderLoop();

      if (this.setProperties) {
        this.setProperties();
      } else {
        GAME.log.debugWarning('The setProperties method is recommended to initialize the Level properties');
      }

      this.createScene();
    }
  }, {
    key: "createScene",
    value: function createScene() {
      var _this = this;

      // Create the scene space
      this.scene = new BABYLON.Scene(GAME.engine); // Add assets management and execute beforeRender after finish

      this.assets = new AssetsDatabase(this.scene, function () {
        GAME.log.debug('Level Assets loaded');

        if (_this.buildScene) {
          _this.buildScene();
        } else {
          GAME.log.debugWarning('You can add the buildScene method to your level to define your scene');
        } // If has the beforeRender method


        if (_this.beforeRender) {
          _this.scene.registerBeforeRender(_this.beforeRender.bind(_this));
        } else {
          GAME.log.debugWarning('You can define animations and other game logics that happends inside the main loop on the beforeRender method');
        }

        GAME.startRenderLoop();
      });

      if (this.setupAssets) {
        this.setupAssets();
      } // Load the assets


      this.assets.load();
      return this.scene;
    }
  }, {
    key: "exit",
    value: function exit() {
      this.scene.dispose();
      this.scene = null;
    }
    /**
     * Adds a collider to the level scene. It will fire the options.onCollide callback
     * when the collider intersects options.collisionMesh. It can be used to fire actions when
     * player enters an area for example.
     * @param {*} name 
     * @param {*} options 
     */

  }, {
    key: "addCollider",
    value: function addCollider(name, options) {
      var collider = BABYLON.MeshBuilder.CreateBox(name, {
        width: options.width || 1,
        height: options.height || 1,
        depth: options.depth || 1
      }, this.scene); // Add a tag to identify the object as collider and to simplify group operations (like dispose)

      BABYLON.Tags.AddTagsTo(collider, 'collider boxCollider');
      collider.position.x = options.positionX || 0;
      collider.position.y = options.positionY || 0;
      collider.position.z = options.positionZ || 0;
      collider.isVisible = options.visible ? options.visible : false;

      if (collider.isVisible) {
        var colliderMaterial = new BABYLON.StandardMaterial(name + 'Material');
        colliderMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
        colliderMaterial.alpha = 0.5;
        collider.material = colliderMaterial;
      }

      options.timeToDispose = options.timeToDispose ? options.timeToDispose : 0;
      collider.actionManager = new BABYLON.ActionManager(this.scene);
      collider.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: options.collisionMesh
      }, function () {
        // Runs onCollide callback if exists
        if (options.onCollide) {
          options.onCollide();
        } // If true, will dispose the collider after timeToDispose


        if (options.disposeAfterCollision) {
          setTimeout(function () {
            collider.dispose();
          }, options.timeToDispose);
        }
      }));
      return collider;
    }
  }, {
    key: "disposeColliders",
    value: function disposeColliders() {
      var colliders = this.scene.getMeshesByTags('collider');

      for (var index = 0; index < colliders.length; index++) {
        colliders[index].dispose();
      }
    }
  }, {
    key: "addMaterial",
    value: function addMaterial(material) {
      this.materials[material.name] = material;
    }
  }, {
    key: "getMaterial",
    value: function getMaterial(materialName) {
      return this.materials[materialName];
    }
  }, {
    key: "removeMaterial",
    value: function removeMaterial(materialName) {
      var material = null;

      if (material = this.materials[materialName]) {
        material.dispose();
        delete this.materials[materialName];
      }
    }
    /**
     * Interpolate a value inside the Level Scene using the BABYLON Action Manager
     * @param {*} target The target object
     * @param {*} property The property in the object to interpolate
     * @param {*} toValue The final value of interpolation
     * @param {*} duration The interpolation duration in milliseconds
     * @param {*} afterExecutionCallback Callback executed after ther interpolation ends
     */

  }, {
    key: "interpolate",
    value: function interpolate(target, property, toValue, duration) {
      var afterExecutionCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      if (!this.scene.actionManager) {
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
      }

      var interpolateAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.NothingTrigger, target, property, toValue, duration);
      interpolateAction.onInterpolationDoneObservable.add(function () {
        GAME.log.debug('Interpolation done');
        if (afterExecutionCallback) afterExecutionCallback();
      });
      this.scene.actionManager.registerAction(interpolateAction);
      interpolateAction.execute();
    }
  }]);

  return Level;
}();

/***/ }),

/***/ "./src/base/Log.js":
/*!*************************!*\
  !*** ./src/base/Log.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Log =
/*#__PURE__*/
function () {
  function Log() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    _classCallCheck(this, Log);

    this.currentID = 0;
    this.logs = [];
    this.enabled = enabled;
  }

  _createClass(Log, [{
    key: "push",
    value: function push() {
      var log = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!this.enabled) return;
      log.ID = ++this.currentID;
      this.logs.push(log);
    }
    /**
     * Simple log method to show what something is doing at moment
     * @param {*} what 
     */

  }, {
    key: "doing",
    value: function doing() {
      var what = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.push({
        'doing': what
      });
    }
  }, {
    key: "getLast",
    value: function getLast() {
      var quantity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.logs.slice(-quantity);
    }
  }, {
    key: "logLast",
    value: function logLast() {
      var quantity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      console.log(this.getLast(quantity));
    }
  }, {
    key: "get",
    value: function get() {
      return this.logs;
    }
  }, {
    key: "log",
    value: function log() {
      console.log(this.logs);
    }
  }, {
    key: "debug",
    value: function debug(data) {
      if (GAME.options.debugMode) {
        console.log('DEBUG LOG: ' + data);
      }
    }
  }, {
    key: "debugWarning",
    value: function debugWarning(data) {
      if (GAME.options.debugMode) {
        console.warn('DEBUG LOG: ' + data);
      }
    }
  }, {
    key: "debugError",
    value: function debugError(data) {
      if (GAME.options.debugMode) {
        console.error('DEBUG LOG: ' + data);
      }
    }
  }]);

  return Log;
}();

/***/ }),

/***/ "./src/base/UI.js":
/*!************************!*\
  !*** ./src/base/UI.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UI =
/*#__PURE__*/
function () {
  function UI(uiName) {
    _classCallCheck(this, UI);

    this.controls = [];
    this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
  }

  _createClass(UI, [{
    key: "addButton",
    value: function addButton(name, text) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
      button.width = options.width || 0.5;
      button.height = options.height || '60px';
      button.color = options.color || 'black';
      button.outlineWidth = options.outlineWidth || 0;
      button.outlineColor = options.outlineColor || button.color;
      button.background = options.background || 'white';
      button.left = options.left || '0px';
      button.top = options.top || '0px';
      button.textHorizontalAlignment = typeof options.horizontalAlignment !== 'undefined' ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      button.textVerticalAlignment = typeof options.verticalAlignment !== 'undefined' ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

      if (options.onclick) {
        button.onPointerUpObservable.add(options.onclick);
      }

      this.menuTexture.addControl(button);
      this.controls.push(button);
      return button;
    }
  }, {
    key: "addText",
    value: function addText(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var textControl = new BABYLON.GUI.TextBlock();
      textControl.text = text;
      textControl.color = options.color || 'white';
      textControl.fontSize = options.fontSize || 28;
      textControl.outlineWidth = options.outlineWidth || 0;
      textControl.outlineColor = options.outlineColor || "black";
      textControl.lineSpacing = options.lineSpacing || '5px';
      textControl.left = options.left || '0px';
      textControl.top = options.top || '0px';
      textControl.textHorizontalAlignment = typeof options.horizontalAlignment !== 'undefined' ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      textControl.textVerticalAlignment = typeof options.verticalAlignment !== 'undefined' ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      textControl.textWrapping = options.wrapping || true;
      this.menuTexture.addControl(textControl);
      this.controls.push(textControl);
      return textControl;
    }
  }, {
    key: "show",
    value: function show() {
      this.controls.forEach(function (control) {
        return control.isVisible = true;
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.controls.forEach(function (control) {
        return control.isVisible = false;
      });
    }
  }]);

  return UI;
}();

/***/ }),

/***/ "./src/game/Monster.js":
/*!*****************************!*\
  !*** ./src/game/Monster.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Monster =
/*#__PURE__*/
function () {
  function Monster(level) {
    _classCallCheck(this, Monster);

    /**
     * Who to chase
     */
    this.level = level;
    this.player = level.player;
    this.currentPlayerTravelledDistance = 0;
    this.distanceBeetweenPlayer = 0.9;
    this.statuses = {
      'CLOSE_TO_PLAYER': true
    };
    /**
     * SOUNDS
     */

    this.approachSound = null;
    this.attackSound = null;
    /**
     * The scene
     */

    this.scene = level.scene;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("monsterSphere", {
      diameter: 0.25,
      segments: 2
    }, this.scene);
    this.mesh.position.x = 0;
    this.mesh.position.y = 0.2;
    this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer;
    this.monsterMaterial = new BABYLON.StandardMaterial('monsterMaterial', this.scene);
    this.monsterMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.monsterColor);
    this.monsterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    this.mesh.material = this.monsterMaterial;
    this.approachSound = new BABYLON.Sound('approachSound', '/assets/sounds/monster.wav', this.scene, null);
    this.attackSound = new BABYLON.Sound('attackSound', '/assets/sounds/monster_attack.mp3', this.scene);
  }

  _createClass(Monster, [{
    key: "approachToPlayer",
    value: function approachToPlayer() {
      this.statuses.CLOSE_TO_PLAYER = true;
      this.currentPlayerTravelledDistance = this.player.totalTravelledDistance;
      this.level.interpolate(this, 'distanceBeetweenPlayer', 0.9, 500);
      this.approachSound.play();
    }
  }, {
    key: "moveAwayFromPlayer",
    value: function moveAwayFromPlayer() {
      this.statuses.CLOSE_TO_PLAYER = false;
      this.level.interpolate(this, 'distanceBeetweenPlayer', 1.5, 1500);
    }
  }, {
    key: "attackPlayer",
    value: function attackPlayer() {
      var _this = this;

      this.attackSound.play();
      this.level.interpolate(this, 'distanceBeetweenPlayer', 0.1, 300);
      setTimeout(function () {
        return _this.player.die();
      }, 300);
    }
  }, {
    key: "move",
    value: function move() {
      var animationRatio = this.scene.getAnimationRatio();
      this.mesh.position.x = this.player.mesh.position.x; // Adding some altitude variation on monster altitude using Math.sin

      this.mesh.position.y = Math.sin(this.mesh.position.z) / 100 + 0.2 + (this.player.mesh.position.y - this.player.defaultAltitude);
      this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer; // If is chasing the player from more than 100 'meters', move away

      if (this.player.totalTravelledDistance - this.currentPlayerTravelledDistance > 100 && this.statuses.CLOSE_TO_PLAYER) {
        this.moveAwayFromPlayer();
      }
    }
  }, {
    key: "isCloseToPlayer",
    value: function isCloseToPlayer() {
      return this.statuses.CLOSE_TO_PLAYER;
    }
  }]);

  return Monster;
}();

/***/ }),

/***/ "./src/game/Player.js":
/*!****************************!*\
  !*** ./src/game/Player.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player(level) {
    _classCallCheck(this, Player);

    this.level = level;
    this.scene = level.scene;
    this.statuses = {
      'RUNNING': true,
      'JUMPING': false,
      'DRAGGING': false,
      'FALLING_DOWN': false,
      'SLOW': false,
      'DEAD': false
    };
    /**
     * HUD Controls
     */

    this.coinsTextControl = null;
    this.metersTextControl = null;
    /**
     * SOUNDS
     */

    this.dieSound = null;
    this.jumpSound = null;
    this.damageSound = null;
    this.gotCoinSound = null;
    /**
     * Set it to true to make the player indestructible for tests
     */

    this.godMode = false;
    this.defaultSpeed = GAME.options.player.defaultSpeed;
    this.speed = this.defaultSpeed;
    this.gravity = GAME.options.player.gravity;
    /**
     * Stores the player last altitude to check if the player is falling down
     */

    this.jumpForce = GAME.options.player.jumpForce;
    this.jumpMaxAltitude = GAME.options.player.jumpMaxAltitude; // Stores the last player altitude from every frame

    this.defaultAltitude = 0.25;
    this.lastAltitude = this.defaultAltitude;
    this.coins = 0;
    this.points = 0;
    this.pointsRecord = false; // How many times the user was damaged at time

    this.damages = 0;
    this.onDie = null;
    /**
     * Used to store the travelled distance and calculate where to generate more level tiles
     * and to give points to the player
     * The travelledDistance will reset each 100 "meters". When travelledDistance is equal to 70
     * the Level will generate more tiles
     */

    this.travelledDistance = 0;
    this.totalTravelledDistance = 0;
    this.setupPlayer();
  }

  _createClass(Player, [{
    key: "setupPlayer",
    value: function setupPlayer() {
      this.dieSound = this.level.assets.getSound('playerDieSound');
      this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
      this.damageSound = this.level.assets.getSound('damageSound');
      this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
        width: 0.3333333,
        height: 0.5,
        depth: 0.3333333
      }, this.scene);
      this.mesh.position.y = this.defaultAltitude;
      var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
      playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.playerColor);
      this.mesh.material = playerMaterial; // Adds the collision ellipsoid fitting it on the Player "Box" mesh

      this.mesh.setEllipsoidPerBoundingBox();
      this.setupAnimations();
      this.createHUD();
    }
  }, {
    key: "setupAnimations",
    value: function setupAnimations() {
      var blinkAnimation = new BABYLON.Animation("blinkAnimation", "material.alpha", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = []; //At the animation key 0, the value of alpha is "1"

      keys.push({
        frame: 0,
        value: 1
      }); //At the animation key 15, the value of alpha is "0.2"

      keys.push({
        frame: 15,
        value: 0.2
      }); //At the animation key 30, the value of alpha is "1"

      keys.push({
        frame: 30,
        value: 1
      });
      blinkAnimation.setKeys(keys);
      this.mesh.animations = [];
      this.mesh.animations.push(blinkAnimation);
    }
  }, {
    key: "createHUD",
    value: function createHUD() {
      this.hud = new UI('playerHudUI');
      this.metersTextControl = this.hud.addText('Meters: 0', {
        'top': '10px',
        'left': '10px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      });
      this.coinsTextControl = this.hud.addText('Coins: 0', {
        'top': '10px',
        'left': '-10px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
      });
    }
  }, {
    key: "getMesh",
    value: function getMesh() {
      return this.mesh;
    }
  }, {
    key: "damage",
    value: function damage() {
      var _this = this;

      this.damages++;
      this.damageSound.play();
      this.blink();
      this.speed = this.defaultSpeed / 2;
      this.statuses.SLOW = true;
      setTimeout(function () {
        _this.statuses.SLOW = false;
        _this.speed = _this.defaultSpeed;
      }, 1500);
    }
  }, {
    key: "blink",
    value: function blink() {
      var _this2 = this;

      var blinkAnimation = this.scene.beginAnimation(this.mesh, 0, 30, true);
      setTimeout(function () {
        blinkAnimation.pause();
        _this2.mesh.material.alpha = 1;
      }, 1500);
    }
  }, {
    key: "move",
    value: function move() {
      if (this.statuses.DEAD) return;
      var animationRatio = this.scene.getAnimationRatio() / 50,
          gravity = this.godMode ? 0 : this.gravity * animationRatio,
          jump = this.statuses.JUMPING && !this.statuses.FALLING_DOWN ? this.jumpForce * animationRatio : 0,
          runSpeed = this.speed * animationRatio; // If is jumping, multiply the speed by 1.5

      runSpeed *= this.statuses.JUMPING ? 1.5 : 1;
      this.mesh.moveWithCollisions(new BABYLON.Vector3(0, gravity + jump, runSpeed));
      this.checkPlayerLateralMovement(animationRatio);
      this.calculateTravelledDistance(animationRatio);
      this.checkPlayerJump();
      this.checkPlayerAltitude();
      this.checkPlayerDragging();

      if (this.mesh.position.y <= -2 && !this.statuses.DEAD) {
        this.die();
      }
    }
  }, {
    key: "calculateTravelledDistance",
    value: function calculateTravelledDistance(animationRatio) {
      if (this.travelledDistance >= 100) {
        this.travelledDistance = 0;
      }

      this.travelledDistance += this.speed * animationRatio;
      this.totalTravelledDistance += this.speed * animationRatio;
      this.metersTextControl.text = 'Meters: ' + Math.floor(this.totalTravelledDistance);
    }
  }, {
    key: "checkPlayerAltitude",
    value: function checkPlayerAltitude() {
      if (this.mesh.position.y < this.lastAltitude) {
        this.statuses.FALLING_DOWN = true;
      } else {
        this.statuses.FALLING_DOWN = false;
      }

      this.lastAltitude = this.mesh.position.y;
    }
  }, {
    key: "checkPlayerLateralMovement",
    value: function checkPlayerLateralMovement(animationRatio) {
      if (GAME.keys.left && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
        this.mesh.position.x -= this.speed / 5 * animationRatio;
      }

      if (GAME.keys.right && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
        this.mesh.position.x += this.speed / 5 * animationRatio;
      }
    }
  }, {
    key: "checkPlayerJump",
    value: function checkPlayerJump() {
      if (GAME.keys.up && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
        this.statuses.JUMPING = true;
      }
      /**
       * If the player reaches the jump max altitude, then we change JUMPING status to false
       * and "hack" the lastAltitude adding more 100 units (it is necessary because the method checkPlayerAltitude will
       * detect FALLING_DOWN only on the next animation frame if we dont make it, 
       * and it will crash the method checkPlayerDragging, immediataly setting the player position 
       * to the initial position. Then we addd a big number to lastAltitude to prevent it)
       */


      if (this.mesh.position.y >= this.jumpMaxAltitude && this.statuses.JUMPING) {
        this.lastAltitude = this.lastAltitude + 100; // Hacking lastAltitude (explained above)

        this.statuses.FALLING_DOWN = true;
        this.statuses.JUMPING = false;
      }
    }
  }, {
    key: "checkPlayerDragging",
    value: function checkPlayerDragging() {
      var _this3 = this;

      if (GAME.keys.down) {
        if (!this.statuses.DRAGGING) {
          this.statuses.DRAGGING = true;
          this.speed = this.defaultSpeed * 1.5; // Smoothly interpolate the Player height to a half and then, readjust
          // the collision ellipsoid

          this.level.interpolate(this.mesh.scaling, 'y', 0.5, 100, function () {
            // Manually reseting the collision ellipsoid height (mesh height/4)
            _this3.mesh.ellipsoid.y = 0.125;
          });
          setTimeout(function () {
            _this3.statuses.DRAGGING = false; // Manually reseting the collision ellipsoid height (future mesh height/4)
            // We need to make it before interpolation to avoid collision problems during 
            // the interpolation proccess

            _this3.mesh.ellipsoid.y = 0.25; // Return the player to the normal height

            _this3.level.interpolate(_this3.mesh.scaling, 'y', 1, 100);
          }, 700);
        }
      } else {
        if (!this.statuses.DRAGGING) {
          if (!this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.mesh.position.y = this.defaultAltitude;
          }

          if (!this.statuses.SLOW) {
            this.speed = this.defaultSpeed;
          }
        }
      }
    }
  }, {
    key: "getTravelledDistance",
    value: function getTravelledDistance() {
      return this.travelledDistance;
    }
  }, {
    key: "keepCoin",
    value: function keepCoin() {
      this.coins++;
      this.coinsTextControl.text = 'Coins: ' + this.coins;
      this.gotCoinSound.play();
    }
  }, {
    key: "reset",
    value: function reset() {
      this.statuses.DEAD = false;
      this.statuses.JUMPING = false;
      this.statuses.FALLING_DOWN = false;
      this.statuses.DRAGGING = false;
      this.coins = 0;
      this.damages = 0;
      this.mesh.position.x = 0;
      this.mesh.position.y = this.defaultAltitude;
      this.mesh.position.z = 0;
      this.travelledDistance = 0;
      this.totalTravelledDistance = 0;
    }
  }, {
    key: "die",
    value: function die() {
      if (this.godMode) return;
      this.statuses.DEAD = true;
      this.dieSound.play();

      if (this.onDie) {
        this.onDie();
      }
    }
  }, {
    key: "getPoints",
    value: function getPoints() {
      return this.points;
    }
  }, {
    key: "calculatePoints",
    value: function calculatePoints() {
      this.points = 0;
      this.points += this.coins * 10;
      this.points += this.totalTravelledDistance;
      this.points -= this.damages * 5;
      this.points = this.points > 0 ? this.points.toFixed(0) : 0;
      this.checkAndSaveRecord(this.points);
      return this.points;
    }
  }, {
    key: "checkAndSaveRecord",
    value: function checkAndSaveRecord(points) {
      var lastRecord = 0;
      this.pointsRecord = false;

      if (window.localStorage['last_record']) {
        lastRecord = parseInt(window.localStorage['last_record'], 10);
      }

      if (lastRecord < points) {
        this.pointsRecord = true;
        window.localStorage['last_record'] = points;
      }
    }
  }, {
    key: "hasMadePointsRecord",
    value: function hasMadePointsRecord() {
      return this.pointsRecord;
    }
  }, {
    key: "getLastRecord",
    value: function getLastRecord() {
      return window.localStorage['last_record'] || 0;
    }
  }]);

  return Player;
}();

/***/ }),

/***/ "./src/game/levels/CreditsLevel.js":
/*!*****************************************!*\
  !*** ./src/game/levels/CreditsLevel.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CreditsLevel =
/*#__PURE__*/
function (_Level) {
  _inherits(CreditsLevel, _Level);

  function CreditsLevel() {
    _classCallCheck(this, CreditsLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(CreditsLevel).apply(this, arguments));
  }

  _createClass(CreditsLevel, [{
    key: "buildScene",
    value: function buildScene() {
      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene); // Make this scene transparent to see the background

      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      this.makeUI();
    }
  }, {
    key: "makeUI",
    value: function makeUI() {
      var ui = new UI('creditsUI');
      ui.addText('Design and Code:\n Tiago Silva Pereira Rodrigues', {
        'top': '10px',
        'fontSize': '20px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
      });
      ui.addText('Music:\n Sound Image', {
        'top': '80px',
        'fontSize': '20px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
      });
      ui.addText('Sounds:\n Sound Image', {
        'top': '150px',
        'fontSize': '20px',
        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
      });
      ui.addButton('backButton', 'Return to Home', {
        'top': '220px',
        'background': GAME.options.backgroundColor,
        'color': 'white',
        'onclick': function onclick() {
          return GAME.goToLevel('HomeMenuLevel');
        }
      });
    }
  }]);

  return CreditsLevel;
}(Level);

/***/ }),

/***/ "./src/game/levels/HomeMenuLevel.js":
/*!******************************************!*\
  !*** ./src/game/levels/HomeMenuLevel.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HomeMenuLevel =
/*#__PURE__*/
function (_Level) {
  _inherits(HomeMenuLevel, _Level);

  function HomeMenuLevel() {
    _classCallCheck(this, HomeMenuLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(HomeMenuLevel).apply(this, arguments));
  }

  _createClass(HomeMenuLevel, [{
    key: "buildScene",
    value: function buildScene() {
      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene); // Make this scene transparent to see the document background

      this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      var menu = new UI('homeMenuUI');
      menu.addButton('playButton', 'Play Game', {
        'background': GAME.options.backgroundColor,
        'color': 'white',
        'onclick': function onclick() {
          return GAME.goToLevel('RunnerLevel');
        }
      });
      menu.addButton('creditsButton', 'Credits', {
        'top': '70px',
        'background': GAME.options.backgroundColor,
        'color': 'white',
        'onclick': function onclick() {
          return GAME.goToLevel('CreditsLevel');
        }
      });
    }
  }]);

  return HomeMenuLevel;
}(Level);

/***/ }),

/***/ "./src/game/levels/RunnerLevel.js":
/*!****************************************!*\
  !*** ./src/game/levels/RunnerLevel.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RunnerLevel =
/*#__PURE__*/
function (_Level) {
  _inherits(RunnerLevel, _Level);

  function RunnerLevel() {
    _classCallCheck(this, RunnerLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(RunnerLevel).apply(this, arguments));
  }

  _createClass(RunnerLevel, [{
    key: "setProperties",
    value: function setProperties() {
      this.player = null;
      this.monster = null; // Used for ground tiles generation

      this.tiles = null; // Menu

      this.menu = null;
      this.pointsTextControl = null;
      this.currentRecordTextControl = null;
      this.hasMadeRecordTextControl = null;
    }
  }, {
    key: "setupAssets",
    value: function setupAssets() {
      this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
      this.assets.addSound('playerDieSound', '/assets/sounds/game-die.mp3', {
        volume: 0.4
      });
      this.assets.addSound('gotCoinSound', '/assets/sounds/coin-c-09.wav');
      this.assets.addSound('damageSound', '/assets/sounds/damage.wav');
    }
  }, {
    key: "buildScene",
    value: function buildScene() {
      this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);
      this.createMenus(); // Sets the active camera

      var camera = this.createArcCamera();
      this.scene.activeCamera = camera; // Uncomment it to allow free camera rotation

      camera.attachControl(GAME.canvas, true); // Add lights to the scene

      var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
      var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 100, -100), this.scene);
      light1.intensity = 0.9;
      light2.intensity = 0.2;
      this.createPlayer();
      this.createMonster();
      this.tiles = new TilesGenerator(this);
      this.tiles.generate();
      this.scene.debugLayer.hide();
      this.scene.debugLayer.show({
        popup: true
      });
    }
  }, {
    key: "createMenus",
    value: function createMenus() {
      var _this = this;

      this.menu = new UI('runnerMenuUI');
      this.pointsTextControl = this.menu.addText('Points: 0', {
        'top': '-150px',
        'color': GAME.options.pointsTextColor,
        'outlineColor': GAME.options.pointsOutlineTextColor,
        'outlineWidth': '2px',
        'fontSize': '40px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.currentRecordTextControl = this.menu.addText('Current Record: 0', {
        'top': '-100px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
        'top': '-60px',
        'color': GAME.options.recordTextColor,
        'fontSize': '20px',
        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
      });
      this.menu.addButton('replayButton', 'Replay Game', {
        'onclick': function onclick() {
          return _this.replay();
        }
      });
      this.menu.addButton('backButton', 'Return to Home', {
        'top': '70px',
        'onclick': function onclick() {
          return GAME.goToLevel('HomeMenuLevel');
        }
      });
      this.menu.hide();
    }
  }, {
    key: "createArcCamera",
    value: function createArcCamera() {
      var camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
      camera.ctype = 1;
      camera.setPosition(new BABYLON.Vector3(0, 1, -3));
      camera.radius = 2;
      return camera;
    }
  }, {
    key: "createPlayer",
    value: function createPlayer() {
      var _this2 = this;

      // Creates the player and sets it as camera target
      this.player = new Player(this);
      this.scene.activeCamera.lockedTarget = this.player.getMesh();
      var playerLight = new BABYLON.DirectionalLight("playerLight", new BABYLON.Vector3(1, -2, 1), this.scene);
      playerLight.intensity = 0.3;
      playerLight.parent = this.player.mesh;
      this.scene.shadowGenerator = new BABYLON.ShadowGenerator(32, playerLight);
      this.scene.shadowGenerator.useBlurExponentialShadowMap = true;
      this.scene.shadowGenerator.getShadowMap().renderList.push(this.player.mesh); // Actions when player dies

      this.player.onDie = function () {
        GAME.pause();

        _this2.player.calculatePoints();

        _this2.showMenu();
      };
    }
  }, {
    key: "showMenu",
    value: function showMenu() {
      this.pointsTextControl.text = 'Points: ' + this.player.getPoints();
      this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();
      this.menu.show();

      if (this.player.hasMadePointsRecord()) {
        this.hasMadeRecordTextControl.isVisible = true;
      } else {
        this.hasMadeRecordTextControl.isVisible = false;
      }
    }
  }, {
    key: "createMonster",
    value: function createMonster() {
      this.monster = new Monster(this); // Add monster shadow

      this.scene.shadowGenerator.getShadowMap().renderList.push(this.monster.mesh);
    }
  }, {
    key: "beforeRender",
    value: function beforeRender() {
      if (!GAME.isPaused()) {
        this.player.move();
        this.monster.move();
      }
    }
  }, {
    key: "replay",
    value: function replay() {
      /**
       * Wee need to dispose the current colliders and tiles on scene to prevent trash objects
       */
      this.tiles.reset();
      this.disposeColliders();
      this.player.reset();
      this.monster.approachToPlayer();
      this.tiles.generate();
      this.menu.hide();
      GAME.resume();
    }
  }]);

  return RunnerLevel;
}(Level);

/***/ }),

/***/ "./src/game/levels/generators/TilesGenerator.js":
/*!******************************************************!*\
  !*** ./src/game/levels/generators/TilesGenerator.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TilesGenerator =
/*#__PURE__*/
function () {
  function TilesGenerator(level) {
    _classCallCheck(this, TilesGenerator);

    this.level = level;
    this.scene = level.scene;
    this.player = level.player;
    this.monster = level.monster;
    /**
     * Default tiles properties
     */

    this.tileDepth = 10;
    this.maxTilesAtTime = 20;
    this.lastTileType = 'HOLE';
    this.generatedTilesNumber = 0;
    this.generatedTilesBlocksNumber = 0;
    this.createCommonMaterials();
  }

  _createClass(TilesGenerator, [{
    key: "createCommonMaterials",
    value: function createCommonMaterials() {
      var coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
      coinMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);
      coinMaterial.emissiveColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);
      var tileMaterialLight = new BABYLON.StandardMaterial("tileMaterialLight", this.scene);
      tileMaterialLight.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileLightColor);
      var tileMaterialDark = new BABYLON.StandardMaterial("tileMaterialDark", this.scene);
      tileMaterialDark.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileDarkColor);
      var hazardMaterial = new BABYLON.StandardMaterial("hazardMaterial", this.scene);
      hazardMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.hazardColor);
      hazardMaterial.alpha = 0.6; // Freeze materials to improve performance (this material will not be modified)

      coinMaterial.freeze();
      tileMaterialLight.freeze();
      tileMaterialDark.freeze();
      hazardMaterial.freeze();
      this.level.addMaterial(coinMaterial);
      this.level.addMaterial(tileMaterialLight);
      this.level.addMaterial(tileMaterialDark);
      this.level.addMaterial(hazardMaterial);
    }
  }, {
    key: "generate",
    value: function generate() {
      var _this = this;

      // Increases the number of generated tile blocks (to add tags on objects and easily dispose them)
      this.generatedTilesBlocksNumber += 1; // Let's generate the next 20 ground tiles (or holes :D) - 200 "meters" of tiles

      for (var currentTilesNumber = 1; currentTilesNumber <= this.maxTilesAtTime; currentTilesNumber++) {
        // Increment the global level number of generated tiles
        this.generatedTilesNumber += 1; // Colliders default options (the colliders will be used to throw actions actions like: dispose old tiles, 
        // generate more tiles, etc)
        // Set visible to true to see the colliders on the scene

        var collidersDefaultOptions = {
          width: 100,
          height: 100,
          visible: false,
          disposeAfterCollision: true,
          collisionMesh: this.player.getMesh(),
          positionZ: (this.generatedTilesNumber - 1) * this.tileDepth
        }; // If is the first tile at time (skips first generation because it is not necessary), 
        // adds a collider (this collider will be used to delete the old tiles)
        // whenever the player intersects it.

        if (currentTilesNumber == 1 && this.generatedTilesNumber != 1) {
          // Copy default options
          var colliderOptions = Object.assign({}, collidersDefaultOptions);

          colliderOptions.onCollide = function () {
            _this.disposeOldTiles();
          };

          this.level.addCollider('deleteOldTilesCollider', colliderOptions);
        } // If is the tenth tile (10), we'll add a collider to generate more tile when collides with it


        if (currentTilesNumber == 10) {
          // Copy default options
          var _colliderOptions = Object.assign({}, collidersDefaultOptions);

          _colliderOptions.onCollide = function () {
            _this.generate();
          };

          this.level.addCollider('generateMoreTilesCollider', _colliderOptions);
        }

        this.createTiles();
      }
    }
  }, {
    key: "createTiles",
    value: function createTiles() {
      /**
       * We'll use this array to determine the type of ground to create. We are 
       * repeating the NORMAL_GROUND type to decrease the chances of generating
       * obstacles and holes. It is an easy way to control the chances to add obstacles
       * and holes
       */
      var tileTypes = ['NORMAL_GROUND', 'SMALL_GROUND', 'NORMAL_GROUND', 'NORMAL_GROUND', 'GROUND_WITH_TOTAL_OBSTACLE', 'HOLE', // If the tile is HOLE, we'll don't generate anything
      'NORMAL_GROUND', 'NORMAL_GROUND', 'GROUND_WITH_TOTAL_OBSTACLE', 'NORMAL_GROUND', 'GROUND_WITH_HIGH_OBSTACLE', 'HOLE', 'SMALL_GROUND'],
          tyleType = 'NORMAL_GROUND'; // If the player is starting to play (first 200 'meters'), creates normal ground tiles,
      // else, choose a tyle type randomly

      if (this.generatedTilesNumber > 20) {
        var randomTileTypeNumber = Math.floor(Math.random() * tileTypes.length);
        tyleType = tileTypes[randomTileTypeNumber];
      } // Prevents generating multiple holes or tiles with obstacles in sequence


      if (this.lastTileType != 'NORMAL_GROUND' && tyleType != 'NORMAL_GROUND') {
        tyleType = 'NORMAL_GROUND';
      }

      this.lastTileType = tyleType;

      if (tyleType == 'NORMAL_GROUND') {
        this.createNormalGroundTile();
      }

      if (tyleType == 'SMALL_GROUND') {
        this.createSmallGroundTile();
      }

      if (tyleType == 'GROUND_WITH_TOTAL_OBSTACLE') {
        this.createTileWithObstacleTile();
      }

      if (tyleType == 'GROUND_WITH_HIGH_OBSTACLE') {
        this.createTileWithHighObstacleTile();
      }
    }
  }, {
    key: "createTile",
    value: function createTile(options) {
      options = options ? options : {
        width: GAME.options.level.tileWidth,
        height: 1,
        depth: this.tileDepth
      };
      var tile = BABYLON.MeshBuilder.CreateBox("groundTile" + this.generatedTilesNumber, options, this.scene);
      BABYLON.Tags.AddTagsTo(tile, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
      tile.receiveShadows = true;
      tile.position.z = (this.generatedTilesNumber - 1) * this.tileDepth;
      tile.position.y = -0.5;
      tile.checkCollisions = true;
      tile.material = this.generatedTilesNumber % 2 == 0 ? this.level.getMaterial('tileMaterialLight') : this.level.getMaterial('tileMaterialDark');
      return tile;
    }
    /**
     * Create coins for an specific tile 
     * @param {*} tile 
     */

  }, {
    key: "createCoins",
    value: function createCoins(tile) {
      var _this2 = this;

      var randomPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var positionX = tile.position.x;

      if (randomPosition) {
        var randomPositionChooser = Math.floor(Math.random() * 100); // 0 to 100 random number

        if (randomPositionChooser <= 33) {
          positionX = -0.3333; // Positining on the left
        }

        if (randomPositionChooser >= 66) {
          positionX = 0.3333; // Positioning on the right
        }
      }

      var _loop = function _loop() {
        var coin = BABYLON.MeshBuilder.CreateBox("coin" + coinsNumber + _this2.generatedTilesNumber, {
          width: 0.1,
          height: 0.1,
          depth: 0.1
        }, _this2.scene);
        BABYLON.Tags.AddTagsTo(coin, 'tilesBlock tilesBlock' + _this2.generatedTilesBlocksNumber);
        coin.material = _this2.level.getMaterial('coinMaterial');
        coin.position.x = positionX;
        coin.position.z = tile.position.z - _this2.tileDepth / 2 + coinsNumber * 2;
        coin.position.y = 0.3;
        /**
         * If the player collides with the Coin, we'll keep the coin and then interpolate
         * the coin altitude to up
         */

        var playerMesh = _this2.player.getMesh();

        coin.executeOnIntersection(playerMesh, function () {
          _this2.player.keepCoin();

          _this2.level.interpolate(coin.position, 'y', 10, 500);
        }, true);
      };

      for (var coinsNumber = 0; coinsNumber < 5; coinsNumber++) {
        _loop();
      }
    }
  }, {
    key: "createNormalGroundTile",
    value: function createNormalGroundTile() {
      var tile = this.createTile(); // 60% chances to generate coins on the tile

      if (Math.floor(Math.random() * 100) > 40) {
        this.createCoins(tile, true);
      }
    }
  }, {
    key: "createSmallGroundTile",
    value: function createSmallGroundTile() {
      var tile = this.createTile({
        width: GAME.options.level.smallTileWidth,
        height: 1,
        depth: this.tileDepth
      }); // Choose the side to place the ground

      var randomSideChooser = Math.floor(Math.random() * 100 + 1);
      tile.position.x = randomSideChooser <= 50 ? -0.3333 : 0.3333;
      tile.position.y = -0.5; // Small tiles always have coins

      this.createCoins(tile);
    }
  }, {
    key: "createTileWithObstacleTile",
    value: function createTileWithObstacleTile() {
      var _this3 = this;

      var tile = this.createTile();
      var obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {
        width: GAME.options.level.hazardWidth,
        height: 0.05,
        depth: 8.25
      }, this.scene);
      BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
      obstacle.position.z = tile.position.z;
      obstacle.position.y = 0.0025;
      obstacle.material = this.level.getMaterial('hazardMaterial'); // Player dies when intersects this obstacle

      var playerMesh = this.player.getMesh();
      obstacle.executeOnIntersection(playerMesh, function () {
        _this3.player.damage();

        if (_this3.monster.isCloseToPlayer()) {
          _this3.monster.attackPlayer();
        } else {
          _this3.monster.approachToPlayer();
        }
      }, true);
    }
  }, {
    key: "createTileWithHighObstacleTile",
    value: function createTileWithHighObstacleTile(tileNumber) {
      var _this4 = this;

      var tile = this.createTile(tileNumber);
      var obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {
        width: 2,
        height: 2,
        depth: 0.25
      }, this.scene);
      BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
      obstacle.position.z = tile.position.z;
      obstacle.position.y = 1.5; // Tiles with high obstacle always have coins

      this.createCoins(tile, true); // Player dies when intersects this obstacle

      var playerMesh = this.player.getMesh();
      obstacle.executeOnIntersection(playerMesh, function () {
        return _this4.player.die();
      }, true);
    }
    /**
     * Disposes old tiles and obstacles (last 20 unused tiles and their obstacles)
     */

  }, {
    key: "disposeOldTiles",
    value: function disposeOldTiles() {
      var lastTilesBlock = this.generatedTilesBlocksNumber - 1,
          tilesBlocks = this.scene.getMeshesByTags('tilesBlock' + lastTilesBlock);

      for (var index = 0; index < tilesBlocks.length; index++) {
        tilesBlocks[index].dispose();
      }
    }
    /**
     * Disposes all level tiles to restart the level
     */

  }, {
    key: "disposeAll",
    value: function disposeAll() {
      var tilesBlocks = this.scene.getMeshesByTags('tilesBlock');

      for (var index = 0; index < tilesBlocks.length; index++) {
        tilesBlocks[index].dispose();
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.disposeAll();
      this.lastTileType = 'HOLE';
      this.generatedTilesNumber = 0;
    }
  }]);

  return TilesGenerator;
}();

/***/ }),

/***/ 0:
/*!**************************!*\
  !*** multi ./src/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/kingofcode/code/games/runner/src/app.js */"./src/app.js");


/***/ })

/******/ });