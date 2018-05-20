!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log');



    module.exports = new Class({

          nextLink: 'links.next.href'.split('.')
        , prevLink: 'links.previous.href'.split('.')



        , init: function(nextLink, prevLink) {
            if (nextLink) this.nextLink = nextLink.split('.');
            if (prevLink) this.prevLink = prevLink.split('.');
        }



        
        /**
         * extract the next and previous page links
         * 
         * @param <Object> responseData
         */
        , parseResponse: function(responseData) {
            return {
                  next: this._extractEnvelopeData(responseData, this.nextLink)
                , prev: this._extractEnvelopeData(responseData, this.prevLink)
            };
        }



        /**
         * checks if there is a next page, its possible that 
         * there is no indication for this, it will return true
         * in that case
         *
         */
        , hasNextPage: function(response, responseData) {
            var nextLink = this._extractEnvelopeData(responseData, this.nextLink);
            return !!nextLink;
        }



        /**
         * checks if there is a next page, its possible that 
         * there is no indication for this, it will return true
         * in that case
         *
         */
        , hasPreviousPage: function(response, responseData) {
            var prevLink = this._extractEnvelopeData(responseData, this.prevLink);
            return !!prevLink;
        }



        /**
         * prepares the request object for the
         * next n items of a set
         *
         * @param <object> last request config
         * @param <object> next request
         * @param <object> current response
         */
        , prepareNextRequest: function(originalRequest, newRequest, response, responseData) {
            var nextLink = this._extractEnvelopeData(responseData, this.nextLink);
            if (nextLink) newRequest.url = nextLink;
        }



        /**
         * prepares the request object for the
         * prevois  n items of a set
         *
         * @param <object> last request config
         * @param <object> next request
         * @param <object> current response
         */
        , preparePreviousRequest: function(originalRequest, newRequest, response, data) {
            var prevLink = this._extractEnvelopeData(responseData, this.prevLink);
            if (prevLink) newRequest.url = prevLink;
        }




        /**
         * extracts a link from the envelope
         */
        , _extractEnvelopeData: function(data, envelope) {
            if (envelope && envelope.length) {
                if (data[envelope[0]]) {
                    return this._extractEnvelopeData(data[envelope[0]], envelope.slice(1));
                }
                else return undefined;
            }
            else return data;
        } 
    });
}();
