const fs = require("fs");
const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE = {
	PLAIN : "text/plain",
	APP : "application/octet-stream",
};

const routes = {
	'/': () => buildResponse(RESPONSE_OK, CONTENT_TYPE.PLAIN),
	'/echo': (directory, path, headers, body) => buildResponse(RESPONSE_OK, CONTENT_TYPE.PLAIN, body),
	'/user-agent': (directory, path, headers, body) => buildResponse(RESPONSE_OK, CONTENT_TYPE.PLAIN, headers["User-Agent"]),
	'/files': (directory, path, headers, body) => handleFileRequest(body, directory),
};

function handleRequest(headers) {
	const [path, body] = headers["GET"].split("/").slice(1);
	const directory = process.argv[3];
	const handler = routes[`/${path}`];
	const response = handler ? handler(directory, path, headers, body) : buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE.PLAIN);
	return response;
}

function handleFileRequest(filename, directory) {
    if (fs.existsSync(`${directory}/${filename}`)) {
        const content = fs.readFileSync(`${directory}/${filename}`).toString();
        return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${RESPONSE_OK}\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
    } else {
        return `HTTP/1.1 ${RESPONSE_NOT_FOUND}\r\n\r\n`;
}
}

function parseHeaders(data) {
	const headers = {};
	const lines = data.toString().split("\r\n");
	const filteredLines = lines.filter(line => line.trim() !== '');
	filteredLines.forEach((line) => {
		const [key, value] = line.split(" ");
		headers[key.replace(/[':]/, "")] = value;
	});
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
			console.log(headers);
			const response = handleRequest(headers);
			socket.write(response);
		} catch (error) {
			console.error("Error handling request:", error);
			socket.end();
		}
	});
});

server.listen(4221, "localhost");
