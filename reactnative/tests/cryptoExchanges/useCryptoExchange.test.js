import { renderHook } from '@testing-library/react-hooks';
import useCryptoExchange from "../../screens/cryptoExchanges/useCryptoExchange";
import expect from "expect";
import {describe, test} from "@jest/globals";
import {act} from "@testing-library/react-native";


describe('useCryptoExchange', () => {
    test('should match snapshot', () => {
        const { result } = renderHook(() => useCryptoExchange());

        expect(result.current).toMatchSnapshot();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetchExchanges works correctly', async () => {
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ id: 1, name: 'Exchange 1' }]),
            })
        );
        global.fetch = mockFetch;

        const { result, waitForNextUpdate } = renderHook(() => useCryptoExchange());
        expect(result.current.exchanges).toEqual([]);
    await act( async () => {
        await result.current.fetchExchanges();

        expect(mockFetch).toHaveBeenCalledWith(`http://10.0.2.2:8000/crypto-exchanges`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token undefined`,
            },
        });
        expect(result.current.exchanges).toEqual([{ id: 1, name: 'Exchange 1' }]);
    });
    });

    test('removeExchange works correctly', async () => {
            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve([{id: 1, name: 'Exchange 1'}]),
                })
            );
            global.fetch = mockFetch;
            const {result} = renderHook(() => useCryptoExchange());

        await act(async () => {
            result.current.setExchanges([{use: 1, name: 'Exchange 1'}]);

            await result.current.removeExchange(1);

            expect(mockFetch).toHaveBeenCalledWith(`http://10.0.2.2:8000/crypto-exchanges`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token undefined`,
                },
                body: JSON.stringify({
                    id: 1,
                }),
            });
            expect(result.current.exchanges).toEqual([]);
        });

    });
});