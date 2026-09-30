// Each pair points to a statement in guide.js and explains its effect in execution order.
// Keep the snippets in sync with the copyable GDScript examples.
window.finalGameFunctionDetails = {
  'scripts/Game.gd': {
    _ready: [
      ['FileAccess.file_exists("user://final_save.json")', 'Check whether this player has a save file before trying to read it. A first-time player simply keeps the empty defaults.'],
      ['JSON.parse_string(FileAccess.get_file_as_string("user://final_save.json"))', 'Read the file as text and turn its JSON into Godot data.'],
      ['if data is Dictionary:', 'Only accept the expected object shape; then restore badges and leaderboard records.']
    ],
    start_run: [
      ['coins = 0', 'Reset spendable coins for this attempt.'],
      ['collected = 0', 'Reset the separate lifetime coin count used by the exit, so buying gear cannot lower it.'],
      ['inventory.clear()', 'Remove equipment from the previous attempt; the remaining assignments reset combat and level state.']
    ],
    next_pickup_name: [
      ['spawn_index += 1', 'Advance a counter every time a bonus pickup is created.'],
      ['return "Bonus_%d" % spawn_index', 'Build a distinct node name so online snapshots can match this pickup on both machines.']
    ],
    collect_coin: [
      ['coins += 1', 'Add currency that the shop may spend.'],
      ['collected += 1', 'Track total coins found, independently of the wallet balance.'],
      ['score += 10', 'Award points for the pickup.'],
      ['if collected >= 20:', 'Unlock the collector badge once the level goal is met. unlock() prevents duplicates.']
    ],
    buy_heal: [
      ['if coins < 5 or player.health >= 3:', 'Reject the purchase if it is unaffordable or the hero already has full health.'],
      ['coins -= 5', 'Charge the wallet only after the guard passes.'],
      ['player.heal()', 'Restore a heart through Player.gd, then award the first-purchase badge and return true.']
    ],
    buy_gear: [
      ['if coins < 8 or inventory.has("Forest Blade"):', 'Prevent a purchase without enough coins or a duplicate blade.'],
      ['inventory.append("Forest Blade")', 'Record ownership after charging eight coins.'],
      ['attack_bonus = 1', 'Make Player.gd deal one extra damage per successful sword hit; unlock the purchase badge.']
    ],
    sell_gear: [
      ['if not inventory.has("Forest Blade"):', 'Leave state alone and return false when there is no blade to sell.'],
      ['inventory.erase("Forest Blade")', 'Remove the owned blade, then refund four coins.'],
      ['attack_bonus = 0', 'Remove its combat bonus before reporting success.']
    ],
    salvage_gear: [
      ['if coins < 2 or not inventory.has("Forest Blade"):', 'Salvaging requires both the blade and the two-coin fee.'],
      ['materials += 1', 'After paying the fee and removing the blade, add one crafting material.'],
      ['attack_bonus = 0', 'Remove the blade damage and award the first-salvage badge.']
    ],
    defeat_enemy: [
      ['score += 100 if is_boss else 20', 'A boss is worth 100 points; a normal enemy is worth 20.'],
      ['if is_boss:', 'Only a boss defeat sets the completion flag and unlocks the boss badge.']
    ],
    unlock: [
      ['if achievements.has(id):', 'Return early if the badge was already earned, including in an earlier run.'],
      ['achievements[id] = true', 'Store the badge under its ID.'],
      ['save_progress()', 'Write it immediately so a restart does not erase the achievement.']
    ],
    finish: [
      ['ending = choice', 'Remember which ending the player selected and add the completion score bonus.'],
      ['records.append({"score": score, "ending": choice})', 'Add this run to the leaderboard with its score and ending.'],
      ['records.sort_custom(func(a, b): return a["score"] > b["score"])', 'Sort records from highest to lowest score.'],
      ['records = records.slice(0, 5)', 'Keep only the best five, then save them to disk.']
    ],
    save_progress: [
      ['FileAccess.open("user://final_save.json", FileAccess.WRITE)', 'Open the Godot user save file for writing.'],
      ['if file:', 'Continue only if the file opened successfully.'],
      ['file.store_string(JSON.stringify({"achievements": achievements, "records": records}))', 'Convert the persistent data to JSON and store it for the next session.']
    ]
  },
  'scripts/GamepadBindings.gd': {
    bind_player: [
      ['var prefix := "p1_" if slot == 1 else "p2_"', 'Choose the action names for the requested player.'],
      ['_clear_pad_events(prefix + suffix)', 'Remove that player’s old pad bindings before assigning a new device; keyboard bindings stay.'],
      ['if device < 0:', 'A negative device means no controller, so stop after clearing old pad events.'],
      ['_axis(prefix + "left", device, -1.0)', 'Map both stick directions, then the D-pad and face buttons to this device only.']
    ],
    bind_system: [
      ['_clear_pad_events(action)', 'Clear old controller assignments for co-op, pause, and restart.'],
      ['if device < 0:', 'Stop when no system controller is connected.'],
      ['_button("pause", device, JOY_BUTTON_START)', 'Bind Start to pause, alongside Back for join and right shoulder for restart.']
    ],
    _clear_pad_events: [
      ['if not InputMap.has_action(action):', 'Create the action if it does not exist, with a small dead zone.'],
      ['if event is InputEventJoypadButton or event is InputEventJoypadMotion:', 'Select only controller events, leaving keyboard events untouched.'],
      ['InputMap.action_erase_event(action, event)', 'Remove each selected event so rebinding will not duplicate it.']
    ],
    _axis: [
      ['InputEventJoypadMotion.new()', 'Create a stick-motion binding.'],
      ['event.axis_value = direction', 'Use -1 for left and +1 for right on the left stick’s X axis.'],
      ['InputMap.action_set_deadzone(action, 0.25)', 'Ignore small accidental stick movement, then add the event to the action.']
    ],
    _button: [
      ['InputEventJoypadButton.new()', 'Create a controller button binding.'],
      ['event.device = device', 'Limit it to the assigned physical controller.'],
      ['InputMap.action_add_event(action, event)', 'Attach the chosen button to the named game action.']
    ]
  },
  'scripts/Player.gd': {
    _ready: [
      ['add_to_group("heroes")', 'Register this node as a hero so pickups, hazards, and enemies can discover it.']
    ],
    _physics_process: [
      ['if not active or health <= 0:', 'Stop movement and attacks for a hidden or defeated hero.'],
      ['attack_wait = maxf(0.0, attack_wait - delta)', 'Count down attack, roll, and damage cooldowns in seconds without going below zero.'],
      ['var axis = remote_axis if remote_controlled else Input.get_axis(prefix + "left", prefix + "right")', 'Use host-received movement for an online guest; otherwise read this player’s keyboard or pad actions.'],
      ['remote_jump = false', 'Consume one-frame remote button presses so holding an old packet cannot repeat an action.'],
      ['velocity.y += 1100.0 * delta if not is_on_floor() else 0.0', 'Apply gravity while airborne; delta makes the change proportional to the physics step.'],
      ['if roll_now and roll_cooldown <= 0.0 and is_on_floor():', 'Start a short fast roll only when grounded and its cooldown has ended.'],
      ['velocity.x = facing * speed * 1.65 if roll_time > 0.0 else axis * speed', 'Roll in the facing direction at extra speed, or move at normal speed from the input axis.'],
      ['if jump_now and is_on_floor():', 'Set upward velocity only when the hero is standing on a floor.'],
      ['if attack_now and attack_wait <= 0.0:', 'Begin a sword swing only after the previous attack has cooled down.'],
      ['if absf(gap.x) < 75.0 and absf(gap.y) < 55.0 and gap.x * facing > -10.0:', 'Hit targets inside the nearby attack box and mostly in front of the hero; blade gear adds damage.'],
      ['move_and_slide()', 'Move the CharacterBody2D and let Godot resolve collisions.'],
      ['sprite.play(animation)', 'Choose the available jump, run, idle, roll, or attack frames after movement.']
    ],
    hurt: [
      ['if hurt_wait > 0.0 or health <= 0:', 'Ignore repeated hits during the brief invulnerability period or after defeat.'],
      ['health -= 1', 'Remove one heart.'],
      ['hurt_wait = 1.0', 'Start a one-second delay before another hit can land.']
    ],
    heal: [
      ['health = mini(3, health + 1)', 'Add one heart but cap health at three.']
    ]
  },
  'scripts/Pickup.gd': {
    _ready: [['body_entered.connect(_on_body_entered)', 'Call the pickup handler when a physics body enters this Area2D.']],
    _on_body_entered: [
      ['if not body.is_in_group("heroes") or not body.active:', 'Ignore enemies, scenery, and inactive heroes.'],
      ['Game.collect_coin()', 'A coin updates the shared wallet, level count, and score.'],
      ['if body.health < 3:', 'Award the healing badge only when the heart can restore missing health.'],
      ['body.heal()', 'Ask Player.gd to apply its health cap.'],
      ['queue_free()', 'Remove this pickup after handling it so it cannot be collected twice.']
    ]
  },
  'scripts/Hazard.gd': {
    _ready: [['body_entered.connect(_on_body_entered)', 'Listen for a collision body entering the hazard.']],
    _on_body_entered: [
      ['if body.is_in_group("heroes") and body.active:', 'Only a currently active player can take hazard damage.'],
      ['body.hurt()', 'Delegate heart loss and damage cooldown to Player.gd.']
    ]
  },
  'scripts/Spawner.gd': {
    _ready: [['timer.timeout.connect(_spawn)', 'Run _spawn each time the child Timer reaches its configured interval.']],
    _spawn: [
      ['if pickup_scene == null or markers.is_empty() or bonus.get_child_count() >= 5:', 'Skip this timer tick if the scene or safe spawn points are missing, or five bonus items exist.'],
      ['var marker = markers.pick_random()', 'Choose one of the safe Marker2D positions.'],
      ['var item = pickup_scene.instantiate()', 'Create a new instance of Pickup.tscn.'],
      ['item.kind = "heart" if randi_range(0, 3) == 0 else "coin"', 'Give roughly one in four spawned pickups a heart; the others are coins.'],
      ['item.global_position = marker.global_position', 'Place the new item at the chosen marker after adding it to the level.']
    ]
  },
  'scripts/Water.gd': {
    _ready: [['body_entered.connect(_on_body_entered)', 'Run the handler whenever something enters the water area.']],
    _on_body_entered: [
      ['if body.is_in_group("heroes"):', 'Damage a hero through its hurt() method.'],
      ['elif body.is_in_group("boulders") and not splashed:', 'Process the first boulder impact once.'],
      ['body.linear_damp = 8.0', 'Increase drag so the boulder slows visibly in the water.'],
      ['if splash_scene:', 'Instantiate the assigned splash effect, add it to the scene, and place it at the boulder.']
    ]
  },
  'scripts/Splash.gd': {
    _ready: [
      ['scale = Vector2(0.5, 0.5)', 'Start the effect at half size.'],
      ['modulate.a = 0.0', 'Make it invisible before the animation begins.'],
      ['fade.tween_property(self, "modulate:a", 1.0, 0.15)', 'Fade in quickly, then fade out over the next 0.6 seconds.'],
      ['fade.tween_callback(queue_free)', 'Delete the temporary effect when fading ends. A second tween grows its scale.']
    ]
  },
  'scripts/Enemy.gd': {
    _ready: [
      ['add_to_group("damageable")', 'Make the enemy visible to Player.gd sword attacks.'],
      ['origin_x = global_position.x', 'Remember its spawn position as the center of its patrol range.']
    ],
    _physics_process: [
      ['attack_wait = maxf(0.0, attack_wait - delta)', 'Count down the time until this enemy can damage a hero again.'],
      ['var closest := 320.0 if boss else 190.0', 'Set a larger detection radius for the boss.'],
      ['if not hero.active or hero.health <= 0:', 'Ignore hidden or defeated heroes while searching for the nearest target.'],
      ['if distance < closest:', 'Keep the nearest eligible hero within detection range.'],
      ['elif global_position.x < origin_x + patrol_left:', 'When there is no target, turn around at the left or right patrol limit.'],
      ['var phase_speed = speed * (1.5 if boss and health_points <= 4 else 1.0)', 'Make the boss 50% faster once its health falls to four or fewer.'],
      ['move_and_slide()', 'Move with collision handling, then flip and play the run animation.'],
      ['if target and closest < attack_range and attack_wait <= 0.0:', 'Damage a nearby hero only when the attack cooldown has expired.']
    ],
    hit: [
      ['health_points -= amount', 'Subtract the damage received from the player attack.'],
      ['if health_points <= 0:', 'Only run loot and defeat logic when health reaches zero.'],
      ['if not boss and loot_scene:', 'Regular enemies may scatter one to three coin pickups; bosses skip loot.'],
      ['Game.defeat_enemy(boss)', 'Add the appropriate score and unlock boss progress if this was the boss.'],
      ['queue_free()', 'Remove the defeated enemy from the scene.']
    ]
  },
  'scripts/Main.gd': {
    _ready: [
      ['process_mode = Node.PROCESS_MODE_ALWAYS', 'Keep Main and the UI responsive while the scene tree is paused.'],
      ['Game.start_run()', 'Reset attempt-only coins, score, equipment, and boss state.'],
      ['p2.active = false', 'Hide player two until a local player joins or an online guest connects.'],
      ['_assign_gamepads()', 'Bind the currently connected controllers to the right players.'],
      ['exit_area.body_entered.connect(_on_exit)', 'Connect the exit trigger; later lines wire the volume, ending, room, and shop controls.']
    ],
    _process: [
      ['_assign_gamepads()', 'Refresh bindings if the active player arrangement changes.'],
      ['if Input.is_action_just_pressed("pause"):', 'Toggle the paused state on a new pause press.'],
      ['if online.is_client:', 'A guest displays snapshots but leaves authoritative shop and death decisions to the host.'],
      ['if Input.is_action_just_pressed("toggle_coop") and not p2.active:', 'Show local player two when the join action is pressed.'],
      ['$UI/HUD/ShopPanel.visible = _shop_player() != null', 'Show shop controls while an active hero overlaps the shop.'],
      ['if p1.health <= 0 and (not p2.active or p2.health <= 0):', 'End the run only when no participating hero remains alive.'],
      ['_update_hud()', 'Refresh labels at the end of the frame.']
    ],
    _on_joy_connection_changed: [['_assign_gamepads()', 'Recompute player bindings after Godot reports a controller connection change.']],
    _assign_gamepads: [
      ['var pads := Input.get_connected_joypads()', 'Read the connected controller IDs in their current order.'],
      ['var local_coop := p2.active and not p2.remote_controlled and not online.is_client', 'Treat P2 as local only when it is active and not driven by an online guest.'],
      ['var next_p1 := second if local_coop else first', 'In solo, P1 gets the first pad; in local co-op, P1 gets the second pad or keyboard.'],
      ['var next_p2 := first if local_coop else -1', 'Give the first pad to local P2, or remove its pad binding otherwise.'],
      ['if next_p1 != p1_pad:', 'Rebind only when a device assignment changed, avoiding repeated Input Map edits.']
    ],
    _update_hud: [
      ['$UI/HUD/Stats.text =', 'Show progress, wallet, score, materials, gear, and each active player’s health.'],
      ['$UI/HUD/Hint.text =', 'Show controls plus current boss and room status.'],
      ['for record in Game.records:', 'Format each saved leaderboard entry, then join them into the Top runs label.']
    ],
    _shop_player: [
      ['for body in shop.get_overlapping_bodies():', 'Inspect every body currently touching the shop area.'],
      ['if body.is_in_group("heroes") and body.active:', 'Return the first active hero; return null if no eligible hero is there.']
    ],
    _trade: [
      ['if online.is_client:', 'A guest sends the request to the host instead of changing shared inventory locally.'],
      ['if player == null:', 'For a local button press, find the hero standing in the shop.'],
      ['if player == null or not shop.get_overlapping_bodies().has(player):', 'Reject purchases from outside the shop, including remote requests.'],
      ['match action:', 'Call the matching buy, sell, or salvage method in Game.gd.'],
      ['$UI/HUD/Story.text =', 'Show whether the trade succeeded and the resulting gear and material count.']
    ],
    _on_exit: [
      ['if finished or not body.is_in_group("heroes") or not body.active:', 'Ignore repeat entry, nonheroes, and inactive players.'],
      ['if Game.collected < 20 or not Game.boss_defeated:', 'Keep the exit locked until both the coin goal and boss defeat are complete.'],
      ['finished = true', 'Stop gameplay and deactivate both heroes.'],
      ['_show_result("You found the relic. Keep it or return it?", true)', 'Open the final choice panel.']
    ],
    _show_result: [
      ['finale.show()', 'Display the finale layer.'],
      ['$UI/Finale/Result.text = message', 'Set the supplied ending or game-over message.'],
      ['$UI/Finale/KeepButton.visible = choices', 'Show both choice buttons only when the player may choose an ending; clear old credits.']
    ],
    _choose: [
      ['Game.finish(choice)', 'Record the selected ending, award points, and save the leaderboard.'],
      ['$UI/Finale/KeepButton.hide()', 'Remove the choice buttons once a decision is made.'],
      ['create_tween().tween_property(result_label, "modulate:a", 1.0, 1.0)', 'Fade the result text into view over one second.'],
      ['create_tween().tween_property(roll, "position:y", -220.0, 9.0)', 'Scroll the credits upward over nine seconds.']
    ],
    _volume_changed: [
      ['maxf(value, 0.001)', 'Keep the slider value above zero so the logarithmic conversion stays valid.'],
      ['AudioServer.set_bus_volume_db(0, linear_to_db(maxf(value, 0.001)))', 'Convert the slider’s linear value to decibels for the master audio bus.']
    ],
    _restart: [
      ['get_tree().paused = false', 'Resume the tree first, even if restart was pressed on a paused screen.'],
      ['get_tree().reload_current_scene()', 'Reopen Main; its _ready method starts a fresh attempt.']
    ]
  },
  'scripts/Online.gd (placeholder; replace in Section 8)': {
    host_room: [['pass', 'This temporary method does nothing. Replace the placeholder script in Section 8 to open a room.']],
    join_room: [['pass', 'This temporary method does nothing. The full script validates a room code and connects to the relay.']]
  },
  'scripts/Online.gd': {
    host_room: [['_connect("host", "")', 'Start a fresh relay connection with the host role and no existing room code.']],
    join_room: [['room_code.strip_edges().to_upper()', 'Trim spaces and normalize the typed code before joining.'], ['_connect("join", room_code.strip_edges().to_upper())', 'Open a relay connection that requests the normalized room code.']],
    _connect: [
      ['if socket.get_ready_state() == WebSocketPeer.STATE_OPEN:', 'Close a previous live connection before starting another room.'],
      ['socket = WebSocketPeer.new()', 'Create a clean socket and remember the requested role and room code.'],
      ['socket.connect_to_url(relay_url)', 'Begin connecting to the configured multiplayer relay.']
    ],
    _process: [
      ['socket.poll()', 'Process connection changes and incoming network packets each frame.'],
      ['if socket.get_ready_state() != WebSocketPeer.STATE_OPEN:', 'Wait until the connection is open before sending messages.'],
      ['if not sent:', 'Send the host or join request once, then mark it as sent.'],
      ['while socket.get_available_packet_count() > 0:', 'Decode and route every waiting relay message.'],
      ['if is_client:', 'The guest sends its current movement and fresh button presses to the host.'],
      ['if tick < 0.05:', 'Wait until roughly 50 ms have accumulated between host snapshots.'],
      ['if is_host:', 'Send the host’s player, world, shop, score, and ending state to the guest.']
    ],
    _send: [['JSON.stringify(data)', 'Encode the message dictionary as JSON text.'], ['socket.send_text(JSON.stringify(data))', 'Transmit the encoded message over the open WebSocket.']],
    send_trade: [['if is_client:', 'Only a guest forwards a shop request.'], ['_send({"type": "trade", "action": action})', 'Send the requested buy, sell, or salvage action for host validation.']],
    _player: [['hero.global_position.x', 'Capture the hero’s world position.'], ['"health": hero.health, "active": hero.active', 'Include hearts and active state so the guest can display the same hero.']],
    _remaining: [['for child in level.get_node(parent_name).get_children():', 'Walk the host’s pickup container.'], ['names.append(child.name)', 'Send surviving node names; the guest removes any pickup absent from this list.']],
    _actor: [['if not is_instance_valid(actor):', 'Represent a removed or missing boss as an empty dictionary.'], ['"hp": actor.health_points', 'Otherwise send position and health for guest display.']],
    _actors: [['for actor in level.get_node(parent_name).get_children():', 'Visit each enemy under the requested container.'], ['result[actor.name] = _actor(actor)', 'Index snapshots by stable node name so the guest can update the matching enemy.']],
    _bonus: [['for item in level.get_node("BonusPickups").get_children():', 'Visit timed pickups and enemy drops.'], ['result[item.name] = {"x": item.global_position.x,', 'Send each item’s name, position, and kind so the guest can create or move it.']],
    _receive: [
      ['match message.get("type", ""):', 'Route each relay packet by its type.'],
      ['"joined":', 'Store the room code and role; a guest then disables local physics, spawning, and collision triggers so the host stays authoritative.'],
      ['"peer_joined":', 'Activate host P2 and mark it as controlled by remote input.'],
      ['"peer_left":', 'Clear host P2 input and hide it, or show the guest a host-disconnected result.'],
      ['"input":', 'On the host, clamp the guest movement axis and queue button presses until Player.gd consumes them.'],
      ['"trade":', 'On the host, pass the guest shop request to Main._trade for overlap validation.'],
      ['"state":', 'On the guest, apply the host snapshot to the visible world.']
    ],
    _apply_state: [
      ['for key in ["p1", "p2"]:', 'Copy both heroes’ position, hearts, and active visibility from the host.'],
      ['Game.coins = int(state.get("coins", 0))', 'Update the shared wallet and other score, gear, and completion values from the snapshot.'],
      ['var boulder_data = state.get("boulder", {})', 'Move the guest boulder to the host position.'],
      ['if bool(state.get("water_splashed", false)) and not last_splash:', 'Play the splash once when the host first reports it.'],
      ['_remove_missing("Pickups", state.get("pickups", []))', 'Remove collected fixed pickups, then sync bonus pickups, enemies, and boss.'],
      ['if Game.ending != "" and Game.ending != last_ending:', 'Show the host’s chosen ending once; otherwise show a waiting message when the host reaches the finale.']
    ],
    _remove_missing: [['for child in level.get_node(parent_name).get_children():', 'Compare local pickup nodes with the host’s surviving-name list.'], ['if not names.has(child.name):', 'Delete any pickup already collected on the host.']],
    _sync_bonus: [
      ['if not items.has(child.name):', 'Remove bonus items that no longer exist on the host.'],
      ['if item == null:', 'Instantiate and name a new pickup when the host created one.'],
      ['item.monitoring = false', 'Keep guest-side collision collection disabled.'],
      ['item.kind = str(data.get("kind", "coin"))', 'Copy the item type and position from the host snapshot.']
    ],
    _sync_actors: [['for actor in level.get_node(parent_name).get_children():', 'Visit each local enemy.'], ['_sync_actor(actor, actors.get(actor.name, {}))', 'Update it from the matching host record or remove it if absent.']],
    _sync_actor: [
      ['if not is_instance_valid(actor):', 'Skip an actor node that has already been freed.'],
      ['if data.is_empty():', 'Remove an enemy or boss absent from the host snapshot.'],
      ['actor.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))', 'Copy the host position.'],
      ['actor.health_points = int(data.get("hp", 1))', 'Copy the host health for the next visible frame.']
    ]
  }
};
