var objects = require("common-utils/objects");

function requestUrl(request) {
	//TODO handle case when we're behind a proxy
	return request.scheme + '://' + request.host
			+ (request.port == 80 ? '' : ':' + request.port) + request.scriptName
			+ request.pathInfo;
}

exports.middleware = function(next, app) {
	app.json = {};
	var headers = {
		"Content-Type" : "application/json"
	};
	var codes = {
		GET : 200,
		HEAD : 200,
		POST : 201,
		PUT : 200,
		DELETE : 204
	};
	return function(request) {
		var body = request.input.read().decodeToString();
		if (body) {
			try {
				request.body = JSON.parse(body);
			} catch (e) {
				return {
					status : 400,
					headers : headers,
					body : [ JSON.stringify({
						error : 400,
						reason : e.message
					}), "\n" ]
				}
			}
		}
		try {
			var result = next(request);
			var h = headers;
			if (request.method == "POST") {
				h = objects.merge(h, {
					"Location" : requestUrl(request) + '/' + result[app.json.id]
				});
			}
			return {
				status : codes[request.method],
				headers : h,
				body : result && request.method != "HEAD" ? [
						JSON.stringify(result), "\n" ] : []
			};
		} catch (e) {
			if (e.notfound) {
				return {
					status : 404,
					headers : {},
					body : []
				};
			} else {
				console.warn(e.stack);
				return {
					status : 503,
					headers : headers,
					body : [ JSON.stringify({
						error : 503,
						reason : e.message
					}), "\n" ]
				};
			}
		}
	};
};