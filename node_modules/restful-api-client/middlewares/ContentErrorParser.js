!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log');



    module.exports = new Class({

          errorFieldName: 'error'


        , init: function(errorFieldName) {
            if (errorFieldName) this.errorFieldName = errorFieldName;
        }



        /**
         * extract data from the envelop so the user receives the data without it
         * 
         * @param <Object> responseData
         */
        , parseResponse: function(response, responseData) {
            if (!responseData) return new Error('Missing response content!');
            if (responseData[this.errorFieldName]) return new Error(responseData[this.errorFieldName]);
        }
    });
}();
