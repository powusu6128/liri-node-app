!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , debug         = require('ee-argv').has('debug-api-client')
        , EventEmitter  = require('ee-event-emitter')
        , ListPaginator = require('./ListPaginator');



    module.exports = new Class({
        inherits: EventEmitter


        , init: function(definition) {
            var list;

            if (definition.methods.list) {
                list = definition.methods.list;

                if (list.envelopeHandler) this.envelopeHandler = list.envelopeHandler;
                if (list.paginator) this.paginator = list.paginator;
                if (list.errorParser) this.errorParser = list.errorParser;
            }
        }



        /**
         * parse the response
         *
         * @param <object> response 
         */
        , parseResponse: function(response, requestConfig, callback) {
            this.getBody(response, function(err, rawData) {
                if (err) {
                    if (debug) log.warn('Failed to get body from response for url %s : %s', requestConfig.url, err.message);
                    callback(err);
                }
                else {
                    if (this.errorParser) {
                        err = this.errorParser.parseResponse(response, rawData);
                        if (err instanceof Error) return callback(err);
                    }

                    var   data      = this.envelopeHandler ? this.envelopeHandler.parseResponse(rawData) : rawData
                        , paginator = this.paginator ? new ListPaginator(this.paginator, response, requestConfig, rawData) : null;

                    if (debug) log.debug('Extracted data from the request on the url %s ...', requestConfig.url);

                    if (paginator) {
                        paginator.on('request', function(request, callback) {
                            this.emit('request', request, callback);
                        }.bind(this));
                    }

                    callback(null, data, paginator);
                }
            }.bind(this));
        }




        /**
         * parse body data from request
         */
        , getBody: function(response, callback) {
            var   contentType = this.getHeader(response, 'content-type')
                , data;

            if (contentType === 'application/json') {
                try {
                    data = JSON.parse(response.body);
                } catch(e) {
                    return callback(new Error('Failed to parse response data: '+e.message));
                }

                callback(null, data);
            }
            else callback();
        }




        /**
         * returns a speĉific header from the response
         */
        , getHeader: function(response, headerName) {
            if (response && response.headers && response.headers[headerName]) return response.headers[headerName].trim().toLowerCase();
            return null;
        }
    });
}();
