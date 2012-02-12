# Tokenize

This is a work in progress attempt to implement the [Parse.com REST API](https://www.parse.com/docs/rest) using [Common Node](https://github.com/olegp/common-node/) and [Mongo Sync](https://github.com/olegp/mongo-sync/).

To run, first install Common Node with `npm install common-node -g` then:

    git clone git://github.com/olegp/tokenize.git
    cd tokenize
    npm install
    common-node index.js

Then, use `curl` to connect to the server on port 8080, e.g.:

     curl -d '{"test":"test"}' http://localhost:8080/classes/notes
     curl 'http://localhost:8080/classes/notes

