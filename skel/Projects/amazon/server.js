var http = require( 'http' );

http.createServer( function( request, response ) {
  response.writeHead( 200, {'Content-Type': 'text/plain'} );
  response.end( 'amazon ' + (new Date()).toString() );
} ).listen( 9010, '127.0.0.1' );