import {
  SciChartSurface,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  PinchZoomModifier,
  CursorModifier,
  AnnotationHoverModifier,
  EXyDirection,
} from "scichart";
import { SelectionModifier } from "../features/SelectionModifier";
import { createCursorModifier } from "../tools/Cursor";

export const configureModifiers = (sciChartSurface: SciChartSurface) => {
  const zoomPanModifier = new ZoomPanModifier({ enableZoom: true });
  const pinchZoomModifier = new PinchZoomModifier({
    xyDirection: EXyDirection.XDirection,
  });
  const cursorModifier = createCursorModifier();

  (pinchZoomModifier as any).scaleFactor = 0.0005;

  const selectionModifier = new SelectionModifier();

  sciChartSurface.chartModifiers.add(
    zoomPanModifier,
    pinchZoomModifier,
    selectionModifier,
    cursorModifier,

    new MouseWheelZoomModifier(),
    new AnnotationHoverModifier(),
  );

  return { zoomPanModifier, cursorModifier, selectionModifier };
};
