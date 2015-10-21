Package.describe({
  name: 'hyperborea:ethergrid',
  version: '0.0.1',
  summary: 'Renders a connected grid that "swirls" depending on it\'s entropy',
  git: 'https://github.com/hyperborea/ethergrid.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('underscore');

  api.addFiles('lib/TweenLite.js', 'client');
  api.addFiles('ethergrid.js', 'client');

  api.export('Ethergrid', 'client');
});
