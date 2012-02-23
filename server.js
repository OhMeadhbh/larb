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
var user_provision = require( './src/user_provision' );
var debug_proxy = require( './src/debug_proxy' );

var host_port = 2525;
var app;
var proxy;

process.on( 'SIGHUP', function () {
	if( app ) {
		app.close();
		setTimeout( function () {
			start_app();	
		}, 10000 );
		
	}
	if( proxy ) {
		proxy.close();
		setTimeout( function () {
			start_proxy();
		}, 10000 );
	}
} );

function start_app() {
	app = express.createServer();

	app.use( express.bodyParser() );
	app.use( express.static( __dirname + '/static' ) );
	app.use( app.router );

	user_provision.addEndpoints( app );
	
	app.listen( host_port );
}

function start_proxy() {
	var proxy_opts = {
			local: {
				port: 5858,
				host: '127.0.0.1'
			},
			remote: {
				port: 5858,
				host: '192.168.56.2'
			}
		};

	proxy = new debug_proxy( proxy_opts );
	proxy.listen();	
}

start_app();
start_proxy();
