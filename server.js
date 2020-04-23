// Institusi Pendidikan Tinggi Malaysia (IPTM) Blockchain Project: Bootnodes for IPTM Blockchain Nodes
// Programmer: Dr. Mohd Anuar Mat Isa, iExploTech & IPTM Secretariat
// Website: www.iptm.online, www.mhei.online, www.iexplotech.com

const Bootnodes_Server_Version = 'alpha:0.1:IPTM:iExploTech';
console.log('VERSION: ' + Bootnodes_Server_Version);

const list_bootnodes_html = '/list_bootnodes.html';
const list_bootnodes_json = '/list_bootnodes.json';
const invalid_request_html = '/invalid_request.html';
const default_list_bootnodes = '{"bootnodes":[{"nodeId":"Node01","enodeId":"12121212","minerAddress":"0x212121","timeStamp":"0"}]}'

var http = require('http');
var fs = require('fs');
var url = require('url');

var port = 8080;
var Invalid_Request;
var cache_list_bootnodes_obj;

var showCacheListBootnodes_obj = function display(){
	for (i in cache_list_bootnodes_obj.bootnodes) {
		console.log(cache_list_bootnodes_obj.bootnodes[i]);
		//console.log(cache_list_bootnodes_obj.bootnodes[i].nodeId);
		//console.log(cache_list_bootnodes_obj.bootnodes[i].enodeId);
		//console.log(cache_list_bootnodes_obj.bootnodes[i].minerAddress);
		//console.log(cache_list_bootnodes_obj.bootnodes[i].timeStamp);
		}
}

// Initial invalid request from IPTM Nodes
fs.readFile(invalid_request_html.substr(1), function (err, data) {
	
	if (err) {
		console.log(err);
		Invalid_Request = 'IPTM Bootnodes:Invalid_Request!';
	} else {
		console.log('Loaded: ' + invalid_request_html.substr(1))
		Invalid_Request = data.toString();
		console.log(Invalid_Request.toString());
	}
});

// Initial list_bootnodes.json from file
fs.readFile(list_bootnodes_json.substr(1), function (err, data) {
	
	if (err) {
		console.log(err);
		console.log('Error Read: ' + list_bootnodes_json.substr(1));
	} else {
		console.log('Loaded: ' + list_bootnodes_json.substr(1));
		cache_list_bootnodes = data.toString();
		console.log(cache_list_bootnodes.toString());
		
		if(IsJsonString(data) == true) {
			cache_list_bootnodes_obj = JSON.parse(data);
		} else {
			cache_list_bootnodes_obj = JSON.parse(default_list_bootnodes);
		}
		
		showCacheListBootnodes_obj();

	}
});
// End Initial Values



