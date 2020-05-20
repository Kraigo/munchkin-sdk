type EmitterSubscription<T> = (event: T, payload?: any) => void

export class Emitter<T> {
    private handlers: Function[] = [];

    subscribe(fn: EmitterSubscription<T>): void {
        this.handlers.push(fn);
    }

    unsubscribe(fn: Function) {
        this.handlers = this.handlers
            .filter(item => item != fn);
    }

    fire(event: T, payload?: any) {
        this.handlers.forEach((handler) =>
            this.fireHandler(handler, event, payload));
    }

    fireHandler(handler: Function, event: T, payload?: any) {
        payload === undefined
            ? handler.call(null, event)
            : handler.call(null, event, payload)
    }

    filter(filterFn: (event: T, payload?: any) => boolean) {
        const emitter = Object.assign(new Emitter<T>(), this);
        const subscribeFn = emitter.subscribe;

        emitter.subscribe = (fn: Function) => {
            subscribeFn.call(this, (event: T, payload?: any) => {
                if (filterFn(event, payload)) {
                    this.fireHandler(fn, event, payload);
                    // fn.call(null, t, payload);
                }
            })
        }
        return emitter;
    }
    
    mapData(mapFn: (payload?: any) => boolean) {
        const emitter = Object.assign(new Emitter<T>(), this);
        const subscribeFn = emitter.subscribe;

        emitter.subscribe = (fn: Function) => {
            subscribeFn.call(this, (event: T, payload?: any) => {
                this.fireHandler(fn, event, mapFn(payload));
            })
        }
        return emitter;
    }
    
    merge<Y>(...emitters: Emitter<Y>[]) {
        const emitter = Object.assign(new Emitter<T>(), this);
        const subscribeFn = emitter.subscribe;
        const target = [
            subscribeFn,
            ...emitters.map(e => e.subscribe)
        ]

        emitter.subscribe = (fn: Function ) => {
            target.forEach((subscribe) => {
                subscribe.call(this, (event: T, payload?: any) => {                    
                    this.fireHandler(fn, event, payload);
                });
            })
        }
        return emitter;
    }
}