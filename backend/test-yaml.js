const yaml = require('js-yaml');

const config = {
  _format_version: '3.0',
  services: [
    {
      name: 'test',
      protocol: 'http',
      host: 'example.com',
      port: 80
    }
  ]
};

console.log(yaml.dump(config, { indent: 2, lineWidth: -1, noRefs: true }));
