/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comepiuse/CSV_TOOL_EPIUSE/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
