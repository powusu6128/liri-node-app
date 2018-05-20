# restful-api-client

Build RESTful API clients using specifications

## installation

    npm i restful-api-client

## build status

[![Build Status](https://travis-ci.org/eventEmitter/restful-api-client.png?branch=master)](https://travis-ci.org/eventEmitter/restful-api-client)


## usage


### build the api using the configuration


    var APIClient = require('restful-api-client');


    var specification = {
          host          : 'http://api.cinergy.ch'
        , baseURL       : '/v1.0/cinema'
        , backoffStatus : 429
        , backoffTime   : 10
        , rateLimit     : 60
        , methods: {
            list: {
                  httpMethod        : 'get'
                , requestBuilder    : APIClient.queryListRequestBuilder
                , offsetHandler     : APIClient.queryOffsetHandler
                , limitHandler      : APIClient.queryLimitHandler
                , envelopeHandler   : APIClient.dataListEnvelopeHandler
                , paginator         : new APIClient.envelopePaginator(
                                                    'links.next.href'
                                                  , 'links.previous.href')
                , emptyResultStatus : 404
            }
        }
        , authenticationHandler: APIClient.headerTokenHandler
        , resources: {
            movies: {
                  list: '/movies'
                , subEntities: {
                    images: {
                        list: '/movies/{id}/images'
                    }
                }
            }
        }
    }



    var CinemaAPI = new Class({
        inherits: APIClient

        , init: function init(authToken) {

            // each request has to transmit an auth token within
            this.authToken = authToken;

            // call superm it will set up everything
            init.super.call(this, specification);
        }


        , prepareRequest: function(request) {
            if (!request.headers) request.headers = {};

            request.headers['auth-token'] = this.authToken;
        }
    });


    // expose all static members to the public
    APIClient.applyTo(CinemaAPI);



### actual api usage

    var api = new CinemaAPI('my api auth token');


    // start requesting data
    api.movies(234)
       .images()
       .limit(100)
       .offset(2)
       .find().then(function(resultSet) {
        return paginator.next(100);
    }).then(function(resultset) {
       
    }).catch();