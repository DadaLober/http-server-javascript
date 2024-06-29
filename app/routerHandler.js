import { RESPONSE, CONTENT_TYPE, ENCODING } from "./utils.js";
import fs from "fs";
import zlib from "zlib";

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
	const encoding = parsedResult.headers["Accept-Encoding"];
	if (!encoding || !encoding.includes("gzip")) {
		return `${RESPONSE.OK}${CONTENT_TYPE.PLAIN}Content-Length: ${body.length}\r\n\r\n${body}\r\n`;
	} 	

	const gzip = zlib.gzipSync(body);
	return `${RESPONSE.OK}${ENCODING.GZIP}${CONTENT_TYPE.PLAIN}Content-Length: ${gzip.length}\r\n\r\n${gzip}\r\n`;
}

export function handleDefaultRequest(statusCode, contentType) {
	return `${statusCode}Content-Type: ${contentType}\r\n`;
}