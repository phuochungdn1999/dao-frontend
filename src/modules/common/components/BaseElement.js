// import { Property as CSSProperty } from '@type/csstype';
import styled from "styled-components";

function spacing({ spacing }) {
  if (!spacing) {
    return null;
  }

  let styles = {};

  // paddings
  const { p, px, py, pl, pr, pb, pt } = spacing;

  // margins
  const { m, mx, my, ml, mr, mb, mt } = spacing;

  // paddings
  if (px) {
    styles.paddingLeft = px;
    styles.paddingRight = px;
  }

  if (py) {
    styles.paddingTop = py;
    styles.paddingBottom = py;
  }

  if (pl) {
    styles.paddingLeft = pl;
  }

  if (pr) {
    styles.paddingRight = pr;
  }

  if (pb) {
    styles.paddingBottom = pb;
  }

  if (pt) {
    styles.paddingTop = pt;
  }

  if (p) {
    styles.padding = p;
  }

  // margins
  if (mx) {
    styles.marginLeft = mx;
    styles.marginRight = mx;
  }

  if (my) {
    styles.marginTop = my;
    styles.marginBottom = my;
  }

  if (ml) {
    styles.marginLeft = ml;
  }

  if (mr) {
    styles.marginRight = mr;
  }

  if (mb) {
    styles.marginBottom = mb;
  }

  if (mt) {
    styles.marginTop = mt;
  }

  if (m) {
    styles.margin = m;
  }

  return styles;
}

function colors({ color, bg, hoverColor, hoverBg }) {
  let styles = {};
  if (color) {
    styles.color = color;
  }

  if (bg) {
    styles.backgroundColor = bg;
  }

  // hover
  if (hoverColor) {
    styles[":hover"] = {
      color: hoverColor,
    };
  }

  if (hoverBg) {
    styles[":hover"] = {
      ...styles[":hover"],
      backgroundColor: hoverBg,
    };
  }
  return styles;
}

function flex({
  flex,
  justifyContent,
  alignItems,
  alignSelf,
  flexWrap,
  flexDirection,
}) {
  let styles = {};

  if (typeof flex === "boolean" && flex) {
    styles.display = "flex";
  } else if (flex) {
    styles.flex = flex;
  }

  if (flexDirection) {
    styles.flexDirection = flexDirection;
    styles.display = "flex";
  }

  if (justifyContent) {
    styles.justifyContent = justifyContent;
  }

  if (alignItems) {
    styles.alignItems = alignItems;
  }

  if (alignSelf) {
    styles.alignSelf = alignSelf;
  }

  if (flexWrap) {
    styles.flexWrap = flexWrap;
  }
  if (flexDirection) {
    styles.flexDirection = flexDirection;
  }

  return styles;
}

function textAlignment({ textAlign }) {
  if (textAlign) {
    return { textAlign };
  }
  return null;
}

function display({ display }) {
  if (display) {
    return { display };
  }
  return null;
}

function border({ border, borderBottom, borderTop, borderLeft, borderRight }) {
  const obj = {};
  if (border) obj.border = border;
  if (borderBottom) obj.borderBottom = borderBottom;
  if (borderTop) obj.borderTop = borderTop;
  if (borderLeft) obj.borderLeft = borderLeft;
  if (borderRight) obj.borderRight = borderRight;
  return obj;
}

// @ts-ignore
const BaseElement = styled.div`
  ${spacing}
  ${colors}
  ${flex}
  ${textAlignment}
  ${display}
  ${border}
`;

export default BaseElement;
