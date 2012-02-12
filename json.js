exports.middleware = function(next, app) {
	var headers = {
		"Content-Type": "application/json"
	};
	var codes = {
		GET: 200,
		HEAD: 200,
		//TODO include Location header
		POST: 201,
		PUT: 200,
		DELETE: 204
	};
	return function(request) {
		try {
			var result = next(request);
			return {
				status: codes[request.method],
				headers: headers,
				body: result && request.method != "HEAD" ? [JSON.stringify(result),
						"\n"] : []
			};
		} catch(e) {
			if(e.notfound) {
				return {
					status: 404,
					headers: {},
					body: []
				};
			} else {
				return {
					status: 503,
					headers: headers,
					body: [JSON.stringify({
						error: 503,
						reason: e.message
					}), "\n"]
				};
			}
		}
	};
};