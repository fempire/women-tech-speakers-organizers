const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const assert = require('assert');

// function returns markdown as tokens in MDAST format

function getTokens (txt) {
    assert.equal(typeof txt, 'string', 'input should be a markdown string');
  
    const processor = unified()
    .use(markdown)
    .use(html);

    let tokens = processor.parse(md).children;

    return tokens;
  }


module.exports = getTokens;