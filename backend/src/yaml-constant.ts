const { readFileSync } = require('fs');
const YAML = require('yaml');

const config_file = readFileSync('./config.yml', 'utf8');
const config = YAML.parse(config_file);

export { config };