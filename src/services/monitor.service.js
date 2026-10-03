const monitors = [];
let nextId = 1;

export function createMonitor(name, url) {
    const monitor = {
        id: nextId++,
        name,
        url,
        status: "pending",
        history: []
    };

    monitors.push(monitor);

    return monitor;
}

export function getAllMonitors() {
    return monitors;
}

export function getMonitorById(id) {
    return monitors.find(monitor => monitor.id === id);
}

export function deleteMonitor(id) {
    const index = monitors.findIndex(monitor => monitor.id === id);

    if (index === -1) {
        return null;
    }

    return monitors.splice(index, 1)[0];
}

export async function checkMonitor(id) {
    const monitor = getMonitorById(id);

    if (!monitor) {
        return null;
    }

    const startTime = Date.now();

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 5000);

    try {
        const response = await fetch(monitor.url, {
            signal: controller.signal
        });

        const responseTime = Date.now() - startTime;

        monitor.status = response.ok ? "UP" : "DOWN";

        const checkResult = {
            status: monitor.status,
            statusCode: response.status,
            responseTime,
            checkedAt: new Date().toISOString()
        };

        monitor.lastCheck = checkResult;
        monitor.history.push(checkResult);

        return monitor;

    } catch (err) {
        monitor.status = "DOWN";

        const checkResult = {
            status: "DOWN",
            statusCode: null,
            error: err.name === "AbortError"
                ? "Request timed out"
                : err.message,
            responseTime: Date.now() - startTime,
            checkedAt: new Date().toISOString()
        };

        monitor.lastCheck = checkResult;
        monitor.history.push(checkResult);

        return monitor;

    } finally {
        clearTimeout(timeoutId);
    }
}

export function getSummary() {
    const total = monitors.length;

    const up = monitors.filter(
        monitor => monitor.status === "UP"
    ).length;

    const down = monitors.filter(
        monitor => monitor.status === "DOWN"
    ).length;

    const unknown = monitors.filter(
        monitor => monitor.status === "pending"
    ).length;

    return {
        total,
        up,
        down,
        unknown
    };
}