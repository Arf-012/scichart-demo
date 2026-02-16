import { TResolvedReturnType } from "scichart-react";
import { createCandlestickChart } from "./createCandlestickChart";
import { CHART_PROVIDERS } from "../../services/ChartProviders";

export const createChartInitializer =
  (providerId: string) => async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, controls } =
      await createCandlestickChart(rootElement);

    // Get provider by ID or default to 'random'
    const provider = CHART_PROVIDERS[providerId] || CHART_PROVIDERS["random"];

    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    // Fetch History
    const priceBars = await provider.getHistory(
      "BTCUSDT",
      "1h",
      startDate,
      endDate,
    );

    // Update Chart Data
    controls.setData(
      providerId === "random" ? "Random" : "BTC/USDT",
      priceBars,
    );

    // Set Initial Viewport (Last 5 days)
    const startViewportRange = new Date(Date.now());
    startViewportRange.setDate(endDate.getDate() - 5);
    const endViewportRange = new Date(endDate.getTime());
    endViewportRange.setDate(endDate.getDate() + 1);
    controls.setXRange(startViewportRange, endViewportRange);

    // Subscribe to Realtime Stream
    const lastBar = priceBars[priceBars.length - 1];
    const obs = provider.getStream("BTCUSDT", "1h", lastBar);

    const subscription = obs.subscribe((pb) => {
      const priceBar = {
        date: pb.openTime,
        open: pb.open,
        high: pb.high,
        low: pb.low,
        close: pb.close,
        volume: pb.volume,
      };
      controls.onNewTrade(priceBar, pb.lastTradeSize, pb.lastTradeBuyOrSell);
    });

    return { sciChartSurface, subscription, controls };
  };
