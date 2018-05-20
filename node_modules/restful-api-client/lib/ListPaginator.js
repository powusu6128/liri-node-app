!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , EventEmitter  = require('ee-event-emitter')
        , clone         = require('clone')
        , asyncMethod   = require('async-method');



    module.exports = new Class({
        inherits: EventEmitter


        , init: function(pager, response, requestConfig, responseData) {
            this.pager                  = pager;
            this.response               = response;
            this.originalRequestConfig  = requestConfig;
            this.responseData           = responseData
        }


    


        /**
         * load the next set of items
         *
         * @param <function> optional callback, if omitted promise will be returned
         */
        , next: asyncMethod(function(callback) {
            if (!this.pager.hasNextPage(this.response, this.responseData)) callback(new Error('Cannot load the next page, the last page was already loaded!'));
            else {
                var newRequest = clone(this.originalRequestConfig);
                this.pager.prepareNextRequest(this.originalRequestConfig, newRequest, this.response , this.responseData);

                this.emit('request', newRequest, callback);
            }
        })


        
        /**
         * load the previous set of items
         *
         * @param <function> optional callback, if omitted promise will be returned
         */
        , previous: asyncMethod(function(callback) {
            if (!this.pager.hasPreviousPage(this.response, this.responseData)) callback(new Error('Cannot load the previous page, the first page was already loaded!'));
            else {
                var newRequest = clone(this.originalRequestConfig);
                this.pager.preparePreviousRequest(this.originalRequestConfig, newRequest, this.response , this.responseData);

                this.emit('request', newRequest, callback);
            }
        })
    });
}();
