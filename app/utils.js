import {routes} from "./router.js";

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
	const rawRequestLine = lines.shift();
	const requestLine = rawRequestLine.split(" ");
	const body = lines.pop();

	// Create headers object
	lines.forEach(element => {
		const [key, value] = element.split(" ");
		headers[key.replace(/[':]/, "")] = value;
	});

	const response = {requestLine, headers, body};
	return response;
}
export function handleRequests(parsedResult) {
	const [_, path, filename] = parsedResult.requestLine[1].split("/");

	// handle routes
	// console.log(parsedResult, path, filename);
	const handler = routes[`/${path}`];
	const response = handler ? handler(parsedResult, path, filename) : routes["/404"]();
	return response;
}
