import numpy as np
import ccxt
import requests
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import yfinance as yf
import matplotlib.pyplot as plt
from datetime import datetime

from typing import Union

from fastapi import FastAPI

# Function to calculate the Relative Strength Index (RSI) for Ethereum
def get_rsi_eth():
    # Load the data into a dataframe
    symbol = yf.Ticker('ETH-USD')
    df_eth = symbol.history(interval="1d", period="max")

    # Delete unnecessary columns
    del df_eth["Dividends"]
    del df_eth["Stock Splits"]

    change = df_eth["Close"].diff()
    change.dropna(inplace=True)

    # Create two copies of the Closing price Series
    change_up = change.copy()
    change_down = change.copy()

    # Set negative values in change_up to 0 and positive values in change_down to 0
    change_up[change_up < 0] = 0
    change_down[change_down > 0] = 0

    # Verify that the sum of change_up and change_down equals the original change
    change.equals(change_up + change_down)

    # Calculate the rolling average of average up and average down
    avg_up = change_up.rolling(14).mean()
    avg_down = change_down.rolling(14).mean().abs()
    rsi = 100 * avg_up / (avg_up + avg_down)
    return rsi

# Function to calculate the Sharpe Ratio for Ethereum
def get_sharp_ratio():
    # Configure the exchange
    exchange = ccxt.binance()  # You can choose another exchange

    # Fetch daily OHLCV data for Ethereum
    ohlcv = exchange.fetch_ohlcv('ETH/USDT', timeframe='1d', limit=100)  # For example, the last 100 days

    # Configure the trading pair and indicators
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['returns'] = df['open'].pct_change() * 100

    # Risk-free rate (e.g., annual interest rate of 2%)
    risk_free_rate = 0.02

    # Calculate mean return and standard deviation of returns
    mean_return = np.mean(df['returns'])
    std_deviation = np.std(df['returns'])

    # Calculate the Sharpe Ratio
    sharpe_ratio = (mean_return - risk_free_rate) / std_deviation

    print(f"Sharpe Ratio: {sharpe_ratio}")

    return sharpe_ratio

# Function to fetch historical data of the Fear and Greed Index
def get_fear_and_greed_history():
    response = requests.get(
        'https://api.alternative.me/fng/?limit=10&format=json')
    response_data = response.json()
    df = pd.DataFrame(response_data["data"])

    return df

# Function to fetch the ColinTalksCrypto Bitcoin Bull Run Index (CBBI)
def get_cbbi():
    # URL of the JSON file
    url = 'https://colintalkscrypto.com/cbbi/data/latest.json'  # Replace with the actual URL

    HTTP_TIMEOUT = 30
    USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'

    # Send a GET request to the URL
    response = requests.get(
        'https://colintalkscrypto.com/cbbi/data/latest.json',
        headers={'User-Agent': USER_AGENT},
        timeout=HTTP_TIMEOUT)

    response_data = response.json()
    df = pd.DataFrame(response_data)

    # Fill NaN values with zeros and drop rows with any NaN values
    df.fillna(0, inplace=True)
    df = df.dropna(how='any')

    # Identify columns to normalize
    features_to_normalize = df.columns

    # Create a MinMaxScaler object
    scaler = MinMaxScaler()

    # Apply Min-Max scaling to the specified columns
    df[features_to_normalize] = scaler.fit_transform(df[features_to_normalize])
    df["Sum"] = df.sum(axis=1)
    df['CBBI'] = df['Sum'] / 11
    return df

# Initialize a FastAPI application
app = FastAPI()

# Define the root endpoint
@app.get("/")
def read_root():
    return {
        "RSI_INDEX": get_rsi_eth().iloc[-1],
        "Sharp_Ratio": get_sharp_ratio(),
        "Fear_and_Greed_Index": get_fear_and_greed_history()['value'].iloc[-1],
        "CBBI_Index": get_cbbi()['CBBI'].iloc[-1] * 100
    }

# Define an endpoint with parameters
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

# Main function
def main():
    print('hello world')
    print('RSI ETH')
    print('-----------')
    print(get_rsi_eth())

    print('Sharp Ratio ETH')
    print('-----------')
    print(get_sharp_ratio())

    print('Fear and greed INDEX')
    print('-----------')
    print(get_fear_and_greed_history())

    print('CBBI INDEX')
    print('-----------')
    print(get_cbbi())

# Entry point of the script
if __name__ == "__main__":
    main()