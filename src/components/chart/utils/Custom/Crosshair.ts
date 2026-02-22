import {
  ChartModifierBase2D,
  ModifierMouseArgs,
  ECoordinateMode,
  EAnnotationLayer,
  CustomAnnotation,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  LineAnnotation,
  AxisMarkerAnnotation,
} from "scichart";
import { appTheme } from "../../../../styles/theme";
import { formatDate, formatPrice } from "../../../../utils/formatters";

const CROSSHAIR_COLOR = "#9B9B9B";
const LABEL_BG = "#2B2B43";
const LABEL_FG = "#FFFFFF";

export class CrosshairTool extends ChartModifierBase2D {
  public type = "CrosshairTool";

  private hLine: LineAnnotation | undefined;
  private vLine: LineAnnotation | undefined;
  private xMarker: AxisMarkerAnnotation | undefined;
  private yMarker: AxisMarkerAnnotation | undefined;
  private coordLabel: CustomAnnotation | undefined;

  constructor() {
    super();
  }

  public modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);

    if (!this.isEnabled) return;

    const px = args.mousePoint.x;
    const py = args.mousePoint.y;

    const rect = this.parentSurface.seriesViewRect;

    // Clamp to chart area
    if (
      px < rect.left ||
      px > rect.right ||
      py < rect.top ||
      py > rect.bottom
    ) {
      this.hideCrosshair();
      return;
    }

    this.showCrosshair();

    const xCalc = this.parentSurface.xAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const yCalc = this.parentSurface.yAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const xVal = xCalc.getDataValue(px);
    const yVal = yCalc.getDataValue(py);

    // ── Horizontal line ──────────────────────────────────────────────────────
    if (!this.hLine) {
      this.hLine = new LineAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        stroke: CROSSHAIR_COLOR,
        strokeThickness: 1,
        strokeDashArray: [4, 4],
        annotationLayer: EAnnotationLayer.AboveChart,
        x1: rect.left,
        x2: rect.right,
        y1: py,
        y2: py,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.hLine);
    } else {
      this.hLine.y1 = py;
      this.hLine.y2 = py;
      this.hLine.x1 = rect.left;
      this.hLine.x2 = rect.right;
    }

    // ── Vertical line ────────────────────────────────────────────────────────
    if (!this.vLine) {
      this.vLine = new LineAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        stroke: CROSSHAIR_COLOR,
        strokeThickness: 1,
        strokeDashArray: [4, 4],
        annotationLayer: EAnnotationLayer.AboveChart,
        x1: px,
        x2: px,
        y1: rect.top,
        y2: rect.bottom,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.vLine);
    } else {
      this.vLine.x1 = px;
      this.vLine.x2 = px;
      this.vLine.y1 = rect.top;
      this.vLine.y2 = rect.bottom;
    }

    // ── X axis marker (date) ─────────────────────────────────────────────────
    if (!this.xMarker) {
      this.xMarker = new AxisMarkerAnnotation({
        fontSize: 11,
        fontStyle: "Bold",
        backgroundColor: LABEL_BG,
        color: LABEL_FG,
        formattedValue: formatDate(xVal),
        xAxisId: "AxisX",
        x1: xVal,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.xMarker);
    } else {
      this.xMarker.x1 = xVal;
      this.xMarker.formattedValue = formatDate(xVal);
    }

    // ── Y axis marker (price) ────────────────────────────────────────────────
    if (!this.yMarker) {
      this.yMarker = new AxisMarkerAnnotation({
        fontSize: 11,
        fontStyle: "Bold",
        backgroundColor: LABEL_BG,
        color: LABEL_FG,
        formattedValue: formatPrice(yVal),
        yAxisId: "AxisY",
        y1: yVal,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.yMarker);
    } else {
      this.yMarker.y1 = yVal;
      this.yMarker.formattedValue = formatPrice(yVal);
    }

    // ── Floating coord label (top-right of cursor) ───────────────────────────
    const labelSvg = this.makeCoordLabel(formatPrice(yVal), formatDate(xVal));

    if (!this.coordLabel) {
      this.coordLabel = new CustomAnnotation({
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        x1: px,
        y1: py,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        svgString: labelSvg,
        annotationLayer: EAnnotationLayer.AboveChart,
        isEditable: false,
      });
      this.parentSurface.annotations.add(this.coordLabel);
    } else {
      this.coordLabel.x1 = px + 12;
      this.coordLabel.y1 = py - 8;
      this.coordLabel.svgString = labelSvg;
    }
  }

  public modifierMouseLeave(args: ModifierMouseArgs): void {
    super.modifierMouseLeave(args);
    this.hideCrosshair();
  }

  private showCrosshair() {
    [
      this.hLine,
      this.vLine,
      this.xMarker,
      this.yMarker,
      this.coordLabel,
    ].forEach((a) => {
      if (a) a.isHidden = false;
    });
  }

  private hideCrosshair() {
    [
      this.hLine,
      this.vLine,
      this.xMarker,
      this.yMarker,
      this.coordLabel,
    ].forEach((a) => {
      if (a) a.isHidden = true;
    });
  }

  private makeCoordLabel(price: string, date: string): string {
    const w = 130;
    const h = 36;
    const r = 5;
    return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}"
        fill="${LABEL_BG}" fill-opacity="0.92" stroke="${CROSSHAIR_COLOR}" stroke-width="0.5"/>
      <text x="10" y="13" font-size="11" font-family="Inter,Roboto,sans-serif"
        font-weight="700" fill="${LABEL_FG}" dominant-baseline="middle">${price}</text>
      <text x="10" y="27" font-size="10" font-family="Inter,Roboto,sans-serif"
        fill="#9B9B9B" dominant-baseline="middle">${date}</text>
    </svg>`;
  }

  // Clean up when tool is removed/disabled
  public onDetach(): void {
    this.removeAnnotations();
    super.onDetach();
  }

  private removeAnnotations() {
    [this.hLine, this.vLine].forEach((a) => {
      if (a) {
        try {
          this.parentSurface.annotations.remove(a);
        } catch (_) {}
      }
    });
    [this.xMarker, this.yMarker].forEach((a) => {
      if (a) {
        try {
          this.parentSurface.annotations.remove(a);
        } catch (_) {}
      }
    });
    if (this.coordLabel) {
      try {
        this.parentSurface.annotations.remove(this.coordLabel);
      } catch (_) {}
    }

    this.hLine = undefined;
    this.vLine = undefined;
    this.xMarker = undefined;
    this.yMarker = undefined;
    this.coordLabel = undefined;
  }
}
