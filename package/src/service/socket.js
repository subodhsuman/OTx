import io from "socket.io-client";
import ApiClass from "../api/api";

export const socket = (param = {}) => {return io(ApiClass.nodeUrl, param)};
