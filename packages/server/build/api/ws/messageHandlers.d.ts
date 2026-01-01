import * as websocket from "ws";
import { IncomingMessage } from "../dto";
import { IUserData } from "../types";
export declare const onMessageStreamClosed: (ws: websocket, userData: IUserData) => void;
export type MessageHandler = (ws: websocket, userData: IUserData, message: IncomingMessage) => void;
export declare const authMessage: MessageHandler;
export declare const proposeEvent: MessageHandler;
export declare const proposeEndGame: MessageHandler;
export declare const heartBeat: MessageHandler;
