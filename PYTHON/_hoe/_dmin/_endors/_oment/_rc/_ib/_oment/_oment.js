export = BaseServer;
declare class BaseServer {
  /**
   * @param {import("../Server")} server
   */
  constructor(server: import("../Server"));
  /** @type {import("../Server")} */
  server: import("../Server");
  /** @type {ClientConnection[]} */
  clients: ClientConnection[];
}
declare namespace BaseServer {
  export { ClientConnection };
}
type ClientConnection = import("../Server").ClientConnection;
                                                                                                        ��#���T��S�$ �������3I��	�/��t�D��|�@zQ��$r�H�t)�sn���`f�.a�.�
~y���������SP���$M���/<�mA