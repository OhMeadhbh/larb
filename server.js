// server.js - api implementation for the larb service
// Copyright (c) 2011-2012 Meadhbh S. Hamrick, All Rights Reserved
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var express = require( 'express' );
var spawn   = require( 'child_process' ).spawn;

var host_port = 2525;

var app = express.createServer();

app.use( express.bodyParser() );
app.use( express.static( __dirname + '/static' ) );
app.use( app.router );

function run_this ( cmd, args, input, failure, success ) {
    var process = spawn( cmd, args );
    
    process.on( 'exit', function ( code ) {
        if( 0 != code ) {
            failure();
        } else {
            success();
        }
    } );
    
    process.stdin.write( input );
    process.stdin.end();
}

app.post( '/api/config', function( request, response ) {
    var rb = request.body;
    var rv = {};
    
    config( finish_request );
    
    function is_param_valid ( param ) {
      return( ('string' === typeof param) && (param.length > 0) );
    }

    function config ( callback ) {
      if( is_param_valid( rb.username ) && is_param_valid( rb.password ) ) {
        var cmd = '/opt/larb/personalize.sh';
        var args = [ rb.fullname, rb.username, rb.password ];
        var input = rb.public + '\n';

        function success () {
          rv.success = true;
          callback( 200 );
        }

        function failure () {
          rv.success = false;
          rv.error = 'personalization process failed';
          callback( 200 );
        }
        run_this( cmd, args, input, failure, success );
      } else {
        rv.success = false;
        rv.error = 'missing required parameter';
        callback( 200 );
      }
    }
    
    function finish_request ( status ) {
        var response_text;
        var content_type;
        
        if( 200 === status ) {
            response_text = JSON.stringify( rv );
            content_type = 'application/json';
        } else {
            response_text = 'error ' + status;
            content_type = 'text/plain';
        }
        
        response.writeHead( status, {'Content-Type': content_type} );
        response.end( response_text );
    }
} );

app.listen( host_port );
//app.listen( host_port, host_address );
