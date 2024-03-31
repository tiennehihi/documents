s;
        addListener(
            event: "stream",
            listener: (
                stream: ClientHttp2Stream,
                headers: IncomingHttpHeaders & IncomingHttpStatusHeader,
                flags: number,
            ) => void,
        ): this;
        addListener(event: string | symbol, listener: (...args: any[]) => void): this;
        emit(event: "altsvc", alt: string, origin: string, stream: number): boolean;
       