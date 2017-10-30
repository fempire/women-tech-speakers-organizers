const unified = require('unified');
const markdown = require('remark-parse');
const html = require('remark-html');
const assert = require('assert');


// map a markdown string to an object
// with `html` and `raw` fields
// str -> obj
function mdToJson (txt) {
  assert.equal(typeof txt, 'string', 'input should be a markdown string');

  const toHtml = unified().use(html);

  const lexer = unified()
    .use(markdown)
    .use(html);

  let tokens = lexer.parse(txt).children; // parsed tokens from Markdown Abstract Syntax Tree format
  let results = {};
  let key = '';

  tokens.forEach(function (token, i) {
    // make object keys from all headings
    if (token.type === 'heading') {
      key = token.children[0].value; 

      // check if heading value already exists as object key
      // if so, add a flag to mark it is a duplicate value and make it unique to assign to object
      // this flag will be removed later when we manipulate object data into array
      if ( results[key] ) {   
        key = token.children[0].value + '!DUPE+' + i;
      }

      // create array to push all subsequent tokens (non-headings) into
      results[key] = [];
      return;
    }

    if (!key) return;

    // push any subsequent non-heading token into array
    results[key].push(token);
  })

  // parse array of subsequent tokens into raw or html strings
  Object.keys(results).forEach(function (key) {
    let tree = {
      type: 'root',
      children: results[key]
    };
 
    results[key] = {
      raw: trimRight(lexer.stringify(tree)),
      html: trimRight(toHtml.stringify(tree))
    }
  })

  return results;
}

// trim whitespace at the
// end of a string
// str -> str
function trimRight (value) {
  return value.replace(/\n+$/, '');
}


module.exports = mdToJson