
import { Emitter } from '../common/emitter';



describe("Testing observable", () => {

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
})