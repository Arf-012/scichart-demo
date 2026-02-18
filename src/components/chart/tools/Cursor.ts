import { CursorModifier } from "scichart";
import { appTheme } from "../../../styles/theme";

export const createCursorModifier = () => {
  const cursorModifier = new CursorModifier({
    crosshairStroke: appTheme.TV_Cursor,
    crosshairStrokeDashArray: [2, 2],
    axisLabelFill: appTheme.TV_Cursor,
    showAxisLabels: true,
  });
  cursorModifier.isEnabled = false;
  return cursorModifier;
};