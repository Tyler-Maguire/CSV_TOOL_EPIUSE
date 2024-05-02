sap.ui.define([
    "sap/ui/core/mvc/Controller",'sap/m/MessageToast','sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,JSONModel) {
        "use strict";
        var csrfToken;
        var changedLine = '';

        return Controller.extend("com.epiuse.compare.controller.appView", {


          onInit() {
            // set data model on view
            const oData = {
               recipient : {
                  name : "World"
               }
            };
            var oCSVModel1= this.getOwnerComponent().getModel("CSVModel1");
            const oModel1 = new JSONModel(oCSVModel1);
            this.getView().setModel(oModel1);

            var oCSVModel2= this.getOwnerComponent().getModel("CSVModel2");
            const oModel2 = new JSONModel(oCSVModel2);
            this.getView().setModel(oModel2);
         },



          onCompare: function(oEvent) {

            var oCSVModelCompare1 = this.getOwnerComponent().getModel("CSVModel1");
            var oCSVModelCompare2 = this.getOwnerComponent().getModel("CSVModel2");


             // split all lines by \n to form an array for both base and secondary files
             const internLines = oCSVModelCompare1.toString().split('\n');
             const externLines = oCSVModelCompare2.toString().split('\n');

             // Create a json object with each secondary file line as its key and value as true
             const externLookup = {};
             externLines.forEach(eLine => externLookup[eLine] = true);

             // Iterate through each line of base file
             internLines.forEach(iLine => {
                 // use above formed json object and pass each line as key
                 // value of externLookup[iLine] would be undefined if secondary file didn't have same line
                 // in that case current line is considered as changed line and will be eventually written to output file
                 if (!externLookup[iLine]) changedLine = changedLine + iLine + '\n'
             })

           




            MessageToast.show(oCSVModelCompare1.toString());
            MessageToast.show(oCSVModelCompare2.toString());

            
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
             // var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var oCSVModel1 = this.getOwnerComponent().getModel("CSVModel1");
              this.getView().setModel(oCSVModel1, "CSVModel1");

              var fU = this.getView().byId("idfileUploader");
              var domRef = fU.getFocusDomRef();
              var file = fU.oFileUpload.files[0]; 
              var reader = new FileReader();
              var params = "CSV1Json=";
              var that = this;

              
            
              reader.onload = function(oEvent) {
                var strCSV = oEvent.target.result;
                var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
                var noOfCols = 4;
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
                
                var jsoncsv1 = new JSONModel();
                jsoncsv1.setData(params);
                that.getOwnerComponent().setModel(jsoncsv1,"CSVModel1");
                that.getView().setModel(jsoncsv1,"CSVModel1");

            

                var http = new XMLHttpRequest();
                //var url = oResourceBundle.getText("UploadEmployeesFile").toString();
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
               //http.open("POST", url, true);
                //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              //  http.send(params);
              };
              reader.readAsBinaryString(file);
            },
            onUpload2: function(e) {
          //    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
              var oCSVModel2 = this.getOwnerComponent().getModel("CSVModel2");
              this.getView().setModel(oCSVModel2, "CSVModel2");
              var fU = this.getView().byId("idfileUploader");
              var domRef = fU.getFocusDomRef();
              var file = fU.oFileUpload.files[0]; 
              var reader = new FileReader();
              var params = "CSV2JSON=";
              var that = this;
              
          
              reader.onload = function(oEvent) {
                var strCSV = oEvent.target.result;
                var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
                var noOfCols = 8;
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

                var jsoncsv2 = new JSONModel();
                jsoncsv2.setData(params);
                that.getOwnerComponent().setModel(jsoncsv2,"CSVModel2");
                that.getView().setModel(jsoncsv2,"CSVModel2");

                MessageToast.show(params);
                var http = new XMLHttpRequest();
                //var url = oResourceBundle.getText("UploadEmployeesFile").toString();
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
               // http.open("POST", url, true);
                //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              //  http.send(params);
              };
              reader.readAsBinaryString(file);
            }
        
        });
    });
