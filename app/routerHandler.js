import { RESPONSE, CONTENT_TYPE } from "./utils.js";
import fs from "fs";

export function handleGETRequests(directory, file) {
	const content = fs.readFileSync(`${directory}/${file}`).toString();
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.APP}\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
}

export function handlePOSTRequests(directory, file, body) {
	const DIR = directory + '/' + file;
	try {
		fs.writeFileSync(DIR, body);
		return `HTTP/1.1 ${RESPONSE.CREATED}\r\n\r\n`;
	} catch (error) {
		console.error("Error writing file:", error);
	}
}

export function handleUserAgentRequest(headers) {
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.PLAIN}\r\nContent-Length: ${headers.length}\r\n\r\n${headers}\r\n`;
} 

export function handleEchoRequest(body) {
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.PLAIN}\r\nContent-Length: ${body.length}\r\n\r\n${body}\r\n`;
}

export function handleDefaultRequest(statusCode, contentType) {
	return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${contentType}\r\n\r\n`;
}