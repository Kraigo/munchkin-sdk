
import { Emitter } from '../common/emitter';



describe("Emitter", () => {

    enum TestEvent {
        FIRST,
        SECOND,
        FILTER,
        MAP
    };
    const observable = new Emitter<TestEvent>();

    test('subscribe', () => {
        const handler = jest.fn();
        observable.subscribe(handler);
        observable.fire(TestEvent.FIRST, null);
        expect(handler).toBeCalled();
    });
    
    test('unsubscribe', () => {
        const handler = jest.fn();
        observable.subscribe(handler);
        observable.fire(TestEvent.FIRST, null);
        expect(handler).toBeCalledTimes(1);
        observable.unsubscribe(handler);
        observable.fire(TestEvent.FIRST, null);
        expect(handler).toBeCalledTimes(1);
    });

    test('event type', () => {
        const handler = jest.fn();

        observable.subscribe(handler);
        observable.fire(TestEvent.FIRST);
        expect(handler).toBeCalledWith(TestEvent.FIRST)
    });

    test('pass data', () => {
        const handler = jest.fn();
        const data1 = 'testData';
        const data2 = {'foo': 'bar'};

        observable.subscribe(handler);
        observable.fire(TestEvent.FIRST, data1);
        expect(handler).toBeCalledWith(TestEvent.FIRST, data1);
        
        observable.fire(TestEvent.FIRST, data2);
        expect(handler).toBeCalledWith(TestEvent.FIRST, data2);
    });

    test('filter', () => {
        const handler = jest.fn();

        observable.filter((event, payload) => payload > 5).subscribe(handler);
        
        observable.fire(TestEvent.FILTER, 1);
        observable.fire(TestEvent.FILTER, 2);
        observable.fire(TestEvent.FILTER, 3);

        expect(handler).toBeCalledTimes(0);
        observable.fire(TestEvent.FILTER, 9);
        observable.fire(TestEvent.FILTER, 8);
        observable.fire(TestEvent.FILTER, 7);
        expect(handler).toBeCalledTimes(3);
    })

    test('filter multi', () => {
        const handler = jest.fn();

        observable
            .filter((event) => event === TestEvent.FILTER)
            .filter((event, payload) => payload > 5)
            .filter((event, payload) => payload < 10)
            .subscribe(handler);
        
        observable.fire(TestEvent.FIRST, 1);
        observable.fire(TestEvent.FIRST, 6);
        observable.fire(TestEvent.FILTER, 1);

        expect(handler).toBeCalledTimes(0);

        observable.fire(TestEvent.FILTER, 6);

        expect(handler).toBeCalledTimes(1);
    })

    test('map', () => {
        const handler = jest.fn();
        const eventDate = {test: 'test'};

        observable
            .mapData(payload => payload.test)
            .subscribe(handler);
        
        observable.fire(TestEvent.FIRST, eventDate);

        expect(handler).toBeCalledWith(TestEvent.FIRST, eventDate.test);
    })

    test('merge', () => {
        const handler = jest.fn();

        const firstEmitter = new Emitter<TestEvent>()
            .filter((event) => event === TestEvent.FIRST);
            
        const secondEmitter = new Emitter<TestEvent>()
            .filter((event) => event === TestEvent.SECOND);

        const firstANDsecondEmitter = new Emitter<TestEvent>()
            .merge(firstEmitter);

        firstANDsecondEmitter.subscribe(handler);

        firstANDsecondEmitter.fire(TestEvent.FIRST);
        expect(handler).toBeCalledWith(TestEvent.FIRST);
        firstANDsecondEmitter.fire(TestEvent.SECOND);
        expect(handler).toBeCalledWith(TestEvent.SECOND);
        expect(handler).toBeCalledTimes(2);
    })
})