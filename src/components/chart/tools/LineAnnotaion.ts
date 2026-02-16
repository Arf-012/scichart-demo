import {
  SciChartSurface,
  AxisBase2D,
  LineAnnotation,
  BoxAnnotation,
  ECoordinateMode,
  EAnnotationLayer,
} from "scichart";
import { appTheme } from "../../../styles/theme";
import { calculateCenter } from "../../../utils/calculateCenter";

export const addLineAnnotation = (
  sciChartSurface: SciChartSurface,
  xAxis: AxisBase2D,
) => {
  const xRange = xAxis.visibleRange;
  const yRange = sciChartSurface.yAxes.get(0).visibleRange;

  const { x1, x2, y1, y2 } = calculateCenter(xRange, yRange);

  const lineAnnotation = new LineAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    stroke: appTheme.MutedBlue,
    strokeThickness: 4,
    x1,
    y1,
    x2,
    y2,
    isEditable: true,
    annotationLayer: EAnnotationLayer.AboveChart,
  });
  sciChartSurface.annotations.add(lineAnnotation);
};