import { RESPONSE, CONTENT_TYPE } from "./utils.js";
import fs from "fs";

export function handleFileGETRequests(parsedResult) {
	if (!fs.existsSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`)) {
		return `HTTP/1.1 ${RESPONSE.NOT_FOUND}\r\n\r\n`;
	}
	const content = fs.readFileSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`).toString();
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.APP}\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
}

export function handleFilePOSTRequests(parsedResult) {
	try {
		const body = parsedResult.headers.body;
		fs.writeFileSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`, body);
		return `HTTP/1.1 ${RESPONSE.CREATED}\r\n\r\n`;
	} catch (error) {
		console.error("Error writing file:", error);
	}
}

export function handleUserAgentRequest(parsedResult) {
	const body = parsedResult.headers["User-Agent"];
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.PLAIN}\r\nContent-Length: ${body.length}\r\n\r\n${body}\r\n`;
} 

export function handleEchoRequest(parsedResult) {
	const body = parsedResult.FILENAME;	
	return `HTTP/1.1 ${RESPONSE.OK}\r\nContent-Type: ${CONTENT_TYPE.PLAIN}\r\nContent-Length: ${body.length}\r\n\r\n${body}\r\n`;
}

export function handleDefaultRequest(statusCode, contentType) {
	return `HTTP/1.1 ${statusCode}\r\nContent-Type: ${contentType}\r\n\r\n`;
}