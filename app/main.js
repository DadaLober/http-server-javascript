import { parseHeaders, handleRequest } from "./utils.js";
import net from "net";

const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		try {
			const headers = parseHeaders(data);
			const response = handleRequest(headers);
			socket.write(response);
			socket.end();
		} catch (error) {
			console.error("Error handling request:", error);
			socket.end();
		}
	});
});

server.listen(4221, "localhost");
