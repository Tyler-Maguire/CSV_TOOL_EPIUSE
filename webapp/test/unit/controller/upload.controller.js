/*global QUnit*/

sap.ui.define([
	"comepiuse/CSV_TOOL_EPIUSE/controller/upload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("upload Controller");

	QUnit.test("I should test the upload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
