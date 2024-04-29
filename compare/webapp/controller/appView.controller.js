sap.ui.define([
    "sap/ui/core/mvc/Controller",'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast) {
        "use strict";
        var csrfToken;

        return Controller.extend("com.epiuse.compare.controller.appView", {
            handleUploadComplete: function(oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    aRegexResult = /\d{4}/.exec(sResponse),
                    iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
                    sMessage;
    
                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            },
    
            handleUploadPress: function() {
                var oFileUploader = this.byId("fileUploader");
                oFileUploader.checkFileReadable().then(function() {
                    oFileUploader.upload();
                }, function(error) {
                    MessageToast.show("The file cannot be read. It may have changed.");
                }).then(function() {
                    oFileUploader.clear();
                });
            }
        
        });
    });
