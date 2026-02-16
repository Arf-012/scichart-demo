import { TPriceBar } from "../../../types/types";

/**
 * Parses Kraken JSON candles into TPriceBar array
 * Kraken Response: [ [time, open, high, low, close, vwap, volume, count], ... ]
 */
const parseKrakenCandles = (candles: any[]): TPriceBar[] => {
  const priceBars: TPriceBar[] = [];

  candles.forEach((candle: any) => {
    // Kraken: [time, open, high, low, close, vwap, volume, count]
    const [timestamp, open, high, low, close, _, volume] = candle;

    priceBars.push({
      date: timestamp, // Kraken timestamp is already in seconds
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume),
    });
  });

  return priceBars;
};

/**
 * Fetches candles from Kraken Rest API
 * Endpoint: https://api.kraken.com/0/public/OHLC
 */
const getCandles = async (
  symbol: string, // e.g., "XBTUSD" or "XXBTZUSD"
  interval: string, // Kraken uses minutes (1, 5, 15, 30, 60, 240, 1440, 10080, 21600)
  startTime?: Date,
  endTime?: Date,
): Promise<TPriceBar[]> => {
  // Map standard intervals to Kraken intervals (minutes)
  const intervalMap: Record<string, number> = {
    "1m": 1,
    "5m": 5,
    "1h": 60,
    "1d": 1440,
  };
  const krakenInterval = intervalMap[interval] || 60;

  // Kraken symbol mapping (e.g. BTCUSDT -> XBTUSD or similar, for demo we use XBTUSD)
  // Note: Kraken symbols can be tricky. "XBTUSD" is a common alias for Bitcoin/USD.
  const krakenSymbol = symbol === "BTCUSDT" ? "XBTUSD" : symbol;

  let url = `https://api.kraken.com/0/public/OHLC?pair=${krakenSymbol}&interval=${krakenInterval}`;
  if (startTime) {
    // Kraken 'since' is a timestamp in seconds
    url += `&since=${Math.floor(startTime.getTime() / 1000)}`;
  }

  try {
    console.log(`KrakenClient: Fetching ${krakenSymbol} ${interval}`);
    const response = await fetch(url);
    const data = await response.json();

    if (data.error && data.error.length > 0) {
      console.error("Kraken API Error:", data.error);
      return [];
    }

    // Kraken returns data.result[pairName]
    const pairName = Object.keys(data.result).find((key) => key !== "last");
    if (pairName) {
      return parseKrakenCandles(data.result[pairName]);
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const krakenRestClient = {
  getCandles,
};
