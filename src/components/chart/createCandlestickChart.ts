import { SciChartSurface } from "scichart";
import { TPriceBar } from "../../services/binanceRestClient";
import { appTheme } from "../../styles/theme";
import { configureAxes } from "./configureAxes";
import { configureSeries } from "./configureSeries";
import { configureModifiers } from "./configureModifiers";
import { PriceAnnotation } from "./PriceAnnotation";
import { addLineAnnotation } from "./tools/LineAnnotaion";
import { addBoxAnnotation } from "./tools/BoxAnnotation";
import { deleteSelectedAnnotations } from "./tools/DeleteAnnotatation";
import { setData, onNewTrade } from "./utils/ChartData";
import { setXRange, setTool } from "./utils/ChartControls";

export const createCandlestickChart = async (
  rootElement: string | HTMLDivElement,
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.TradingViewTheme,
    },
  );

  const { xAxis } = configureAxes(sciChartSurface, wasmContext);
  const { candleDataSeries } = configureSeries(sciChartSurface, wasmContext);
  const modifiers = configureModifiers(sciChartSurface);
  const { latestPriceAnnotation } = PriceAnnotation(sciChartSurface);

  const controls = {
    setData: (symbolName: string, priceBars: TPriceBar[]) =>
      setData(candleDataSeries, latestPriceAnnotation, symbolName, priceBars),
    onNewTrade: (
      priceBar: TPriceBar,
      tradeSize: number,
      lastTradeBuyOrSell: boolean,
    ) =>
      onNewTrade(
        candleDataSeries,
        xAxis,
        latestPriceAnnotation,
        priceBar,
        tradeSize,
        lastTradeBuyOrSell,
      ),
    setXRange: (startDate: Date, endDate: Date) =>
      setXRange(xAxis, startDate, endDate),
    setTool: (tool: string) => setTool(modifiers, tool),
    addLineAnnotation: () => addLineAnnotation(sciChartSurface, xAxis),
    addBoxAnnotation: () => addBoxAnnotation(sciChartSurface, xAxis),
    deleteSelectedAnnotations: () => deleteSelectedAnnotations(sciChartSurface),
  };

  return {
    sciChartSurface,
    controls,
  };
};
