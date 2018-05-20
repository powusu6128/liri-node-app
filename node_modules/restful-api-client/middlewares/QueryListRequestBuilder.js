!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types');



    module.exports = new Class({

        /**
         * apply a set of parameters to the request
         * 
         * @param <Object> the request definition
         * @param <Object> the parameters to apply
         */
        buildRequest: function(request, parameters) {
            if (parameters && parameters.length) {
                if (type.object(parameters[0])) {
                    if (!request.query) request.query = parameters[0];
                    else {
                        Object.keys(parameters[0]).forEach(function(key) {
                            request.query[key] = parameters[0][key];
                        });
                    }
                }
            }
        }
    });
}();
