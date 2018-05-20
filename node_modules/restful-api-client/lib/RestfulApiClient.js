!function() {

	var   Class 		       = require('ee-class')
        , type                 = require('ee-types')
		, log 			       = require('ee-log')
        , debug                = require('ee-argv').has('debug-api-client')
        , RateLimiter          = require('request-rate-limiter')
        , Entity               = require('./Entity')
        , ListResponseParser   = require('./ListResponseParser');




    var staticMethodNames = [
          'QueryOffsetHandler'
        , 'QueryListRequestBuilder'
        , 'QueryLimitHandler'
        , 'ResponseEnvelopeHandler'
        , 'EnvelopePaginator'
        , 'ContentErrorParser'
    ];






    /**
     * The actual api generator
     */
	var APIClient = module.exports = new Class({

        // the url to prepend to each built request path
          baseURL: ''

        // the host to send requests to
        , host: ''

        // the path tp make requests to
        , basePath: ''


        // default rate limit
        , rateLimit: 60

        // default backoff time
        , backoffTime: 10

        // backoff http status
        , backoffStatus: 429

        // how long to wait until to time out requests (10 mins)
        , timeout: 600

        // count the request that were executed
        , requestCount: 0

        // time when the first request was fired
        , firstRequest: null

        /**
         * class constructor
         */
		, init: function(definition) {
            if (!type.object(definition)) throw new Error('Missing the api definition!')

            // URL stuff
            if (type.string(definition.host)) this.host = definition.host;
            if (type.string(definition.basePath)) this.basePath = definition.basePath;

            // create base url
            this.baseURL = this.host+this.basePath;

            // first request
            this.firstRequest = Date.now();

            // rate limiting options
            if (type.number(definition.backoffStatus)) this.backoffStatus = definition.backoffStatus;
            if (type.number(definition.backoffTime)) this.backoffTime = definition.backoffTime;
            if (type.number(definition.rateLimit)) this.rateLimit = definition.rateLimit;
            if (type.number(definition.timeout)) this.timeout = definition.timeout;


            // rate limited requests
            this.limiter = new RateLimiter({
                  rate           : this.rateLimit
                , interval       : 60
                , backoffCode    : this.backoffStatus
                , backoffTime    : this.backoffTime
                , maxWaitingTime : this.timeout
            });


            // prepare response parsers
            this.listParser = new ListResponseParser(definition);

            // the paginator needs to emit requests
            this.listParser.on('request', this.handleListRequest.bind(this));

            // hidden property
            Class.define(this, '_api', Class({}));


            // build the API from the definition
            this._buildApi(definition);

            // we got a root entity, return it instead of the class isntances
            if (this._rootEntity) {
                // apply api to it
                Object.keys(this._api).forEach(function(apiName) {
                    this._rootEntity[apiName] = this._api[apiName];
                }.bind(this));

                return this._rootEntity;
            }
		}




        /**
         * create the api interface from the specifications
         */
        , _buildApi: function(definition) {
            Object.keys(definition.resources).forEach(function(resourceName) {
                if (resourceName === '_root') this._rootEntity = new Entity(resourceName, definition.resources[resourceName], definition, this.handleListRequest.bind(this));
                else this[resourceName] = new Entity(resourceName, definition.resources[resourceName], definition, this.handleListRequest.bind(this));
            }.bind(this));
        }




        /**
         * manages outgoing requests
         */
        , handleListRequest: function(request, callback) {
            if (type.function(this.prepareRequest)) this.prepareRequest(request);

            // prepend th ebase url
            if (!/^https?:\/\//gi.test(request.url)) request.url = this.baseURL+request.url;

            // fuck them!
            request.qs = request.query;

            if (debug) log.info('sending request to %s', request.url, request);

            // let the limiter do the request
            this.limiter.request(request, function(err, response) {
                if (debug) {
                    this.requestCount++;
                    log.debug('Fired %s requests, %s requests per minute ...', this.requestCount, (this.requestCount/((Date.now()-this.firstRequest)/1000/60)));
                }
                if (err) {
                    if (debug) log.warn('The request on the url %s failed: %s', request.url, err.message);
                    callback(err);
                }
                else {
                    if (debug) log.debug('The request on the url %s returned with the status %s and a body of %s bytes ...', request.url, response.statusCode, (response.body || '').length);
                    if (type.function(this.prepareResponse)) this.prepareResponse(response);

                    this.listParser.parseResponse(response, request, function(err, data, paginator) {
                        if (err || !data || !type.function(this.prepareResponseContent)) callback(err, data, paginator);
                        else {
                            data = this.prepareResponseContent(data);
                            callback(err, data, paginator);
                        }
                    }.bind(this));
                }
            }.bind(this));
        }
	});







    // set static methods
    APIClient.applyTo = function(target) {
        staticMethodNames.forEach(function(name) {
            target[name] = require('../middlewares/'+name);
        });
    }


    // expose the middlewares on the constructor
    APIClient.applyTo(APIClient);    
}();
