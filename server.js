// Institusi Pendidikan Tinggi Malaysia (IPTM) Blockchain Project: Bootnodes for IPTM Blockchain Nodes
// Programmer: Dr. Mohd Anuar Mat Isa, iExploTech & IPTM Secretariat
// Website: https://github.com/iexplotech  www.iptm.online, www.mhei.online, www.iexplotech.com
// License: GNU General Public License v3.0

const Bootnodes_Server_Version = 'alpha:0.1:IPTM:iExploTech';
console.log('IPTM BOOTNODES SERVER, Version: ' + Bootnodes_Server_Version);

// Configuration Flag
//const MACHINE_HOST_CLIENT_SERVER = true; // this machine running both bootnode server and client
//const MACHINE_HOST_CLIENT_SERVER_IP = '47.254.195.137'; // must fixed public IPv4

// check OS platform
var win32 = process.platform === "win32"; // Same for x64 Win OS
var darwin = process.platform === "darwin";  // Mac
var linux = process.platform === "linux";
console.log(`Supported OS Platform = Windows:${win32} Linux:${darwin} Mac:${linux}`);
console.log(`This OS Platform is ${process.platform}`);

if(win32 == true) {
	console.log('OK! Supported Operating System');
}
else if (true == (darwin || linux)) {
	console.log('OK! Supported Operating System');
} else {
	console.log('Halted! Not Supported Operating System');
	process.exit(-1);
}

const list_bootnodes_html = '/list_bootnodes.html';
const list_bootnodes_json = '/list_bootnodes.json';
const invalid_request_html = '/invalid_request.html';
const bootnodes_table_html = '/bootnodes_table.html';
const index_html = '/index.html';
const default_list_bootnodes = '{"bootnodes":[{"nodeId":"DefaultServerNode01","enodeId":"enode://c6ab138c36886cb28196b1dcd9d7ebc0f2818e543b5a4f93cd1cc7bfc6b6c820f660edce9762027794099adce4edd110409e4e17a2f3862b6a400660a46c4324@127.0.0.1:30303?discport=0","minerAddress":"0x80ce17271ffa4a7f66e2cbf3561a6946587f470d","timeStamp":"26 Apr 2020 17:31:58"}]}';
const b1 = '<link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" rel=\"stylesheet\">\n<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script>\n<script type=\"text/javascript\">'
const b2 = '$(document).ready(function () {\n    var html = \'<table class=\"table table-striped\">\';\n    html += \'<tr>\';\n    var flag = 0;\n    $.each(data[0], function(index, value){\n        html += \'<th>\'+index+\'</th>\';\n    });\n    html += \'</tr>\';\n     $.each(data, function(index, value){\n         html += \'<tr>\';\n        $.each(value, function(index2, value2){\n            html += \'<td>\'+value2+\'</td>\';\n        });\n        html += \'<tr>\';\n     });\n     html += \'</table>\';\n     $(\'body\').html(html);\n});\n</script>';

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


var checkBootnodesData = function (data, client_ip) {
	console.log('client_ip: ' + client_ip);  // e.g. ::ffff:127.0.0.1
	console.log('checkBootnodesData: ' + data);
	
	if(client_ip === null)
	{
		console.log('Empty data input from client ip: ');
		return false;
	}
	
	var IPAddressArray = client_ip.split(':');
	
	if(IPAddressArray === null)
	{
		console.log('Empty/Invalid data input from client ip: ');
		return false;
	}
	
	console.log(IPAddressArray.length);
	for(i in IPAddressArray){  // index 3 (last index) is the ipv4 address
		console.log(IPAddressArray[i]);
	}
	
	if(IsJsonString(data) == true) {
		var obj = JSON.parse(data);
		console.log(obj.bootnodes[0].nodeId);
		console.log(obj.bootnodes[0].enodeId);
		console.log(obj.bootnodes[0].minerAddress);
		console.log(obj.bootnodes[0].timeStamp);
		
		readListBootnodes(data);
		
		// modify enodeId to public ipv4 addresss
		console.log('enodeId from Client: ' + obj.bootnodes[0].enodeId);
		obj.bootnodes[0].enodeId = obj.bootnodes[0].enodeId.replace('127.0.0.1', IPAddressArray[3]); // replace to public IPv4 Address
		console.log('enodeId from Client updated to Public IP: ' + obj.bootnodes[0].enodeId);
		
		data = JSON.stringify(obj); // update bootnode data with updated public IPv4 Address 
		
		// changed enodeId with public IPv4 Address
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
			checkBootnodesData(body, request.socket.remoteAddress);
			
		// table file
		} else if (pathname === bootnodes_table_html) {
			console.log(bootnodes_table_html);
		
		// table file
		} else if (pathname === index_html) {
			console.log(index_html);
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
			
			if (pathname === bootnodes_table_html || pathname === index_html) {
				console.log(bootnodes_table_html + ' or ' + index_html);
				//var json_string = 'var data = ' + JSON.stringify(cache_list_bootnodes_obj).substr(13) + ';';
				//var str2 = '[{"nodeId":"Node01","enodeId":"12121212","minerAddress":"0x212121","timeStamp":"0", "ipAddress":"127.0.0.1"}, {"nodeId":"Node01","enodeId":"12121212","minerAddress":"0x212121","timeStamp":"0", "ipAddress":"127.0.0.1"}]';
				//var obj2 = (JSON.parse(str2));
				//var str3 = JSON.stringify(obj2, null, ' ');
				
				var json_str = JSON.stringify(cache_list_bootnodes_obj.bootnodes, null, ' ');
				//var json_string = JSON.parse(JSON.stringify(cache_list_bootnodes_obj).substr(13, str.length - 2));
				console.log('json_str: ' + json_str);
				
				//var str3 = JSON.stringify(json_str, null, ' ');
				
				//console.log('str3: ' + str3);
				
				
				var str4 = 'var data = ' + json_str +';';
				
				var assemble = `${b1}\n${str4}\n${b2}`;
				console.log('assemble: ' + assemble);
				response.write(assemble);
				//response.write(data.toString());
				
			} else {
				// Write the content of the file to response body
				response.write(data.toString());
			}	
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

