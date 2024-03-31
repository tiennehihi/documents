/*jshint node: true */
module.exports = function(grunt) {
  var browsers = [{
      browserName: "iphone",
      platform: "OS X 10.8",
      version: "6"
  }, {
      browserName: "iphone",
      platform: "OS X 10.10",
      version: "9.2"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "4.0"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "4.4"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "5.1"
  }, {
      browserName: "firefox",
      platform: "Windows 10"
  }, {
      browserName: "chrome",
      platform: "Windows 10"
  }, {
      browserName: "internet explorer",
      platform: "XP",
      version: "7"
  }, {
      browserName: "internet explorer",
      platform: "Windows 7",
      version: "8"
  }, {
      browserName: "internet explorer",
      platform: "Windows 7",
      version: "9"
  }, {
      browserName: "internet explorer",
      platform: "Windows 8",
      version: "10"
  }, {
      browserName: "internet explorer",
      platform: "Windows 10",
      version: "11"
  }, {
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "13.10586"
  }, {
      browserName: "opera",
      platform: "Windows 2008",
      version: "12"
  }, {
      browserName: "safari",
      platform: "OS X 10.8",
      version: "6"
  }, {
      browserName: "safari",
      platform: "OS X 10.9",
      version: "7"
  }, {
      browserName: "safari",
      platform: "OS X 10.10",
      version: "8"
  }, {
      browserName: "safari",
      platform: "OS X 10.11",
      version: "9"
  }];

  var tags = [];
  if (process.env.TRAVIS_PULL_REQUEST && process.