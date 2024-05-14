sap.ui.define([
    "sap/ui/core/mvc/Controller",'sap/m/MessageToast','sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast,JSONModel) {
        "use strict";
        var resultToDraw = {
          json1: "",
          json2: "",
          colorLine: [],
          stepDiff: [],
          currentLine: 0,
          tab: ""
      };

      
      var csvBaseKeys = [];
      var csvBaseHeader = '';
      var csvBaseHeadArr = [];
      var csvBaseHeadCnt = 0;
      var csvBaseKeysCnt = 0;

      var csvCompareKeys = [];
      var csvCompareHeader = '';
      var csvCompHeadArr = [];
      var csvCompHeadCnt = 0;
      var csvCompareKeysCnt = 0;

      var result = {
          csv: [],
          text: "",
          maxColumn: 0,
          nbLineDiff: 0,
          nbColumnDiff: 0
      };
      var delimit_1 = '';
      var delimit_2 = '';

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
         },

         getAllColumns: function() {
          const columns = [];
          return columns;
        },

       

          onCompare: function(oEvent) {

            var rowInput = this.getView().byId("RowSelection").getValue();
            var keyInput = this.getView().byId("KeySelection").getValue();

            if(keyInput.toString() != ''){
              csvBaseKeys = keyInput.toString().split(','); 
              csvBaseKeysCnt = csvBaseKeys.count();        
            }
            if(keyInput.toString() != ''){
              csvCompareKeys = rowInput.toString().split(','); 
              csvCompareKeysCnt =  csvCompareKeys.count();             
            }

            var oCSVModelCompare1 = this.getOwnerComponent().getModel("CSVModelBase");
            var oCSVModelCompare2 = this.getOwnerComponent().getModel("CSVModelCompare");

             const internLines = oCSVModelCompare1.oData.toString().split('\n');
             const externLines = oCSVModelCompare2.oData.toString().split('\n');

             this.reOrderCSV(internLines,externLines);


            this.dynamicCSVcompare(oCSVModelCompare1.oData.CSVBaseJson.toString(),oCSVModelCompare2.oData.CSVCompareJson.toString(),delimit_1,delimit_2);


            MessageToast.show(oCSVModelCompare1.toString());
            MessageToast.show(oCSVModelCompare2.toString());
            
            },

             checkFunc: async function (inputFile) {

               if (inputFile.files.length) {
                 try {
                   var csvFileInText = await inputFile.files[0].text();
                   console.log(csvFileInText);

                   var arrObje = [];
                  // var lines = csvFileInText.split('\n');
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
             checkFuncCompare: async function (inputFile) {

              if (inputFile.files.length) {
                try {
                  var csvFileInText = await inputFile.files[0].text();
                  console.log(csvFileInText);

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

            reOrderCSV: function(LinesCSV1,LinesCSV2){

             /*  var csvBaseKeys = [];
              var csvBaseHeader = '';
              var csvBaseHeadArr = [];
              var csvBaseHeadCnt = 0;
              var csvBaseKeysCnt = 0;
        
              var csvCompareKeys = [];
              var csvCompareHeader = '';
              var csvCompHeadArr = [];
              var csvCompHeadCnt = 0;
              var csvCompareKeysCnt = 0; 
              
              check matching keys1 vs keys2 
              loop through keys1 confirm in headerline 1
              loop through keys2 confirm in headerline 2
              loop through keys1 check in headerline 2
              loop through keys2 check in headerline 1
              */

              var Body1 = LinesCSV1[0].shift();
              var Body2 = LinesCSV2[0].shift();

              if(csvBaseHeader == csvCompareHeader){
              }else{
              
              var data = [];
              var count = csvBaseKeysCnt;
              while (count > 0) {
                var obj = {};
                var keys = csvBaseKeys;
                for (var i = 0; i < keys.length; i++) {
                 
                }
                data.push(obj);
                count--;
              }


              
            }


            },

            onUploadBase: function(e) {
               var oCSVModelBase = this.getOwnerComponent().getModel("CSVModelBase");
               this.getView().setModel(oCSVModelBase, "CSVModelBase");
               var fU = this.getView().byId("FileUploaderBase");
               var domRef = fU.getFocusDomRef();
               var file = fU.oFileUpload.files[0]; 
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
              fileObject.data = result.text;
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
              let maxLen = tmpArray.sort((a, b) => b - a)[0];
              let delimiter_i = 0;
              tmpArray1.forEach((e, i) => {
                  if (maxLen === e) {
                      delimiter_i = i;
                  }
              });
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

         
          dynamicCSVcompare: function(json1,json2,delimit_1,delimit_2){
          function a(a) {
              for (var e = [], d = a.split(c), h = 0; h < d.length; h++) {
                  a = !1;
                  var k = d[h];
                  k.length && k[0] == f && (2 <= k.length ? k[k.length - 1] !== f ? a = !0 : 2 < k.length && k[k.length - 2] === b && (a = !0) : a = !0);
                  a && h !== d.length - 1 ? d[h + 1] = k + c + d[h + 1] : e.push(k)
              }
              return e
          }
          
          var c = delimit_1
            , f = ""
            , b = ''
            , n = json1
            , p = json2
            , l = n.split(/\r?\n/)
            , g = p.split(/\r?\n/);
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
          this.showDiff(delimit_1);
          return result;
          
      },

      copyToClipBoard :function() {
        var a = result.text;
        var b = document.createElement("textarea");
        b.textContent = a;
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

    var myTable= "<table><tr><td style='width: 100px; color: red;'>Col Head 1</td>";
    myTable+= "<td style='width: 100px; color: red; text-align: right;'>Col Head 2</td>";
    myTable+="<td style='width: 100px; color: red; text-align: right;'>Col Head 3</td></tr>";

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

          function a(a) {
              var b = document.createElement("div");
              resultContainer.appendChild(b);
              b.classList.add("diff-line");
              if (a) {
                  var d = document.createElement("div");
                  d.classList.add("diff-col");
                  d.classList.add("diff-col-row");
                  d.appendChild(document.createTextNode("Row " + a));
                  b.appendChild(d)
              }
              return b
          }
          function c(a, b, d) {
              d = void 0 === d ? null : d;
              var c = document.createElement("div");
              a.appendChild(c);
              c.classList.add("diff-col");
              d === Compare.ONLY1 ? c.classList.add("column1") : d === Compare.ONLY2 ? c.classList.add("column2") : d === Compare.DIFF && c.classList.add("col-diff");
              c.appendChild(document.createTextNode(null === b ? "" : b));
              result.text += null === b ? "" : b;
              return a
          }
          var f = delimit
            , b = 'all'
            //'diff' 'all'
            , n = true;
            //false true
          //document.getElementById("result").style.display = "";
         // window.location.href = "#result";
          result.text = "";
          //services.billboard.emptyAndHide(["editor-error1", "editor-valid1"]);
         // for (services.billboard.emptyAndHide(["editor-error2", "editor-valid2"]); resultContainer.firstChild; )
          //    resultContainer.removeChild(resultContainer.firstChild);
         for (var p = a(), l = 0; l <= result.maxColumn; l++) {
             var g = document.createElement("div");
             g.classList.add("diff-col");
             g.classList.add("diff-col-field");
             0 < l && g.appendChild(document.createTextNode("Field " + l));
             p.appendChild(g)
          }
          result.csv.forEach(function(e, g) {
              if ("diff" != b || e.diff) {
                  var d = a(g + 1);
                  "diff" == b && n && (result.text += (g + 1).toString() + f);
                  e.columns.forEach(function(a, b) {
                      "string" == typeof a ? c(d, a) : c(d, a.data, a.diff);
                      result.maxColumn != b + 1 && (result.text += f)
                  });
                  for (e = e.columns.length + 1; e <= result.maxColumn; e++)
                      c(d, ""),
                      result.maxColumn != e + 1 && (result.text += f);
                  result.csv.length != g + 1 && (result.text += "")
              }
          });
      //    resultContainer.appendChild(document.createElement("br"));
           resultContainer.appendChild(document.createElement("br"));
      }
      

     
    });

  });