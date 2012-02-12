//var base64 = require("common-utils/base64");
var objects = require("common-utils/objects");
var Application = require("stick").Application;
var mongo = require("mongo-sync");
var ObjectId = mongo.ObjectId;
var app = exports.app = Application();

var db = new mongo.Server().db("tokenize");

app.configure("notfound", require("./json"), "params", "route");
app.json.id = "objectId";

function wrap(e) {
	if (!e) {
		throw {
			notfound : true
		};
	}
	e.objectId = e._id;
	delete e._id;
	return e;
}

// TODO count, order
// TODO authentication
// TODO counters, data types, relational queries
// TODO users
// TODO files
// TODO geopoints

app.get("/classes/:collection", function(request, collection) {
	var limit = request.params.limit || 100;
	if (limit > 1000)
		limit = 1000;
	return {
		results : db.getCollection(collection).find(
				request.params.where ? JSON.parse(request.params.where) : {})
				.skip(request.params.skip || 0).limit(limit).toArray()
				.map(wrap)
	};
});

app.get("/classes/:collection/:id", function(request, collection, id) {
	return wrap(db.getCollection(collection).findOne({
		_id : new ObjectId(id)
	}));
});

app.post("/classes/:collection", function(request, collection) {
	var object = request.body;
	object.createdAt = object.updatedAt = new Date();
	var id = db.getCollection(collection).save(object)._id;
	return {
		objectId : id,
		createdAt : object.createdAt
	}
});

app.put("/classes/:collection/:id", function(request, collection, id) {
	// we're really doing a PATCH here
	var objectId = new ObjectId(id);
	var object = db.getCollection(collection).findOne({
		_id : new ObjectId(id)
	});
	if (!object) {
		throw {
			notfound : true
		};
	}
	object = objects.merge(object, request.body);
	object.updatedAt = new Date();
	delete object._id;
	db.getCollection(collection).update({
		_id : objectId
	}, object);
	return {
		updatedAt : object.updatedAt
	};
});

app.del("/classes/:collection/:id", function(request, collection, id) {
	if (!db.getCollection(collection).remove({
		_id : new ObjectId(id)
	})) {
		throw {
			notfound : true
		};
	}
});
