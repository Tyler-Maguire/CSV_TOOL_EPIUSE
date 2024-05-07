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
        //const Stream = require('stream');
        //const csv = require('csvtojson');
        //const fs = require('fs');
        return Controller.extend("com.epiuse.compare.controller.appView", {
          onInit() {
            // set data model on view
            const oData = {
               Key : {
                  Value : "",
                  Row : "",
                  Coloumn : "" 
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
            var pathForOutputFileName = './difference.csv';


             // split all lines by \n to form an array for both base and secondary files
             const  internLines= oCSVModelCompare1.oData.toString().split('\n');
             const externLines = oCSVModelCompare2.oData.toString().split('\n');
             var externLookup = {};   
             var internCells;
             externLines.forEach(function (eLine){  
             externLookup[eLine] = true;         
            });   
            internLines.forEach(function (iLine){  
              externLookup[iLine] = true;
              internCells = iLine.split(';');
              if(externLookup[internCells[0]]){

              }        
             });                                  
            //internLines.forEach(function(iLine){
           // var internCells = iLine.split(';');
           // if(externLookup[internCells[0]]){ 
            //fs.appendFileSync('public/md5-data/blacklist.csv', internCells[1] + '\n');
            //}

            // this.getView().byId("FileOut1").setBindingContext()

            // var fileout2 = this.byId("FileOut2");

            // fileout1

            MessageToast.show(oCSVModelCompare1.toString());
            MessageToast.show(oCSVModelCompare2.toString());
            
            },
            
            onUpload: function(e) {
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
               };
               reader.readAsBinaryString(file);
             },
             onUpload2: function(e) {
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
               };
               reader.readAsBinaryString(file);
             },
            handleUploadPress1: function(oEvent) {

            let csv = `foo,bar,baz\na,b,c\nd,e,f\ng,h,i`;
              let header = ["head1", "head2", "head3"];
              function parseCsv(str) {
                let split = str.split("\n");
                split.shift();
                let res = [];

                split.forEach((line) => {
                  let o = {};
                  line.split(',').forEach((el, i) => {
                    o[header[i]] = el;
                  })
                  res.push(o);
                });
                return res;
              }

              console.log(parseCsv(csv));

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
            }
        });
    });
