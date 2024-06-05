const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE = "text/plain";

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

function buildResponse(statusCode, body) {
	const contentLength = body ? body.length : 0;
	return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${CONTENT_TYPE}\r\nContent-Length: ${contentLength}\r\n\r\n${body}`;
}

function handleRequest(socket, headers) {
	const path = headers["GET"];
	if (path === "/") {
		return buildResponse(RESPONSE_OK);
	} 
	else if (path.includes("/user-agent")) {
		const sanitizedUserAgent = headers["User-Agent"];
		console.log(`Received user-agent: ${sanitizedUserAgent}`);
		return buildResponse(RESPONSE_OK, sanitizedUserAgent);
	} 
	else if (path.includes("/echo")) {
		const message = path.split("/echo/")[1];
		return buildResponse(RESPONSE_OK, message);
	} 
	else {
		return buildResponse(RESPONSE_NOT_FOUND);
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
