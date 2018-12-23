class Log {

    constructor() {
        this.currentID = 0;
        this.logs = [];
    }

    push(log = {}) {
        log.ID = ++this.currentID;
        this.logs.push(log);
    }

    getLast(quantity = 1) {
        return this.logs.slice(-quantity);
    }

    logLast(quantity = 1) {
        console.log(this.getLast(quantity));
    }

    get() {
        return this.logs;
    }

    log() {
        console.log(this.logs);
    }

}