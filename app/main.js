const fs = require("fs");
const net = require("net");

const RESPONSE_OK = "200 OK";
const RESPONSE_NOT_FOUND = "404 Not Found";
const CONTENT_TYPE_PLAIN = "text/plain";
const CONTENT_TYPE_APP = "application/octet-stream";	

const routes = {
    '/': () => buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN),
    '/user-agent': (headers) => handleUserAgent(headers),
    '/echo': (headers, path) => handleEcho(path),
    '/files': (headers, path) => handleFiles(path)
};

function handleUserAgent(headers) {
	if (!headers || typeof headers["User-Agent"] !== 'string') {
        throw new Error('Invalid User-Agent header');
    }
    const sanitizedUserAgent = headers["User-Agent"];
    console.log(`Received user-agent: ${sanitizedUserAgent}`);
    return buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN, sanitizedUserAgent);
}

function handleEcho(path) {
    const filename = path.split("/echo/")[1];
    console.log(`Received echo: ${filename}`);
    return buildResponse(RESPONSE_OK, CONTENT_TYPE_PLAIN, filename);
}

function handleFiles(path) {
    const directory = process.argv[3];
    const filename = path.split("/files/")[1];
    const filePath = `${directory}/${filename}`;
    if (fs.existsSync(filePath)) {
        log(`Received file name: ${filename}, directory: ${directory}`);
        const content = fs.readFileSync(filePath).toString();
        return buildResponse(RESPONSE_OK, CONTENT_TYPE_APP, content);
    } else {
        return buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE_PLAIN);
    }
}

function handleRequest(socket, headers) {
    if (!headers || typeof headers["GET"] !== 'string') {
        return buildResponse(RESPONSE_BAD_REQUEST, CONTENT_TYPE_PLAIN);
    }

    const path = headers["GET"];
    const routeHandler = routes[path] || routes[path.split('/')[1]];

    if (routeHandler) {
        try {
            return routeHandler(headers, path);
        } catch (error) {
            log(`Error during request handling: ${error.message}`);
            return buildResponse(RESPONSE_INTERNAL_SERVER_ERROR, CONTENT_TYPE_PLAIN);
        }
    } else {
        return buildResponse(RESPONSE_NOT_FOUND, CONTENT_TYPE_PLAIN);
    }
}

function parseHeaders(data) {
	if (!data || data.length === 0) {
		return console.error("No data provided");
	}
	const headers = {};
	for (const line of data.toString().split("\r\n")) {
		const [key, value] = line.trim().split(" ");
		headers[key.replace(/[':]/, "")] = value;	
	}
	return headers;
}

const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		try {
			const headers = parseHeaders(data);
			console.log(headers);
			const response = handleRequest(socket, headers);
			socket.write(response);
		} catch (error) {
			console.error("Error handling request:", error);
			socket.write(buildResponse(400, "Bad Request"));
		}
	});
});

server.listen(4221, "localhost");
