import { RESPONSE, CONTENT_TYPE} from "./utils.js";
import { handleEchoRequest, handleUserAgentRequest, handleFileGETRequests, handleDefaultRequest, handleFilePOSTRequests } from "./routerHandler.js";

export const routes = {
	'/': () => handleDefaultRequest(RESPONSE.OK, CONTENT_TYPE.PLAIN),
	'/404': () => handleDefaultRequest(RESPONSE.NOT_FOUND, CONTENT_TYPE.PLAIN),
	'/echo': (parsedResult) => handleEchoRequest(parsedResult),
	'/user-agent': (parsedResult) => handleUserAgentRequest(parsedResult),
	'/files': (parsedResult) => parsedResult.METHOD === "POST" ? handleFilePOSTRequests(parsedResult) : handleFileGETRequests(parsedResult),
};