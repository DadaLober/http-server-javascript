const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("close", () => {
		socket.end();
		server.close();
	});
	socket.on("data", (data) => {
		const path = data.toString().split(" ")[1];
		const str = path.split("/echo/")[1];
		// console.log(path);
		// console.log(str);
		if (path === `/` || path.includes(`/echo/`)) {
			responseStatus = "200 OK";
		} 
		else {
			socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
		}
		path === `/echo/${str}` ? socket.write(`HTTP/1.1 ${responseStatus}\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`)
		:socket.write(`HTTP/1.1 ${responseStatus}\r\n\r\n`);
	});
});

server.listen(4221, "localhost");
