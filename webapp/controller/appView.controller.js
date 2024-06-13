sap.ui.define([
  "sap/ui/core/mvc/Controller",'sap/m/MessageToast','sap/ui/model/json/JSONModel','sap/ui/model/Model'
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,MessageToast,JSONModel,Model) {
      "use strict";
      var resultToDraw = {
        json1: "",
        json2: "",
        colorLine: [],
        stepDiff: [],
        currentLine: 0,
        tab: ""
    };

    var Body1;
    var Body2;
    var File1_Name = '';
    var File2_Name = '';
    var File1_Dir_Location = '';
    var File2_Dir_Location = '';

    var Variant_File_1;
    var Variant_File_2;
    var Variant_File;
    var OutputFileInLine = '';

    var OutputFile = '';

    var newBody1 = [];
    var newBody2 = [];

    var FullCSV1;
    var FullCSV2;

    //To-DO: Add in Logging functionality
    var logdata = [];
    var Verbose = false;
    var basiclogging = true;
    
    var rowInput;
    var keyInput;

    var csvFile1;
    var csvFile2;

    var csvfiles = [];
    
    var newCSV1 = [];
    var newCSV2 = [];
    var newCSV1json = '';
    var newCSV2json = '';


    var stringkeys = '';
    var stringDiff = '';
    var n;
    var ignorearray = [];
    var ignorekeys = [];
    var founddiff = false;
    var keyhandled = false;
    var sameline = false;
    var firstdiff = true;

    
    var csvBaseKeys = [];
    var csvBaseHeader = '';
    var csvBaseHeadArr = [];
    var csvBaseHeadCnt = 0;
    var csvBaseKeysCnt = 0;
    var csvBaseNewHeader = '';
    var csvBaseNewHeadArr = [];

    var csvCompareKeys = [];
    var csvCompareHeader = '';
    var csvCompHeadArr = [];
    var csvCompHeadCnt = 0;
    var csvCompareKeysCnt = 0;
    var csvCompNewHeader = '';
    var csvCompNewHeadArr = [];

    var result = {
        csv: [],
        text: "",
        maxColumn: 0,
        nbLineDiff: 0,
        nbColumnDiff: 0
    };

    var OrderCSV = {
        preCSV:[],
        postCSV:[]
    };

    var NewCSV = {
      newCSV1:[],
      newCSV2:[]
  };

    var delimit_1 = ',';
    var delimit_2 = ',';

    var compareSelect = 'all'
      //'all' or 'diff'
      , Compare = {
        ONLY1: 1,
        ONLY2: 2,
        DIFF: 3
    };
 
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

          var csvResult = this.getOwnerComponent().getModel("csvResult");
          this.getView().setModel(csvResult);
          
       },

      //Useful to get coloumns which appears in both files(Common file attributes)
       getAllColumns: function() {
        const columns = [];
        return columns;
      },

     

        onCompare: function(oEvent) {
          // Here we are using the localStorage in order to save variant information:
          rowInput = this.getView().byId("RowSelection").getValue();
          localStorage.setItem('Rows', JSON.stringify(rowInput));
          keyInput = this.getView().byId("KeySelection").getValue();
          localStorage.setItem('Keys', JSON.stringify(keyInput));

          if(keyInput.toString() != ''){
            csvBaseKeys = keyInput.toString().split(','); 
            csvBaseKeysCnt = csvBaseKeys.length;        
          }
          if(keyInput.toString() != ''){
            csvCompareKeys = rowInput.toString().split(','); 
            csvCompareKeysCnt =  csvCompareKeys.length;             
          }

          var oCSVModelCompare1 = this.getOwnerComponent().getModel("CSVModelBase");
          var oCSVModelCompare2 = this.getOwnerComponent().getModel("CSVModelCompare");

           const internLines = oCSVModelCompare1.oData.CSVBaseJson.toString().split('\n');
           const externLines = oCSVModelCompare2.oData.CSVCompareJson.toString().split('\n');
 
          this.reOrderCSV(internLines,externLines);
          this.dynamicCSVcompare(oCSVModelCompare1.oData.CSVBaseJson.toString(),oCSVModelCompare2.oData.CSVCompareJson.toString(),delimit_1,delimit_2);

          
          //MessageToast.show(oCSVModelCompare1.toString());
          //MessageToast.show(oCSVModelCompare2.toString());
          
          },



          //This is an extremely important Function as here the sorting of the coloumns is done
           checkFunc: async function (inputFile) {
             if (inputFile.files.length) {
               try {
                 var csvFileInText = await inputFile.files[0].text();
                 console.log(csvFileInText);

                 csvFileInText=csvFileInText.replaceAll('\r','').replaceAll('ï»¿','');
                 csvfiles.push(csvFileInText);

                 var arrObje = [];
                // var lines = csvFileInText.split('\n');
                csvFileInText = csvFileInText.replace(/{/g, '').replace(/}/g, '');
                 let lines = csvFileInText.split(/\r?\n/);

                let delimit = this.delimiter(csvFileInText);

                delimit_1 = delimit;

                 var lineA = lines[0].split(delimit);

                 csvBaseHeader = lines[0];
                 csvBaseHeadArr = lineA;

                 let linesize = lineA.length;
                 csvBaseHeadCnt = linesize;

                 if (linesize >= 1) {
                   return linesize;
                 }
                 else {
                   return -1;
                 }

               } catch (e) {
                 console.error(e);
               }
             }
           },


           //this Function is used to first align the matching coloumns into the correct order so they can be compared in the following stage.
           checkFuncCompare: async function (inputFile) {

            if (inputFile.files.length) {
              try {
                var csvFileInText = await inputFile.files[0].text();
                console.log(csvFileInText);
                csvFileInText=csvFileInText.replaceAll('\r','').replaceAll('ï»¿','');
                csvfiles.push(csvFileInText);

                var arrObje = [];
               // var lines = csvFileInText.split('\n');
                let lines = csvFileInText.split(/\r?\n/);

               let delimit = this.delimiter(csvFileInText);

               delimit_2 = delimit;

                var lineA = lines[0].split(delimit);

                csvCompareHeader = lines[0];

                let linesize = lineA.length;
                csvCompHeadCnt = linesize;
                

                csvCompHeadArr = lineA;

                if (linesize >= 1) {
                  return linesize;
                }
                else {
                  return -1;
                }

              } catch (e) {
                console.error(e);
              }
            }
          },

          //TO-DO Check through the ReOrder Section as the long File causes issues with matching
          reOrderCSV: function(LinesCSV1,LinesCSV2){
            var len1 = LinesCSV1.length;
            len1--;
            for(var w = 0; w <= len1; w++){
              if(LinesCSV1[w]){
                LinesCSV1[w]=LinesCSV1[w].replaceAll('\r','').replaceAll('ï»¿','');
              }
            
            }
            csvFile1 = LinesCSV1;
            var len2 = LinesCSV2.length;
            len2--;
            for(var d = 0; d <= len2; d++){
              if(LinesCSV2[d]){
                LinesCSV2[d]=LinesCSV2[d].replaceAll('\r','').replaceAll('ï»¿','');
              }
            }
            csvFile2 = LinesCSV2;
            FullCSV1 = LinesCSV1;
            FullCSV2 = LinesCSV2;

            Body1 = JSON.parse(JSON.stringify(LinesCSV1));
            Body2 = JSON.parse(JSON.stringify(LinesCSV2));

            var header1 = JSON.parse(JSON.stringify(Body1));
            var header2 = JSON.parse(JSON.stringify(Body2));

            header1.shift();
            header2.shift();
        
            newCSV1json = '';
            newCSV2json = '';

            Body1 = Body1.filter(Boolean);
            Body2 = Body2.filter(Boolean);

            var newsplit1  = csvFile1.map((x) => x.split(delimit_1));
            var newsplit2  = csvFile2.map((x) => x.split(delimit_2));   
            
            newsplit1.filter(Boolean);
            newsplit2.filter(Boolean);

            for (var i = 0; i < newsplit1.length; i++) {
              if(newsplit1[i]==''){newsplit1.splice(i, 1);}
            }

            for (var i = 0; i < newsplit2.length; i++) {
              if(newsplit2[i]==''){newsplit2.splice(i, 1);}
            }

            var tempheader = '';
            var temparray1;
            var temparray2;
            var tempcol = '';
            var newheadcnt1 = 0;
            var newheadcnt2 = 0;
            if(csvBaseHeader == csvCompareHeader){
            }else{
            for(var i=0;i<csvBaseHeadCnt;i++){
              for(var j=0;j<csvCompHeadCnt;j++){  
                var obj = {};
                var obj2 = {};         
                if(csvBaseHeadArr[i]==csvCompHeadArr[j]){
             
                  tempheader = csvBaseHeadArr[i];

                  //Shifting CSV1
                  csvBaseHeadArr[i] = csvBaseHeadArr[newheadcnt1];
                  csvBaseHeadArr[newheadcnt1] = tempheader;

                  //obj[newsplit1[newheadcnt1][i]] = newsplit1[newheadcnt1][j];
                  //Loop through rows newsplit1
                  for(var b1=0; b1<newsplit1.length;b1++){
                  temparray1 = JSON.parse(JSON.stringify(newsplit1[b1][i]));
                  newsplit1[b1][i] = JSON.parse(JSON.stringify(newsplit1[b1][newheadcnt1]));
                  newsplit1[b1][newheadcnt1] = JSON.parse(JSON.stringify(temparray1));;
                  }
                  //Shifting CSV2
                  csvCompHeadArr[j] = csvCompHeadArr[newheadcnt2];
                  csvCompHeadArr[newheadcnt2] = tempheader;

                  //obj2[newsplit2[j][newheadcnt2]] = newsplit2[newheadcnt2][i];
                  //Loop through rows newsplit2
                  
                  for(var b2=0; b2<newsplit2.length;b2++){
                    temparray2 = JSON.parse(JSON.stringify(newsplit2[b2][i]));
                    newsplit2[b2][i] = JSON.parse(JSON.stringify(newsplit2[b2][newheadcnt2]));
                    temparray2 = JSON.parse(JSON.stringify(newsplit2[b2][j]));
                    newsplit2[b2][j] = JSON.parse(JSON.stringify(newsplit2[b2][newheadcnt2]));
                    newsplit2[b2][newheadcnt2] = JSON.parse(JSON.stringify(temparray2));;
                    }

                  //TO-DO Shift Cols at the same index.
                  newheadcnt1++;
                  newheadcnt2++;
                  NewCSV.newCSV1.push(obj);
                  NewCSV.newCSV2.push(obj2);
                }
      
              }
              
            } 
            
            Body1 = newsplit1;
            Body2 = newsplit2;
          }           
          },


          //Upload the First File and use Binary String read to pass the file contents into a stream
          onUploadBase: function(e) {
             var oCSVModelBase = this.getOwnerComponent().getModel("CSVModelBase");
             this.getView().setModel(oCSVModelBase, "CSVModelBase");
             var fU = this.getView().byId("FileUploaderBase");
             var domRef = fU.getFocusDomRef();
             var file = fU.oFileUpload.files[0]; 
             File1_Name = fU.oFileUpload.files[0].name;
             File1_Dir_Location = fU.oFileUpload.files[0].param;
             var reader = new FileReader();
             var params = "";
             var that = this;
             reader.onload = function(oEvent) {
               var strCSV = oEvent.target.result;
               var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
               var lines = strCSV.split('\n');
               that.checkFunc(fU.oFileUpload).then(function(r){
                var noOfCols = r;
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
                for (var j = 0; j < Len; j++) {
                  params += JSON.stringify(data.pop()) + ", ";
                }
                params = params.substring(0, params.length - 2);
                var jsoncsvbase = new JSONModel();
                jsoncsvbase.setData({CSVBaseJson:strCSV});
                that.getView().byId("FileOutBase").setText(params); 
                that.getOwnerComponent().setModel(jsoncsvbase,"CSVModelBase");
                that.getView().setModel(jsoncsvbase,"CSVModelBase");
                });
             };
             reader.readAsBinaryString(file);
           },
           onUploadCompare: function(e) {
            var oCSVModelCompare = this.getOwnerComponent().getModel("CSVModelCompare");
            this.getView().setModel(oCSVModelCompare, "CSVModelCompare");
            var fU = this.getView().byId("FileUploaderCompare");
            var domRef = fU.getFocusDomRef();
            var file = fU.oFileUpload.files[0]; 
            File2_Name = fU.oFileUpload.files[0].name;
            File2_Dir_Location = fU.oFileUpload.files[0].param;
            var reader = new FileReader();
            var params = "";
            var that = this;
            reader.onload = function(oEvent) {
              var strCSV = oEvent.target.result;
              var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
              var lines = strCSV.split('\n');
              that.checkFuncCompare(fU.oFileUpload).then(function(r){
               var noOfCols = r;
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
               for (var j = 0; j < Len; j++) {
                 params += JSON.stringify(data.pop()) + ", ";
               }
               params = params.substring(0, params.length - 2);
               var jsoncsvcompare = new JSONModel();
               jsoncsvcompare.setData({CSVCompareJson:strCSV});
               that.getView().byId("FileOutCompare").setText(params); 
               that.getOwnerComponent().setModel(jsoncsvcompare,"CSVModelCompare");
               that.getView().setModel(jsoncsvcompare,"CSVModelCompare");
               });
            };
            reader.readAsBinaryString(file);
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

          //Function has not yet been implemented but considering the use it might be handy with large files
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
          exportResultstoFile: function (fileObject) {
           // fileObject.data = result.text;
            fileObject.data = OutputFile;
            fileObject.filename = 'results.csv';
            var blob = (fileObject.blob ? fileObject.blob : new Blob([fileObject.data], { type: fileObject.mime }));
            if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, fileObject.filename);
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileObject.filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          
          },

          //Generic read File class which is used as a base for readFileBase and ReadFileCompare
          readFile: function(input){
            let file = input.files[0];

            let reader = new FileReader();
          
            reader.readAsText(file);
          
            reader.onload = function() {
              console.log(reader.result);
            };
          
            reader.onerror = function() {
              console.log(reader.error);
            };

          },

          //To-DO change the name of this function and then we can make use of the dlimiter function
          delimiter: function(csvText) {
            let t = csvText.split("\n")[0];
            let delArray = [',', ';', '|', '    '];
            let comma,samiclon,pipe,tab = 0;
            delArray.forEach((e, i) => {
                if (i === 0) {
                    comma = t.split(e).length;
                } else if (i === 1) {
                    samiclon = t.split(e).length;
                } else if (i === 2) {
                    pipe = t.split(e).length;
                } else if (i === 3) {
                    tab = t.split(e).length;
                }
            });
            let tmpArray1 = [comma, samiclon, pipe, tab]
            let tmpArray = [comma, samiclon, pipe, tab];
            let maxLen = tmpArray.sort((file, b) => b - file)[0];
            let delimiter_i = 0;
            tmpArray1.forEach((e, i) => {
                if (maxLen === e) {
                    delimiter_i = i;
                }
            });

            //returns the correct delimeter for the file as a return:
            if (delimiter_i === 0) {
                return ',';
            } else if (delimiter_i === 1) {
                return ';'
            } else if (delimiter_i === 2) {
                return '|'
            } else if (delimiter_i === 3) {
                return '    '
            }
        },


        // New variant Section which was added on the 10th June
        onUploadVariant: function(){



          var fU = this.getView().byId("FileUploaderVariant");
          var domRef = fU.getFocusDomRef();
          var file = fU.oFileUpload.files[0];

          var fU1 = this.getView().byId("FileUploadBase");
          var domRef = fU1.getFocusDomRef();
         // var file1 = fU1.oFileUpload.files[0];

          var fU2 = this.getView().byId("FileUploadCompare");
          var domRef = fU2.getFocusDomRef();
         // var file2 = f2.oFileUpload.files[0];

      
          var reader = new FileReader();
          var params = "";
          var that = this;
          reader.onload = function(oEvent) {
            var strCSV = oEvent.target.result;
            var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
            var lines = strCSV.split('\n');

            //to-do Research and test Setting oFileUpload Params from the JS Controller:

           // file1.name = (lines[0].split('File_1_Resource:')[1]);
           // file2.name = (lines[1].split('File_1_Resource:')[1]);

            keyInput = lines[2].split('File_1_Input_Parameters:')[1];
            rowInput = lines[3].split('File_2_Input_Parameters:')[1];

            that.getView().byId("RowSelection").setValue(rowInput);
            that.getView().byId("KeySelection").setValue(keyInput);

            var keyText = '';
            var keyStart = false;

            var diffText = '';
            var diffstart=false;

            for(var j =0; j < lines.length;j++){

              if(lines[j].split('KeyList from prev Run:')[1]){
                keyStart = true;
              }
              if(lines[j].split('DiffList from prev Run:')[1]){
                keyStart = false;
                diffstart = true; 
             }
              if(keyStart == true){
              keyText = keyText + lines[j]+'\n';
              }
            if(diffstart == true){
              diffText =diffText + lines[j]+'\n';
            }
          }
          keyText.replace('KeyList from prev Run:','');
          keyText.replace('DiffList from prev Run:','');
          that.getView().byId("Key").setText(keyText);
          diffText.replace('DiffList from prev Run:','');
          that.getView().byId("Diff").setText(diffText);
          };
          reader.readAsBinaryString(file);
        },
        createVariant: function(){
          Variant_File = '';
          Variant_File = Variant_File + 'File_1_Resource: ' + File1_Name + '\n';
          Variant_File = Variant_File + 'File_2_Resource: ' + File2_Name + '\n';
          Variant_File = Variant_File + 'File_1_Input_Parameters: ' + keyInput + '\n';
          Variant_File = Variant_File + 'File_2_Input_Parameters: ' + rowInput + '\n';
          Variant_File = Variant_File + 'Results from Prev Run: \n' + OutputFile+ '\n';
          Variant_File = Variant_File + 'KeyList from prev Run: \n' + stringkeys.trim() +'\n';
          Variant_File = Variant_File + 'DiffList from prev Run: \n' + stringDiff ;

          //Testing Local Storage in the form of Browser Cashe
          localStorage.setItem(keyInput, rowInput);
          localStorage.setItem('Keys', JSON.stringify(keyInput));
          localStorage.setItem('Rows', JSON.stringify(rowInput));


          //Testing Fetching the item store:
          var keys = localStorage.getItem('Keys');
          var rows = localStorage.getItem('Rows');
          
          

        },
        ExportVariant: function(fileObject){
       //   Variant_File = to do structure Variant file to store set readible parameters
            this.createVariant();
                     fileObject.data = Variant_File;
                     fileObject.filename = 'variant.csv';
                     var blob = (fileObject.blob ? fileObject.blob : new Blob([fileObject.data], { type: fileObject.mime }));
                     if (navigator.msSaveBlob) { // IE 10+
                       navigator.msSaveBlob(blob, fileObject.filename);
                     } else {
                       var link = document.createElement("a");
                       if (link.download !== undefined) { // feature detection
                         // Browsers that support HTML5 download attribute
                         var url = URL.createObjectURL(blob);
                         link.setAttribute("href", url);
                         link.setAttribute("download", fileObject.filename);
                         link.style.visibility = 'hidden';
                         document.body.appendChild(link);
                         link.click();
                         document.body.removeChild(link);
                       }
                     }
        },
        

        dynamicCSVcompare: function(json1,json2,delimit_1,delimit_2){

          //NEW Bypass of Encoding
          delimit_1 = ',';
          delimit_2 = ',';


          function a(a) {
              for (var e = [], d = a.split(c), h = 0; h < d.length; h++) {
                  a = !1;
                  var k = d[h];
                  k.length && k[0] == f && (2 <= k.length ? k[k.length - 1] !== f ? a = !0 : 2 < k.length && k[k.length - 2] === b && (a = !0) : a = !0);
                  a && h !== d.length - 1 ? d[h + 1] = k + c + d[h + 1] : e.push(k)
              }
              return e
          }

          json1 = json1.replaceAll('ï»¿','');
          json2 = json2.replaceAll('ï»¿','');
          //json1 = Body1.replaceAll('ï»¿','');
          //json1 = Body2.replaceAll('ï»¿','');
          
          var c = delimit_1
            , f = ""
            , b = ''
            , n = json1
            , p = json2;
            //, l = n.split(/\r?\n/)
            //, g = p.split(/\r?\n/);


          var basekey = '';
          var compkey = '';
          var basekeymap = 0;
          var compkeymap = 0;

          //ToDo Add code for the section for key chcking ect
          //Loop through both CSV Rows and use key Selection to match rows and line up row indexs
          if(csvBaseKeysCnt >= 1 && csvCompareKeysCnt >= 1){
            //Future dev to use correspnding keys regardless of text matching or number of keys. 
             if(csvBaseKeys[0] == csvCompareKeys[0] && csvBaseKeys[1] == csvCompareKeys[1]){
              for(var k=0;k < csvBaseKeysCnt;k++){
                if(basekey == ''){
                  basekey = csvBaseKeys[k];
                }else{
                  basekey = basekey +' + '+ csvBaseKeys[k];
                } 
                basekeymap++;
              }
              for(var t=0;t < csvCompareKeysCnt;t++){
                if(compkey == ''){
                  compkey = csvCompareKeys[t];
                }else{
                  compkey = compkey +' + '+ csvCompareKeys[t];
                } 
                compkeymap++;
              }
             }else{
              MessageToast.show('Keys entered do not match. Please check keys.');
             } 
          }else{
              MessageToast.show('Please check that you entered keys for each CSV.');
          } 

          //while looping through 1st csv create data(base key) based on compkey then loop through other table create data(compare key)based on compkey and check then move row to match
           // rearrange from multidimensional array to single dimensional array combining key coloumns?  then 
           // rearrange from multidimensional array to single dimensional array combining key coloumns?  then
           //Note for now only 2 keys allowed. --- CHECK WHAT EFFECT this Has on comparison 
             var stopcsv = false;
             var stopcsv2 = false;
             //CSV-1
            for(var i = 0; i < Body1.length; i++) { 
              var tempstring1 = ''; 
              //New Untested Code
              if(Array.isArray(Body1[i])){
                console.log('CSV 1 already split');
              }else{
                Body1[i]=Body1[i].split(',');
                //New Untested Code
              }
              for(var j=0; j < Body1[i].length; j++) {
                if(j >= 0 && j <  basekeymap){
                  if(stopcsv == false){
                  tempstring1 = Body1[i][j] + ' + ' + Body1[i][j+1];
                  stopcsv = true;
                  }
                }
                else{
                  tempstring1 = tempstring1 + ','+ Body1[i][j];
                }
                //old code
                //if(tempstring1 == ''){
                //  tempstring1 = Body1[i][j];
                //}
                
              }
              newBody1.push(tempstring1);
              stopcsv = false;
            }

            //CSV-2   
            for(var i = 0; i < Body2.length; i++) { 
              var tempstring2 = ''; 
              //New Untested Code
              if(Array.isArray(Body2[i])){
                console.log('CSV 2 already split');
              }else{
                Body2[i]=Body2[i].split(',');
                //New Untested Code
              }
            
              
              for(var j=0; j < Body2[i].length; j++) { 
                //new code
                if(j >= 0 && j < compkeymap){
                  if(stopcsv2 == false){
                  tempstring2 = Body2[i][j] + ' + ' + Body2[i][j+1];
                  stopcsv2 = true;
                  }
                }
                else{
                  tempstring2 = tempstring2 +','+ Body2[i][j];
                }
                
                //old code
               // if(tempstring2 == ''){
              //    tempstring2 = Body2[i][j];
              //  }
                
              }
              newBody2.push(tempstring2);
              stopcsv2 = false;
            }
            //Loop Through

            var loopcnt = 0;
            var biggercsv = [];
            var smallercsv = [];
            var tempstring = ""; 
            
            if (newBody1.length > newBody2.length){
              loopcnt =newBody1.length;
              biggercsv = newBody1;
              smallercsv = newBody2;
            }
            else{
              loopcnt =newBody2.length;
              biggercsv = newBody2;
              smallercsv = newBody1;
            }
            
            for(var i=1;i <loopcnt;i++){

              for(var j=1;j <smallercsv.length;j++){
                tempstring = "";
                biggercsv = biggercsv.filter(Boolean); 
                let lineA = biggercsv[i].split(delimit_1);
                let keyA = lineA[0];

                smallercsv = smallercsv.filter(Boolean);
                console.log(j);
                if(j < 1265){
                let lineB = smallercsv[j].split(delimit_1);
                let keyB = lineB[0];
                
                if(keyA == keyB){
                  tempstring = smallercsv[i];
                  smallercsv[i] = smallercsv[j];
                  smallercsv[j]= tempstring;
                }
              }

              }

            }

        // TO do change to ignore colomn diff    
              var l = biggercsv;
              var g = smallercsv;

       //   var  l = newBody1;
       //   var g = newBody2;
          result.csv = [];
          result.text = "";
          result.maxColumn = 0;
          result.nbLineDiff = 0;
          result.nbColumnDiff = 0;
          l.forEach(function(e, b) {
              a(e).length > result.maxColumn && (result.maxColumn = a(e).length)
          });
          g.forEach(function(b, c) {
              a(b).length > result.maxColumn && (result.maxColumn = a(b).length)
          });
          l.forEach(function(b, c) {
              var d = {
                  columns: [],
                  diff: !1
              };
              result.csv.push(d);
              var h = a(b);
              if (g.length > c) {
                  var e = a(g[c])
                    , m = 0;
                  h.forEach(function(a, b) {
                      e.length > b ? (b = e[b],
                      a == b ? d.columns.push(a) : (d.columns.push({
                          data: a + " != " + b,
                          diff: Compare.DIFF
                      }),
                      result.nbColumnDiff++,
                      m = 1)) : (d.columns.push({
                          data: a,
                          diff: Compare.ONLY1
                      }),
                      result.nbColumnDiff++,
                      m = 1)
                  });
                  e.forEach(function(a, b) {
                      b >= h.length && (d.columns.push({
                          data: a,
                          diff: Compare.ONLY2
                      }),
                      result.nbColumnDiff++,
                      m = 1)
                  });
                  result.nbLineDiff += m;
                  0 < m && (d.diff = !0)
              } else
                  h.forEach(function(a, b) {
                      d.columns.push({
                          data: a,
                          diff: Compare.ONLY1
                      });
                      result.nbColumnDiff++
                  }),
                  result.nbLineDiff += 1,
                  d.diff = !0
          });
          g.forEach(function(b, c) {
              if (c >= l.length) {
                  var d = {
                      columns: [],
                      diff: !0
                  };
                  result.csv.push(d);
                  result.nbLineDiff += 1;
                  a(b).forEach(function(a, b) {
                      d.columns.push({
                          data: a,
                          diff: Compare.ONLY2
                      });
                      result.nbColumnDiff++
                  })
              }
          });
     //     this.showDiff(delimit_1);

       for(var m = 0; m <= result.csv.length-1; m++){
        founddiff = false;
        if(m == 0){

          for(n = 0; n < result.csv[0].columns.length; n++){
            if(result.csv[0].columns[n].data){
              ignorearray.push(n);
            }
            }

        }else{
        if(result.csv[m].columns[0].data){
          stringDiff = stringDiff +'Exists in File B only'  +'\n';
          stringkeys = stringkeys +result.csv[m].columns[0].data.split('!=')[0]+'\n';      
          stringDiff = stringDiff +'Exists in File A only'  +'\n';
          stringkeys = stringkeys +result.csv[m].columns[0].data.split('!=')[1];
        }
      
        for(n = 0; n < result.csv[m].columns.length; n++){
        if(result.csv[m].columns[n].data){
          if(ignorearray.indexOf(n) > -1){
          }else{
            if(result.csv[m].columns[0].data){}else{
           // stringDiff = stringDiff +'('+ result.csv[m].columns[n].data+')';

           if(sameline == false){
            if(firstdiff == false){
              stringDiff = stringDiff+'\n'+'Diff:'+ result.csv[0].columns[n];
            }else{
              stringDiff = stringDiff +'Diff:'+ result.csv[0].columns[n];
            }
         //    
            
            sameline = true;
            firstdiff = false;
           }
           else{
            stringDiff = stringDiff +' + '+ result.csv[0].columns[n];
            firstdiff = false;
           }  
            }
            if(keyhandled == false && result.csv[m].columns[0] !== Object(result.csv[m].columns[0])){
              stringkeys = stringkeys + result.csv[m].columns[0] +'\n';
            
              keyhandled = true;
            }
          }
        }
        }
        sameline = false;
        if(keyhandled == true){
          keyhandled = false;
        }
       // if(stringDiff !== ''){
       //   stringDiff = stringDiff + '\n';
       // }
      }
       }
       this.getView().byId("Key").setText(stringkeys); 
       this.getView().byId("Diff").setText(stringDiff); 
       this.TabulateOutputForExport();

          return result;
      },  

      TabulateOutputForExport: function(){

        var keySplit = [] ;
        var diffSplit = [];
        
        keySplit = stringkeys.split('\n');
        diffSplit = stringDiff.split('\n');


        for(var i =0; i < keySplit.length; i++){

          OutputFile = OutputFile + keySplit[i].trim() +'\t'+diffSplit[i].trim() +'\n';
          
        }

      },





    copyToClipBoard :function() {
    //  var file = result.text;
     var file = OutputFile;
      var b = document.createElement("textarea");
      b.textContent = file;
      document.body.appendChild(b);
      let sel = document.getSelection();
      var c = document.createRange();
      c.selectNode(b);
      sel.removeAllRanges();
      sel.addRange(c);
      document.execCommand("copy");
      sel.removeAllRanges();
      document.body.removeChild(b)
  },

  showTable :function() {
  var myTable= "<table><tr><td style='width: 100px; color: red;'>VARR1</td>";
  myTable+= "<td style='width: 100px; color: red; text-align: right;'>VARR2</td>";
  myTable+="<td style='width: 100px; color: red; text-align: right;'>VARR3</td></tr>";
  myTable+="<tr><td style='width: 100px;                   '>---------------</td>";
  myTable+="<td     style='width: 100px; text-align: right;'>---------------</td>";
  myTable+="<td     style='width: 100px; text-align: right;'>---------------</td></tr>";
  myTable+="</table>";
  document.write( myTable);
  document.getElementById('tablePrint').innerHTML = myTable;
  },
    showDiff: function (delimit) {
    //  var resultContainer = this.getView().byId("result-diff");
      var resultContainer = document.getElementsByClassName('result-diff')[0];
        function file(file) {
            var b = document.createElement("div");
            resultContainer.appendChild(b);
            b.classList.add("diff-line");
            if (file) {
                var d = document.createElement("div");
                d.classList.add("diff-col");
                d.classList.add("diff-col-row");
                resultContainer.appendChild(document.createElement("br"));
                d.appendChild(document.createTextNode("Row " + file));
                b.appendChild(d)
            }
            return b
        }
        function c(file, b, d) {
            d = void 0 === d ? null : d;
            var c = document.createElement("div");
            file.appendChild(c);
            c.classList.add("diff-col");
            d === Compare.ONLY1 ? c.classList.add("column1") : d === Compare.ONLY2 ? c.classList.add("column2") : d === Compare.DIFF && c.classList.add("col-diff");
            c.appendChild(document.createTextNode(null === b ? "" : b));
            result.text += null === b ? "" : b;
            return file
        }
        var f = delimit
          , b = 'diff'
          //'diff' 'all'
          , n = true;
          //false true
        //document.getElementById("result").style.display = "";
       // window.location.href = "#result";
        result.text = "";
        //services.billboard.emptyAndHide(["editor-error1", "editor-valid1"]);
       // for (services.billboard.emptyAndHide(["editor-error2", "editor-valid2"]); resultContainer.firstChild; )
        //    resultContainer.removeChild(resultContainer.firstChild);
      //  for (var p = file(), l = 0; l <= result.maxColumn; l++) {
      //      var g = document.createElement("div");
      //      g.classList.add("diff-col");
      //      g.classList.add("diff-col-field");
      //      0 < l && g.appendChild(document.createTextNode("Field " + l));
      //      p.appendChild(g)
      //   }
        result.csv.forEach(function(e, g) {
            if ("diff" != b || e.diff) {
                var d = file(g + 1);
                "diff" == b && n && (result.text += (g + 1).toString() + "f");
                e.columns.forEach(function(file, b) {
                    "string" == typeof file ? c(d, file) : c(d, file.data, file.diff);
                    result.maxColumn != b + 1 && (result.text += f)
                });
                for (e = e.columns.length + 1; e <= result.maxColumn; e++)
                    c(d, ""),
                    result.maxColumn != e + 1 && (result.text += f);
                result.csv.length != g + 1 && (result.text += "")
            }
        });
    //    resultContainer.appendChild(document.createElement("br"));
    //     resultContainer.appendChild(document.createElement("br"));
    }
    

   
  });

});