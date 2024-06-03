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
		let responseStatus;
		const path = data.toString().split(" ")[1];
		const str = path.split("/")[2];
		// console.log(path);
		// console.log(str);
		if (path === `/` || path === `/echo/${str}`) {
			responseStatus = "200 OK";
		} 
		else {
			responseStatus = "404 Not Found";
		}
		socket.write(`HTTP/1.1 ${responseStatus}\r\n\r\n`);
		path === `/echo/${str}` ? socket.write(`Content-Type: text/plain\r\n\r\nContent-Length:${str.length}\r\n\r\n${str}`) : socket.write(`Content-Type: text/plain\r\n\r\nContent-Length: 0\r\n\r\n`);
	});
});

server.listen(4221, "localhost");
