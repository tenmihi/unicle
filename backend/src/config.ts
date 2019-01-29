const { readFileSync } = require('fs');
const YAML = require('yaml');

const file = readFileSync('./config.yml', 'utf8');
const config = YAML.parse(file);

export default config;