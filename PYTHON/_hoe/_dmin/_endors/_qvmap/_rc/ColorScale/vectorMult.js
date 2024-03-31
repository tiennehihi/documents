import { Strategy } from 'workbox-strategies/Strategy.js';
import './_version.js';
export interface WarmStrategyCacheOptions {
    urls: Array<string>;
    strategy: Strategy;
}
/