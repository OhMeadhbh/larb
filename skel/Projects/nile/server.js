var http = require( 'http' );

http.createServer( function( request, response ) {
  response.writeHead( 200, {'Content-Type': 'text/plain'} );
  response.end( 'nile ' + (new Date()).toString() );
} ).listen( 9000, '127.0.0.1' );
