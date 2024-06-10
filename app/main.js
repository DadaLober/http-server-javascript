const fs = require("fs");
const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE_PLAIN = "text/plain";
const CONTENT_TYPE_APP = "application/octet-stream";	

// Define routes and their handlers
const routes = {
    '/': () => buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN),
    '/user-agent': (headers) => handleUserAgent(headers),
    '/echo': (headers, path) => handleEcho(path),
    '/files': (headers, path) => handleFiles(path)
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

const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		try {
			const headers = parseHeaders(data);
			const response = handleRequest(socket, headers);
			socket.write(response);
		} catch (error) {
			console.error("Error handling request:", error);
			socket.write(buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE_PLAIN, error));
		}
	});
});

server.listen(4221, "localhost");
