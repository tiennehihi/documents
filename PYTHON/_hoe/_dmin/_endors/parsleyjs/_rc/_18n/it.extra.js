/// <reference types="node" />
export = Server;
declare class Server {
  static get cli(): {
    readonly getArguments: () => {
      "allowed-hosts": {
        