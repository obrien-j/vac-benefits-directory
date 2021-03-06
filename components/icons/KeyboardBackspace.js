"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _createSvgIcon = _interopRequireDefault(require("./utils/createSvgIcon"));

var _default = (0, _createSvgIcon.default)(
  _react.default.createElement(
    _react.default.Fragment,
    null,
    _react.default.createElement("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }),
    _react.default.createElement("path", {
      d: "M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"
    })
  ),
  "KeyboardBackspace"
);

exports.default = _default;
