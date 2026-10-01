// These are teaching examples. The shared starter ZIP stays a blank project so
// students create every scene and script themselves in the Godot editor.
window.finalGameGuide = [
  {
    id: 'plan', title: '1. Plan one playable journey', modules: '4 Storyline · 8 Game loop',
    summary: 'Make a forest rescue level. The hero collects 20 coins, crosses a hazard, visits a healing shop, defeats two enemy types and a boss, then chooses what to do with the relic.',
    steps: [
      'In the FileSystem panel, create folders scenes, scripts, and assets/my-game. Put your own hero, boss, tiles, props, pickups, and UI PNGs in assets/my-game. The lesson art under assets/ is a reference library.',
      'Rename the welcome scene to Main.tscn or create a new 2D scene named Main. Set it as the main scene with Project → Project Settings → Application → Run.',
      'Sketch a left-to-right level: safe start → coins and hazard → shop → two enemy encounters → boss arena → exit. Keep one map for every play mode.'
    ],
    check: 'Press F6 on Main. The welcome text is gone; the new scene opens. The Debugger shows no script errors.'
  },
  {
    id:'world', title:'2. Assemble art, parallax, and collision', modules:'1 Character · 2 Assets · 3 Boss art · 5 Parallax and tiles · 11 Physics',
    summary:'Build the whole level before coding encounters. Use the art you created in earlier modules, with the starter library where it helps.',
    steps:[
      'In Main, add Backdrop (Parallax2D with Sprite2D children), Terrain (TileMapLayer), Pickups and BonusPickups (Node2D), SpawnPoints (Node2D with Marker2D children), Spawner (Node with Timer), Water (Area2D), Boulder (RigidBody2D), Enemies (Node2D), Boss (an Enemy scene instance), Player1 and Player2 (Player scene instances), Shop and Exit (Area2D), and UI (CanvasLayer).',
      'For Terrain, create a TileSet from your tile sheet. Paint platforms and the floor, then add collision polygons to solid tiles in the TileSet editor. Put Backdrop behind Terrain and set its repeat size/motion scale for depth.',
      'Create scenes/Player.tscn: CharacterBody2D → AnimatedSprite2D, CollisionShape2D, Camera2D. Slice your hero sheet in SpriteFrames; name at least idle, run, jump, attack, and roll if your sheet has it. Make Camera2D current only on Player1.',
      'Create scenes/Enemy.tscn: CharacterBody2D → AnimatedSprite2D, CollisionShape2D. Duplicate instances for two normal enemy types and the boss; assign their own SpriteFrames and collision shapes.',
      'Create scenes/Pickup.tscn: Area2D → Sprite2D, CollisionShape2D. Duplicate it 20 times for coins, then add a few hearts. Create a separate Area2D with CollisionShape2D for each hazard, the Shop, and Exit.',
      'Use the Module 11 pool, boulder, and splash art if it fits your theme. Water gets a pool Sprite2D and CollisionShape2D; Boulder uses Sprite2D and CollisionShape2D. Put Boulder above Water so gravity produces a visible splash.',
      'Place Player1 at the safe start, Player2 beside them, Shop before the boss, Exit after the boss. Set the boss instance Inspector property boss to On after attaching Enemy.gd in Section 5.'
    ],
    tree:`Main (Node2D) [Main.gd]
├─ Backdrop (Parallax2D)
├─ Terrain (TileMapLayer)
├─ Pickups (Node2D) → 20+ Pickup.tscn instances
├─ BonusPickups (Node2D) → timed spawns and enemy drops
├─ SpawnPoints (Node2D) → safe Marker2D positions
├─ Spawner (Node) [Spawner.gd] → Timer
├─ Hazards (Node2D) → Hazard.tscn instances
├─ Water (Area2D) [Water.gd] → Sprite2D, CollisionShape2D
├─ Boulder (RigidBody2D) → Sprite2D, CollisionShape2D
├─ Enemies (Node2D) → Enemy.tscn instances
├─ Boss (Enemy.tscn instance; boss = On)
├─ Player1 (Player.tscn; slot = 1)
├─ Player2 (Player.tscn; slot = 2)
├─ Shop (Area2D) → CollisionShape2D
├─ Exit (Area2D) → CollisionShape2D
├─ Online (Node) [Online.gd]
└─ UI (CanvasLayer) → HUD (Control), Finale (Control)`,
    check:'Press F6. The level, hero, tiles, shop, boss, and exit are visible. The hero stands on the floor instead of falling through it.'
  },
  {
    id:'player', title:'3. Add controls and player movement', modules:'1 Character · 9 Controls · 10 Settings · 11 Physics',
    summary:'Map keyboard actions, then let GDScript assign connected gamepads to the right player. Both input methods use the same player script.',
    steps:[
      'Open Project → Project Settings → Input Map. Add p1_left, p1_right, p1_jump, p1_roll, p1_attack, p1_interact, the same six p2_ actions, plus toggle_coop, pause, and restart.',
      'Bind P1 to A/D, Space, K, J, E. Bind P2 to Left/Right, Up, Down, Right Shift, Return. Bind toggle_coop to C, pause to Escape, and restart to R. Keep these keyboard events; GamepadBindings.gd adds controller events at run time.',
      'Build scripts/Player.gd and scripts/GamepadBindings.gd one task at a time below. Attach Player.gd to Player.tscn. In Main set Player1 slot=1 and Player2 slot=2. Adjust CollisionShape2D to the hero silhouette; keep the feet near the bottom of the shape.',
      'Once Main.gd is attached in Section 6, the first connected pad controls P1 in solo play. In local co-op, it controls P2 while P1 uses the keyboard or a second pad. The script maps left stick/D-pad, A jump, B roll, X attack, Y interact, Back to join P2, Start to pause, and right shoulder to restart.',
      'The cloud editor runs on a remote Linux desktop. Test a physical pad only if that desktop forwards it to Godot; if Input.get_connected_joypads() is empty, run a downloaded project locally for the controller check. For online play later, the host uses remote_axis, remote_jump, remote_roll, and remote_attack for Player2.'
    ],
    files:[{name:'scripts/GamepadBindings.gd',code:`extends RefCounted

static func bind_player(slot: int, device: int) -> void:
    var prefix := "p1_" if slot == 1 else "p2_"
    for suffix in ["left", "right", "jump", "roll", "attack", "interact"]:
        _clear_pad_events(prefix + suffix)
    if device < 0:
        return
    _axis(prefix + "left", device, -1.0)
    _axis(prefix + "right", device, 1.0)
    _button(prefix + "left", device, JOY_BUTTON_DPAD_LEFT)
    _button(prefix + "right", device, JOY_BUTTON_DPAD_RIGHT)
    _button(prefix + "jump", device, JOY_BUTTON_A)
    _button(prefix + "roll", device, JOY_BUTTON_B)
    _button(prefix + "attack", device, JOY_BUTTON_X)
    _button(prefix + "interact", device, JOY_BUTTON_Y)

static func bind_system(device: int) -> void:
    for action in ["toggle_coop", "pause", "restart"]:
        _clear_pad_events(action)
    if device < 0:
        return
    _button("toggle_coop", device, JOY_BUTTON_BACK)
    _button("pause", device, JOY_BUTTON_START)
    _button("restart", device, JOY_BUTTON_RIGHT_SHOULDER)

static func _clear_pad_events(action: String) -> void:
    if not InputMap.has_action(action):
        InputMap.add_action(action, 0.25)
    for event in InputMap.action_get_events(action):
        if event is InputEventJoypadButton or event is InputEventJoypadMotion:
            InputMap.action_erase_event(action, event)

static func _axis(action: String, device: int, direction: float) -> void:
    var event := InputEventJoypadMotion.new()
    event.device = device
    event.axis = JOY_AXIS_LEFT_X
    event.axis_value = direction
    InputMap.action_set_deadzone(action, 0.25)
    InputMap.action_add_event(action, event)

static func _button(action: String, device: int, button: int) -> void:
    var event := InputEventJoypadButton.new()
    event.device = device
    event.button_index = button
    InputMap.action_add_event(action, event)`},
    {name:'scripts/Player.gd',code:`extends CharacterBody2D

@export var slot := 1
@export var speed := 220.0
@export var jump_speed := -430.0
var active := true
var remote_controlled := false
var remote_axis := 0.0
var remote_jump := false
var remote_roll := false
var remote_attack := false
var health := 3
var facing := 1
var attack_wait := 0.0
var roll_time := 0.0
var roll_cooldown := 0.0
var hurt_wait := 0.0
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
    add_to_group("heroes")

func _physics_process(delta: float) -> void:
    if not active or health <= 0:
        return
    attack_wait = maxf(0.0, attack_wait - delta)
    roll_time = maxf(0.0, roll_time - delta)
    roll_cooldown = maxf(0.0, roll_cooldown - delta)
    hurt_wait = maxf(0.0, hurt_wait - delta)
    var prefix = "p1_" if slot == 1 else "p2_"
    var axis = remote_axis if remote_controlled else Input.get_axis(prefix + "left", prefix + "right")
    var jump_now = remote_jump if remote_controlled else Input.is_action_just_pressed(prefix + "jump")
    var roll_now = remote_roll if remote_controlled else Input.is_action_just_pressed(prefix + "roll")
    var attack_now = remote_attack if remote_controlled else Input.is_action_just_pressed(prefix + "attack")
    remote_jump = false
    remote_roll = false
    remote_attack = false
    velocity.y += 1100.0 * delta if not is_on_floor() else 0.0
    if axis != 0.0 and roll_time <= 0.0:
        facing = 1 if axis > 0.0 else -1
    if roll_now and roll_cooldown <= 0.0 and is_on_floor():
        roll_time = 0.28
        roll_cooldown = 0.7
    velocity.x = facing * speed * 1.65 if roll_time > 0.0 else axis * speed
    if jump_now and is_on_floor():
        velocity.y = jump_speed
    sprite.flip_h = facing < 0
    if attack_now and attack_wait <= 0.0:
        attack_wait = 0.4
        for target in get_tree().get_nodes_in_group("damageable"):
            var gap = target.global_position - global_position
            if absf(gap.x) < 75.0 and absf(gap.y) < 55.0 and gap.x * facing > -10.0:
                target.hit(1 + Game.attack_bonus)
    move_and_slide()
    var animation = "jump" if not is_on_floor() else ("run" if absf(axis) > 0.1 else "idle")
    if roll_time > 0.0:
        animation = "roll" if sprite.sprite_frames and sprite.sprite_frames.has_animation("roll") else "run"
    if attack_wait > 0.25:
        animation = "attack"
    if sprite.sprite_frames and sprite.sprite_frames.has_animation(animation):
        sprite.play(animation)

func hurt() -> void:
    if hurt_wait > 0.0 or health <= 0:
        return
    health -= 1
    hurt_wait = 1.0

func heal() -> void:
    health = mini(3, health + 1)`}],
    check:'P1 moves, jumps, rolls, and attacks with the keyboard. In Section 6, test the first connected pad with both stick and D-pad; C or Back will then activate P2.'
  },
  {
    id:'pickups',title:'4. Collect coins and survive hazards',modules:'6 Item spawning · 8 Game loop · 11 Physics',
    summary:'Coins fund the shop and count toward the exit. A timer creates bonus pickups at safe markers, and defeated enemies drop loot.',
    steps:[
      'Create scripts/Game.gd as an Autoload named Game in Project → Project Settings → Globals. Build it in small steps below before writing Pickup.gd.',
      'Attach Pickup.gd to Pickup.tscn. Set kind=coin on 20 instances and kind=heart on health pickups. Give every instance a unique node name; keep all instances under Main/Pickups.',
      'Create Hazard.tscn as Area2D → CollisionShape2D, add your hazard Sprite2D, and attach Hazard.gd. Place hazards where players can jump over or around them.',
      'Add five Marker2D children under SpawnPoints, placed on safe platforms. Attach Spawner.gd to Spawner, assign scenes/Pickup.tscn to pickup_scene in the Inspector, and set its Timer wait time to 12 seconds with Autostart on. BonusPickups holds these timed items and enemy loot.',
      'Create scenes/Splash.tscn as Node2D → Sprite2D with the splash image, and attach Splash.gd. Attach Water.gd to Water and assign scenes/Splash.tscn to splash_scene. Add Boulder to the boulders group in the Node → Groups tab. Use a RigidBody2D so Godot gravity drops it into the pool.',
      'In each Area2D Inspector, enable Monitoring and set its collision mask so it detects Player bodies; Water must also detect Boulder. Use Debug → Visible Collision Shapes if an overlap does not register.'
    ],
    files:[
      {name:'scripts/Game.gd', code:`extends Node

var coins := 0
var collected := 0
var score := 0
var boss_defeated := false
var ending := ""
var inventory: Array[String] = []
var materials := 0
var attack_bonus := 0
var spawn_index := 0
var achievements: Dictionary = {}
var records: Array = []

func _ready() -> void:
    if FileAccess.file_exists("user://final_save.json"):
        var data = JSON.parse_string(FileAccess.get_file_as_string("user://final_save.json"))
        if data is Dictionary:
            achievements = data.get("achievements", {})
            records = data.get("records", [])

func start_run() -> void:
    coins = 0
    collected = 0
    score = 0
    boss_defeated = false
    ending = ""
    inventory.clear()
    materials = 0
    attack_bonus = 0
    spawn_index = 0

func next_pickup_name() -> String:
    spawn_index += 1
    return "Bonus_%d" % spawn_index

func collect_coin() -> void:
    coins += 1
    collected += 1
    score += 10
    if collected >= 20:
        unlock("coin_collector")

func buy_heal(player) -> bool:
    if coins < 5 or player.health >= 3:
        return false
    coins -= 5
    player.heal()
    unlock("first_purchase")
    return true

func buy_gear() -> bool:
    if coins < 8 or inventory.has("Forest Blade"):
        return false
    coins -= 8
    inventory.append("Forest Blade")
    attack_bonus = 1
    unlock("first_purchase")
    return true

func sell_gear() -> bool:
    if not inventory.has("Forest Blade"):
        return false
    inventory.erase("Forest Blade")
    coins += 4
    attack_bonus = 0
    return true

func salvage_gear() -> bool:
    if coins < 2 or not inventory.has("Forest Blade"):
        return false
    coins -= 2
    inventory.erase("Forest Blade")
    materials += 1
    attack_bonus = 0
    unlock("first_salvage")
    return true

func defeat_enemy(is_boss: bool) -> void:
    score += 100 if is_boss else 20
    if is_boss:
        boss_defeated = true
        unlock("boss_breaker")

func unlock(id: String) -> void:
    if achievements.has(id):
        return
    achievements[id] = true
    save_progress()

func finish(choice: String) -> void:
    ending = choice
    score += 50
    unlock("finished_game")
    records.append({"score": score, "ending": choice})
    records.sort_custom(func(a, b): return a["score"] > b["score"])
    records = records.slice(0, 5)
    save_progress()

func save_progress() -> void:
    var file = FileAccess.open("user://final_save.json", FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify({"achievements": achievements, "records": records}))` },
      {name:'scripts/Pickup.gd',code:`extends Area2D

@export var kind := "coin" # Use "heart" for a healing pickup.

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body) -> void:
    if not body.is_in_group("heroes") or not body.active:
        return
    if kind == "coin":
        Game.collect_coin()
    elif kind == "heart":
        if body.health < 3:
            Game.unlock("heart_restored")
        body.heal()
    queue_free()`},
      {name:'scripts/Hazard.gd',code:`extends Area2D

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body) -> void:
    if body.is_in_group("heroes") and body.active:
        body.hurt()`},
      {name:'scripts/Spawner.gd',code:`extends Node

@export var pickup_scene: PackedScene
@onready var timer: Timer = $Timer
@onready var markers = $"../SpawnPoints".get_children()
@onready var bonus = $"../BonusPickups"

func _ready() -> void:
    timer.timeout.connect(_spawn)

func _spawn() -> void:
    if pickup_scene == null or markers.is_empty() or bonus.get_child_count() >= 5:
        return
    var marker = markers.pick_random()
    var item = pickup_scene.instantiate()
    item.name = Game.next_pickup_name()
    item.kind = "heart" if randi_range(0, 3) == 0 else "coin"
    bonus.add_child(item)
    item.global_position = marker.global_position`},
      {name:'scripts/Water.gd',code:`extends Area2D

@export var splash_scene: PackedScene
var splashed := false

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body) -> void:
    if body.is_in_group("heroes"):
        body.hurt()
    elif body.is_in_group("boulders") and not splashed:
        splashed = true
        body.linear_damp = 8.0
        if splash_scene:
            var splash = splash_scene.instantiate()
            get_tree().current_scene.add_child(splash)
            splash.global_position = body.global_position`},
      {name:'scripts/Splash.gd',code:`extends Node2D

func _ready() -> void:
    scale = Vector2(0.5, 0.5)
    modulate.a = 0.0
    var fade = create_tween()
    fade.tween_property(self, "modulate:a", 1.0, 0.15)
    fade.tween_property(self, "modulate:a", 0.0, 0.6)
    fade.tween_callback(queue_free)
    create_tween().tween_property(self, "scale", Vector2.ONE, 0.4)`}
    ],
    check:'A coin disappears on pickup; the Timer creates bonus items; a heart heals; hazards hurt. The boulder falls under gravity and creates a splash when it enters Water.'
  },
  {
    id:'combat',title:'5. Build enemy AI and a boss phase',modules:'3 Boss · 7 Enemies and AI · 8 Game loop',
    summary:'Reuse one enemy script for two ordinary types and the boss. The boss changes speed below half health and unlocks the exit when defeated.',
    steps:[
      'Attach Enemy.gd to Enemy.tscn. Set patrol_left and patrol_right for each instance in the Inspector; these are offsets from its starting point. Use different sprite frames and speeds for the two normal types.',
      'Set boss=On and health_points=8 on the Boss instance. Add an arena floor that keeps the fight readable. Adjust attack_range so the boss can reach a player without instantly overlapping them. Assign scenes/Pickup.tscn to loot_scene on each regular enemy.',
      'The player attack calls hit() on nearby nodes in the damageable group. Enemies add themselves to that group automatically. Keep their collision masks aligned with Terrain and Player.'
    ],
    files:[{name:'scripts/Enemy.gd',code:`extends CharacterBody2D

@export var boss := false
@export var health_points := 2
@export var speed := 65.0
@export var patrol_left := -90.0
@export var patrol_right := 90.0
@export var attack_range := 38.0
@export var loot_scene: PackedScene
var origin_x := 0.0
var direction := 1.0
var attack_wait := 0.0
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
    add_to_group("damageable")
    origin_x = global_position.x

func _physics_process(delta: float) -> void:
    attack_wait = maxf(0.0, attack_wait - delta)
    velocity.y += 1100.0 * delta if not is_on_floor() else 0.0
    var target = null
    var closest := 320.0 if boss else 190.0
    for hero in get_tree().get_nodes_in_group("heroes"):
        if not hero.active or hero.health <= 0:
            continue
        var distance = global_position.distance_to(hero.global_position)
        if distance < closest:
            closest = distance
            target = hero
    if target:
        direction = 1.0 if target.global_position.x > global_position.x else -1.0
    elif global_position.x < origin_x + patrol_left:
        direction = 1.0
    elif global_position.x > origin_x + patrol_right:
        direction = -1.0
    var phase_speed = speed * (1.5 if boss and health_points <= 4 else 1.0)
    velocity.x = direction * phase_speed
    move_and_slide()
    sprite.flip_h = direction < 0.0
    if sprite.sprite_frames and sprite.sprite_frames.has_animation("run"):
        sprite.play("run")
    if target and closest < attack_range and attack_wait <= 0.0:
        target.hurt()
        attack_wait = 1.0 if boss else 1.4

func hit(amount: int = 1) -> void:
    health_points -= amount
    if health_points <= 0:
        if not boss and loot_scene:
            var container = get_tree().get_first_node_in_group("loot_container")
            if container:
                for i in range(randi_range(1, 3)):
                    var loot = loot_scene.instantiate()
                    loot.name = Game.next_pickup_name()
                    loot.kind = "coin"
                    container.add_child(loot)
                    loot.global_position = global_position + Vector2(randf_range(-24, 24), -20)
        Game.defeat_enemy(boss)
        queue_free()`}],
    check:'Each enemy patrols, chases, and deals damage. A defeated regular enemy scatters coin loot; the boss speeds up after four hits and sets Game.boss_defeated to true.'
  },
  {
    id:'interface',title:'6. Connect the HUD, shop, settings, and local co-op',modules:'8 Game loop · 10 Settings · 14 Marketplace · 15 Achievements · 16 Leaderboard · 17 Local co-op',
    summary:'One Main script joins the reusable scenes. A second player can join the same level, and shared rewards persist between runs.',
    steps:[
      'Under UI add HUD (Control) with Stats, Hint, Story, Achievements, Leaderboard (Labels) and Volume (HSlider). Add ShopPanel (Control) with BuyButton, SellButton, SalvageButton. Add HostButton, JoinButton (Buttons) and RoomCode (LineEdit) for Section 8.',
      'Under UI add Finale (Control) with Result and Credits (Labels) and KeepButton, ReturnButton, RestartButton (Buttons). Make Finale fill the viewport and enable Clip Contents. Hide it by default. Main.gd sets UI to Always and gameplay branches to Pausable so Escape can resume a paused run.',
      'Attach Main.gd below to Main. Also attach the small Online.gd placeholder to Online; replace that file with the full version in Section 8. Shop and Exit each need a CollisionShape2D and Monitoring on. Enter Shop: E or gamepad Y buys a heart for five coins; the panel buys a Forest Blade for eight coins, sells it for four, or salvages it for one material at a two-coin fee.',
      'Press C or gamepad Back to activate Player2. The first pad switches to P2; P1 keeps the keyboard or uses a second pad. Both share coins and score, but each has three hearts.',
      'Drag the Volume slider while the game runs. Escape or gamepad Start pauses and resumes; R or right shoulder restarts. Records and achievements are saved in user://final_save.json.'
    ],
    files:[{name:'scripts/Main.gd',code:`extends Node2D

const GamepadBindings = preload("res://scripts/GamepadBindings.gd")
@onready var p1 = $Player1
@onready var p2 = $Player2
@onready var shop: Area2D = $Shop
@onready var exit_area: Area2D = $Exit
@onready var finale: Control = $UI/Finale
@onready var online = $Online
var finished := false
var p1_pad := -2
var p2_pad := -2
var system_pad := -2

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    $UI.process_mode = Node.PROCESS_MODE_ALWAYS
    for branch in ["Pickups", "BonusPickups", "Spawner", "Hazards", "Water", "Boulder", "Enemies", "Boss", "Player1", "Player2", "Shop", "Exit", "Online"]:
        get_node(branch).process_mode = Node.PROCESS_MODE_PAUSABLE
    Game.start_run()
    $BonusPickups.add_to_group("loot_container")
    p2.active = false
    p2.hide()
    Input.joy_connection_changed.connect(_on_joy_connection_changed)
    _assign_gamepads()
    finale.hide()
    finale.clip_contents = true
    $UI/HUD/ShopPanel.hide()
    exit_area.body_entered.connect(_on_exit)
    $UI/HUD/Volume.min_value = 0.0
    $UI/HUD/Volume.max_value = 1.0
    $UI/HUD/Volume.step = 0.05
    $UI/HUD/Volume.value = 1.0
    $UI/HUD/Volume.value_changed.connect(_volume_changed)
    $UI/Finale/KeepButton.pressed.connect(func(): _choose("keep"))
    $UI/Finale/ReturnButton.pressed.connect(func(): _choose("return"))
    $UI/Finale/RestartButton.pressed.connect(_restart)
    $UI/HUD/HostButton.pressed.connect(online.host_room)
    $UI/HUD/JoinButton.pressed.connect(func(): online.join_room($UI/HUD/RoomCode.text))
    $UI/HUD/ShopPanel/BuyButton.pressed.connect(func(): _trade("buy"))
    $UI/HUD/ShopPanel/SellButton.pressed.connect(func(): _trade("sell"))
    $UI/HUD/ShopPanel/SalvageButton.pressed.connect(func(): _trade("salvage"))
    $UI/HUD/Story.text = "The forest relic is missing. Find it beyond the guardian."

func _process(_delta: float) -> void:
    _assign_gamepads()
    if Input.is_action_just_pressed("pause"):
        get_tree().paused = not get_tree().paused
    if get_tree().paused:
        return
    if Input.is_action_just_pressed("restart"):
        _restart()
    if online.is_client:
        _update_hud()
        return
    if Input.is_action_just_pressed("toggle_coop") and not p2.active:
        p2.active = true
        p2.show()
        _assign_gamepads()
    if not finished:
        $UI/HUD/ShopPanel.visible = _shop_player() != null
        for body in shop.get_overlapping_bodies():
            if body == p1 and Input.is_action_just_pressed("p1_interact"):
                Game.buy_heal(p1)
            if body == p2 and p2.active and not p2.remote_controlled and Input.is_action_just_pressed("p2_interact"):
                Game.buy_heal(p2)
        if p1.health <= 0 and (not p2.active or p2.health <= 0):
            finished = true
            _show_result("Game over. Press Restart to try again.", false)
    _update_hud()

func _on_joy_connection_changed(_device: int, _connected: bool) -> void:
    _assign_gamepads()

func _assign_gamepads() -> void:
    var pads := Input.get_connected_joypads()
    var first := pads[0] if pads.size() > 0 else -1
    var second := pads[1] if pads.size() > 1 else -1
    var local_coop := p2.active and not p2.remote_controlled and not online.is_client
    var next_p1 := second if local_coop else first
    var next_p2 := first if local_coop else -1
    if next_p1 != p1_pad:
        GamepadBindings.bind_player(1, next_p1)
        p1_pad = next_p1
    if next_p2 != p2_pad:
        GamepadBindings.bind_player(2, next_p2)
        p2_pad = next_p2
    if first != system_pad:
        GamepadBindings.bind_system(first)
        system_pad = first

func _update_hud() -> void:
    $UI/HUD/Stats.text = "Coins %d / 20  Wallet %d  Score %d  Materials %d  Blade %s  P1 ♥%d  P2 ♥%d" % [Game.collected, Game.coins, Game.score, Game.materials, "yes" if Game.attack_bonus > 0 else "no", p1.health, p2.health if p2.active else 0]
    $UI/HUD/Hint.text = "E/Y: shop heal. C/Back: P2. Esc/Start: pause. R/RB: restart. Boss: %s  Room: %s" % ["done" if Game.boss_defeated else "alive", online.code]
    $UI/HUD/Achievements.text = "Badges: " + ", ".join(Game.achievements.keys())
    var lines := []
    for record in Game.records:
        lines.append("%d (%s)" % [record["score"], record["ending"]])
    $UI/HUD/Leaderboard.text = "Top runs: " + ", ".join(lines)

func _shop_player():
    for body in shop.get_overlapping_bodies():
        if body.is_in_group("heroes") and body.active:
            return body
    return null

func _trade(action: String, player = null) -> void:
    if online.is_client:
        online.send_trade(action)
        return
    if player == null:
        player = _shop_player()
    if player == null or not shop.get_overlapping_bodies().has(player):
        return
    var success := false
    match action:
        "buy": success = Game.buy_gear()
        "sell": success = Game.sell_gear()
        "salvage": success = Game.salvage_gear()
    $UI/HUD/Story.text = "%s %s. Gear: %s. Materials: %d" % [action.capitalize(), "complete" if success else "unavailable", ", ".join(Game.inventory), Game.materials]

func _on_exit(body) -> void:
    if finished or not body.is_in_group("heroes") or not body.active:
        return
    if Game.collected < 20 or not Game.boss_defeated:
        $UI/HUD/Story.text = "The exit needs 20 coins and the defeated guardian."
        return
    finished = true
    p1.active = false
    p2.active = false
    _show_result("You found the relic. Keep it or return it?", true)

func _show_result(message: String, choices: bool) -> void:
    finale.show()
    $UI/Finale/Result.text = message
    $UI/Finale/KeepButton.visible = choices
    $UI/Finale/ReturnButton.visible = choices
    $UI/Finale/Credits.text = ""

func _choose(choice: String) -> void:
    Game.finish(choice)
    $UI/Finale/Result.text = "You chose to %s the relic. Final score: %d" % [choice, Game.score]
    $UI/Finale/KeepButton.hide()
    $UI/Finale/ReturnButton.hide()
    var result_label: Label = $UI/Finale/Result
    result_label.modulate.a = 0.0
    create_tween().tween_property(result_label, "modulate:a", 1.0, 1.0)
    var roll: Label = $UI/Finale/Credits
    roll.text = "CREDITS\nDesign: your name\nArt: your own work and credited lesson assets\nBuilt with Godot"
    roll.position.y = 500.0
    create_tween().tween_property(roll, "position:y", -220.0, 9.0)

func _volume_changed(value: float) -> void:
    AudioServer.set_bus_volume_db(0, linear_to_db(maxf(value, 0.001)))

func _restart() -> void:
    get_tree().paused = false
    get_tree().reload_current_scene()`},
    {name:'scripts/Online.gd (placeholder; replace in Section 8)',code:`extends Node

var is_client := false
var code := ""

func host_room() -> void:
    pass

func join_room(_room_code: String) -> void:
    pass`}],
    check:'C or gamepad Back adds P2 on the same level. One pad controls P2 while P1 uses the keyboard; with two pads each player has one. E or Y buys a heart at the shop. Start pauses and RB restarts.'
  },
  {
    id:'ending',title:'7. Complete the story and ending',modules:'4 Storyline · 12 Ending cutscene · 13 Credits · 15 Achievements · 16 Leaderboard',
    summary:'The level needs a real finish condition, player choice, short cutscene, and credits—not just a boss that disappears.',
    steps:[
      'Set a title and opening line in HUD/Story. Give the two enemy types and boss names using Label nodes or artwork. Replace the sample forest text in Main.gd with the story you wrote in Module 4.',
      'At the exit, Main.gd checks that 20 coins were collected and the boss was defeated. Walk through it to show the choice panel. Keep and Return are two different ending decisions. Replace the sample Result text with your own outcome for each choice.',
      'Main.gd fades in the result and scrolls the Credits label with a Tween. Fill Credits with the people and asset sources for your game, then add an AnimationPlayer to animate the relic or camera if you want a richer cutscene.',
      'Finish once with each choice. Confirm coin_collector, boss_breaker, first_purchase, and finished_game appear in Game.achievements, and that the next run shows a leaderboard record.'
    ],
    check:'A complete run reaches an ending choice, shows a cutscene/credits, saves an achievement and score, and restarts cleanly.'
  },
  {
    id:'online',title:'8. Add a two-player online room',modules:'17 Local co-op · 18 Multiplayer',
    summary:'Use the same map and P2 controls. The host runs collisions and rewards; a guest sends P2 input and sees snapshots. The Final Game relay is on this site.',
    steps:[
      'Clear the temporary contents of scripts/Online.gd, then rebuild that same file through the writing tasks below. The shown relay_url uses this page’s WebSocket address. If this page uses localhost, replace it with the public site’s WebSocket URL before running Godot in a cloud workspace; localhost inside the cloud editor points to that server, not your Mac.',
      'Open two independent Godot workspaces or two running copies of the project. Host in one copy; read its six-character room code from the HUD. Enter that code in the second copy and press Join.',
      'On the guest copy, use P1 keyboard controls or the first connected gamepad to control the host’s Player2. The host owns coins, timed item spawns, enemy drops, boss, shop, score, and ending state. The guest receives snapshots of the world; leaderboard records and achievements save in the host’s workspace.',
      'Test a coin pickup, one enemy hit, a purchase, the boss defeat, and the exit while both copies are connected. Use a fresh code after a host disconnects.'
    ],
    files:[{name:'scripts/Online.gd',code:`extends Node

@export var relay_url := "__RELAY_URL__"
var socket := WebSocketPeer.new()
var code := ""
var is_client := false
var is_host := false
var pending := ""
var join_code := ""
var sent := false
var tick := 0.0
var last_ending := ""
var last_splash := false
@onready var level = get_parent()

func host_room() -> void:
    _connect("host", "")

func join_room(room_code: String) -> void:
    _connect("join", room_code.strip_edges().to_upper())

func _connect(role: String, room_code: String) -> void:
    if socket.get_ready_state() == WebSocketPeer.STATE_OPEN:
        socket.close()
    socket = WebSocketPeer.new()
    pending = role
    join_code = room_code
    sent = false
    socket.connect_to_url(relay_url)

func _process(delta: float) -> void:
    socket.poll()
    if socket.get_ready_state() != WebSocketPeer.STATE_OPEN:
        return
    if not sent:
        _send({"type": pending, "code": join_code})
        sent = true
    while socket.get_available_packet_count() > 0:
        var message = JSON.parse_string(socket.get_packet().get_string_from_utf8())
        if message is Dictionary:
            _receive(message)
    if is_client:
        _send({"type": "input", "axis": Input.get_axis("p1_left", "p1_right"),
            "jump": Input.is_action_just_pressed("p1_jump"),
            "roll": Input.is_action_just_pressed("p1_roll"),
            "attack": Input.is_action_just_pressed("p1_attack"),
            "interact": Input.is_action_just_pressed("p1_interact")})
    tick += delta
    if tick < 0.05:
        return
    tick = 0.0
    if is_host:
        _send({"type": "state", "p1": _player(level.p1), "p2": _player(level.p2),
            "coins": Game.coins, "collected": Game.collected, "score": Game.score,
            "materials": Game.materials, "gear": Game.inventory, "attack_bonus": Game.attack_bonus,
            "boss": Game.boss_defeated, "boss_data": _actor(level.get_node_or_null("Boss")),
            "ending": Game.ending, "finished": level.finished,
            "shop_open": level.shop.get_overlapping_bodies().has(level.p2),
            "boulder": {"x": level.get_node("Boulder").global_position.x,
                "y": level.get_node("Boulder").global_position.y},
            "water_splashed": level.get_node("Water").splashed,
            "pickups": _remaining("Pickups"), "bonus": _bonus(),
            "enemies": _actors("Enemies")})

func _send(data: Dictionary) -> void:
    socket.send_text(JSON.stringify(data))

func send_trade(action: String) -> void:
    if is_client:
        _send({"type": "trade", "action": action})

func _player(hero) -> Dictionary:
    return {"x": hero.global_position.x, "y": hero.global_position.y,
        "health": hero.health, "active": hero.active}

func _remaining(parent_name: String) -> Array:
    var names := []
    for child in level.get_node(parent_name).get_children():
        names.append(child.name)
    return names

func _actor(actor) -> Dictionary:
    if not is_instance_valid(actor):
        return {}
    return {"x": actor.global_position.x, "y": actor.global_position.y,
        "hp": actor.health_points}

func _actors(parent_name: String) -> Dictionary:
    var result := {}
    for actor in level.get_node(parent_name).get_children():
        result[actor.name] = _actor(actor)
    return result

func _bonus() -> Dictionary:
    var result := {}
    for item in level.get_node("BonusPickups").get_children():
        result[item.name] = {"x": item.global_position.x,
            "y": item.global_position.y, "kind": item.kind}
    return result

func _receive(message: Dictionary) -> void:
    match message.get("type", ""):
        "joined":
            code = str(message.get("code", ""))
            is_host = pending == "host"
            is_client = pending == "join"
            if is_client:
                level.p1.set_physics_process(false)
                level.p2.set_physics_process(false)
                level.get_node("Spawner").set_process(false)
                level.get_node("Spawner/Timer").stop()
                level.get_node("Boulder").freeze = true
                level.get_node("Water").monitoring = false
                for enemy in level.get_tree().get_nodes_in_group("damageable"):
                    enemy.set_physics_process(false)
                for parent_name in ["Pickups", "Hazards"]:
                    for area in level.get_node(parent_name).get_children():
                        area.monitoring = false
                level.shop.monitoring = false
                level.exit_area.monitoring = false
        "peer_joined":
            level.p2.active = true
            level.p2.show()
            level.p2.remote_controlled = true
        "peer_left":
            if is_host:
                level.p2.remote_axis = 0.0
                level.p2.remote_jump = false
                level.p2.remote_roll = false
                level.p2.remote_attack = false
                level.p2.remote_controlled = false
                level.p2.active = false
                level.p2.hide()
            elif is_client:
                level.finished = true
                level._show_result("The host left the room. Restart to play again.", false)
                socket.close()
        "input":
            if is_host:
                level.p2.remote_axis = clampf(float(message.get("axis", 0)), -1.0, 1.0)
                level.p2.remote_jump = level.p2.remote_jump or bool(message.get("jump", false))
                level.p2.remote_roll = level.p2.remote_roll or bool(message.get("roll", false))
                level.p2.remote_attack = level.p2.remote_attack or bool(message.get("attack", false))
                if bool(message.get("interact", false)) and level.shop.get_overlapping_bodies().has(level.p2):
                    Game.buy_heal(level.p2)
        "trade":
            if is_host:
                level._trade(str(message.get("action", "")), level.p2)
        "state":
            if is_client:
                _apply_state(message)

func _apply_state(state: Dictionary) -> void:
    for key in ["p1", "p2"]:
        var hero = level.p1 if key == "p1" else level.p2
        var data = state.get(key, {})
        hero.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))
        hero.health = int(data.get("health", 3))
        hero.active = bool(data.get("active", false))
        hero.visible = hero.active
    Game.coins = int(state.get("coins", 0))
    Game.collected = int(state.get("collected", 0))
    Game.score = int(state.get("score", 0))
    Game.materials = int(state.get("materials", 0))
    Game.inventory.assign(state.get("gear", []))
    Game.attack_bonus = int(state.get("attack_bonus", 0))
    Game.boss_defeated = bool(state.get("boss", false))
    Game.ending = str(state.get("ending", ""))
    level.get_node("UI/HUD/ShopPanel").visible = bool(state.get("shop_open", false))
    var boulder_data = state.get("boulder", {})
    level.get_node("Boulder").global_position = Vector2(float(boulder_data.get("x", 0)), float(boulder_data.get("y", 0)))
    if bool(state.get("water_splashed", false)) and not last_splash:
        last_splash = true
        var splash = preload("res://scenes/Splash.tscn").instantiate()
        level.add_child(splash)
        splash.global_position = level.get_node("Boulder").global_position
    _remove_missing("Pickups", state.get("pickups", []))
    _sync_bonus(state.get("bonus", {}))
    _sync_actors("Enemies", state.get("enemies", {}))
    _sync_actor(level.get_node_or_null("Boss"), state.get("boss_data", {}))
    if Game.ending != "" and Game.ending != last_ending:
        last_ending = Game.ending
        level.finished = true
        level._show_result("Host chose to %s the relic." % Game.ending, false)
    elif bool(state.get("finished", false)) and not level.finished:
        level.finished = true
        level._show_result("Host reached the relic. Waiting for their choice…", false)

func _remove_missing(parent_name: String, names: Array) -> void:
    for child in level.get_node(parent_name).get_children():
        if not names.has(child.name):
            child.queue_free()

func _sync_bonus(items: Dictionary) -> void:
    var parent = level.get_node("BonusPickups")
    for child in parent.get_children():
        if not items.has(child.name):
            child.queue_free()
    for item_name in items:
        var item = parent.get_node_or_null(item_name)
        if item == null:
            item = preload("res://scenes/Pickup.tscn").instantiate()
            item.name = item_name
            parent.add_child(item)
            item.monitoring = false
        var data = items[item_name]
        item.kind = str(data.get("kind", "coin"))
        item.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))

func _sync_actors(parent_name: String, actors: Dictionary) -> void:
    for actor in level.get_node(parent_name).get_children():
        _sync_actor(actor, actors.get(actor.name, {}))

func _sync_actor(actor, data: Dictionary) -> void:
    if not is_instance_valid(actor):
        return
    if data.is_empty():
        actor.queue_free()
        return
    actor.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))
    actor.health_points = int(data.get("hp", 1))`}],
    check:'Two copies show the same room code. The guest moves P2; both copies see the same positions, coins, enemy defeats, boss status, and final ending.'
  },
  {
    id:'test',title:'9. Playtest, polish, and submit',modules:'1–18 integrated',
    summary:'Complete the game as a player would, then keep a copy of the finished Godot project.',
    steps:[
      'Run from the opening story/start area to the exit without using the editor. Test solo first, then local co-op, then a two-workspace online room.',
      'Check that all 20 coins are reachable, both enemy types can be beaten, the shop actually spends coins, the boss has two phases, and the exit cannot open early.',
      'Test death and restart, pause and volume, both ending choices, credits, achievements, and leaderboard persistence after restarting.',
      'Replace placeholder text and art with your own finished assets. Credit any shared lesson art. Download the current project ZIP from the cloud editor lesson before deleting the workspace; open that ZIP once to confirm it contains Main.tscn and your scripts.'
    ],
    check:'A fresh playthrough reaches credits without a Debugger error, and the downloaded ZIP contains the finished level and scripts.'
  }
];
