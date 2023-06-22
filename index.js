/*
const fs = require('fs');

//Blocking synchronous way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn)
const textOut = `This is what we know about avocados ${textIn} \n Created on ${Date.now().toString()}`;
fs.writeFileSync('./txt/output.txt', textOut)
console.log('File Written!');

//Non-blocking asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    console.log(data)
})

console.log('Will read file!')

*/

/////////////////////
// SERVER
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//Sync call to the fs module
//It doesnt care when its in top level code (outside of a function)
//Its going to be called once when the process start.
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

console.log(slugify('Fresh Avocados', { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replaceAll('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Hello from the server</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
