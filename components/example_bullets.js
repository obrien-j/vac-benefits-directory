import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { css } from "emotion";
import { globalTheme } from "../theme";

const margin = css`
  padding-left: 20px;
  @media only screen and (min-width: ${globalTheme.max.sm}) {
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
  }
  li {
    margin-bottom: 10px;
  }
`;
const root = css`
  border-bottom: thin dashed ${globalTheme.colour.lineGrey};
  color: ${globalTheme.colour.greyishBrown};
`;
export class ExampleBullets extends React.Component {
  getExampleBullets = () => {
    const { benefitExamples, benefit, t } = this.props;
    const lang = t("current-language-code") === "en" ? "english" : "french";
    return benefitExamples
      .filter(x => x.linked_benefits.indexOf(benefit.vacNameEn) > -1)
      .map((x, i) => {
        return <li key={i}>{x[lang]}</li>;
      });
  };

  render() {
    const { t } = this.props;
    const bullets = this.getExampleBullets();

    if (bullets.length === 0) {
      return null;
    }
    return (
      <div className={root}>
        {t("benefit_card.examples")}
        <ul className={margin}>{bullets}</ul>
      </div>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    benefitExamples: reduxState.benefitExamples
  };
};

ExampleBullets.propTypes = {
  benefit: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  benefitExamples: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(ExampleBullets);
