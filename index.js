/*
Armando Campos
3/20/17 - 4/10/17
*/
// Constants
const NONE = -1, TILE_SIZE = 64;

var container = document.getElementById('container');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// [ - - Input - - ]
var Key = {
  _pressed: {},
  i_p: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  isPressed: function(keyCode){
    return this.i_p[keyCode];
  },
  
  onKeydown: function(event) {
    if(!this.isDown(event.keyCode)){
      this.i_p[event.keyCode] = true;
    }else{
      delete this.i_p[event.keyCode];
    }
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
    delete this.i_p[event.keyCode];
  }
};

document.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
document.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

// [ - - General Methods - - ]
/**
  * Get Element by use of ID.
  * @param name ID of Element.
*/
function getByID(name){
  return document.getElementById(name);
}

function getElWidth(name){
  var post = getByID(name).getBoundingClientRect();
  return post.width;
}
function getElHeight(name){
  var post = getByID(name).getBoundingClientRect();
  return post.height;
}

/**
  * Get Random Integer.
  * @param max Maximum Integer.
*/
function random_int(max){
  return Math.floor(Math.random()*max);
}

function slide_into(base, dest, spd){
  var dif = Math.abs(dest - base);
  if(dif < spd)return dest;
  var dir = sign(dest - base);
  return base+(dir*spd);
}

function sign(value){
  if(value == 0)return 0;
  if(value > 0){
    return 1;
  }else{
    return -1;
  }
}

function bool_sub(b1, b2){
  if(b1){
    if(b2)return 0;
    return 1;
  }else{
    if(b2)return -1;
    return 0;
  }
}

function inRange(value, min, max){
  return (value >= Math.min(min, max)) && (value <= Math.max(min, max));
}

function rangeIntersect(min0, max0, min1, max1){
  return (Math.max(min0, max0) >= Math.min(min1, max1)) && (Math.min(min0, max0) <= Math.max(min1, max1));
}

function rectIntersect(msk0, msk1){
  return (rangeIntersect(msk0.left, msk0.right, msk1.left, msk1.right)) &&
  (rangeIntersect(msk0.up, msk0.down, msk1.up, msk1.down));
}

/**
  * Check if a Value is defined.
  * @param value Value to Check.
*/
function valid(value){
  return (value != NONE);
}

/**
  * Remove Random Value from Array. Warning, Will not check for remaining values.
  * @param array Array to remove value from.
*/
function array_random_removal(array){
  var length = array.length;
  var pos = random_int(length);
  var val = array[pos];
  while(val == NONE){
    pos = random_int(length);
    val = array[pos];
  }
  array[pos] = NONE;
  return val;
}

/**
  * Convert entire array into a String.
  * @param array Array to convert into String.
*/
function array_write(array){
  var str = "[";
  for(var i = 0; i < array.length; i++){
    var ext = ", ";
    if(i == array.length-1)ext = "]";
    str+=String(array[i])+ext;
  }
  return str;
}
/**
  * Convert entire 2D array into a String.
  * @param array Array to convert into String.
*/
function array_write2D(array){
  var str = "[";
  for(var i = 0; i < array.length; i++){
    var ext = ", ";
    if(i == array.length-1)ext = "]";
    str+=array_write(array[i])+ext;
  }
  return str;
}


/**
  * Alarms, used for delayed events.
*/
class alarm {
  constructor(){
    this.time = NONE;
    this.func = NONE;
    this.param = NONE;
  }

  update(){
    this.tick();
    this.check();
  }

  tick(){
    if(this.time != NONE){
      this.time = this.time - 1;
    }
  }

  check(){
    if(valid(this.time)){
      if(this.time == 0){
        // Execute Function
        if(this.param == NONE){
          this.func();
        }else{
          this.func(this.param);
        }
        this.reset();
      }
    }
  }

  set(time, func, param){
    this.time = time;
    this.func = func;
    this.param = param;
  }

  reset(){
    this.time = NONE;
    this.func = NONE;
    this.param = NONE;
  }
}

/**
  * Alarm System, controls alarms.
*/
class alarm_system {
  constructor(num){
    this.alarms = [NONE];
    for(var i = 0; i < num; i++){
      this.alarms.push(new alarm());
    }
  }

  get_alarm(aID){
    return this.alarms[aID];
  }

  update(){
    // Update all Alarms
    for(var i = 0; i < this.alarms.length; i++){
      var alrm = this.get_alarm(i);
      if(alrm != NONE){
        // Alarm Exists
        alrm.update();
      }
    }
  }

