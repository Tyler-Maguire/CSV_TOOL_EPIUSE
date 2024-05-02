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
          onCompare: function(oEvent) {


               

            },  
            handleUploadPress1: function(oEvent) {
                
                var file;
                var oFileUploader1 = this.byId("fileUploader1");
                var reader1 = new FileReader();
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
            
            },

            handleTypeMissmatch: function(oEvent) {
              var aFileTypes = oEvent.getSource().getFileType();
              jQuery.each(aFileTypes, function(key, value) {
                aFileTypes[key] = "*." + value;
              });
              var sSupportedFileTypes = aFileTypes.join(", ");
              MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                " is not supported. Choose one of the following types: " +
                sSupportedFileTypes);
            },
            handleValueChange: function(oEvent) {
              MessageToast.show("Press 'Upload File' to upload file '" + oEvent.getParameter("newValue") + "'");
            },
            handleFileSize: function(oEvent) {
              MessageToast.show("The file size should not exceed 10 MB.");
            },
            handleFileNameLength: function(oEvent) {
              MessageToast.show("The file name should be less than that.");
            },
            onUpload: function(e) {
              var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var fU = this.getView().byId("idfileUploader");
              var domRef = fU.getFocusDomRef();
              var file = fU.oFileUpload.files[0]; 
              var reader = new FileReader();
              var params = "EmployeesJson=";
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
                // MessageBox.show(params);
                var http = new XMLHttpRequest();
                var url = oResourceBundle.getText("UploadEmployeesFile").toString();
                http.onreadystatechange = function() {
                  if (http.readyState === 4 && http.status === 200) {
                    var json = JSON.parse(http.responseText);
                    var status = json.status.toString();
                    switch (status) {
                      case "Success":
                        MessageToast.show("Data is uploaded succesfully.");
                        break;
                      default:
                        MessageToast.show("Data was not uploaded.");
                    }
                  }
                };
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              //  http.send(params);
              };
              reader.readAsBinaryString(file);
            },
            onUpload2: function(e) {
              var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var fU = this.getView().byId("idfileUploader");
              var domRef = fU.getFocusDomRef();
              var file = fU.oFileUpload.files[0]; 
              var reader = new FileReader();
              var params = "EmployeesJson=";
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
                // MessageBox.show(params);
                var http = new XMLHttpRequest();
                var url = oResourceBundle.getText("UploadEmployeesFile").toString();
                http.onreadystatechange = function() {
                  if (http.readyState === 4 && http.status === 200) {
                    var json = JSON.parse(http.responseText);
                    var status = json.status.toString();
                    switch (status) {
                      case "Success":
                        MessageToast.show("Data is uploaded succesfully.");
                        break;
                      default:
                        MessageToast.show("Data was not uploaded.");
                    }
                  }
                };
                http.open("POST", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              //  http.send(params);
              };
              reader.readAsBinaryString(file);
            }
        
        });
    });
