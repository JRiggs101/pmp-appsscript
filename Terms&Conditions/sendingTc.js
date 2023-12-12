//Sending Terms&Condition Template for PMP 

function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('send mail');
    menu.addItem('send terms', 'mailStuff')
    menu.addToUi();
  }

  //Insert File ID for tcFile

  function mailStuff() {
    const tcFile = DriveApp.getFileById('')
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName('Sending');
  
    const rows = sheet.getDataRange().getDisplayValues();
  
    rows.forEach(function(row, index){
      //skip header
      if (index === 0) return;
      
      var ready = row[3];
      var sent = row[4];
      
      //skip if not ready to send or already sent
      if (ready === 'FALSE' || sent === 'TRUE') return;
      console.log(`${index} got through`)
  
      var entityName = row[0];
      var ehr = row[1];
      var entityEmail = row[2];
      // Insert Email for Body
      var body = ``
  
      GmailApp.sendEmail(entityEmail, 'Subject', body, {
        attachments: [tcFile],
      });
  
      //check sent box
      sheet.getRange(index+1, 5, 1, 1).check();
    });
  
  }