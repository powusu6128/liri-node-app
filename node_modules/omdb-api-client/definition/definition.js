!function() {
    var   RESTfulAPIClient = require('restful-api-client')
        , log = require('ee-log');



    module.exports = {
          host          : 'http://www.omdbapi.com'
        , basePath      : ''
        , backoffStatus : 429
        , backoffTime   : 5
        , rateLimit     : 60
        , methods: {
            list: {
                  httpMethod        : 'get'
                , requestBuilder    : new RESTfulAPIClient.QueryListRequestBuilder()
                , errorParser       : new RESTfulAPIClient.ContentErrorParser('Error')
                , headers: {
                    accept: 'application/json'
                }
            }
        }
        , resources: {
            _root: {
                  list: '/'
            }
        }
    }
}();