  // Add to Specific Position
  set(aID, time, func, param){
    this.get_alarm(aID).set(time, func, param);
  }

  // Add to Unknown Position
  // Not recommended if using Specifics
  add(time, func, param){
    var open = 0;
    for(var i = 0; i < this.alarms.length; i++){
      var alrm = this.get_alarm(i);
      if(alrm != NONE){
        // Alarm Exists
        if(alrm.time == NONE)open = i;
      }
    }
    // Set Alarm
    this.get_alarm(open).set(time, func, param);
  }

  wipe(){
    for(var i = 0; i < this.alarms.length; i++){
      var alrm = this.get_alarm(i);
      if(alrm != NONE){
        // Alarm Exists
        alrm.reset();
      }
    }
  }
}

class Mask {
  constructor(xx, yy, width, height){
    this.x = xx;
    this.y = yy;
    this.ww = width;
    this.hh = height;
    this.hlfw = width/2;
    this.hlfh = height/2;
    this.update(xx, yy);
  }

  update(xx, yy){
    this.x = xx;
    this.y = yy;
    this.left = this.x - this.hlfw;
    this.right = this.x + this.hlfw;
    this.up = this.y - this.hlfh;
    this.down = this.y + this.hlfh;
  }
}

// Camera
class Camera {
  constructor(Entity){
    this.follow = Entity;
    this.x = 0;
    this.y = 0;
  }

  update(){
    if(this.follow != NONE){
      // Follow Abstract Entity
      this.x = this.follow.x;
      this.y = this.follow.y;
    }
  }
}

// Entity Classes
class AbstractEntity {
  constructor(type, xx, yy){
    this.type = type;
    var sz = TILE_SIZE;
    if(this.type == 0){
        sz = TILE_SIZE/2;
        //GAME.player = this;
    }
    this.home = {x: xx, y: yy};
    this.post = { x: xx, y : yy };
    this.vel = { h: 0, v : 0 };
    this.msk = new Mask(xx, yy, sz, sz);
    this.spd = 4*(sz/32);
    this.color = "tomato";
    // Physics
    this.hface = 1;
    this.onground = false;
    this.onwall = false;
    this.onwallB = false;
    this.cling = false;
    // Player
    this.stamina_max = 6;
    this.stamina = this.stamina_max;

  }
  // Get
  get side_l(){
    return this.msk.left;
  }
  get side_r(){
    return this.msk.right;
  }
  get side_u(){
    return this.msk.up;
  }
  get side_d(){
    return this.msk.down;
  }

  // Set
  setPost(xx, yy){
    this.post.x = xx;
    this.post.y = yy;
  }

  // should probably use deltatime instead but oh well
  // Physics
  gravity(){
    var weight = 0.5;
    if(this.onwall){
      weight = 0.1;
      if(this.vel.v < 0)this.vel.v = 0;
    }
    if(this.cling){
      weight = 0;
      if(!this.onwall){
        // Underneath
        this.vel.v = -2;
      }else{
        this.vel.v = 0;
      }
    }
    this.vel.v += weight;
    if(this.vel.v >= 8)this.vel.v = 8;
  }

  boundcheck(){
    var half = TILE_SIZE/2
    if(this.side_l > canvas.width)this.post.x = -half;
    if(this.side_r < -half)this.post.x = canvas.width;//getElWidth("canvas");
    if(this.side_u > canvas.height)this.post.y = -half;
    if(this.side_d < -half)this.post.y = canvas.height+half;//getElHeight("canvas");
  }

  stamina_charge(){
    this.stamina += 0.2;
    if(this.stamina > this.stamina_max)this.stamina = this.stamina_max;
  }

  stamina_use(cost){
    if(this.stamina >= cost){
      // Use
      this.stamina -= cost;
      return true;
    }else{
      return false;
    }
  }

  set_home(xx, yy){
    this.home.x = xx;
    this.home.y = yy;
  }

  reset(){
    this.post.x = this.home.x;
    this.post.y = this.home.y;
    this.msk.update(this.post.x, this.post.y);
    this.stamina = this.stamina_max;
  }

