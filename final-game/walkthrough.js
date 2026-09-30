// Companion notes for the copyable GDScript in guide.js. Keep file names in sync.
window.finalGameWalkthrough = {
  'scripts/Game.gd': {
    flow: [
      'When the project opens, _ready loads saved achievements and top scores from user://final_save.json.',
      'Main calls start_run to reset the current attempt. Pickups and enemies then call Game methods to update coins, health, score, gear, and achievements.',
      'At the exit, finish records the chosen ending, keeps the five highest scores, and writes the persistent data back to disk.'
    ],
    symbols: {
      _ready: 'Loads achievements and leaderboard records from the save file. Coins and health begin fresh for each run.',
      start_run: 'Resets the current run without deleting achievements or previous leaderboard records.',
      next_pickup_name: 'Returns a unique name for each spawned pickup so online snapshots can identify it.',
      collect_coin: 'Adds one wallet coin, one level coin, and ten score points. Collecting 20 unlocks the coin badge.',
      buy_heal: 'Spends five wallet coins to heal a player, but only when the player is hurt and can afford it.',
      buy_gear: 'Spends eight coins on the Forest Blade and raises the player attack bonus.',
      sell_gear: 'Removes the Forest Blade, refunds four coins, and removes its attack bonus.',
      salvage_gear: 'Trades the Forest Blade plus a two-coin fee for one crafting material.',
      defeat_enemy: 'Adds score after an enemy dies. A boss defeat also opens the path to the ending.',
      unlock: 'Adds a badge only once and immediately saves persistent progress.',
      finish: 'Stores the ending choice, awards bonus score, sorts leaderboard records, and keeps the best five.',
      save_progress: 'Writes achievements and leaderboard records as JSON in Godot user storage.',
      coins: 'The spendable wallet balance. Shop actions reduce it.',
      collected: 'The total coins collected in this level. The exit requires at least 20, even after coins are spent.',
      score: 'Points earned from coins, enemies, and finishing the level.',
      boss_defeated: 'Becomes true when the boss dies; the exit checks it before showing the finale.',
      inventory: 'The gear the player currently owns, including the Forest Blade.',
      attack_bonus: 'Extra damage added to the player attack while the Forest Blade is owned.',
      achievements: 'Persistent badges loaded from and saved to user://final_save.json.',
      records: 'Persistent leaderboard entries, sorted by score and limited to five.'
    }
  },
  'scripts/GamepadBindings.gd': {
    flow: [
      'Main chooses a connected controller device number for each local player.',
      'bind_player removes only old controller events, then maps that device’s stick, D-pad, and face buttons to the player actions. Keyboard bindings remain.',
      'bind_system maps join, pause, and restart to the first controller. Main calls these methods again when a controller connects or the local player arrangement changes.'
    ],
    symbols: {
      bind_player: 'Assigns one specific controller to P1 or P2. A device value of -1 removes that player’s controller bindings.',
      bind_system: 'Maps Back, Start, and right shoulder to join, pause, and restart.',
      _clear_pad_events: 'Erases only joypad bindings from an action, preserving the keyboard keys set in Project Settings.',
      _axis: 'Creates a left-stick motion event for one direction and sets a 0.25 dead zone to ignore small drift.',
      _button: 'Adds a button event for one controller device and one action.',
      slot: 'Player number: 1 selects p1_ actions and 2 selects p2_ actions.',
      device: 'Godot’s connected controller ID. It keeps one pad from moving both players.',
      prefix: 'The p1_ or p2_ prefix used to build the action names.'
    }
  },
  'scripts/Player.gd': {
    flow: [
      'Each physics tick reads this player’s action names. Online guests supply the same movement and button presses through remote_* values.',
      'The script applies gravity, movement, jump, roll, facing, and a short attack cooldown before move_and_slide resolves collisions.',
      'After movement it chooses an animation. hurt and heal change health when hazards, enemies, or pickups call them.'
    ],
    symbols: {
      _ready: 'Adds this player to the heroes group so pickups, hazards, and enemies can find it.',
      _physics_process: 'Runs every physics frame: reads actions, moves the character, applies attacks, and updates animation.',
      hurt: 'Removes one heart unless the player is already invulnerable or defeated.',
      heal: 'Restores one heart, with a maximum of three.',
      slot: 'Chooses the p1_ or p2_ Input Map actions for this player instance.',
      remote_controlled: 'When true, the host uses input received from an online guest instead of local keys or pad.',
      remote_axis: 'Horizontal movement value sent by the online guest.',
      remote_jump: 'One pending online jump press; consumed and cleared on the next physics tick.',
      remote_roll: 'One pending online roll press; consumed and cleared on the next physics tick.',
      remote_attack: 'One pending online attack press; consumed and cleared on the next physics tick.',
      axis: 'Horizontal action value from keyboard, gamepad, or online input; it drives velocity and facing.',
      roll_time: 'Remaining time for the fast roll movement.',
      roll_cooldown: 'Delay before another roll can start.',
      attack_wait: 'Delay between sword hits; it also keeps the attack animation visible briefly.',
      facing: 'Direction of the hero and its sword hit check: -1 is left, 1 is right.',
      health: 'Current hearts. Reaching zero stops this player from acting.'
    }
  },
  'scripts/Pickup.gd': {
    flow: [
      '_ready connects the Area2D body_entered signal to the pickup handler.',
      'Only an active hero may collect it. A coin updates Game; a heart heals the hero and may unlock a badge.',
      'queue_free removes the pickup so it cannot be collected twice.'
    ],
    symbols: {
      _ready: 'Starts listening for a physics body entering the pickup area.',
      _on_body_entered: 'Checks the entering body, applies the coin or heart reward, and removes the pickup.',
      kind: 'Inspector setting that decides whether this instance is a coin or a heart.',
      body: 'The physics body that entered the area; only active heroes receive a reward.'
    }
  },
  'scripts/Hazard.gd': {
    flow: [
      'The Area2D listens for a body entering its collision shape.',
      'If the body is an active hero, it calls that hero’s hurt method. Player.gd handles the brief damage cooldown.'
    ],
    symbols: {
      _ready: 'Connects the hazard area’s body_entered signal.',
      _on_body_entered: 'Damages active heroes and ignores other bodies.',
      body: 'The body that touched the hazard.'
    }
  },
  'scripts/Spawner.gd': {
    flow: [
      'The Timer calls _spawn at its configured interval.',
      'The guard skips spawning if the scene or markers are missing, or if five bonus pickups already exist.',
      'A random marker receives a new coin or occasional heart, named so the online game can track it.'
    ],
    symbols: {
      _ready: 'Connects the Timer timeout signal to _spawn.',
      _spawn: 'Creates one bonus pickup at a random safe marker, subject to the five-item limit.',
      pickup_scene: 'The Pickup.tscn resource selected in the Inspector and instantiated for each spawn.',
      timer: 'Child Timer node that decides when to try another spawn.',
      markers: 'Safe Marker2D positions under SpawnPoints.',
      bonus: 'Container that holds timed pickups and enemy loot.',
      item: 'The new pickup instance before it is added to the level.'
    }
  },
  'scripts/Water.gd': {
    flow: [
      'The water area detects bodies entering its collision shape.',
      'A hero takes damage. The first boulder slows down and creates a Splash scene at its position.',
      'The splashed flag prevents duplicate splash effects when the boulder remains in the water.'
    ],
    symbols: {
      _ready: 'Connects the water body_entered signal.',
      _on_body_entered: 'Separates hero damage from the one-time boulder splash.',
      splash_scene: 'The splash visual scene assigned in the Inspector.',
      splashed: 'True after the first boulder splash, preventing repeated effects.',
      body: 'The hero or boulder entering the water.'
    }
  },
  'scripts/Splash.gd': {
    flow: [
      'The effect begins small and transparent.',
      'Tweens fade it in, fade it out, grow it, and then delete the temporary scene.'
    ],
    symbols: {
      _ready: 'Starts the scale and opacity tweens as soon as Splash.tscn appears.',
      fade: 'Tween that controls opacity and removes the effect when the animation ends.'
    }
  },
  'scripts/Enemy.gd': {
    flow: [
      'At startup, the enemy joins damageable and remembers its patrol center.',
      'Each physics tick it finds the nearest active hero. It chases within range, otherwise patrols between its offsets; the boss speeds up below half health.',
      'When close enough it hurts the hero with a cooldown. hit removes health; defeated normal enemies drop coins, while a boss defeat updates Game.'
    ],
    symbols: {
      _ready: 'Registers this enemy as damageable and saves its starting X position.',
      _physics_process: 'Chooses a hero or patrol direction, moves, animates, and attacks when in range.',
      hit: 'Receives damage from Player.gd. On defeat it drops loot, updates score, and removes the enemy.',
      boss: 'Inspector switch for boss detection radius, faster second phase, and boss defeat progress.',
      health_points: 'Enemy hit points. The boss phase begins at four or fewer.',
      patrol_left: 'Left patrol limit measured relative to origin_x.',
      patrol_right: 'Right patrol limit measured relative to origin_x.',
      attack_range: 'Maximum horizontal/nearby distance for hurting a hero.',
      attack_wait: 'Cooldown that stops damage on every physics frame.',
      target: 'Nearest active hero found this frame; null means continue patrolling.',
      loot_scene: 'Pickup scene used for random coin drops after a normal enemy dies.'
    }
  },
  'scripts/Main.gd': {
    flow: [
      '_ready configures the level, HUD buttons, the shop and exit, and controller assignments.',
      '_process handles pause, restart, local co-op, shop healing, and game-over checks, then refreshes the HUD.',
      'The exit requires 20 collected coins and a defeated boss. It opens the ending choice; _choose saves the result and animates the credits.'
    ],
    symbols: {
      _ready: 'Wires scene nodes, UI buttons, shop and exit signals, and initial gamepad assignments.',
      _process: 'Checks input and game state every rendered frame, including pause, co-op join, shopping, and game over.',
      _on_joy_connection_changed: 'Refreshes input assignments when a controller connects or disconnects.',
      _assign_gamepads: 'In solo, pad one controls P1. In local co-op, pad one controls P2 and pad two can control P1.',
      _update_hud: 'Writes coins, score, health, badges, leaderboard, boss state, and room code to UI labels.',
      _shop_player: 'Finds an active hero currently overlapping the shop area.',
      _trade: 'Routes buy, sell, and salvage buttons to Game, or sends the request to the host for an online guest.',
      _on_exit: 'Allows the finale only after 20 coins were collected and the boss was defeated.',
      _show_result: 'Displays the finale panel and shows or hides the ending choice buttons.',
      _choose: 'Commits Keep or Return to Game and animates the result and credits.',
      _volume_changed: 'Turns the slider value into a decibel level on Godot’s main audio bus.',
      _restart: 'Unpauses and reloads the level scene for a fresh run.',
      GamepadBindings: 'The helper script that connects specific controller devices to P1 and P2 Input Map actions.',
      p1: 'Reference to the Player1 scene instance.',
      p2: 'Reference to Player2; activated for local co-op or an online guest.',
      online: 'The Online node that hosts, joins, and relays multiplayer state.',
      finished: 'Prevents game-over and exit logic from running again after the finale starts.',
      local_coop: 'True only when P2 is active on this device, so pads are assigned to separate local players.',
      p1_pad: 'Remembered controller ID for P1. It avoids rebinding the Input Map on every frame.',
      p2_pad: 'Remembered controller ID for P2.',
      system_pad: 'Remembered controller ID used for join, pause, and restart.'
    }
  },
  'scripts/Online.gd (placeholder; replace in Section 8)': {
    flow: [
      'Main needs host_room, join_room, is_client, and code before the networking section exists.',
      'These placeholder methods do nothing yet. Replace the entire file with the full Online.gd in Section 8.'
    ],
    symbols: {
      host_room: 'Placeholder called by the Host button. The real implementation connects to the relay in Section 8.',
      join_room: 'Placeholder called by the Join button. The real implementation sends a room code in Section 8.',
      is_client: 'False until the complete networking script joins another host.',
      code: 'Room code shown in the HUD after a host or guest joins.'
    }
  },
  'scripts/Online.gd': {
    flow: [
      'Host and Join open a WebSocket to the relay and send the room request after the connection opens.',
      'The guest sends movement and button presses; the host is authoritative for collisions, rewards, enemies, and story state, and sends snapshots about every 0.05 seconds.',
      'The guest applies snapshots to players and world objects. Missing pickups are removed, new bonus items appear, and the host ending is shown on both copies.'
    ],
    symbols: {
      host_room: 'Begins a relay connection as the room host.',
      join_room: 'Begins a relay connection using the typed room code.',
      _connect: 'Creates a fresh WebSocket and remembers whether this copy is hosting or joining.',
      _process: 'Polls incoming packets, sends guest input every frame, and sends host snapshots at a fixed interval.',
      _send: 'Serializes a message as JSON and sends it through the WebSocket.',
      send_trade: 'Forwards a guest shop button press to the host.',
      _player: 'Packs one hero’s position, health, and active state into a snapshot.',
      _remaining: 'Lists surviving child names so the guest can remove collected pickups.',
      _actor: 'Packs one enemy or boss position and health into a snapshot.',
      _actors: 'Packs all enemies under one scene node by name.',
      _bonus: 'Packs timed pickup names, positions, and kinds for the guest.',
      _receive: 'Routes joined, peer, input, trade, and state messages to the right host or guest behavior.',
      _apply_state: 'Copies the host snapshot into the guest’s players, HUD state, pickups, enemies, boulder, splash, and finale.',
      _remove_missing: 'Deletes guest pickups that are absent from the host’s surviving-name list.',
      _sync_bonus: 'Creates or updates timed pickups to match the host snapshot.',
      _sync_actors: 'Updates a whole enemy container from the host snapshot.',
      _sync_actor: 'Updates one enemy or boss position and health from a snapshot.',
      relay_url: 'WebSocket address of this site’s multiplayer relay. Cloud workspaces need a public reachable address.',
      socket: 'WebSocketPeer that carries room requests, input, trades, and snapshots.',
      code: 'Six-character room code shared with the other player.',
      is_client: 'True on the guest copy; its local physics is disabled in favor of host snapshots.',
      is_host: 'True on the authoritative copy that runs collisions and rewards.',
      pending: 'Host or join request waiting for the WebSocket to open.',
      tick: 'Time accumulated until the host sends the next world snapshot.',
      level: 'Reference to Main, used to read or update players and world nodes.'
    }
  }
};

