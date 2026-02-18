import {
  TSciChart,
  SciChartSurface,
  OhlcDataSeries,
  FastCandlestickRenderableSeries,
  FastLineRenderableSeries,
  XyMovingAverageFilter,
} from "scichart";
import { appTheme } from "../../../styles/theme";

export const configureSeries = (
  sciChartSurface: SciChartSurface,
  wasmContext: TSciChart,
) => {
  const candleDataSeries = new OhlcDataSeries(wasmContext, {
    dataSeriesName: "BTC/USDT",
  });

  const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
    dataSeries: candleDataSeries,
    strokeThickness: 1,
    brushUp: appTheme.TV_Green,
    brushDown: appTheme.TV_Red,
    strokeUp: appTheme.TV_Green,
    strokeDown: appTheme.TV_Red,
    id: "candlestick-series",
  });

  candlestickSeries.rolloverModifierProps.tooltipLegendTemplate = (
    tooltipProps: any,
    seriesInfo: any,
  ) => {
    const display = "flex";
    let str = "";

    if (seriesInfo && seriesInfo.openValue) {
      const open = seriesInfo.openValue.toFixed(2);
      const high = seriesInfo.highValue.toFixed(2);
      const low = seriesInfo.lowValue.toFixed(2);
      const close = seriesInfo.closeValue.toFixed(2);
      const change = seriesInfo.closeValue - seriesInfo.openValue;
      const percentChange = ((change / seriesInfo.openValue) * 100).toFixed(2);
      const color = change >= 0 ? appTheme.TV_Green : appTheme.TV_Red;
      const labelColor = "#787B86";

      str = `
        <div style="display: flex; gap: 10px; font-family: Roboto; font-size: 13px;">
            <span style="color: ${labelColor}">O <span style="color: ${color}">${open}</span></span>
            <span style="color: ${labelColor}">H <span style="color: ${color}">${high}</span></span>
            <span style="color: ${labelColor}">L <span style="color: ${color}">${low}</span></span>
            <span style="color: ${labelColor}">C <span style="color: ${color}">${close}</span></span>
            <span style="color: ${color}">
               ${change >= 0 ? "+" : ""}${change.toFixed(2)} (${change >= 0 ? "+" : ""}${percentChange}%)
            </span>
        </div>
      `;
    }

    const legendEl = document.getElementById("legend-ohlc-value");
    if (legendEl) {
      legendEl.innerHTML = str;
    }

    return "";
  };

  sciChartSurface.renderableSeries.add(candlestickSeries);

  // Add moving averages
  // sciChartSurface.renderableSeries.add(
  //   new FastLineRenderableSeries(wasmContext, {
  //     dataSeries: new XyMovingAverageFilter(candleDataSeries, {
  //       dataSeriesName: "Moving Average (20)",
  //       length: 20,
  //     }),
  //     stroke: appTheme.VividSkyBlue,
  //   }),
  // );

  // sciChartSurface.renderableSeries.add(
  //   new FastLineRenderableSeries(wasmContext, {
  //     dataSeries: new XyMovingAverageFilter(candleDataSeries, {
  //       dataSeriesName: "Moving Average (50)",
  //       length: 50,
  //     }),
  //     stroke: appTheme.VividPink,
  //   }),
  // );

  return {
    candleDataSeries,
    candlestickSeries,
  };
};
