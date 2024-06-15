import { RESPONSE, CONTENT_TYPE} from "./utils.js";
import { handleEchoRequest, handleUserAgentRequest, handleFileGETRequests, handleDefaultRequest, handleFilePOSTRequests } from "./routerHandler.js";

export const routes = {
	'/': () => handleDefaultRequest(RESPONSE.OK, CONTENT_TYPE.PLAIN),
	'/404': () => handleDefaultRequest(RESPONSE.NOT_FOUND, CONTENT_TYPE.PLAIN),
	'/echo': (_, __, filename) => handleEchoRequest(filename),
	'/user-agent': (parsedResult) => handleUserAgentRequest(parsedResult),
	'/files': (parsedResult, path, filename) => parsedResult.requestLine.includes('POST') 
	? handleFilePOSTRequests(parsedResult, path, filename) : handleFileGETRequests(_, path, filename),
};