  // Update
  update(){
    // Physics
    this.gravity();
    var ir = Key.isDown(Key.RIGHT), il = Key.isDown(Key.LEFT);
    var id = Key.isDown(Key.DOWN), iu = Key.isPressed(Key.UP);
    var hdir = bool_sub(ir, il), vdir = bool_sub(id, iu);
    if(hdir != 0){
      this.hface = hdir;
      this.vel.h = slide_into(this.vel.h, 6*hdir, 1);
    }else{
      this.vel.h = slide_into(this.vel.h, 0, 2);
    }

    if(this.onground){
      // Jumping
      if(iu){
        this.vel.v = -4;
      }
      // Stamina
      this.stamina_charge();
    }
    if(this.onwall){
      if(iu){
        if(this.stamina_use(1)){
          this.vel.v = -3;
          this.vel.h = -this.hface*2;
        }
      }
    }
    /*
    TOP DOWN MOVEMENT
    
    if(vdir != 0){
      this.vel.v = slide_into(this.vel.v, 6*vdir, 1);
    }else{
      this.vel.v = slide_into(this.vel.v, 0, 1);
    }
    */
    
    var ox = this.post.x, oy = this.post.y;
    var nx = this.post.x + (this.vel.h*this.spd);
    var ny = this.post.y + (this.vel.v*this.spd);
    this.msk.update(nx, ny);
    var hs = this.vel.h;
    var vs = this.vel.v;
    var forceh = 0, forcev = 0;
    this.onground = false;
    this.onwallB = false;
    this.onwall = false;
    this.cling = false;
    // COLLISION CHECK
    var grid = GAME.INSTANCES;
    var gridw = grid.length;
    for(var i = 0; i < gridw; i++){
      var inst = grid[i];
      if(inst != NONE){
        var type = inst.type;
        // Collision
        switch(type){
          case 1: // Wall
          case 2: // StickyWall
          case 3: // BouncyWall
          case 4: // SpeedWall
            var ix = inst.post.x, iy = inst.post.y;
            var disx = Math.abs(ix - this.post.x);
            var dirx = sign(ix - this.post.x);
            var colh = false;

            var disy = Math.abs(iy - this.post.y);
            var diry = sign(iy - this.post.y);
            // Within Range
            if((disx <= TILE_SIZE*2)&&(disy <= TILE_SIZE*2)){
              // VERTICAL
              this.msk.update(ox, ny);
              if(this.place_meeting(inst)){
                this.msk.update(ox, oy);
                this.vel.v = 0;
                switch(type){
                  case 3: // BOUNCYWALL
                    forcev = (vs*-1.5);
                    break;
                }
                vs = 0;
                if(diry == 1){
                  this.onground = true;
                  switch(type){
                    case 4: // SPEEDWALL
                      forceh = (hs*1.15);
                      break;
                  }
                  // Player hits top side of
                  this.post.y = -1+inst.side_u-this.msk.hlfh;
                }else{
                  this.onwallB = true;
                  switch(type){
                    case 2: // STICKYWALL
                      this.cling = true;
                      this.stamina_charge();
                      break;
                  }
                  // Player hits bottom side of
                  this.post.y = 1+inst.side_d+this.msk.hlfh;
                }
                ny = this.post.y;
                this.msk.update(nx, oy);
              }

              this.msk.update(nx, oy);
              if(this.place_meeting(inst)){
                this.msk.update(ox, oy);
                // HORIZONTAL
                this.vel.h = 0;
                this.onwall = true;
                switch(type){
                  case 2: // STICKYWALL
                    this.cling = true;
                    this.stamina_charge();
                    break;
                  case 3: // BOUNCYWALL
                    forceh = (hs*-1.5);
                    break;
                }
                hs = 0;
                if(dirx == 1){
                  
                  // Player hits left side of
                  this.post.x = -1+inst.side_l-this.msk.hlfw;
                }else{
                  // Player hits right side of
                  this.post.x = 1+inst.side_r+this.msk.hlfw;
                }
                nx = this.post.x;
                this.msk.update(nx, ny);
                
                //this.vel.h = hs;
                colh = true;
              }
            }
        }
      }
    }
    
    // Update Position
    // add force to velocity
    if(forceh != 0)this.vel.h = forceh;
    var vx = (this.vel.h*this.spd);
    if(forcev != 0)this.vel.v = forcev;
    var vy = (this.vel.v*this.spd);
    this.post.x += vx;
    this.post.y += vy;
    // Force
    //this.post.x += forceh;
    //this.post.y += forcev;
    this.boundcheck();
    this.msk.update(this.post.x, this.post.y);

    //GAME.CAMERA.x = this.post.x - (canvas.width / 2);
    //GAME.CAMERA.y = this.post.y - (canvas.height / 2);
  }

  place_meeting(inst){
    // Check Collision Masks
    return rectIntersect(this.msk, inst.msk);
  }