var IsJsonString = function (str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

var writeListBootnodes = function (data) {
	console.log('writeListBootnodes');

	fs.writeFileSync(list_bootnodes_json.substr(1), data, function (err) {
		if (err) {
			console.log(err);
			console.log('Error Write: ' + list_bootnodes_json.substr(1));
		} else console.log('Write: ' + list_bootnodes_json.substr(1));
	});
		
}

var addNewBootnodesIntoCacheListBootnodes = function (data) {
	
	//var str1 = '{"nodeId":"Node02","enodeId":"12121212","minerAddress":"0x212121","timeStamp":"0"}';
	//var str2 = '{"nodeId":"Node03","enodeId":"13131313","minerAddress":"0x212121","timeStamp":"0"}';
	
	console.log('data: ' + data);
	
	if(IsJsonString(data) == true) {
		
		var temp_json_obj = JSON.parse(data);
		var found = false;
		
		console.log('temp_json_obj: ' + temp_json_obj.bootnodes[0].nodeId);
		console.log('Length List Bootnodes: ' + cache_list_bootnodes_obj.bootnodes.length );
		
		// search duplicate content based on nodeId and update to latest bootnode info
		for (i in cache_list_bootnodes_obj.bootnodes) {
			console.log('Search: ' + i + ' :' + cache_list_bootnodes_obj.bootnodes[i].nodeId);
			// found duplicate nodeId, need to update
			if(cache_list_bootnodes_obj.bootnodes[i].nodeId.toString() === temp_json_obj.bootnodes[0].nodeId.toString()) {
				console.log('Found Duplicate & Update: ' + cache_list_bootnodes_obj.bootnodes[i].nodeId);
				found = true;
				// update bootnode
				cache_list_bootnodes_obj.bootnodes[i].enodeId = temp_json_obj.bootnodes[0].enodeId;
				cache_list_bootnodes_obj.bootnodes[i].minerAddress = temp_json_obj.bootnodes[0].minerAddress;
				cache_list_bootnodes_obj.bootnodes[i].timeStamp = temp_json_obj.bootnodes[0].timeStamp;
				break;
			}
		}
		// no duplicate, add new bootnode info
		if (found == false) {
				console.log('Add New Bootnode: ' + JSON.stringify(temp_json_obj.bootnodes[0]) );
				cache_list_bootnodes_obj.bootnodes.push(temp_json_obj.bootnodes[0]);
		}
			
		
		//cache_list_bootnodes_obj.bootnodes.push(JSON.parse(data));
		showCacheListBootnodes_obj();
		writeListBootnodes(JSON.stringify(cache_list_bootnodes_obj));
	}
}

var readListBootnodes = function (data) {
	console.log('readListBootnodes');
	
	fs.readFile(list_bootnodes_json.substr(1), function (err, data2) {
		if (err) {
			console.log(err);
			console.log('Error Read: ' + list_bootnodes_json.substr(1));
		} else {
			console.log('Read: ' + list_bootnodes_json.substr(1));
			console.log('Read: ' + data2.toString());
			
			
		}
	});
	
	
}


var checkBootnodesData = function (data) {
	console.log('checkBootnodesData: ' + data);
	
	if(IsJsonString(data) == true) {
		var obj = JSON.parse(data);
		console.log(obj.bootnodes[0].nodeId);
		console.log(obj.bootnodes[0].enodeId);
		console.log(obj.bootnodes[0].minerAddress);
		
		readListBootnodes(data);
		
		addNewBootnodesIntoCacheListBootnodes(data);
	}
}

// Create IPTM Bootnodes Server
const server = http.createServer( function (request, response) {
	
	console.log('Connection from: ' + request.socket.remoteAddress + ' Port: ' + request.socket.remotePort);
	console.log('Connection proxy: ' + request.headers['x-forwarded-for']);
	// Parse the request containing file name
	var pathname = url.parse(request.url).pathname;

	// Print the name of the file for which request is made.
	console.log("Request for " + pathname + " received.");
	
	var body = '';
	
	request.on('data', function (chunk) {
	body += chunk;
	});
	
	request.on('end', function () {
	console.log('POSTed: ' + body);
	
		// web html
		if(pathname === list_bootnodes_html) {
			console.log(list_bootnodes_html);
			//checkBootnodesData(body);
		
		// json file
		} else if (pathname === list_bootnodes_json) {
			console.log(list_bootnodes_json);
			checkBootnodesData(body);
		}
	});
		

	// Read the requested file content from file system
	//console.log(pathname.substr(1));
	fs.readFile(pathname.substr(1), function (err, data) {
		if (err) {
			console.log(err);
	
			// HTTP Status: 404 : NOT FOUND
			// Content Type: text/plain
			response.writeHead(404, {'Content-Type': 'text/html'});
			
			//response.write("Invalid Request to IPTM Bootnodes");
			response.write(Invalid_Request);

		} else {
			// Page found	  
			// HTTP Status: 200 : OK
			// Content Type: text/plain
			response.writeHead(200, {'Content-Type': 'text/html'});	
	
			// Write the content of the file to response body
			response.write(data.toString());		
		}
					
		// Send the response body 
		response.end();
	});   
}).listen(port);

process.on('SIGTERM', () => {
	server.close(() => {
		console.log('Process terminated');
		process.exit(1);
		})
});

// Console will print the message
console.log('IPTM Bootnodes Server running at http://localhost:' + port + '/');

