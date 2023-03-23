import React, { useState, useEffect, useCallback } from 'react';
import { render, screen, fireEvent, act, waitFor, queryByText, queryByTestId, getByText } from '@testing-library/react-native';
import { Button, FlatList, Table, Row, Cell } from 'react-native';
import StockAsset from '../../screens/stocks/StockAsset';
import stockAssetData from './fixtures/stockAsset.json';
import stockAssetList from './fixtures/StockAssetList.json';
describe('<StockAsset />', () => {

    const params = {
        route: {
          params: {
            accessToken: stockAssetData.accessToken,
            accountID: stockAssetData.accountID,
            account_name: stockAssetData.account_name,
            balance: stockAssetData.balance,
            balance_currency: stockAssetData.balance_currency,
            logo: stockAssetData.logo,
            name: stockAssetData.name,
            transactions: stockAssetData.transactions,
            security_id: stockAssetData.security_id,
            removeAccount: jest.fn(async () => {return Promise}),
          },
        },
        navigation: {
          navigate: jest.fn(),
          goBack: jest.fn()
        }
      };

      beforeEach(() => {
        const mockStocks = stockAssetList;
      
        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockStocks),
          ok: true
        });
      });
      
      afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
      });
      
      

    it('StockAsset snapshot test', async () => {
        const stockAssetDetails = render(<StockAsset {...params} />)

        await act( async () => {
            await waitFor( () => {
                const loading = screen.queryByText('Loading...');
                expect(loading).toBeNull();
            })
        });
      
        await waitFor(() => {
            expect(screen.getByText('Candlestick Chart')).toBeDefined()
            fireEvent.press(screen.getByText('Candlestick Chart'))
            expect(screen.getByText('Line Chart')).toBeDefined()
            fireEvent.press(screen.getByText('Line Chart'))
        })

        expect(stockAssetDetails).toMatchSnapshot();
    }
    )

    it('stockDetails text test', async () => {
        const stockAssetDetails = render(<StockAsset {...params} />)

        await act( () => {
            // console.log(screen.debug());
            expect(screen.getByText("Fidelity • GBP • Plaid  IRA"))
            expect(screen.getByText("BALANCE:  "))
            expect(screen.getByText("£266.23"))
        });
    }
    )

    // it('test toggle between charts', async () => {
        
    // });

    it('toggle transactions when table is clicked', () => {
        const { getByText, queryByTestId } = render(<StockAsset {...params} />);
        const button = getByText('View Transactions');
        fireEvent.press(button);
        // console.log(screen.debug());

        expect(button.props.children).toEqual('Hide Transactions');

        expect(screen.getByText("Press on any transaction to view in depth details."))
        expect(screen.getByText("ID"))
        expect(screen.getByText("Amount"))
        expect(screen.getByText("Date"))
        expect(screen.getByText("Quantity"))
        expect(screen.getByText("Fees"))

        fireEvent.press(button);

        expect(button.props.children).toEqual('View Transactions');

        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("Amount")).toBeNull();
        expect(screen.queryByText("Date")).toBeNull();
        expect(screen.queryByText("Quantity")).toBeNull();
        expect(screen.queryByText("Fees")).toBeNull();
      });
      

    it("toggle table when transactions are empty", () => {
        const parameter = {
            route: {
              params: {
                accessToken: stockAssetData.accessToken,
                accountID: stockAssetData.accountID,
                account_name: stockAssetData.account_name,
                balance: stockAssetData.balance,
                balance_currency: stockAssetData.balance_currency,
                logo: stockAssetData.logo,
                name: stockAssetData.name,
                transactions: [],
                removeAccount: jest.fn(async () => {return Promise}),
              },
            },
            navigation: {
              navigate: jest.fn(),
              goBack: jest.fn()
            }
          };

        const { getByText, queryByTestId } = render(<StockAsset {...parameter} />);
        const button = getByText('View Transactions');
        fireEvent.press(button);
        console.log(screen.debug());

        expect(button.props.children).toEqual('Hide Transactions');

        expect(screen.getByText("No transaction data available."))

        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("Amount")).toBeNull();
        expect(screen.queryByText("Date")).toBeNull();
        expect(screen.queryByText("Quantity")).toBeNull();
        expect(screen.queryByText("Fees")).toBeNull();

        fireEvent.press(button);

        expect(button.props.children).toEqual('View Transactions');

        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("ID")).toBeNull();
        expect(screen.queryByText("Amount")).toBeNull();
        expect(screen.queryByText("Date")).toBeNull();
        expect(screen.queryByText("Quantity")).toBeNull();
        expect(screen.queryByText("Fees")).toBeNull();
    });

    

    it("toggle stocks when clicked", async () => {
        const mockedGetStocks = jest.fn().mockImplementation(() => {
            return Promise.resolve([{"id": 4, "institution_price": "0.01", "institution_price_currency": "GBP", "name": "iShares Inc MSCI Brazil", "quantity": 10000, "security_id": "abJamDazkgfvBkVGgnnLUWXoxnomp5up8llg4", "stockAccount": "JDaKG8B86LCwkwKqKZwLfqR9Aby9NdtQeDelD", "ticker_symbol": "EWZ"}, {"id": 5, "institution_price": "42.15", "institution_price_currency": "GBP", "name": "U S Dollar", "quantity": 5, "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are", "stockAccount": "JDaKG8B86LCwkwKqKZwLfqR9Aby9NdtQeDelD", "ticker_symbol": null}, {"id": 6, "institution_price": "1.00", "institution_price_currency": "GBP", "name": "Nflx Feb 01'18 $355 Call", "quantity": 0.01, "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb", "stockAccount": "JDaKG8B86LCwkwKqKZwLfqR9Aby9NdtQeDelD", "ticker_symbol": "NFLX180201C00355000"}]);
          });

          
        const { getByText, queryByTestId } = render(<StockAsset {...params} getStocks={mockedGetStocks} />);

        await waitFor( () => {
            const loading = screen.UNSAFE_queryByType('ActivityIndicator');
            expect(loading).toBeNull();
        })

        const button = getByText('View Stocks');
        fireEvent.press(button);
        console.log(screen.debug());

        expect(button.props.children).toEqual('Hide Stocks');

        expect(screen.queryByText("No stock data available.")).toBeNull();

        expect(screen.getByText("iShares Inc MSCI Brazil"))
        expect(screen.getByText("U S Dollar"))
        expect(screen.getByText("Nflx Feb 01'18 $355 Call"))

        fireEvent.press(button);

        expect(button.props.children).toEqual('View Stocks');

        expect(screen.queryByText("No stock data available.")).toBeNull();

        expect(screen.queryByText("iShares Inc MSCI Brazil")).toBeNull();
        expect(screen.queryByText("U S Dollar")).toBeNull();
        expect(screen.queryByText("Nflx Feb 01'18 $355 Call")).toBeNull();
    });

    // it("toggle stocks when stocks are empty", () => {
    //     const parameter = {
    //         route: {
    //           params: {
    //             accessToken: stockAssetData.accessToken,
    //             accountID: "jdufsouy8739ud39u39du3",
    //             account_name: stockAssetData.account_name,
    //             balance: stockAssetData.balance,
    //             balance_currency: stockAssetData.balance_currency,
    //             logo: stockAssetData.logo,
    //             name: stockAssetData.name,
    //             transactions: [],
    //             removeAccount: jest.fn(async () => {return Promise}),
    //           },
    //         },
    //         navigation: {
    //           navigate: jest.fn(),
    //           goBack: jest.fn()
    //         }
    //       };

    //     const { getByText, queryByTestId } = render(<StockAsset {...parameter} />);
    //     const button = getByText("View Stocks");
    //     fireEvent.press(button);
    //     console.log(screen.debug());

    //     expect(button.props.children).toEqual('Hide Stocks');

    //     expect(screen.getByText("No stock data available."))

    //     fireEvent.press(button);

    //     expect(button.props.children).toEqual('View Stocks');

    //     expect(screen.queryByText("No stock data available.")).toBeNull();
    // });

    it('stockDetails test button press', async () => {
        const navigationData = {
            stock: {
                id: 6,
                institution_price: '1.00',
                institution_price_currency: 'GBP',
                name: "Nflx Feb 01'18 $355 Call",
                quantity: 0.01,
                security_id: '8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb',
                stockAccount: 'JDaKG8B86LCwkwKqKZwLfqR9Aby9NdtQeDelD',
                ticker_symbol: 'NFLX180201C00355000'
            },
            security_id: '8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb'
        };

        const navigate = jest.fn();
        const stockDetails = render(<StockAsset {...params}/>);

        fireEvent.press(getByText('View Stocks'));
        fireEvent.press(await screen.getByText("Nflx Feb 01'18 $355 Call"));
        expect(navigate).toHaveBeenCalledWith("StockDetails", navigationData);
    })

    it('test remove account', async () => {
        const snapshot = render(<StockAsset {...params} />);
    
        await waitFor( () => {
            const loading = screen.UNSAFE_queryByType('ActivityIndicator');
            expect(loading).toBeNull();
        })
    
        await act(async () => {
            // console.log(screen.debug());
            fireEvent.press(await screen.getByText('REMOVE'));
            fireEvent.press(await screen.getByText('Yes'));
        });
    });
    
    
    it('test cancel remove account', async () => {
        const snapshot = render(<StockAsset {...params} />)
    
        await waitFor( () => {
            const loading = screen.UNSAFE_queryByType('ActivityIndicator');
            expect(loading).toBeNull();
        })
    
        await act(async () => {
            // console.log(screen.debug());
            fireEvent.press(await screen.getByText('REMOVE'));
            fireEvent.press(await screen.getByText('No'));
        });
    })
});