import * as http from "http";
import * as https from "https";
declare const setupWebsocketAPI: (server: http.Server | https.Server) => void;
export default setupWebsocketAPI;
