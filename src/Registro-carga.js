function myFunction() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('B4:J22').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('REGISTROS - Movimientos'), true);
  spreadsheet.getRange('3:21').activate();
  spreadsheet.getActiveSheet().insertRowsBefore(spreadsheet.getActiveRange().getRow(), 19);
  spreadsheet.getActiveRange().offset(0, 0, 19, spreadsheet.getActiveRange().getNumColumns()).activate();
  spreadsheet.getRange('A3').activate();
  spreadsheet.getRange('CARGA!B4:J22').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  spreadsheet.getRange('A1').activate();
  spreadsheet.getActiveSheet().getFilter().sort(1, false);
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('CARGA'), true);
  spreadsheet.getActiveRangeList().clear({contentsOnly: true, skipFilteredRows: true});
  spreadsheet.getRange('C4').activate();
};