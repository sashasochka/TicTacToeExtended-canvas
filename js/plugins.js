"use strict";

// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {
  };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// helper functions

var array2dInit = function (dim1, dim2, fun) {
  var result = [];
  for (var outer = 0; outer < dim1; ++outer) {
    result[outer] = [];
    for (var inner = 0; inner < dim2; ++inner) {
      result[outer][inner] = fun({y: outer,  x: inner});
    }
  }
  return result;
};

// assertions
var assert = function (condition, message) {
  if (!condition) {
    throw new assert.AssertionError(message);
  }
};

assert.AssertionError = function (msg) {
  this.name = assert.AssertionError.name;
  this.message = msg;
  this.toString = function () {
    return this.name + ": " + this.message;
  };
};

assert.AssertionError.name = "AssertionError";
