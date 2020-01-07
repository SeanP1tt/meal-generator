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


const app = express();
const port = process.env.PORT || 4000;

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

const siteContainers = ['.container', 
'.grid-container',
'#recipes',
'.row',
  ]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname +'/public'));

if(process.env.NODE_ENV === 'production'){

    app.use(express.static('client/build'));
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
  } else if(mealType === 'Lunch'){
    let site = cookbook.lunch[Math.floor(Math.random()*cookbook.lunch.length)]
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
    let randInt = Math.floor(Math.random() * $(s + ' a').length)
    x=randInt
    $(s + ' a').each((i,elem)=>{
        links.push($(elem).attr('href'))
    } )
      }
    })
})
return [x, links]
}



app.listen(port, () => console.log(`Listening on port ${port}`));

var http = require("http");
setInterval(function() {
    http.get("https://meal-generator.herokuapp.com/");
    console.log("poke 👉🏾");
}, 300000); // every 5 minutes (300000)
