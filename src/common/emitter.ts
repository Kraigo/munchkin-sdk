export class Emitter<T> {
    private handlers: Function[] = [];
    public filters: ((t: T) => boolean)[] = [];

    subscribe(fn: Function) {
        this.handlers.push(fn);
    }

    unsubscribe(fn: Function) {
        this.handlers = this.handlers
            .filter(item => item != fn);
    }

    fire(t: T, payload?: any) {
        if (this.filters.every(f => f(t))) {
            this.handlers.forEach(item => {
                payload === undefined
                    ? item.call(null, t)
                    : item.call(null, t, payload)
            });
        }
    }

    filter(fn: (t: T) => boolean) {
        const emitter = Object.assign(new Emitter(), this)
        emitter.filters.push(fn);
        return emitter;
    }
}