import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { css } from "emotion";
import Router from "next/router";
import Container from "./container";
import Header from "./typography/header";
import Body from "./typography/body";
import Button from "./button";
import HeaderButton from "./header_button";
import HeaderLink from "./header_link";
import { globalTheme } from "../theme";
import Paper from "./paper";
import { mutateUrl } from "../utils/common";
import { connect } from "react-redux";
import { showQuestion } from "../utils/common";

const box = css`
  padding: 63px 63px 63px 63px;
  @media only screen and (max-width: ${globalTheme.max.mobile}) {
    padding: 17px 26px 55px 26px;
  }
  display: inline-flex;
`;
const prevButton = css`
  margin-top: 50px;
  margin-bottom: 15px;
`;
const questions = css`
  margin: 0;
  padding: 0;
`;
const body = css`
  margin-top: 5px;
  margin-bottom: 0px;
`;
export class GuidedExperience extends Component {
  returnGoToNextSection = clearCurrentQuestion => {
    let goToNextSection = () => {
      const { id, reduxState, url, saveQuestionResponse } = this.props;
      let params = {};
      this.queryParamsToClear().forEach(x => {
        params[x.key] = x.value;
      });

      // modifiedReduxState exists so we are sure the redux state updates before we do Router push
      let modifiedReduxState = JSON.parse(JSON.stringify(reduxState));
      if (clearCurrentQuestion) {
        if (id === "needs") {
          saveQuestionResponse("selectedNeeds", {});
          modifiedReduxState.selectedNeeds = {};
        } else {
          saveQuestionResponse(id, "");
          modifiedReduxState[id] = "";
        }
      }

      const displayable_sections = this.getDisplayableSections(
        modifiedReduxState
      );
      const dynamicStepNumber = displayable_sections.indexOf(id);
      let nextSection;
      if (dynamicStepNumber + 1 >= displayable_sections.length) {
        nextSection = "summary";
        if (clearCurrentQuestion && id === "needs") {
          params.section = "";
          params.selectedNeeds = {};
          const newUrl = mutateUrl(url, "/summary", params);
          window.location.href = newUrl;
          document.body.focus();
        } else {
          params.section = "";
          Router.push(mutateUrl(url, "/summary", params)).then(() =>
            window.scrollTo(0, 0)
          );
          document.body.focus();
        }
      } else {
        nextSection = displayable_sections[dynamicStepNumber + 1];
        params.section = nextSection;
        if (clearCurrentQuestion) {
          params[id] = "";
        }
        Router.push(mutateUrl(url, "/index", params)).then(() =>
          window.scrollTo(0, 0)
        );
        document.body.focus();
      }
    };
    return goToNextSection;
  };

  getDisplayableSections = reduxState => {
    return this.props.reduxState.questions
      .map(x => x.variable_name)
      .filter((x, i) => showQuestion(x, i, reduxState));
  };

  queryParamsToClear() {
    return this.props.reduxState.questions
      .map(x => x.variable_name)
      .filter((x, i) => !showQuestion(x, i, this.props.reduxState))
      .map(x => {
        if (x === "needs") {
          return { key: "selectedNeeds", value: {} };
        } else {
          return { key: x, value: "" };
        }
      });
  }

  render() {
    const { t, prevSection, subtitle, helperText, url } = this.props;

    return (
      <Container id="mainContent">
        {prevSection === "index" ? (
          <HeaderLink
            id="prevButton"
            href={t("ge.home_link")}
            className={prevButton}
            arrow="back"
          >
            {t("back")}
          </HeaderLink>
        ) : (
          <HeaderButton
            id="prevButton"
            onClick={() => {
              let params = { section: prevSection };
              this.queryParamsToClear().forEach(x => {
                params[x.key] = x.value;
              });
              Router.push(mutateUrl(url, "/", params));
              document.body.focus();
              window.scrollTo(0, 0);
            }}
            className={prevButton}
            arrow="back"
          >
            {t("back")}
          </HeaderButton>
        )}

        {this.props.stepNumber === 0 ? (
          <React.Fragment>
            <Header size="lg" headingLevel="h1">
              {t("ge.Find benefits and services")}
            </Header>
            <Body>
              <p>{t("ge.intro_text_p1")}</p>
              <p>{t("ge.intro_text_p2")}</p>
            </Body>
          </React.Fragment>
        ) : null}

        <Paper padding="md" className={box}>
          <Grid container spacing={24}>
            <Grid item xs={12} className={questions}>
              <Header size="md_lg" headingLevel="h2">
                {subtitle}
              </Header>
              {helperText ? <Body className={body}>{helperText}</Body> : null}
              {this.props.children}
            </Grid>

            <Grid item xs={12}>
              <Button
                id="nextButton"
                arrow={true}
                onClick={this.returnGoToNextSection(false)}
              >
                {t("next")}{" "}
              </Button>
              <HeaderButton
                id="skipButton"
                altStyle="grey"
                onClick={this.returnGoToNextSection(true)}
              >
                {t("ge.skip")}
              </HeaderButton>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    reduxState: reduxState,
    sectionOrder: reduxState.questions.map(x => x.variable_name)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveQuestionResponse: (question, response) => {
      dispatch({
        type: "SAVE_QUESTION_RESPONSE",
        data: { [question]: response }
      });
    }
  };
};

GuidedExperience.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  reduxState: PropTypes.object.isRequired,
  sectionOrder: PropTypes.array.isRequired,
  saveQuestionResponse: PropTypes.func.isRequired,
  prevSection: PropTypes.string,
  t: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  stepNumber: PropTypes.number.isRequired,
  children: PropTypes.object.isRequired,
  store: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuidedExperience);
