import React from "react";
import { mount } from "enzyme";
import { SelectionsEditor } from "../../components/selections_editor";
const { axe, toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);
import eligibilityPathsFixture from "../fixtures/eligibilityPaths";
import needsFixture from "../fixtures/needs";
import configureStore from "redux-mock-store";
import questionsFixture from "../fixtures/questions";
import multipleChoiceOptionsFixture from "../fixtures/multiple_choice_options";
import questionDisplayLogicFixture from "../fixtures/question_display_logic";
import questionClearLogicFixture from "../fixtures/question_clear_logic";
import responsesFixture from "../fixtures/responses";

describe("SelectionsEditor", () => {
  let props;
  let mockStore, reduxData;

  beforeEach(() => {
    props = {
      t: key => key,
      profileQuestions: questionsFixture.filter(
        q => q.variable_name !== "needs"
      ),
      responses: responsesFixture,
      saveQuestionResponse: jest.fn()
    };
    reduxData = {
      questions: questionsFixture,
      questionDisplayLogic: questionDisplayLogicFixture,
      questionClearLogic: questionClearLogicFixture,
      multipleChoiceOptions: multipleChoiceOptionsFixture,
      selectedNeeds: {},
      needs: needsFixture,
      eligibilityPaths: eligibilityPathsFixture,
      pageWidth: 1000
    };
    mockStore = configureStore();
    props.store = mockStore(reduxData);
  });

  it("passes axe tests", async () => {
    let html = mount(<SelectionsEditor {...props} {...reduxData} />).html();
    expect(await axe(html)).toHaveNoViolations();
  });

  it("has no clear button if nothing selected", () => {
    props.store = mockStore(reduxData);
    expect(
      mount(<SelectionsEditor {...props} {...reduxData} />)
        .find("#ClearFilters")
        .first().length
    ).toEqual(0);
  });

  it("has a clear button if patronType has a value", () => {
    props.responses.patronType = "organization";
    props.store = mockStore(reduxData);
    expect(
      mount(<SelectionsEditor {...props} {...reduxData} />)
        .find("#ClearFilters")
        .first().length
    ).toEqual(1);
  });

  it("has a clear button if selectedNeeds is populated", () => {
    reduxData.selectedNeeds = { foo: "bar" };
    props.store = mockStore(reduxData);
    expect(
      mount(<SelectionsEditor {...props} {...reduxData} />)
        .find("#ClearFilters")
        .first().length
    ).toEqual(1);
  });

  it("has a correct clearFilters function", () => {
    let instance = mount(
      <SelectionsEditor {...props} {...reduxData} />
    ).instance();
    instance.clearFilters();
    expect(props.saveQuestionResponse).toBeCalledWith("patronType", "");
    expect(props.saveQuestionResponse).toBeCalledWith("serviceType", "");
    expect(props.saveQuestionResponse).toBeCalledWith("statusAndVitals", "");
    expect(props.saveQuestionResponse).toBeCalledWith("serviceHealthIssue", "");
    expect(props.saveQuestionResponse).toBeCalledWith("selectedNeeds", {});
  });

  it("clicking #ClearFilters runs the clearFilters function", () => {
    reduxData.selectedNeeds = { foo: "bar" };
    const mounted = mount(<SelectionsEditor {...props} {...reduxData} />);
    mounted.instance().clearFilters = jest.fn();
    mounted
      .find("#ClearFilters")
      .first()
      .simulate("click");
    expect(mounted.instance().clearFilters).toBeCalled();
  });

  it("clicking ExpansionPanelSummary runs the toggleOpenState function", () => {
    const mounted = mount(<SelectionsEditor {...props} {...reduxData} />);
    mounted.instance().toggleOpenState = jest.fn();
    mounted
      .find("ExpansionPanelSummary")
      .first()
      .simulate("click");
    expect(mounted.instance().toggleOpenState).toBeCalled();
  });

  it("returns 1 if a profile filter is selected", () => {
    props.responses.patronType = "organization";
    props.store = mockStore(reduxData);
    expect(
      mount(<SelectionsEditor {...props} {...reduxData} />)
        .instance()
        .countSelected()
    ).toEqual(1);
  });

  it("toggles the state with toggleOpenState", () => {
    const mounted = mount(<SelectionsEditor {...props} {...reduxData} />);
    mounted.setState({ open: true });
    mounted.instance().toggleOpenState();
    expect(mounted.state("open")).toEqual(false);
  });
});
