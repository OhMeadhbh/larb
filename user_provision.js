( function () {
	var spawn   = require( 'child_process' ).spawn;
	
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

	function addEndpoints ( app ) {
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
	}
	
	if( module && module.exports ) {
		module.exports = {
			addEndpoints: addEndpoints	
		};
	}
} ) ();