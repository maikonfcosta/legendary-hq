const cheerio = require('cheerio');

async function scrapeDarkCity() {
  const res = await fetch('https://www.legendarycardgame.com/dark-city-at-a-glace');
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const results = [];
  $('h1, h2, h3, p, img').each((i, el) => {
    const name = el.tagName.toLowerCase();
    if (name === 'img') {
      results.push(`IMG: ${$(el).attr('alt')} | src=${$(el).attr('src')}`);
    } else {
      results.push(`${name.toUpperCase()}: ${$(el).text().trim()}`);
    }
  });
  
  console.log(results.slice(0, 50).join('\n'));
}

scrapeDarkCity().catch(console.error);
