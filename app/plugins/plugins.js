const context = require.context('./', true, /index\.js/)

/**
 * Require's the `index.js` file from each plugin directory.
 * The result of each require is
 * @param  {Object} ctx
 * @returns {array}     An array of objects. Each object is a plugin.
 */
const requireAllPlugins = function(ctx) {
  const keys = ctx.keys()
  //array of values from each index.js require
  const values = keys.map(ctx)
  return values
}
const allPlugins = requireAllPlugins(context)

//TODO: change filename back to index.js?, but I need to figure out how
//to tell tell require.context to not include this file or else
//an extra empty object gets created as a plugin.
module.exports = [...allPlugins]
