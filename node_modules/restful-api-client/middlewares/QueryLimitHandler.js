!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log');



    module.exports = new Class({

        propertyName: 'limit'


        , init: function(propertyName) {
            if (propertyName) this.propertyName = propertyName;
        }



        /**
         * apply the limit to the request
         * 
         * @param <Object> the request definition
         * @param <Number> the limit to apply
         */
        , buildRequest: function(request, limit) {
            if (!request.query) request.query = {};
            
            request.query[this.propertyName] = limit;
        }
    });
}();