window.finalGameCommonSymbols = {
  Game: 'The Game.gd autoload: one shared place for coins, score, inventory, achievements, and saved records.',
  Input: 'Godot singleton that reports current keyboard and controller action states.',
  InputMap: 'Godot singleton that stores the keys and controller events assigned to each action.',
  WebSocketPeer: 'Godot object that opens and polls the online room connection.',
  JSON: 'Godot helper for converting game data to and from JSON text.',
  delta: 'Elapsed time since the previous frame. Multiplying motion by delta keeps behavior steady at different frame rates.',
  body: 'The physics body that entered an Area2D collision shape.',
  queue_free: 'Godot schedules this node for deletion after the current frame.',
  connect: 'Connects a signal to the function that should run when that event occurs.',
  instantiate: 'Creates a new scene instance from a PackedScene resource.',
  add_child: 'Places a node inside the running scene tree.',
  get_tree: 'Returns the current SceneTree so code can find groups, the current scene, or pause state.',
  get_nodes_in_group: 'Finds all nodes registered under a named group such as heroes or damageable.',
  is_in_group: 'Checks whether a node belongs to a named gameplay group.',
  move_and_slide: 'Moves a CharacterBody2D and resolves collisions using its velocity.',
  is_on_floor: 'Checks whether the body touched a floor during its previous collision move.',
  global_position: 'Position in the whole level, used when placing effects or comparing two actors.',
  velocity: 'Movement speed used by CharacterBody2D before move_and_slide runs.',
  create_tween: 'Creates a timed animation for a property such as opacity, scale, or position.',
  get_axis: 'Combines negative and positive Input Map actions into one horizontal value.',
  is_action_just_pressed: 'True only on the frame an input action begins, which prevents a held button from repeatedly firing.',
  get_connected_joypads: 'Returns device IDs for controllers visible to this Godot process.',
  action_add_event: 'Adds a key, button, or stick event to a named Input Map action.',
  action_erase_event: 'Removes an old event from an Input Map action.',
  poll: 'Processes new WebSocket packets and connection changes.',
  send_text: 'Sends a UTF-8 text message through the WebSocket.'
};
