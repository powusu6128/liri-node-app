(function() {
    'use strict';


    const log = require('ee-log');
    const assert = require('assert');
    const OMBDAPI = require('../');

    let omdb;



    describe('The OMBDAPI', function() {
        it('should not crash when instantiated', function() {
            omdb = new OMBDAPI();
        });
        


        it('should be able to list movies', function(done) {
            this.timeout(10000);

            omdb({t:'chappie'}).list().then((movie) => {
                assert(movie);
                done();
            }).catch(done);
        });



        it('should be able to identify errors', function(done) {
            this.timeout(10000);

            omdb({t:'chappipe'}).list().then(() => {}).catch((err) => {
                assert(err instanceof Error);
                done();
            });
        });
    });
})();   
    