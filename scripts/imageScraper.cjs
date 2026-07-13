const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeImages() {
  const res = await fetch('https://www.legendarycardgame.com/expansions');
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if(href && href.startsWith('/')) {
      links.push(href);
    }
  });
  
  const uniqueLinks = [...new Set(links)];
  const imageDB = {};
  
  console.log(`Found ${uniqueLinks.length} links. Fetching images...`);
  
  for (const link of uniqueLinks) {
    if (link === '/' || link === '/cart' || link === '/giveaways' || link === '/community-events') continue;
    
    try {
      console.log(`Fetching ${link}...`);
      const pageRes = await fetch('https://www.legendarycardgame.com' + link);
      const pageText = await pageRes.text();
      const $page = cheerio.load(pageText);
      
      $page('img').each((i, el) => {
        const src = $page(el).attr('src');
        let alt = $page(el).attr('alt') || '';
        
        // Extract filename from alt or URL if possible
        if (!alt && src) {
          const parts = src.split('/');
          alt = parts[parts.length - 1];
        }
        
        if (src && alt) {
          imageDB[alt.trim()] = src;
        }
      });
    } catch (e) {
      console.error(`Error on ${link}: ${e.message}`);
    }
  }
  
  fs.writeFileSync('src/data/imageDB.json', JSON.stringify(imageDB, null, 2));
  console.log(`Saved ${Object.keys(imageDB).length} images to src/data/imageDB.json`);
}

scrapeImages().catch(console.error);
