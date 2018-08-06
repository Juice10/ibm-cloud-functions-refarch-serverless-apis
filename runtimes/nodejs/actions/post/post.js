// Load the Cloudant library.
var common = require('./common/utils.js')
var content_type_header = {'Content-Type': 'application/json'}

var todo_db_name = "todos"

function postHandler(params) {
  var api_root_url = params.base_url;
  cloudant = common.getDb(params)

  return new Promise(function(resolve, reject) {
    common.asyncSafeDbCreate(cloudant.db, todo_db_name)
    .then(function() {
      todo_db = cloudant.db.use(todo_db_name)
      // Title is mandatory
      if (! params.title) {
        reject({
          statusCode: 400,
          headers: content_type_header,
          body: {
            error: "A title for the TODO is mandatory."
          }
        })
      }
      todo_id = common.getToDoID(params)
      // ID is not allowed (generated by the backend)
      if (todo_id) {
        reject({
          statusCode: 400,
          headers: content_type_header,
          body: {
            error: "Setting the ID for a TODO is not allowed."
          }
        })
      } else {
        return common.asyncToDoPost(todo_db, api_root_url, params)
      }
    })
    .then(common.resolveSuccessFunction(resolve))
    .catch(common.rejectErrorsFunction(reject))
  })
}

exports.main = postHandler;