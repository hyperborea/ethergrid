Ethergrid = function(canvas, grid, options) {
  var w = canvas.offsetWidth;
  var h = canvas.offsetHeight;

  canvas.width = w;
  canvas.height = h;

  var ctx = canvas.getContext('2d');
  var points = [];

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
    _.invoke(points, 'destroy');
    points = [];

    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[0].length; x++) {
        if (grid[y][x]) {
          var point = new Point((x+1) * options.padding, (y+1) * options.padding, options.size);
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
    // _.each(points, function(point) {
    //   point.connections = _.chain(points)
    //     .sortBy(function(p2) { return point.idx != p2.idx ? getDistance(point, p2) : Infinity; })
    //     .first(2)
    //     .value();
    // });
  }
  
  function Point (x, y, r) {
    var _this = this;
    var _originX = x;
    var _originY = y;
    var _active = true;

    // constructor
    (function() {
      _this.x = x;
      _this.y = y;
      _this.r = r;
      _this.connections = [];

      animate();
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

    this.destroy = function() {
      _active = false;
    };

    // private
    function animate () {
      TweenLite.to(_this, options.speed * (Math.random()+1), {
        x: _originX - options.entropy + options.entropy * 2 * Math.random(),
        y: _originY - options.entropy + options.entropy * 2 * Math.random(),
        onComplete: function() {
          if (_active) animate();
        }
      });
    }
  }


  function render () {
    ctx.clearRect(0, 0, w, h);
    _.invoke(points, 'render');

    requestAnimationFrame(render);
  }

  function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }


  // PUBLIC
  this.speed   = function(v) { options.speed = v; };
  this.entropy = function(v) { options.entropy = v; };
  this.opacity = function(v) { options.color.a = v; };
  this.color   = function(r, g, b, speed) {
    speed = speed || 1;
    TweenLite.to(options.color, speed, {r:r, g:g, b:b});
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
