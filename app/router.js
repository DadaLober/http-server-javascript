import { RESPONSE, CONTENT_TYPE} from "./utils.js";
import { handleEchoRequest, handleUserAgentRequest, handleGETRequests, handleDefaultRequest, handlePOSTRequests } from "./routerHandler.js";

export const routes = {
	'/': () => handleDefaultRequest(RESPONSE.OK, CONTENT_TYPE.PLAIN),
	'/404': () => handleDefaultRequest(RESPONSE.NOT_FOUND, CONTENT_TYPE.PLAIN),
	'/echo': (directory, path, headers, body) => handleEchoRequest(body),
	'/user-agent': (directory, path, headers) => handleUserAgentRequest(headers),
	'/files': (directory, path, headers, file, requestLine, body) => requestLine.includes('POST') ? handlePOSTRequests(directory, file, body) : handleGETRequests(directory, file),
};