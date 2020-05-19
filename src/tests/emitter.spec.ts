
import { Emitter } from '../common/emitter';



describe("Emitter", () => {

    enum TestEvent {
        FIRST
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

        observable.filter(t => t > 5).subscribe(handler);
        
        observable.fire(1);
        observable.fire(2);
        observable.fire(3);

        expect(handler).toBeCalledTimes(0);
        observable.fire(9);
        observable.fire(8);
        observable.fire(7);
        expect(handler).toBeCalledTimes(3);
    })
})