  // Draw
  draw(){
    var ll = this.side_l;
    var ww = this.msk.ww;
    var uu = this.side_u;
    var hh = this.msk.hh;
    draw_rectangle(ll, uu, ww, hh, this.color);
    if(this.type == 0){
      GAME.ctx.font = "48px Arial";
      GAME.ctx.textAlign = "center";
      GAME.ctx.fillStyle = "lightgreen";
      //GAME.ctx.fillText("STAMINA:"+String(Math.floor(this.stamina)), this.post.x, this.post.y-this.msk.hh);
      draw_rectangle(ll, uu-32, this.msk.ww, 16, "#424242");
      draw_rectangle(ll, uu-32, (this.stamina / this.stamina_max)*this.msk.ww, 16, "lightgreen");
    }
  }

  // Render
  render(){
    this.update();
    this.draw();
  }
}

class Wall extends AbstractEntity {
  constructor(xx, yy){
    super(1, xx, yy);
    this.color = "#FFFFFF";
  }
  
  update(){
    // DO NOTHING
  }
}

class StickyWall extends AbstractEntity {
  constructor(xx, yy){
    super(2, xx, yy);
    this.color = "#6A1B9A";
  }

  update(){
    // DO NOTHING
  }
}

class BouncyWall extends AbstractEntity {
  constructor(xx, yy){
    super(3, xx, yy);
    this.color = "#FFC400";
  }

  update(){
    // DO NOTHING
  }
}

class SpeedWall extends AbstractEntity {
  constructor(xx, yy){
    super(4, xx, yy);
    this.color = "#42A5F5";
  }

  update(){
    // DO NOTHING
  }
}

/*
GAME STATES:
0 - INITIALIZATION
1 - WAIT FOR PLAYER START
*/
var STATE = 0;
var GAME = {
  ctx: getByID("canvas").getContext("2d"),
  INSTANCES: [NONE, NONE],
  ALARM: new alarm_system(6),
  start: function(){
      this.interval = setInterval(update, 60);

      },
  level: [[
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "XX      X====X   XXX              X",
  "XX      X        XXX              X",
  "XX      X                         X",
  "XX XO   =                         X",
  "XX     XX                         X",
  "=  X   XX                         X",
  "X XXX X===                        X",
  "= XXX                             X",
  "X XXX                             X",
  "= XXXO>>>>>>>>>O                  X",
  "X XXXXXX                          X",
  "X      X                          X",
  "XXXXXX X                          X",
  "X    X X                          X",
  "X X  X X                          X",
  "X X  = X                          X",
  "X X  X X                          X",
  "X@X    X                          X",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ], [
  "XXXXXXXXXX===XXXXXXXXXXXXXXXXXXXXXX",
  "X            X  XXXX              X",
  "X       X    =  =XXX              X",
  "X       X       =                 X",
  "X  XO   =                         X",
  "X  =   XX                         X",
  "=      XX                         X",
  "X     X==X                        X",
  "=  X  =                           X",
  "X  =                              X",
  "=     =                           X",
  "X   X                             X",
  "X   =  X                          X",
  "X      X                          X",
  "X      =                          X",
  "X                                 X",
  "X       =                          X",
  "X   =                             X",
  "X@                                X",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ]],
  CAMERA: new Camera(NONE),
  render: function(){
    draw_bg();
    draw_grid();
  }
}

// [ - - Game Methods - - ]
/**
  * Begin Game.
*/
function play(){
  GAME.start();
}

/**
  * Update Game.
*/
function update(){
  GAME.CAMERA.update();
  drawImage(imageObj.image);
  GAME.ALARM.update();
  
  switch(STATE){
    case 0: // INITIALIZATION
      level_load(GAME.level[1]);
      STATE = 1;
      break;
    case 1:
      break;
  }
  
}

// Drawing
function draw_bg(){
  draw_rectangle(GAME.CAMERA.x, GAME.CAMERA.y, canvas.width, canvas.height, "#000000");
}

function draw_grid(){
  if(STATE == 0)return;
  
  var grid = GAME.INSTANCES;
  var gridw = grid.length;
  for(var i = 0; i < gridw; i++){
    var inst = grid[i];
    if(inst != NONE){
      inst.render();
    }
  }
}

function level_switch(levelID){
  level_trash();
  GAME.ALARM.add(level_load, 1, levelID);
}

