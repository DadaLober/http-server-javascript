import { parseHeaders, handleRoutes } from "./utils.js";
import net from "net";


const handleSocketData = (socket, data) => {
	try {
		const parsedResult = parseHeaders(data);
		const [response, buffer] = handleRoutes(parsedResult);
		console.log(response);
		socket.write(response);
		if (buffer) {
			socket.write(buffer);
		}
		socket.end();
	} catch (error) {
		console.error("Error handling request:", error);
		socket.end();
	}
};

const server = net.createServer((socket) => {
	socket.on("data", (data) => handleSocketData(socket, data));
});

server.listen(4221, "localhost");