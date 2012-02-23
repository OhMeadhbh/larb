( function () {
	var net = require( 'net' );
	var log = require( 'util' ).log;
	
	function debug_proxy ( options ) {
		this.options = options;
		this.listening = false;
		this.connected = false;
	}
	
	debug_proxy.prototype.listen = function () {
		var local_port = 5858;
		var local_host = '127.0.0.1';
		var remote_port = 5858;
		var remote_host = '192.168.56.2';
		
		if( this.options ) {
			if( this.options.local ) {
				local_port = this.options.local.port || 5858;
				local_host = this.options.local.host || '127.0.0.1';
			}
			if( this.options.remote ) {
				remote_port = this.options.remote.port || 5858;
				remote_host = this.options.remote.host || '192.168.56.2';
			}
		}

		var that = this;

		function serverListeningListener( ) {
			that.listening = true;
		}
		
		function serverConnectionListener( socket ) {
			if( that.connected ) {
				socket.on( 'close', function( has_error ) {
					socket.destroy();
				} );
				socket.end();
			} else {
				that.connected = true;
				that.socket = socket;
		
				socket.on( 'data', function ( data ) {
					if( that.client ) {
						client.write( data );
					}
				} );
		
				socket.on( 'end', function () {
					if( that.client ) {
						that.client.end();
					}
				} );
			
				socket.on( 'close', function ( has_error ) {
					socket.destroy();
					that.connected = false;
				} );

				var client = new net.Socket( { type: 'tcp4' } );
				that.client = client;
				
				client.on( 'data', function( data ) {
					socket.write( data );
				} );
				
				client.on( 'end', function() {
					socket.end();
				} );

				client.on( 'error', function( exception ) {
					log( 'client error: ' + exception.toString() );
					socket.end();
				} );
					
				client.connect( local_port, local_host );
			}
		}
		
		function serverCloseListener() {
			this.listening = false;
		}
		
		this.server = net.createServer();
		this.server.on( 'listening', serverListeningListener );
		this.server.on( 'connection', serverConnectionListener );
		this.server.on( 'close', serverCloseListener );
		this.server.listen( remote_port, remote_host );
	};
	
	debug_proxy.prototype.close = function () {
		if( this.listening && this.server ) {
			this.server.close();
		}
		
		if( this.connected && this.socket ) {
			this.socket.end();
		}
	};
	
	if( module && module.exports ) {
		module.exports = debug_proxy;
	}
} ) ();