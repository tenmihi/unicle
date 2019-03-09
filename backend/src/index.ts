if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'fetch') {
  exports.fetch = require('./lib/funcs/fetch').fetch;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'update_by_hatena_bookmark') {
  exports.update_by_hatena_bookmark = require('./lib/funcs/update-by-hatena-bookmark').update_by_hatena_bookmark;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'update_by_rss') {
  exports.update_by_rss = require('./lib/funcs/update-by-rss').update_by_rss;
}