const html = require('mdast-html')
const assert = require('assert')
const mdast = require('mdast')

// TODO: update this to use unified and remark (instead of mdast and mdast-html)

// map a markdown string to an object
// with `html` and `raw` fields
// str -> obj
function mdToJson (txt) {
  assert.equal(typeof txt, 'string', 'input should be a markdown string')

  const toHtml = mdast().use(html)
  const lexer = mdast()
  const tokens = lexer.parse(txt).children
  const res = {}
  var key = ''

  tokens.forEach(function (token, i) {
    if (token.type === 'heading') {
      key = token.children[0].value

      if ( res[key] ) {
        console.log('key already exists on object: ' + key + i);
        
        key = token.children[0].value + '!DUPE+' + i;
      }

      res[key] = []
      return
    }

    if (!key) return

    res[key].push(token)
  })

  Object.keys(res).forEach(function (key) {
    const tree = {
      type: 'root',
      children: res[key]
    }
 
    res[key] = {
      raw: trimRight(lexer.stringify(tree)),
      html: trimRight(toHtml.stringify(tree))
    }
  })

  return res
}

// trim whitespace at the
// end of a string
// str -> str
function trimRight (value) {
  return value.replace(/\n+$/, '')
}


module.exports = mdToJson