//Processes for compliance

//Get the ID's for the folders
const INVEST_FOLDER_ID = "";
const COMP_FOLDER_ID = "";

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('compliance');
  menu.addItem('pre-investigations', 'sendPreInvestigationEmails')
  menu.addToUi();
}

function getBoardInfo(){
    //get the ID for the sheet and the name of the sheet
  const boardSheet = SpreadsheetApp.openById('').getSheetByName('general');
  const rows = boardSheet.getDataRange().getDisplayValues();

  var boardContacts = {};
  var boardNames = {};

  rows.forEach(function(row, index){
    //skip header
    if (index === 0) return;

    board = row[0];
    name = row[1];
    email = row[2];
    boardContacts[board] = email; 
    boardNames[board] = name;

  })

  return [boardNames, boardContacts]
}

// function to create folders 
function createFolder(parFolder, folderName){
  var parFdr = DriveApp.getFolderById(parFolder);
  try {
    var newFolder = parFdr.getFoldersByName(folderName).next()
  } catch(e) {
    var newFolder = parFdr.createFolder(folderName)
  }
  return newFolder.getId()
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

//functions to getting the date and then adding whatever deadlines are needed
function getDueDate() {
const today = new Date();
const mon = today.getMonth() + 1;
const day = today.getDate();
const yr = today.getFullYear();
const todayStr = `${mon}-${day}-${yr}`;

const dueDate = addBusinessDays(today, 7);
const monD = dueDate.getMonth() + 1;
const dayD = dueDate.getDate();
const yrD = dueDate.getFullYear();
const dueDateStr = `${monD}/${dayD}/${yrD}`;
return [todayStr, dueDateStr]
}

function getDueDateInvest() {
const today = new Date();
const mon = today.getMonth() + 1;
const day = today.getDate();
const yr = today.getFullYear();
const todayStr = `${mon}-${day}-${yr}`;

const dueDate = addBusinessDays(today, 10);
const monD = dueDate.getMonth() + 1;
const dayD = dueDate.getDate();
const yrD = dueDate.getFullYear();
const dueDateStr = `${monD}/${dayD}/${yrD}`;
return [todayStr, dueDateStr]
}
//to account for business days
function addBusinessDays(d,n) {
    d = new Date(d.getTime());
    var day = d.getDay();
    d.setDate(d.getDate() + n + (day === 6 ? 2 : +!day) + (Math.floor((n - 1 + (day % 6 || 1)) / 5) * 2));
    return d;
}


function sendPreInvestigationEmails() {
    // email subject
  var emailSubj = '';
  
  // email body using HTML
  const EMAIL_BODY = ''

  //email body using normal apps script way
  const EMAIL_TEXT_BODY = ''

  const preInvest = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('pre_investigation');

  //get sheet values
  const rows = preInvest.getDataRange().getDisplayValues();

  rows.forEach(function(row, index) {
    //skip header
    if (index === 0) return;
    //if the draft has already been created, skip
    if (row[0] === 'TRUE') return;
    
    var datesRange = preInvest.getRange(index+1, 3+1, 1, 2)
    var dates = [getDueDate()];
    datesRange.setValues(dates);

    var dueDate = getDueDate()[1]; 
    Logger.log(dueDate)
    var busName = row[6];
    var address = row[7];
    var city = row[8];
    var state = row[9];
    var zip = row[10];
    var licNumber = row[11];
    var dea = row[12];
    var last_compliant = row[15];
    var pharmEmailOne = row[17]
    var pharmEmailTwo = row[18]
    var pharmEmail = pharmEmailOne + "," + pharmEmailTwo


    // replacing information on the documents
    emailSubjRow = emailSubj.replaceAll('{busName}', busName) 
    var bodies = EMAIL_BODY.replaceAll('{busName}', busName)
    bodies = bodies.replaceAll('{address}', address)
    bodies = bodies.replaceAll('{city}', city)
    bodies = bodies.replaceAll('{state}', state)
    bodies = bodies.replaceAll('{zip}', zip)
    bodies = bodies.replaceAll('{licNumber}', licNumber)
    bodies = bodies.replaceAll('{dea}', dea)
    bodies = bodies.replaceAll('{dueDate}', dueDate)
    bodies = bodies.replaceAll('{last_compliant}', last_compliant)
    
    var txtBody = EMAIL_TEXT_BODY.replaceAll('{busName}', busName)
    txtBody = txtBody.replaceAll('{address}', address)
    txtBody = txtBody.replaceAll('{city}', city)
    txtBody = txtBody.replaceAll('{state}', state)
    txtBody = txtBody.replaceAll('{zip}', zip)
    txtBody = txtBody.replaceAll('{licNumber}', licNumber)
    txtBody = txtBody.replaceAll('{dea}', dea)
    txtBody = txtBody.replaceAll('{dueDate}', dueDate)
    txtBody = txtBody.replaceAll('{last_compliant}', last_compliant)

    //var aliases = GmailApp.getAliases();
    var alias = '';

    GmailApp.sendEmail(pharmEmail, emailSubjRow, txtBody, {
      'from': alias,
      htmlBody: bodies,
      cc:''
    });
    
    //check sent box
    preInvest.getRange(index+1,1,1,1).check();
  });
}