import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { globalTheme } from "../theme";
import { uuidv4 } from "../utils/common";

const StyledCheckbox = styled("label")({
  display: "block",
  position: "relative",
  padding: "0 0 0 38px"
});

const StyledInput = styled("input")(
  {
    position: "absolute",
    left: 0,
    top: 0,
    width: "24px",
    height: "24px",
    zIndex: 1,
    margin: 0,
    zoom: 1,
    opacity: 0,
    ":checked + span:after": {
      opacity: 1
    },
    ":focus + span:before": {
      boxShadow: `0 0 0 3px ${globalTheme.colour.focusColour}`
    }
  },
  ({ disabled }) => ({
    cursor: disabled ? "auto" : "pointer",
    " + span": {
      pointerEvents: disabled ? "none" : "auto"
    }
  })
);

const StyledLabel = styled("span")({
  fontFamily: globalTheme.fontFamily,
  fontWeight: 400,
  textTransform: "none",
  fontSize: "14px",
  lineHeight: "16px",
  cursor: "pointer",
  padding: "8px 0px 9px 8px",
  display: "block",
  height: "28px",
  color: `${globalTheme.colour.greyishBrown}`,
  "::before": {
    content: "''",
    display: "block",
    border: `2px solid ${globalTheme.colour.greyishBrown}`,
    background: "transparent",
    width: "24px",
    height: "24px",
    position: "absolute",
    top: 0,
    left: 0
  },
  "::after": {
    content: "''",
    border: "solid",
    color: globalTheme.colour.greyishBrown,
    borderWidth: "0 0 4px 4px",
    background: "transparent",
    borderTopColor: "transparent",
    width: "11px",
    height: "5px",
    position: "absolute",
    top: "8px",
    left: "6px",
    transform: "rotate(-45deg)",
    zoom: 1,
    opacity: 0
  }
});

const Checkbox = ({ children, className, ...props }) => {
  const guid = uuidv4();
  return (
    <StyledCheckbox className={className} htmlFor={guid}>
      <StyledInput type="checkbox" {...props} id={guid} />
      <StyledLabel>{children}</StyledLabel>
    </StyledCheckbox>
  );
};

Checkbox.defaultProps = {
  className: undefined
};

Checkbox.propTypes = {
  /**
   * Text content for checkbox
   */
  children: PropTypes.node.isRequired,
  /**
   * CSS Classname for outermost container
   */
  className: PropTypes.string
};

export default Checkbox;
