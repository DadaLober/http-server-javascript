import { parseHeaders, handleRequests } from "./utils.js";
import net from "net";

const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		try {
			const [requestArray, headers, body] = parseHeaders(data);
			const response = handleRequests(requestArray, headers, body);
			socket.write(response);
			socket.end();
			return
		} catch (error) {
			console.error("Error handling request:", error);
			socket.end();
		}
	});
});

server.listen(4221, "localhost");
