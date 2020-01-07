const fs = require('fs');
const request = require('request');
var rp = require('request-promise');
const cheerio = require('cheerio');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const cookbook = {'breakfast': [
'https://thepioneerwoman.com/cooking_cat/breakfast/'],
'lunch': ['https://thepioneerwoman.com/cooking_cat/vegetarian/', 'https://thepioneerwoman.com/cooking_cat/sandwiches/'],
'dinner': ['https://thepioneerwoman.com/cooking_cat/seafood/', 'https://thepioneerwoman.com/cooking_cat/vegetarian/', 'https://thepioneerwoman.com/cooking_cat/comfort-food/', 'https://thepioneerwoman.com/cooking_cat/pasta/']}

let selectors = ['.recipe__list', '.recipe__list--ingredients', '#recipeDirectionsRoot', '.recipe-summary', '.ContentBundle', '.ContentBundle--spread-grid', '.Recipe', 
'.grid-container',
'#recipes',
'.row'
 ]

// Initial Config
const app = express();
const port = process.env.PORT || 4000;
// Server

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const recipe_selectors = [
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.recipe-summary.wide', 
	'.wprm-recipe-container',
	'.recipe-content',
	'.simple-recipe-pro',
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
];

const defaultSites = ['https://thepioneerwoman.com/cooking/',
'https://www.therecipedepository.com/category/vegetarian',
'https://www.therecipedepository.com/category/seafood']

const siteContainers = ['.container', 
'.grid-container',
'#recipes',
'.row',

  ]

// Load client secrets from a local file.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname +'/public'));

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));//determine what this is for
}
app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '/public/Index.html'));
});
app.post('/', (req, response) => {
  let mealType = (req.body.selector);
  let found;
  let final;
  let data;

  if(mealType === 'Breakfast'){
    let site = cookbook.breakfast[Math.floor(Math.random()*cookbook.breakfast.length)]
    testScraper(site).then(links =>{
      let [index, array] = links
      request(array[index], function(err, res, body) {
        const $ = cheerio.load(body);
        selectors.some(function(s){
          if($(s).length > 0){
             found =true;
             data = $(s).html();
             final = data;
             response.send(final);
          } else {
            console.log(`couldn't find ingredients :/`)
        }  
        })
    })
    }).catch(err => console.log(err));

    if(found===true){
      console.log('working as expected')
      response.send(final);
    }
  } else if(mealType === 'Lunch'){
    let site = cookbook.lunch[Math.floor(Math.random()*cookbook.lunch.length)]
    testScraper(site).then(links =>{
      let [index, array] = links
      request(array[index], function(err, res, body) {
        const $ = cheerio.load(body);
        selectors.some(function(s){
          if($(s).length > 0){
             found =true;
             data = $(s).html();
             final = data;
             response.send(final);
          } else {
            console.log(`couldn't find ingredients :/`)
        }  
        })
    })
    }).catch(err => console.log(err));

    if(found===true){
      console.log('working as expected')
      response.send(final);
    }
  } else if(mealType === 'Dinner'){
    let site = cookbook.dinner[Math.floor(Math.random()*cookbook.dinner.length)]
    testScraper(site).then(links =>{
      let [index, array] = links
      request(array[index], function(err, res, body) {
        const $ = cheerio.load(body);
        selectors.some(function(s){
          console.log(s)
          console.log($(s).length)
          if($(s).length > 0){
             found =true;
             data = $(s).html();
             final = data;
             response.send(final);
          } else {
            console.log(`couldn't find ingredients :/`)
        }  
        })
    })
    }).catch(err => console.log(err));

    if(found===true){
      console.log('working as expected')
      response.send(final);
    }
  }



});

async function testScraper(url){
  let x=0;
  let links = [];
  await rp(url, function(err, res, body) {  
    const $ = cheerio.load(body);
    console.log(url)
    selectors.some(function(s){
      if($(s).length > 0){
        console.log('found a match')
    let randInt = Math.floor(Math.random() * $(s + ' a').length)
    x=randInt
    console.log(`number is: ${randInt}`)
    $(s + ' a').each((i,elem)=>{
        links.push($(elem).attr('href'))
    } )
    // console.log(body);
      }
    })
})
return [x, links]

// await request(link, function(err, res, body) {
//   console.log(body)
// })
}





async function updateSheet(mealType, res, list){
  let token;
   fs.readFile('credentials.json', async (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
  token = JSON.parse(content);
  let auth = await authorize(token).then(value => {
    console.log(value);
    let temp= addMeal(value, mealType, list);
    return temp;
  })
  .then(value => {
    res.send(value);
  })
  .catch(error => console.log('received error', error));
   });
};


async function sendData(mealType, res){
    let token;
     fs.readFile('credentials.json', async (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
    token = JSON.parse(content);
    let auth = await authorize(token).then(value => {
      let temp= getRandomMeal(value, mealType);
      return temp;
    })
    .then(value => {
      res.send(value);
    })
    .catch(error => console.log('received error', error));
     });
};



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 async function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  let oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
return new Promise(function(resolve, reject) {
  // Check if we have previously stored a token.
    try {
      fs.readFile(TOKEN_PATH, async (err, token) => {
        if (err) oAuth2Client = await getNewToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
    });
  } catch (e){
    console.log('an error was produced', e);
    reject(e);
  }
});
  }


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      resolve(oAuth2Client);
    });
  });
});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

//my spreadhseet Id : 1EjR9F02mzOM_NZLAVUxIKbx1cyqI3af5a-VzDFGcHzI;
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

function getRandomMeal(auth, type) {
  let list = [];
  return new Promise((resolve, reject) => {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1EjR9F02mzOM_NZLAVUxIKbx1cyqI3af5a-VzDFGcHzI',
    range: type +'!A2:D',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
      try {
          list.push(row);
      }
      catch(e) {
          reject(e);
      }

      });
      resolve(list);
    } else {
      console.log('No data found.');
    }
  });
  });
}


function addMeal(auth, type, data) {
  return new Promise((resolve, reject) => {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.append({
    spreadsheetId: '1EjR9F02mzOM_NZLAVUxIKbx1cyqI3af5a-VzDFGcHzI',
    range: type +'!A2:D',
    valueInputOption: 'RAW',
    resource: {values: [data]},
  }, (err, result) => {
    if (err) {
      // Handle error.
      //console.log('The API returned an error: ', err);
      reject(err);
    } else {
      //console.log(result);
      resolve('The meal has been added!');
    }
      });
  });
  };

app.listen(port, () => console.log(`Listening on port ${port}`));
