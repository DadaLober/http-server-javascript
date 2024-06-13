import {routes} from "./router.js";

export const RESPONSE = {
    OK : "200 OK",
    NOT_FOUND : "404 Not Found",
};
export const CONTENT_TYPE = {
	PLAIN : "text/plain",
	APP : "application/octet-stream",
};

export function parseHeaders(data) {
	const headers = {};
	const lines = data.toString().split("\r\n");
	const filteredLines = lines.filter(line => line.trim() !== '');
	filteredLines.forEach((line) => {
		const [key, value] = line.split(" ");
		headers[key.replace(/[':]/, "")] = value;
	});
	return headers;
}

export function handleRequest(headers) {
	const [path, body] = headers["GET"].split("/").slice(1);
	const directory = process.argv[2];
	const handler = routes[`/${path}`];
	return handler ? handler(directory, path, headers, body) : routes["/404"]();
}