function level_load(plan){
  var planw = plan.length;
  var planh = plan[0].length;
  for(var i = 0; i < planw; i++){
    for(var j = 0; j < planh; j++){
      var type = NONE;
      var spot = plan[i].substring(j, j+1);
      switch(spot){
        case "@": type = 0; break; // PLAYER
        case "X": type = 1; break; // WALL
        case "=": type = 2; break; // STICKYWALL
        case "O": type = 3; break; // BOUNCYWALL
        case ">": type = 4; break; // SPEEDWALL
      }
      if(type != NONE){
        //alert("made a wall:"+i+", "+j);
        // Add Instance
        //var inst = new Instance(instID, posX, posY);
        var posX = j*TILE_SIZE, posY = i*TILE_SIZE;
        var inst = instance_create(type, posX, posY);
        GAME.INSTANCES.push(inst);
      }
    }
  }
}

function level_trash(){
  GAME.INSTANCES = [NONE, NONE];
}

function instance_create(type, xx, yy){
  switch(type){
    case 0: return new AbstractEntity(0, xx, yy);
    case 1: return new Wall(xx, yy);
    case 2: return new StickyWall(xx, yy);
    case 3: return new BouncyWall(xx, yy);
    case 4: return new SpeedWall(xx, yy);
    
  }
  return undefined;
}

// [ - - Player Control Buttons - - ]
/**
  * Player Reset Button.
*/
function btn_reset(){
  STATE = 0;
}



// DISPLAY FIX - - - - - - - - - - - - - - -
// this prvents iOS browsers from moving the viewport on drag
$(window).bind(
  'touchmove',
   function(e) {
    e.preventDefault();
  }
);   

// this function fill an image on canvas
function drawImage(image) {
   context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
}

// this function will render your drawings
var ww = 300;
function drawImage(stage) {

  GAME.render();

  //ww++;
  //context.fillRect (50, 50, ww, 700);
  //draw_rectangle(50, 50, ww, 700, "deepskyblue");
  //draw_rectangle(800, 100, 1000, 300, "darkseagreen");
  //draw_rectangle(1708, 200, 500, 900, "tomato");

  //alert("render");
}

function draw_set_color(color){
  context.fillStyle = color;
}

function draw_rectangle(x1, y1, ww, hh){
  draw_set_color("#FFF");
  context.fillRect(x1-GAME.CAMERA.x, y1-GAME.CAMERA.y, ww, hh);
}
function draw_rectangle(x1, y1, ww, hh, color){
  draw_set_color(color);
  context.fillRect(x1-GAME.CAMERA.x, y1-GAME.CAMERA.y, ww, hh);
}

var imageObj = new Image();
imageObj.onload = function () {
   drawImage(image);
};

var drawStage = new Image();
drawStage.onload = function () {
   drawImage(stage);
};

// set this to false to maintain the canvas aspect ratio, or true otherwise
var stretch_to_fit = false;

function resize() {
   // aspect ratio
   var widthToHeight = canvas.width / canvas.height;
   var newWidthToHeight = widthToHeight;

   // cache the window dimensions (discount the border)
   var newWidth = window.innerWidth,
       newHeight = window.innerHeight;

   if (stretch_to_fit) {
       // overwrite the current canvas aspect ratio to fit the entire screen
       widthToHeight = window.innerWidth / window.innerHeight;
   } else {
       newWidthToHeight = newWidth / newHeight;
   }


   // scale the container using CSS		
   if (newWidthToHeight > widthToHeight) {
       newWidth = newHeight * widthToHeight;
       container.style.height = newHeight + 'px';
       container.style.width = newWidth + 'px';
   } else {
       newHeight = newWidth / widthToHeight;
       container.style.width = newWidth + 'px';
       container.style.height = newHeight + 'px';
   }

   // adjust the container position 
   container.style.marginTop = (-newHeight / 2) + 'px';
   container.style.marginLeft = (-newWidth / 2) + 'px';

};

// listen to resize events
window.addEventListener('resize', function () {
   resize();
}, false);

// also resize the screen on orientation changes
window.addEventListener('orientationchange', function () {
   resize();
}, false);

// draw the image on canvas
// note that you dont need to redraw on resize since the canvas element stays intact    
drawImage(imageObj);

// first resize
resize();




/*
  TODO:
  - New Entity Types [
    X- StickyWall (Recharges Stamina, Prevents Sliding)
    X- BouncyWall (Bounces Player)
    - Follower (Follows Player)
    - DangerWall (Triggers Death of Player)
    - Checkpoint (Sets Home of Player)
    - StaminaOrb (Refills Player Stamina)
    - FragilePlatform (Will Fade Away when Player makes contact)
    - Orb (Player Currency)
  ]
*/
