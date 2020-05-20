export class Emitter<T> {
    private handlers: Function[] = [];

    subscribe(fn: Function): void {
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

    filter(filterFn: (t: T, payload?: any) => boolean) {
        const emitter = Object.assign(new Emitter(), this);
        const subscribeFn = emitter.subscribe;

        emitter.subscribe = (fn: Function) => {
            subscribeFn.call(this, (t:T, payload?: any) => {
                if (filterFn(t, payload)) {
                    fn.call(null, t, payload);
                }
            })
        }
        return emitter;
    }
    
    mapData(mapFn: (payload?: any) => boolean) {
        const emitter = Object.assign(new Emitter(), this);
        const subscribeFn = emitter.subscribe;

        emitter.subscribe = (fn: Function) => {
            subscribeFn.call(this, (t:T, payload?: any) => {
                fn.call(null, t, mapFn(payload));
            })
        }
        return emitter;
    }
}