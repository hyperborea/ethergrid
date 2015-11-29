Ethergrid = function(canvas, grid, options) {
  var width  = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  canvas.width  = width;
  canvas.height = height;

  var ctx = canvas.getContext('2d');
  var points = [];
  var isActive = true;
  var activeCount = 0;

  options = options || {};
  _.defaults(options, {
    entropy : 1,
    speed   : 1,
    padding : 10,
    size    : 2,
    color   : {
      r : 247,
      g : 202,
      b : 24,
      a : 1,
    }
  });

  init(grid);
  render();


  // PRIVATE
  function init (grid) {
    _.invoke(points, 'deactivate');
    points = [];

    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[0].length; x++) {
        if (grid[y][x]) {
          var point = new Point(x * options.padding + options.size, y * options.padding + options.size, options.size);
          points.push(point);
        }
      }
    }

    // find connections
    _.each(points, function(p1) {
      p1.connections = _.chain(points)
        .filter(function(p2) { return p1 != p2 && getDistance(p1, p2) <= Math.pow(options.padding, 2) * 2; })
        .value();
    });
  }
  
  function Point (x, y, r) {
    var _this = this;
    var _originX = x;
    var _originY = y;
    var _active = false;

    // constructor
    (function() {
      _this.x = x;
      _this.y = y;
      _this.r = r;
      _this.connections = [];

      _this.deactivate = deactivate;
      _this.activate = activate;

      activate();
    })();

    // methods
    this.render = function() {
      var rgb = _.chain(options.color).pick('r', 'g', 'b').map(parseInt).value();
      var opacity = Number(options.color.a);
      
      ctx.fillStyle = 'rgba(' + rgb.join() + ',' + opacity + ')';
      ctx.strokeStyle = 'rgba(' + rgb.join() + ',' + opacity / 5 + ')';


      ctx.beginPath();
      ctx.arc(_this.x, _this.y, _this.r, 0, 2 * Math.PI);
      ctx.fill();

      _.each(this.connections, function(toPoint) {
        if (toPoint != this) {
          ctx.beginPath();
          ctx.moveTo(_this.x, _this.y);
          ctx.lineTo(toPoint.x, toPoint.y);
          ctx.stroke();
        }
      });
    };

    function deactivate() {
      if (_active) {
        _active = false;
        activeCount--;  
      }
    };

    function activate() {
      if (!_active) {
        _active = true;
        activeCount++;
        animate();
      }
    };

    // private
    function animate () {
      if (!options.entropy && _this.x === _originX && _this.y === _originY) _this.deactivate();
      if (!_active) return;

      var targetX = _originX - options.entropy + options.entropy * 2 * Math.random();
      var targetY = _originY - options.entropy + options.entropy * 2 * Math.random();

      targetX = Math.min(Math.max(targetX, options.size), width - options.size);
      targetY = Math.min(Math.max(targetY, options.size), height - options.size);

      TweenLite.to(_this, options.speed * (Math.random()+1), {
        x: targetX,
        y: targetY,
        onComplete: animate
      });
    }
  }


  function render () {
    ctx.clearRect(0, 0, width, height);
    _.invoke(points, 'render');

    if (activeCount)
      requestAnimationFrame(render);
    else
      isActive = false;
  }

  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }


  // PUBLIC
  this.speed   = function(v) { options.speed = v; };
  this.entropy = function(v) {
    options.entropy = v;
    if (v) _.invoke(points, 'activate');
    if (!isActive) {
      isActive = true;
      render();
    }
  };
  this.opacity = function(v) { options.color.a = v; };
  this.color   = function(r, g, b, speed) {
    speed = speed || 1;
    TweenLite.to(options.color, speed, {
      r: r,
      g: g,
      b: b
    });
  };

  this.colorHex = function(hex, speed) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    this.color(r, g, b, speed);
  };

  this.grid = function(grid) {
    init(grid || []);
  };
};
