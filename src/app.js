// Base Logic
require('./base/Log.js');
require('./base/UI.js');
require('./base/Level.js');
require('./base/AssetsDatabase.js');

// Game Logic
require('./game/Player.js');
require('./game/Monster.js');

// Game Levels
require('./game/levels/HomeMenuLevel.js');
require('./game/levels/CreditsLevel.js');
require('./game/levels/generators/TilesGenerator.js');
require('./game/levels/RunnerLevel.js');

// The Game main class
require('./Game.js');