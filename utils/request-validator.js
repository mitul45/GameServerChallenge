var findMissingParams = function(request, parameters) {
	var missingParams = [];
	for(var i = 0; i < parameters.length; i++) {
		var param = request.param(parameters[i]); 
		if(param === null || param === undefined || param === ""){
			missingParams.push(parameters[i]);
		}
	}
	return missingParams;
}

module.exports = {
	missingParams: findMissingParams
}