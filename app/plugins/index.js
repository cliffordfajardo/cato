const context = require.context('.', true, /index\.js/);

/**
 * Require's the `index.js` file from each plugin directory.
 * The result of each require is
 * @param  {Object} ctx
 * @returns {array}     An array of objects. Each object is a plugin.
 */
const requireAllPlugins = function(ctx) {
  const keys = ctx.keys();
  //array of values from each index.js require
  const values = keys.map(ctx);
  return values;
}
const allPlugins = requireAllPlugins(context);

module.exports = [...allPlugins];
