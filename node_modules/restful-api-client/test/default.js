
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert')
		, qs 			= require('querystring')
		, Webservice 	= require('ee-webservice');



	var   RESTfulAPIClient 	= require('../')
		, APISpecfication 	= require('./APISpecfication')
		, APIImplementation
		, client;




	var createPagingEnvelope = function(request, data) {
		var   envelope = {}
			, url  	   = request._uri.protocol+'//'+request._uri.host+request.pathname;


		envelope.data = data;
		envelope.links = {};


		envelope.links.next = {
			href: url+'?'+qs.stringify({
				  offset : parseInt((request.query.offset || 0), 10)+parseInt((request.query.limit || 19), 10)
				, limit  : request.query.limit
			})
		};

		if (request.query.offset) {
			envelope.links.previous = {
				href: url+'?'+qs.stringify({
					  offset : parseInt(request.query.offset, 10)-parseInt((request.query.limit || 10), 10)
					, limit  : request.query.limit
				})
			};
		}
		

		return JSON.stringify(envelope);
	}






	describe('The RESTfulAPIClient', function() {
		before(function(done) {
			// setting up the webserver
			var service = new Webservice({
				  port:         9756
    			, interface:    Webservice.IF_ANY
			});

			// add middlewares for the tests
			service.use(function(request, response) { //log(request);

				response.setHeader('content-type', 'application/json');

				switch (request.pathname) {
					case '/prefix/movies/3/images':
						response.send(createPagingEnvelope(request, [{id:1}]));
						break;


					default:
						response.send(404);
				}
			});


			// listen
			service.listen(done)
		});





		it('should not crash when inherited from', function() {
			APIImplementation = new Class({
				inherits: RESTfulAPIClient


				, init: function init(APIKey) {
					this.apiKey = APIKey;

					// automatically build the api
					init.super.call(this, APISpecfication);
				}


				/**
				 * add my auth token to each of the requests
				 */
				, prepareRequest: function(request) {
		            if (!request.headers) request.headers = {};

		            request.headers['authorization'] = 'testAuth '+this.authToken;
		        }
			});
		});





		it('should not crash when instantiated', function() {
			client = new APIImplementation('a--b');
		});





		it('should build urls correctly', function(done) {

			//log(client.movies(3), client.movies(3).images);
			client.movies(3).offset(300).limit(20).images().list(function(err, data, paginator) {
				if (err) done(err);
				else {
					assert(data);
					assert(data.length);
					assert(data[0].id === 1);
					assert(paginator);

					done();
				}
			});
		});
	});
	