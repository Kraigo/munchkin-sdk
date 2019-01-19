export class Emitter<T> {
    private handlers: Function[] = [];

    subscribe(fn: Function) {
        this.handlers.push(fn);
    }

    unsubscribe(fn: Function) {
        this.handlers = this.handlers
            .filter(item => item != fn);
    }

    fire(t: T, payload?: any) {
        this.handlers.forEach(item => {
            payload === undefined
                ? item.call(null, t)
                : item.call(null, t, payload)
        });
    }
}