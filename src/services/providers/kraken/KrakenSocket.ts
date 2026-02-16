import { WebsocketBuilder } from "websocket-ts";
import { Observable } from "rxjs";
import { TRealtimePriceBar } from "../../../types/types";

// Kraken WebSocket URL
const WSS_URL = "wss://ws.kraken.com";

/**
 * Parses Kraken OHLC Websocket Message
 * Format: [channelID, [time, etime, open, high, low, close, vwap, volume, count], channelName, pair]
 */
const parseObsevableMessage = (data: any): TRealtimePriceBar | null => {
  // Check if it's a data message (array) and not an event (object)
  if (!Array.isArray(data)) return null;

  const [_, ohlcData, channelName, pair] = data;

  if (channelName !== "ohlc-60") {
    // We are hardcoding 1h (60) for this demo
    // In a real app, strict checking might be needed or dynamic subscription
    // But for now, we process whatever OHLC we get
    // Kraken channel names are like "ohlc-1", "ohlc-60"
  }

  // ohlcData: [time, etime, open, high, low, close, vwap, volume, count]
  // time: Begin time of interval (seconds, string)
  // etime: End time of interval (seconds, string)
  const [time, etime, open, high, low, close, vwap, volume, count] = ohlcData;

  const pb: TRealtimePriceBar = {
    symbol: pair,
    eventTime: Date.now(),
    openTime: parseFloat(time) * 1000,
    interval: "1h", // Hardcoded for this simple demo wrapper
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
    closeTime: parseFloat(etime) * 1000,
    lastTradeSize: 0, // Not provided directly in OHLC packet
    lastTradeBuyOrSell: false,
  };
  return pb;
};

const getRealtimeCandleStream = (symbol: string, interval: string) => {
  const obs = new Observable<TRealtimePriceBar>((subscriber) => {
    // Map interval to Kraken minutes
    const intervalMap: Record<string, number> = {
      "1m": 1,
      "5m": 5,
      "1h": 60,
      "1d": 1440,
    };
    const krakenInterval = intervalMap[interval] || 60;
    const krakenSymbol = symbol === "BTCUSDT" ? "XBT/USD" : symbol; // Kraken WS uses '/', e.g. XBT/USD

    console.log("Connecting to Kraken WS for", krakenSymbol);

    const ws = new WebsocketBuilder(WSS_URL)
      .onOpen((i, ev) => {
        console.log("Kraken WS Connected");
        // Subscribe
        i.send(
          JSON.stringify({
            event: "subscribe",
            pair: [krakenSymbol],
            subscription: {
              name: "ohlc",
              interval: krakenInterval,
            },
          }),
        );
      })
      .onMessage((i, ev) => {
        const data = JSON.parse(ev.data);
        // Heartbeat or Status
        if (data.event === "heartbeat") return;
        if (data.event === "systemStatus") return;
        if (data.event === "subscriptionStatus") {
          console.log("Kraken Subscription:", data);
          return;
        }

        const candle = parseObsevableMessage(data);
        if (candle) {
          subscriber.next(candle);
        }
      })
      .build();

    return () => ws.close();
  });

  return obs;
};

export const krakenSocketClient = {
  getRealtimeCandleStream,
};
