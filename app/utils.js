import {routes} from "./router.js";
import process from "process";

export const RESPONSE = {
    OK : "HTTP/1.1 200 OK\r\n",
	CREATED : "HTTP/1.1 201 Created\r\n\r\n",
    NOT_FOUND : "HTTP/1.1 404 Not Found\r\n\r\n",
};

export const CONTENT_TYPE = {
	PLAIN : "Content-Type: text/plain\r\n",
	APP : "Content-Type: application/octet-stream\r\n",
};

export const ENCODING = {
	GZIP : "Content-Encoding: gzip\r\n",
};

export function parseHeaders(data) {
	const headers = {};
	const lines = data.toString().split("\r\n");

	// Extract request line and body
	const requestLine = lines.shift().split(" ");
	const METHOD = requestLine[0];
	const [, PATH, FILENAME] = requestLine[1].split("/");
	const DIRECTORY = process.argv[3];
	const body = lines.pop();

	// Create headers object
	lines.forEach(element => {
		const [key, value] = element.split(": ");
		headers[key] = value;
	});
	headers.body = body;

	return {METHOD, DIRECTORY, PATH, FILENAME, headers};
}

export function handleRoutes(parsedResult) {
	const handler = routes[`/${parsedResult.PATH}`];
	const response = handler ? handler(parsedResult) : routes["/404"]();
	return response;
}
