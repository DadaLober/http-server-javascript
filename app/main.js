const fs = require("fs");
const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE_PLAIN = "text/plain";
const CONTENT_TYPE_APP = "application/octet-stream";	

// Define routes and their handlers
const routes = {
    '/': () => buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN),
    '/user-agent': (headers) => buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN, headers['user-agent']),
    '/echo': (headers, path) => buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN, path),
    '/files': (headers, path) => buildResponse(RESPONSE_OK, CONTENT_TYPE_APP, fs.readFileSync(path)),
};

function parseHeaders(data) {
	if (!data || data === null || data.length === 0) {
		return console.error("No data provided");
	}
	const headers = {};
	for (const line of data.toString().split("\r\n")) {
		const [key, value] = line.trim().split(" ");
		headers[key.replace(/[':]/, "")] = value;	
	}
	return headers;
}

function buildResponse(statusCode, contentType, body = "") {
	try {
	const contentLength = body.length;
	return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${contentType}\r\nContent-Length: ${contentLength}\r\n\r\n${body}`;
	} catch (error) {
		return console.error("Error building response:", error);
	}
}

function handleRequest(socket, headers) {
	const path = headers['path'];
	const route = routes[path];
	if (route) {
		return route(headers, path);
	} else {
		return buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE_PLAIN);
	}
}

const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		try {
			const headers = parseHeaders(data);
			console.log("Request headers:", headers);
			const response = handleRequest(socket, headers);
			socket.write(response);
		} catch (error) {
			console.error("Error handling request:", error);
			socket.end();
		}
	});
});

server.listen(4221, "localhost");
