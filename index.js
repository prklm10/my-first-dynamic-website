const http = require("http");
const url = require("url");
const fs = require("fs");
/////////////////////////////
//File I/O
// // Blocking Synchrounous
// // const text = fs.readFileSync("./txt/input.txt", "utf-8");

// // console.log(text);

// // const textOut = `This is what we know about avacado: \n ${text}. \n Created on ${Date.now()}`;
// // console.log(textOut);
// // fs.writeFileSync("./txt/output.txt", textOut);

// // Non-Blocking Asynchronous

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log(err);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("Writting Finished!");
//       });
//     });
//   });
// });
// console.log("Writing File!!!");

// html template
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// api-data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

// api Data in jSON format;
const dataObj = JSON.parse(data);

// replace Template function
const replaceTemplate = (templateCard, product) => {
  let output = templateCard.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGES%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICES%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%VITAMINS%}/, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

// server
const server = http.createServer((req, res) => {
  const baseURL = "http://" + req.headers.host + "/";
  const { searchParams, pathname } = new url.URL(req.url, baseURL);
  //const pathname = req.url;

  // /overview || /
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = dataObj
      .map((e) => replaceTemplate(templateCard, e))
      .join("");
    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardHtml);
    res.end(output);

    // /product
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const id = req.url.split("=")[1];
    const product = dataObj[id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // /api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // 404
  } else {
    res.writeHead(404);
    res.end("Page Not Found");
  }
});
server.listen(8000, () => {
  console.log("Listening to 8000");
});
