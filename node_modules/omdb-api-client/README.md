# omdb-api-client

a simple omdb api client

## installation

    npm i omdb-api-client

## build status

[![Build Status](https://travis-ci.org/eventEmitter/omdb-api-client.png?branch=master)](https://travis-ci.org/eventEmitter/omdb-api-client)

## usage
    
    // import
    var APIClinet = require('omdb-api-client');

    // instantiate
    var omdb = new APIClinet();


You may use all request parameters specified ont he [omdb api page](http://www.omdbapi.com/)

    // list a movie using promises
    omdb({t:'chappie'}).list().then(function(movie) {
        log(movie);
    }).catch(function(err) {
        log(err);
    });


    // list a movie using callbacks
    omdb({i:'tt1823672'}).list(function(err, movie) {
        log(err, movie);
    });

The results returned from the omdb API are normalized before they are returned from the omdb api client to the caller. A result may look like this:

    {
        title: "Chappie"
        , year: 2015
        , rated: "R"
        , released: Fri Mar 06 2015 00:00:00 GMT+0100 (CET)
        , runtime: 120
        , genres: (3):[
            0: "Action"
            , 1: "Sci-Fi"
            , 2: "Thriller"
        ]
        , directors: (1):[
            0: "Neill Blomkamp"
        ]
        , writers: (2):[
            0: "Neill Blomkamp"
            , 1: "Terri Tatchell"
        ]
        , actors: (4):[
            0: "Hugh Jackman"
            , 1: "Sigourney Weaver"
            , 2: "Sharlto Copley"
            , 3: "Dev Patel"
        ]
        , plot: "In the near future, crime is patrolled by an oppressive mechanized police force. When one police droid, Chappie, is stolen and given new programming, he becomes the first robot with the ability to think and feel for himself."
        , languages: (1):[
            0: "English"
        ]
        , countries: (2):[
            0: "Mexico"
            , 1: "USA"
        ]
        , awards: null
        , poster: "http://ia.media-imdb.com/images/M/MV5BMTUyNTI4NTIwNl5BMl5BanBnXkFtZTgwMjQ4MTI0NDE@._V1_SX300.jpg"
        , metascore: null
        , type: "movie"
    }
