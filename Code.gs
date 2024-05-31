function test() {
  var dateString = "1970-01-02 02:20:10";
  var date = new Date(dateString); // Convert string to Date object
  
  var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), 'd'); // Format date
  
  Logger.log(formattedDate);
}

function dateDifferenceInHoursMinutes(date1,date2) {

  // var date1, date2;
  // date1 = "2024-04-14 8:30";
  // date2 = "2024-04-15 00:0";

  // Convert the date strings to Date objects
  var d1 = new Date(date1);
  var d2 = new Date(date2);

  // Calculate the difference in milliseconds
  var diffInMs = Math.abs(d2 - d1);

  // Calculate the difference in various units
  var diffInSeconds = Math.floor(diffInMs / 1000);
  var hours = Math.floor(diffInSeconds / 3600);
  diffInSeconds %= 3600;
  var minutes = Math.floor(diffInSeconds / 60);

  // Pad the hours and minutes with leading zeros if necessary
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');

  // Return the result as a formatted string
  Logger.log(`${hours}:${minutes}`);
  return `${hours}:${minutes}`;
}

 function getTotalHours(duration) {
  duration = '241:40:00';
  Logger.log(duration);
  var parts = duration.split(":");
  const hours = parseInt(parts[0]) + parseInt(parts[1]) / 60 + parseInt(parts[2]) / 3600;
  Logger.log(hours);
  return hours;

}

function durationToMinutes(duration) {
  Logger.log({duration});
  var hoursMinutes = duration.split(':');
  var hours = parseInt(hoursMinutes[0]);
  var minutes = parseInt(hoursMinutes[1]);
  return hours * 60 + minutes;
}
function sumDuration(previousDuration,newDuration){
  // Convert durations to total minutes

  Logger.log({previousDuration,newDuration});
  var previousTotalMinutes = durationToMinutes(previousDuration.toString());
  var newTotalMinutes = durationToMinutes(newDuration.toString());
  
  // Add the new duration to the previous total
  var totalMinutes = previousTotalMinutes + newTotalMinutes;
  
  // Convert total minutes back to HH:mm format
  var hours = Math.floor(totalMinutes / 60);
  var minutes = totalMinutes % 60;
  var totalDuration = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  return totalDuration;

}


// convert '6/4/2024 8:17:00' to Output: "2024-04-30 8:18"
function convertDateFormat(dateStr) {

    // Split the date and time parts
    let [datePart, timePart] = dateStr.toString().split(' ');

    // Split the date part into day, month, and year
    let [day, month, year] = datePart.split('/');

    // Construct the new date format
    let newDateFormat = `${year}-${month}-${day} ${timePart}`;

    Logger.log({dateStr,newDateFormat});

    return newDateFormat;
}
function groupEmployeeNames_() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ExportLog');
  // Get all employee names in a column (assuming names are in column A)
  var data = sheet.getRange("B:B").getValues();

  // Use a Set to remove duplicates and convert back to array
  var uniqueNames = [...new Set(data.flat())];

  // Optional: Return the unique names (uncomment and adjust cell reference)
  // sheet.getRange("B1").setValue(uniqueNames);  // Replace "B1" with desired cell

  // You can further process the 'uniqueNames' array here
  return uniqueNames;
}
function groupEmployeeNames() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ExportLog');
  // Get all employee names and data
  var data = sheet.getRange("B2:G").getValues();

  // Filter based on employee names and non-empty E, F, and G columns
  var filteredData = data.filter(function (row) {
    // Check if employee name is a string and not blank
    return typeof row[0] === 'string' && row[0].trim() !== '' &&
      // Check if E, F, and G columns are not empty
      row[4] !== '' && row[5] !== '';
  });

  // Extract filtered employee names (assuming names are in A)
  var names = filteredData.map(function (row) { return row[0]; });

  // Use a Set to remove duplicates and convert back to array
  var uniqueNames = [...new Set(names.flat())];

  // Optional: Return the unique names (uncomment and adjust cell reference)
  // sheet.getRange("B1").setValue(uniqueNames);  // Replace "B1" with desired cell

  // You can further process the 'names' array here
  //return uniqueNames;
  return [ "akil ahmed pathan","ajay vagh",  ]
}


