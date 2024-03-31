import './_version.js';
interface OnSyncCallbackOptions {
    queue: Queue;
}
interface OnSyncCallback {
    (options: OnSyncCallbackOptions): void | Promise<void>;
}
export interface QueueOptions {
    forceSyncFallback?: boolean;
    maxRetentionTime?: number;
    onSync?: OnSyncCallback;
}
interface QueueEntry {
    request: Request;
    timestamp?: number;
    metadata?: object;
}
/**
 * A class to manage storing failed requests in IndexedDB and retrying them
 * later. All parts of the storing and replaying process are observable via
 * callbacks.
 *
 * @memberof workbox-background-sync
 */
declare class Queue {
    private readonly _name;
    private readonly _onSync;
    private readonly _maxRetentionTime;
    private readonly _queueStore;
    private readonly _forceSyncFallback;
    private _syncInProgress;
    private _requestsAddedDuringSync;
    /**
     * Creates an instance of Queue with the given options
     *
     * @param {string} name The unique name for this queue. This name must be
     *     unique as it's used to register sync events and store requests
     *     in IndexedDB specific to this instance. An error will be thrown if
     *     a duplicate name is detected.
     * @param {Object} [options]
     * @param {Function} [options.onSync] A function that gets invoked whenever
     *     the 'sync' event fires. The function is invoked with an object
     *     containing the `queue` property (referencing this instance), and you
     *     can use the callback to customize the replay behavior of the queue.
     *     When not set the `replayRequests()` method is called.
     *     Note: if the re