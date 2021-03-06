import React, { Component } from "react";
import PropTypes from "prop-types";
import { globalTheme } from "../../theme";
import { cx, css } from "emotion";

const sizeDict = {
  xl: { fontSize: 52, fontWeight: 900 },
  lg: { fontSize: 36, fontWeight: 900 },
  md_lg: { fontSize: 32, fontWeight: 900 },
  md: { fontSize: 24, fontWeight: "bold" },
  sm_md: { fontSize: 20, fontWeight: "bold" },
  sm: { fontSize: 18, fontWeight: "bold" }
};

class Header extends Component {
  style = css`
    font-family: ${globalTheme.fontFamily};
    font-size: ${sizeDict[this.props.size].fontSize}px;
    @media only screen and (max-width: ${globalTheme.max.mobile}) {
      font-size: ${0.8 * sizeDict[this.props.size].fontSize}px;
    }
    font-weight: ${sizeDict[this.props.size].fontWeight};
    color: ${globalTheme.colour.greyishBrown};
    margin: 0px;
    padding-top: ${this.props.paddingTop}px;
  `;

  render() {
    const { children, className, headingLevel, id } = this.props;
    const appliedClassname = className ? cx(this.style, className) : this.style;
    switch (headingLevel) {
      case "h1":
        return (
          <h1 id={id} className={appliedClassname}>
            {children}
          </h1>
        );
      case "h2":
        return (
          <h2 id={id} className={appliedClassname}>
            {children}
          </h2>
        );
      case "h3":
        return (
          <h3 id={id} className={appliedClassname}>
            {children}
          </h3>
        );
      case "h4":
        return (
          <h4 id={id} className={appliedClassname}>
            {children}
          </h4>
        );
      case "":
        return (
          <div id={id} className={appliedClassname}>
            {children}
          </div>
        );
    }
  }
}

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.string,
  headingLevel: PropTypes.string,
  size: PropTypes.string,
  id: PropTypes.string,
  paddingTop: PropTypes.string
};

Header.defaultProps = {
  headingLevel: "",
  paddingTop: "0"
};

export default Header;
