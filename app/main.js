const fs = require("fs");
const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE_PLAIN = "text/plain";
const CONTENT_TYPE_APP = "application/octet-stream";	

function parseHeaders(data) {
	const headers = {};
	for (const line of data.toString().split("\r\n")) {
		const [key, value] = line.trim().split(" ");
		if (key) {
			headers[key.replace(/[':]/, "")] = value;
		}	
	}
	return headers;
}

function buildResponse(statusCode, contentType, body) {
	const contentLength = body ? body.length : 0;
	return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${contentType}\r\nContent-Length: ${contentLength}\r\n\r\n${body}`;
}

function handleRequest(socket, headers) {
	const path = headers["GET"];
	if (path === "/") {
		return buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN);
	} 
	else if (path.includes("/user-agent")) {
		const sanitizedUserAgent = headers["User-Agent"];
		console.log(`Received user-agent: ${sanitizedUserAgent}`);
		return buildResponse(RESPONSE_OK, sanitizedUserAgent, CONTENT_TYPE_PLAIN);
	} 
	else if (path.includes("/echo")) {
		const filename = path.split("/echo/")[1];
		console.log(`Received echo: ${filename}`);
		return buildResponse(RESPONSE_OK, filename, CONTENT_TYPE_PLAIN);
	} 
	else if (path.includes("/files")) {
		const directory = process.argv[3];
		const filename = path.split("/files/")[1];
		if (fs.existsSync(`${directory}/${filename}`)){
			console.log(`Received file name: ${filename}, directory: ${directory}`);
			const content = fs.readFileSync(`${directory}/${filename}`).toString();
			return buildResponse(RESPONSE_OK, CONTENT_TYPE_APP, content);
		}
		else {
			return buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE_PLAIN);
		}
	}
	else {
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
			console.log(headers);
			const response = handleRequest(socket, headers);
			socket.write(response);
		} catch (error) {
			console.error("Error handling request:", error);
			socket.write(buildResponse(400, "Bad Request"));
		}
	});
});

server.listen(4221, "localhost");
