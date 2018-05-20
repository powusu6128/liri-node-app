!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log');



    module.exports = new Class({

        propertyName: 'offset'


        , init: function(propertyName) {
            if (propertyName) this.propertyName = propertyName;
        }



        /**
         * apply the offset to the request
         * 
         * @param <Object> the request definition
         * @param <Number> the offset to apply
         */
        , buildRequest: function(request, offset) {
            if (!request.query) request.query = request.query = {};

            request.query[this.propertyName] = offset;
        }
    });
}();
