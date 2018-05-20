!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , EventEmitter  = require('ee-event-emitter')
        , QueryBuilder  = require('./QueryBuilder');



    /**
     * creates custom querybuilders derived
     * from configurations
     */


    var QueryBuilderBuilder = module.exports = new Class({
        inherits: EventEmitter


        , init: function(name, resourceDefinition, definition, emitRequest) {
            var ClassDefinition = {};

            // let the QueryBuilder variation inherit the QueryBuilder class
            ClassDefinition.inherits = QueryBuilder;

            // store configs on the QueryBuilder and this class
            this.name = ClassDefinition.name = name;
            this.resourceDefinition = ClassDefinition.resourceDefinition = resourceDefinition;
            this.definition = ClassDefinition.definition = definition;

            // propagate events
            ClassDefinition.emitRequest = emitRequest;

            
            // set default values
            this._setDefault(ClassDefinition);


            // create children
            this._createSubBuilders(ClassDefinition, emitRequest);

            // return the class
            return new Class(ClassDefinition);
        }





        /**
         * create query builders on top of the current one
         */
        , _createSubBuilders: function(ClassDefinition, emitRequest) {
            var thisContext = this;

            if (this.resourceDefinition.resources) {
                Object.keys(this.resourceDefinition.resources).forEach(function(name) {
                    var QB = new QueryBuilderBuilder(name, this.resourceDefinition.resources[name], this.definition, emitRequest);

                    ClassDefinition[name] = function() {
                        return new QB({
                              parmaters: Array.prototype.slice.call(arguments)
                            , parent: this
                        });
                    } 
                }.bind(this));
            }
        }





        /**
         * send events upwards
         */
        , emitRequest: function(request, callback) {
            this.emit('request', request, callback);
        }





        /**
         * set defaults
         */
        , _setDefault: function(ClassDefinition) {
              // storage for defaults
            ClassDefinition._list = {};

            // list defaults
            ClassDefinition._list.headers = this.definition.methods.list.headers || {
                 accept: 'application/json'
            };

            // method
            ClassDefinition._list.method = this.definition.methods.list.method || 'get';

            // url
            ClassDefinition._list.url = this.resourceDefinition.list || '/'+ this.name;

            // builders
            ClassDefinition._list.requestBuilder = this.definition.methods.list.requestBuilder.buildRequest.bind(this.definition.methods.list.requestBuilder);
            if (this.definition.methods.list.offsetHandler) ClassDefinition._list.offsetBuilder = this.definition.methods.list.offsetHandler.buildRequest.bind(this.definition.methods.list.offsetHandler);
            if (this.definition.methods.list.limitHandler) ClassDefinition._list.limitBuilder = this.definition.methods.list.limitHandler.buildRequest.bind(this.definition.methods.list.limitHandler);
        }
    });
}();