function writeEmployeeNames1() {
  // Check if script has edit permission
  var hasEditPermission = ScriptApp.getProjectProperties().getProperty("hasEditPermission");
  Logger.log(hasEditPermission);
  
  
  if (hasEditPermission !== "true") {
    // Request edit permission
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.requestEditPermission();
    return;
  } 
  
  // Rest of your function code here...
}
function writeEmployeeNames() {
  // Call groupEmployeeNames to get filtered employee names
  var names = groupEmployeeNames();
  Logger.log({names});

  // Get the sheet object
  //var sheet = SpreadsheetApp.getActiveSheet();
  
  // Starting row for writing employee names (assuming B1)
  var startRow = 2;
  
  // Loop through filtered names
  for (var i = 0; i < names.length; i++) {
    // Write employee name
    var employeeName = names[i];
    sheet.getRange("B" + startRow).setValue(employeeName);
    startRow++;
    addHeaders(startRow);
    startRow++;
    Logger.log("addDateRange");
    Logger.log({startRow,employeeName});
    addDateRange(startRow,employeeName);
        startRow++;

    // Insert 11 blank rows
    //sheet.insertRowAfter(startRow);
    for (var j = 0; j < 11; j++) {
     // sheet.getRange(startRow, 2).setValue(""); // Set blank value in B column
      startRow++;
    }
  }
}
function displayEmployeeNames() {
  writeEmployeeNames();
 }

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Jaydeep Menu')
    .addItem('Write Employee Names', 'writeEmployeeNames')
    .addItem('Write Headers', 'addHeaders')
    .addItem('Add Date Range', 'addDateRange')
    //.addItem('Add In Time', 'addInDateTime')
    //.addItem('Add Out Time', 'addOutDateTime')

    .addToUi();
}

function addHeaders(row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Header Row
  var headers = [
    "Date", "In", "Out", "Total", "Date", "In", "Out", "Total", "Date", "In", "Out", "Total", "Total Hours"
  ];

  // Write headers to row 3
  sheet.getRange(row, 1, 1, headers.length).setValues([headers]);
}

function addDateRange(startRow,employeeName) {
  
  //Load row wise data.
  _loadData(employeeName);

//var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dates = [];
  
  // Generate date numbers from 1 to 31
  for (var day = 1; day <= 31; day++) {
    dates.push(day);
  }
  // Write date numbers to columns
  for (var i = 0; i < dates.length; i++) {
    
    var column = Math.floor(i / 11) * 4 + 1; // Move to next "Date" column every 10 dates
    var row = (i % 11) + startRow; // Start from row 4
    
    var day = Math.abs(dates[i]).toString();
    sheet.getRange(row, column).setValue(day);

          Logger.log({day,row,column});

    if(filteredData.hasOwnProperty(day)){
      

      _addInDateTime(filteredData[day], row, column+1);
      _addOutDateTime(filteredData[day], row, column+2);
      _addTotalDuration(filteredData[day], row, column+3); 

    }
  }
  _addFinalTotalDuration(startRow, 13); 


}

var filteredData;
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ExportLogConverted');
var finalTotalDuration ;
function _loadData(employeeName){

  //var employeeName = 'akil ahmed pathan'; //response.getResponseText().trim();
  // var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var exportLogSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ExportLog');

    // Get all data from ExportLog sheet
    var data = exportLogSheet.getRange("B2:G").getValues();

    // Filter rows by selected employee name
    var _filteredData = data.filter(function(row) {
      return row[0] === employeeName;
    });
    
    Logger.log({_filteredData});
    // filteredData = _loadData2(_filteredData);

 
  // Create an object to map days to filteredData
  var dayMap = {};

  finalTotalDuration = "0:0";

  // Loop through filteredData
  _filteredData.forEach(function(row) {
    var inDate = row[3]; //  the date is in the 3 column (index 3)
    if(inDate.toString().trim() != ""){

        var indate = convertDateFormat(inDate); 
        //var [year, month, day] = indateStr.split('-');
        Logger.log({indate, inDate});

         var day = Utilities.formatDate(new Date(indate), Session.getScriptTimeZone(), 'd'); // Format to display only time

          var outdate = convertDateFormat(row[4]); //  the date is in the 3 column (index 3)
      
          Logger.log({indate,outdate,day});

          // Format the date to 'YYYY-MM-DD' for consistency
          // var formattedDate = `${year}-${month}-${day}`;

          var inDateTime = Utilities.formatDate(new Date(indate), Session.getScriptTimeZone(), 'H:mm'); // Format to display only time
          var outDateTime = Utilities.formatDate(new Date(outdate), Session.getScriptTimeZone(), 'H:mm'); // Format to display only time

          var totalDuration = dateDifferenceInHoursMinutes(indate,outdate);

          var tempRow = [indate,outdate,inDateTime,outDateTime, totalDuration]
          Logger.log(tempRow);
          dayMap[day] = tempRow;
          finalTotalDuration = sumDuration(finalTotalDuration,totalDuration);
          
    }

    filteredData = dayMap;
 

    
  });

   Logger.log({dayMap});
  return dayMap;
}

function _addInDateTime(data, row, column) {

  if(row == null || column == null){
    return;
  }

   //var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     //Logger.log(data);
     
        
      sheet.getRange(row, column).setValue(data[2]);
     // return;
    //}
 }
 



function _addOutDateTime(data, row, column) {

  if(row == null || column == null){
    return;
  }

   //var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
 // var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ExportLogConverted');

        
        sheet.getRange(row, column).setValue(data[3]);
   
    
  
}
function _addTotalDuration(data, row, column) {

  if(row == null || column == null){
    return;
  }
       
        sheet.getRange(row, column).setValue(data[4]);
  
}
function _addFinalTotalDuration(row, column){

  if(row == null || column == null){
    return;
  }
       
  sheet.getRange(row, column).setValue(finalTotalDuration);
}



