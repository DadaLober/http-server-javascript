import { parseHeaders, handleRoutes } from "./utils.js";
import net from "net";

const handleSocketClose = (socket) => {
	socket.end();
};

/**
 * @param {Object} socket - The socket object representing the connection.
 * @param {Buffer} data - The data received from the client.
 */
const handleSocketData = (socket, data) => {
	try {
		const parsedResult = parseHeaders(data);
		const response = handleRoutes(parsedResult);
		socket.write(response);
		socket.end();
	} catch (error) {
		console.error("Error handling request:", error);
		socket.end();
	}
};

const server = net.createServer((socket) => {
	socket.on("close", () => handleSocketClose(socket));
	socket.on("data", (data) => handleSocketData(socket, data));
});

server.listen(4221, "localhost");