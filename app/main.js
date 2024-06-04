const net = require("net");

console.log("Logs...");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE = "text/plain";


function buildResponse(path, str) {

	if (path === "/" || path.includes("/echo/")) {
		return `HTTP/1.1 ${RESPONSE_OK}\r\nContent-Type: ${CONTENT_TYPE}\r\nContent-Length: ${str.length}\r\n\r\n${str}`;
	} else {
		return `HTTP/1.1 ${RESPONSE_NOT_FOUND}\r\n\r\n`;
	}
}

const server = net.createServer((socket) => {
    socket.on("close", () => {
		socket.end();
		server.close();
	});
	socket.on("data", (data) => {
		const path = data.toString().split(" ")[1];
		const str = path.split("/echo/")[1];

		socket.write(buildResponse(path, str));
	});
});

server.listen(4221, "localhost");
