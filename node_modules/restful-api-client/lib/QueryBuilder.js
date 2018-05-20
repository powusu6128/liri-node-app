!function() {

    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , type          = require('ee-types')
        , EventEmitter  = require('ee-event-emitter')
        , asyncMethod   = require('async-method');



    /**
     * the query builder is used to create list and
     * bulk update calls
     */


    module.exports = new Class({
        inherits: EventEmitter


        , init: function(options) {

            // store parameters passed to the query builder
            this.parameters = options.parameters;

            // maybe we got an id, store it
            if (this.parameters && this.parameters.length) {
                this.id = type.object(this.parameters[0]) && this.parameters[0] !== null ? this.parameters.id : this.parameters[0];
            }
            

            // store references to the parent query builder
            if (options.parent) this.parent = options.parent;
        }



        /**
         * execute the list function, 
         * build the requests using the middlewares
         * passed in the configurations
         */
        , list: asyncMethod(function(callback) {
            var request = {};

            // http method
            request.method = this._list.method;

            // set the default headers
            request.headers = this._list.headers;

            // build url
            request.url = this._buildListUrl();

            // let the middleware do the rest
            this._list.requestBuilder(request, this.parameters);
            

            // offset && limit
            if (type.number(this.getLimit())) this._list.limitBuilder(request, this.getLimit()); 
            if (type.number(this.getOffset())) this._list.offsetBuilder(request, this.getOffset()); 
            
            // send to the RestfulAPIClient class
            this.emitRequest(request, callback);
        })



        // get the limit from thwe tree
        , getLimit: function() {
            if (type.number(this._limit)) return this._limit;
            else if (this.parent) return this.parent.getLimit();
            else return null;
        }

        // get the offset from thwe tree
        , getOffset: function() {
            if (type.number(this._offset)) return this._offset;
            else if (this.parent) return this.parent.getOffset();
            else return null;
        }

        


        /**
         * limit the range of the request
         */
        , limit: function(limit) {
            this._limit = limit;
            return this;
        }


        

        /**
         * offset the range of the request
         */
        , offset: function(offset) {
            this._offset = offset;
            return this;
        }





        , _buildListUrl: function() {
            var url = '';

            if (this.parent) url += this.parent._buildListUrl();

            if (this.id) return url + this._list.url + '/' + this.id;
            else return url + this._list.url;
        }
    });
}();
