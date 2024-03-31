/**
 * Represents the completion of an asynchronous operation
 */
interface ThenPromise<T> extends Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the ThenPromise.
   * @param onfulfilled The callback to execute when the ThenPromise is resolved.
   * @param onrejected The callback to execute when the ThenPromise is rejected.
   * @returns A ThenPromise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): ThenPromise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the ThenPromise.
   * @param onrejected The callback to execute when the ThenPromise is rejected.
   * @returns A ThenPromise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): ThenPromise<T | TResult>;

  // Extensions specific to then/promise

  /**
   * Attaches callbacks for the resolution and/or rejection of the ThenPromise, without returning a new promise.
   * @param onfulfilled The callback to execute when the ThenPromise is resolved.
   * @param onrejected The callback to execute when the ThenPromise is rejected.
   */
  done(onfulfilled?: ((value: T) => any) | undefined | null, onrejected?: ((reason: any) => any) | undefined | null): void;


  /**
   * Calls a node.js style callback.  If none is provided, the promise is returned.
   */
	nodeify(callback: void | null): ThenPromise<T>;
	nodeify(callback: (err: Error, value: T) => void): void;
}

interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

typ