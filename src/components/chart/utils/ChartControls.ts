import { NumberRange, AxisBase2D, ChartModifierBase2D } from "scichart";

export const setXRange = (
  xAxis: AxisBase2D,
  startDate: Date,
  endDate: Date,
) => {
  console.log(
    `createCandlestickChart(): Setting chart range to ${startDate} - ${endDate}`,
  );
  xAxis.visibleRange = new NumberRange(
    startDate.getTime() / 1000,
    endDate.getTime() / 1000,
  );
};

export const setTool = (
  modifiers: { [key: string]: ChartModifierBase2D },
  tool: string,
) => {
  const { zoomPanModifier, cursorModifier, selectionModifier } = modifiers;

  zoomPanModifier.isEnabled = false;
  cursorModifier.isEnabled = false;
  selectionModifier.isEnabled = false;

  switch (tool) {
    case "pan":
      zoomPanModifier.isEnabled = true;
      cursorModifier.isEnabled = false;
      break;
    case "cursor":
      zoomPanModifier.isEnabled = false;
      cursorModifier.isEnabled = true;
      break;
    default:
      zoomPanModifier.isEnabled = true;
      cursorModifier.isEnabled = false;
      break;
  }
};
