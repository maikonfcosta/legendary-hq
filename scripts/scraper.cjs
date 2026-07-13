const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  const res = await fetch('https://www.legendarycardgame.com/expansions');
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if(href && href.startsWith('/')) {
      links.push({ href, text });
    }
  });
  
  console.log("Internal Links found:");
  // group by href
  const unique = {};
  links.forEach(l => unique[l.href] = l.text);
  console.log(unique);
}

scrape().catch(console.error);
