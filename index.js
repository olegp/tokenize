//var base64 = require("common-utils/base64");
var Application = require("stick").Application;
var mongo = new (require("mongo-sync").Server)();

var app = exports.app = Application();

var db = mongo.db("tokenize");

app.configure("notfound", require("./json"), "params", "route");

app.get("/classes/:collection", function(request, collection) {
	return db.getCollection(collection).find().toArray().map(function(e) {
		e.objectId = e._id;
		delete e._id;
		return e;
	});
});

app.post("/classes/:collection", function(request, collection) {
	var object = JSON.parse(request.input.read().decodeToString());
	object.createdAt = object.updatedAt = new Date();
	var id = db.getCollection(collection).save(object)._id;
	return {
		objectId: id,
		createdAt: object.createdAt
	}
});