!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log');



    module.exports = new Class({


        envelope: ['data']


        , init: function(envelopeName) {
            if (envelopeName) this.envelope = envelopeName.split('.');
        }



        /**
         * extract data from the envelop so the user receives the data without it
         * 
         * @param <Object> responseData
         */
        , parseResponse: function(responseData) {
            return this._extractEnvelopeData(responseData, this.envelope);
        }




        /**
         * extracts data from an envelope
         */
        , _extractEnvelopeData: function(data, envelope) {
            if (data && envelope && envelope.length) {
                if (data[envelope[0]]) { 
                    return this._extractEnvelopeData(data[envelope[0]], envelope.slice(1));
                }
                else return data;
            }
            else return data;
        } 
    });
}();
