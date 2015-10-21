Template.body.onRendered(function() {
  var grid = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
  ];

  // var grid = _(10).times(function() {
  //   return _(10).times(function() {
  //     return 1;
  //   });
  // });

  var canvas = this.find('#canvas');
  var ether = this.ether = new Ethergrid(canvas, grid);
});


Template.body.events({
  'mousemove #canvas': function(event) {
    console.log(event.offsetX, event.offsetY);
  },

  'change input[name=speed]': function(event, template) {
    template.ether.speed(event.target.value);
  },

  'change input[name=entropy]': function(event, template) {
    template.ether.entropy(event.target.value);
  },

  'change input[name=color]': function(event, template) {
    template.ether.colorHex(event.target.value);
  },

  'change input[name=opacity]': function(event, template) {
    template.ether.opacity(event.target.value);
  },
});