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
               

        },
            handleUploadComplete1s: function(oEvent) {},
            handleUploadComplete2: function(oEvent) {}, 
    
            handleUploadPress1: function(oEvent) {
                
                var file;
                var oFileUploader1 = this.byId("fileUploader1");
                var reader1 = new FileReader();
                if (oEvent.getParameters("files")) {
                    file = oEvent.getParameters("files").files[0]; 
                }
                file = oFileUploader1.oFileUpload.files[0];
                reader1.onload = function(oEvent) {
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
            }

            },
            handleUploadPress2: function(oEvent) {
                
                var file;
                var reader2 = new FileReader();
                var oFileUploader2 = this.byId("fileUploader2");
                if (oEvent.getParameters("files")) {
                    file = oEvent.getParameters("files").files[0]; 
                }
                reader2.onload = function(oEvent) {
                    file = oFileUploader2.oFileUpload.files[0];    
                    var reader2 = new FileReader();
                    var strCSV = oEvent.target.result;
                    var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
                    var arrLen = arrCSV.length;
                    var noOfCols = arrLen;
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
            }
            
            }
        
        });
    });
