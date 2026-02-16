import {
  SciChartSurface,
  AxisBase2D,
  BoxAnnotation,
  ECoordinateMode,
  EAnnotationLayer,
  OhlcDataSeries,
} from "scichart";
import { appTheme } from "../../../styles/theme";
import { calculateCenter } from "../../../utils/calculateCenter";
import { attachStatsTooltip } from "../utils/TooltipBehavior";

export const addBoxAnnotation = (
  sciChartSurface: SciChartSurface,
  xAxis: AxisBase2D,
) => {
  const yAxis = sciChartSurface.yAxes.get(0);
  const xRange = xAxis.visibleRange;
  const yRange = yAxis.visibleRange;

  const { x1, x2, y1, y2 } = calculateCenter(xRange, yRange);

  const boxAnnotation = new BoxAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    fill: appTheme.VividPurple + "33",
    stroke: appTheme.VividPurple,
    strokeThickness: 1,
    x1,
    y1,
    x2,
    y2,
    isEditable: true,
    annotationLayer: EAnnotationLayer.AboveChart,
  });

  sciChartSurface.annotations.add(boxAnnotation);

  const renderableSeries = sciChartSurface.renderableSeries.get(0);
  if (!renderableSeries || !renderableSeries.dataSeries) return;

  const dataSeries = renderableSeries.dataSeries as OhlcDataSeries;

  attachStatsTooltip(sciChartSurface, boxAnnotation, dataSeries, xAxis, yAxis);
};
