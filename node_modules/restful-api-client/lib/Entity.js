!function() {

    var   Class                 = require('ee-class')
        , log                   = require('ee-log')
        , EventEmitter          = require('ee-event-emitter')
        , Model                 = require('./Model')
        , QueryBuilderBuilder   = require('./QueryBuilderBuilder');



    /*
     * the entity builder sets up the entites constructor
     * and the query builder as well as the model
     */


    module.exports = new Class({
        inherits: EventEmitter

        , init: function(name, resourceDefinition, definition, handleRequest) {
            var thisContext = this;

            // redirect requests
            this.handleRequest = handleRequest;

            // create the custom query builder 
            this.createQueryBuilder(name, resourceDefinition, definition);

            // create the custom model
            this.createModel(name, resourceDefinition, definition);


            // we need to return a custom constructor in order
            // to be able to differentiate between list and 
            // create requests
            var Constructor = function() {


                if (this instanceof Constructor) {
                    // creating stuff
                    return new thisContext.Model(Array.prototype.slice.call(arguments));
                }
                else {
                    // listing or bulk updating stuff
                    return new thisContext.QueryBuilder({
                        parameters: Array.prototype.slice.call(arguments)
                    });
                }
            };


            // the class constructor supports returning 
            // custom objects
            return Constructor;
        }




        /**
         * set up the custom query builder
         */
        , createQueryBuilder: function(name, resourceDefinition, definition) {
            this.QueryBuilder = new QueryBuilderBuilder(name, resourceDefinition, definition, this.handleRequest);
        }


        /**
         * set up the model builder
         */
        , createModel: function(name, resourceDefinition, definition) {
            this.Model = new Model(name, resourceDefinition, definition);
        }
    });
}();
