import { RESPONSE, CONTENT_TYPE, ENCODING } from "./utils.js";
import fs from "fs";

export function handleFileGETRequests(parsedResult) {
	if (!fs.existsSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`)) {
		return RESPONSE.NOT_FOUND;
	}
	const content = fs.readFileSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`).toString();
	return `${RESPONSE.OK}${CONTENT_TYPE.APP}Content-Length: ${content.length}\r\n\r\n${content}\r\n`;
}

export function handleFilePOSTRequests(parsedResult) {
	try {
		const body = parsedResult.headers.body;
		fs.writeFileSync(`${parsedResult.DIRECTORY}/${parsedResult.FILENAME}`, body);
		return RESPONSE.CREATED;
	} catch (error) {
		console.error("Error writing file:", error);
	}
}

export function handleUserAgentRequest(parsedResult) {
	const body = parsedResult.headers["User-Agent"];
	return `${RESPONSE.OK}${CONTENT_TYPE.PLAIN}Content-Length: ${body.length}\r\n\r\n${body}\r\n`;
} 

export function handleEchoRequest(parsedResult) {
	const body = parsedResult.FILENAME;	
	if (parsedResult.headers["Accept-Encoding"] === "gzip") {
		return `${RESPONSE.OK}${ENCODING.GZIP}${CONTENT_TYPE.PLAIN}Content-Length: ${body.length}\r\n\r\n${body}\r\n`;
	}
	return `${RESPONSE.OK}${CONTENT_TYPE.PLAIN}Content-Length: ${body.length}\r\n\r\n${body}\r\n`;
}

export function handleDefaultRequest(statusCode, contentType) {
	return `${statusCode}Content-Type: ${contentType}\r\n`;
}