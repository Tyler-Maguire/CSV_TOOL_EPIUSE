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
            handlefileComparison: function(oEvent) {
               
                if (oEvent.getParameters("files")) {
                    var file = oEvent.getParameters("files").files[0]; 
                }
            },
            handleUploadComplete1s: function(oEvent) {
                if (oEvent.getParameters("files")) {
                    var file = oEvent.getParameters("files").files[0]; 
                }
            },
            handleUploadComplete2: function(oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    aRegexResult = /\d{4}/.exec(sResponse),
                    iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
                    sMessage;
    
                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            }, 
    
            handleUploadPress1: function() {
                var oFileUploader1 = this.byId("fileUploader1");
                oFileUploader1.checkFileReadable().then(function() {
                    oFileUploader1.upload();
                }, function(error) {
                    MessageToast.show("File 1 cannot be read. It may have changed.");
                }).then(function() {
                    oFileUploader1.clear();
                });
            },
            handleUploadPress2: function() {
                var oFileUploader2 = this.byId("fileUploader2");
                oFileUploader2.checkFileReadable().then(function() {
                    oFileUploader2.upload();
                }, function(error) {
                    MessageToast.show("File 2 cannot be read. It may have changed.");
                }).then(function() {
                    oFileUploader2.clear();
                });
            }
        
        });
    });
