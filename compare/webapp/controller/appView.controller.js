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
                reader.onload = function(oEvent) {
                    var strCSV = oEvent.target.result;
                    var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
                    var noOfCols = 6;
                    var headerRow = arrCSV.splice(0, noOfCols);
                    var data = [];
                    while (arrCSV.length > 0) {
                      var obj = {};
                      var row = arrCSV.splice(0, noOfCols);
                      for (var i = 0; i < row.length; i++) {
                        obj[headerRow[i]] = row[i].trim();
                      }
                      data.push(obj);
                    }
                    var Len = data.length;
                    data.reverse();
                    params += "[";
                    for (var j = 0; j < Len; j++) {
                      params += JSON.stringify(data.pop()) + ", ";
                    }
                    params = params.substring(0, params.length - 2);
                    params += "]";
            },
            handleUploadComplete1s: function(oEvent) {
                if (oEvent.getParameters("files")) {
                    var file = oEvent.getParameters("files").files[0]; 
                }
            },
            handleUploadComplete2: function(oEvent) {
                if (oEvent.getParameters("files")) {
                    var file = oEvent.getParameters("files").files[0]; 
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
