/**
 * This modules relates to special attributes in __html__ e.g.
 *
 *  <span watch="..name::"></span>
 *  <button on="click:.clicked"></button>
 *
 */

const {specialAttributes} = require('./constants')
const {expandField} = require('./views')
const {getAttVal, getAttDefinition} = require('../utils/dom')

/**
 * Parses the "watch" special attribute.
 */
function parseWATCH(attString) {
  if (attString) {
    const chunks = attString.split(':')
    const values = {
      name: expandField(chunks[0].trim()),
      convert: undefined,
      target: undefined,
    }
    if (chunks[1].trim() != '') {
      values.convert = expandField(chunks[1].trim())
    }
    if (chunks.length > 2) {
      values.target = chunks[2].trim() == '' ? 'text' : chunks[2].trim()
    }
    return values
  }
}

/**
 * Parses the "on" special attribute.
 */
function parseON(attString) {
  if (attString) {
    const chunks = attString.split(':')
    const values = {
      event: chunks[0].trim(),
      callback: `(e, w) => ${expandField(chunks[1].trim())}(e, w)`
    }
    return values
  }
}

/**
 * Collects all the special attribute for a node.
 */
function findRedRunnerAtts(node) {
  const nodeAtts = node.rawAttrs
  return {
    'args': getAttVal(nodeAtts, specialAttributes.ARGS),
    'saveAs': getAttVal(nodeAtts, specialAttributes.AS),
    'on': parseON(getAttVal(nodeAtts, specialAttributes.ON)),
    'watch': parseWATCH(getAttVal(nodeAtts, specialAttributes.WATCH)),
  }
}

/** 
 * Returns a node as string with the RedRunner code removed.
 */
function removeRedRunnerCode(dom) {

  /** 
   * Returns the rawAttString with the special attributes removed.
   */
  function stripSpecialAtts(rawAttString) {
    Object.values(specialAttributes).forEach(att => {
      let wholeAtt = getAttDefinition(rawAttString, att)
      rawAttString = rawAttString.replace(wholeAtt, '')
    })
    // Just trimming extraneous whitespace
    return rawAttString.split(' ').filter(s => s.length).join(' ')
  }

  // Function called recursively on nodes.
  function processNode(node, i) {
    let attStr = node.rawAttrs
    if (attStr) {
      node.rawAttrs = stripSpecialAtts(attStr)
    }
    node.childNodes.forEach(processNode)
  }
  processNode(dom)
  return dom.toString()
}

module.exports = {findRedRunnerAtts, removeRedRunnerCode}