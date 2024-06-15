import {routes} from "./router.js";
import process from "process";

export const RESPONSE = {
    OK : "200 OK",
	CREATED : "201 Created",
    NOT_FOUND : "404 Not Found",
};
export const CONTENT_TYPE = {
	PLAIN : "text/plain",
	APP : "application/octet-stream",
};

export function parseHeaders(data) {
	const headers = {};
	const lines = data.toString().split("\r\n");

	// Extract request line and body
	const requestLine = lines.shift().split(" ");
	const METHOD = requestLine[0];
	const [_, PATH, FILENAME] = requestLine[1].split("/");
	const DIRECTORY = process.argv[3];
	const body = lines.pop();

	// Create headers object
	lines.forEach(element => {
		const [key, value] = element.split(" ");
		headers[key.replace(/[':]/, "")] = value;
	});
	headers.body = body;

	return {METHOD, DIRECTORY, PATH, FILENAME, headers};
}
export function handleRoutes(parsedResult) {
	// handle routes
	console.log(parsedResult);
	const handler = routes[`/${parsedResult.PATH}`];
	const response = handler ? handler(parsedResult) : routes["/404"]();
	return response;
}
