// Counter Signing for T&C 

function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('send mail');
    menu.addItem('send', 'mailStuff')
    menu.addToUi();
  }
  
  function mailStuff() {
    // Add sheets ID
    const folder = DriveApp.getFolderById('')
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      // Name of sheet
      .getSheetByName('');
  
    const rows = sheet.getDataRange().getDisplayValues();
  
    rows.forEach(function(row, index){
      //skip header
      if (index === 0) return;
      
      var ready = row[3];
      var sent = row[4];
      
      //skip if not ready to send or already sent
      if (ready === 'FALSE' || sent === 'TRUE') return;
      console.log(`${index} got through`)
  
      var fileName = row[0];
      var entityName = row[1];
      var entityEmail = row[2];
      // Body of Eamil
      var body = ''
      
      var file = folder.getFilesByName(fileName).next()
      GmailApp.sendEmail(entityEmail, `Executed Agreement w/ ${entityName}`, body, {
      attachments: [file],
      // Add CCs for every email
      cc: '',
      });
  
      //check sent box
      sheet.getRange(index+1, 5, 1, 1).check();
  
    });
  
}  