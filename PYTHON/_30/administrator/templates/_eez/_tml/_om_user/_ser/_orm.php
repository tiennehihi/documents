/1852#issuecomment-419622780)"
            );
        }

        const clock = {
            now: start,
            Date: createDate(),
            loopLimit: loopLimit,
        };

        clock.Date.clock = clock;

        //eslint-disable-next-line jsdoc/require-jsdoc
        function getTimeToNextFrame() {
            return 16 - ((clock.now - start) % 16);
        }

        //eslint-disable-next-line jsdoc/require-jsdoc
        function hrtime(prev) {
            const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
            const secsSinceStart = Math.floor(millisSinceStart / 1000);
            const remainderInNanos =
                (millisSinceStart - secsSinceStart * 1e3) * 1e6 +
                nanos -
                adjustedSystemTime[1];

            if (Array.isArray(prev)) {
                if (prev[1] > 1e9) {
                    throw new TypeError(
                        "Number of nanoseconds can't exceed a billion"
                    );
                }

                const oldSecs = prev[0];
                let nanoDiff = remainderInNanos - prev[1];
                let secDiff = secsSinceStart - oldSecs;

                if (nanoDiff < 0) {
                    nanoDiff += 1e9;
                    secDiff -= 1;
                }

                return [secDiff, nanoDiff];
            }
            return [secsSinceStart, remainderInNanos];
        }

        if (hrtimeBigintPresent) {
            hrtime.bigint = function () {
                const parts = hrtime();
                return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line
            };
        }

        clock.requestIdleCallback = function requestIdleCallback(
            func,
            timeout
        ) {
            let timeToNextIdlePeriod = 0;

            if (clock.countTimers() > 0) {
                timeToNextIdlePeriod = 50; // const for now
            }

            const result = addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay:
                    typeof timeout === "undefined"
                        ? timeToNextIdlePeriod
                        : Math.min(timeout, timeToNextIdlePeriod),
                idleCallback: true,
            });

            return Number(result);
        };

        clock.cancelIdleCallback =