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
	const requestLine = lines.shift();
	const body = lines.pop();
	lines.forEach(element => {
		const [key, value] = element.split(" ");
		headers[key] = value;
	});
	const requestArray = requestLine.split(" ");
	return [requestArray, headers, body];
}
export function handleRequests(requestLine, headers, body) {
	if (requestLine.includes('POST')) {
		const path = requestLine[1].split("/")[1];
		const file = requestLine[1].split("/")[2];
		const directory = process.argv[2];
		const handler = routes[`/${path}`];
		console.log(directory, path, headers, file, body);
		return handler ? handler(directory, path, headers, file, requestLine, body) : routes["/404"]();
	}
	else if (requestLine.includes('GET')) {
		const [path, body] = headers["GET"].split("/").slice(1);
		const directory = process.argv[2];
		const handler = routes[`/${path}`];
		return handler ? handler(directory, path, headers, body) : routes["/404"]();
	}
	else {
		return routes["/404"]();
	}
}