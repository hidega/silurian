'use strict'

const ParsingStage = require('./parsing-stage')

function Interceptor(target) {
  const self = this
  
  let prevData = false
  
  const lastWhitespaceChecker = f => data => {
    prevData.ws && target.whitespace(prevData)
    f(data)
    prevData = data
  }
  
  self.error = lastWhitespaceChecker(target.error)
  
  self.whitespace = data => prevData = data
  
  self.string = lastWhitespaceChecker(target.string)
  
  self.number = lastWhitespaceChecker(target.number)
  
  self.integer = lastWhitespaceChecker(target.integer)
  
  self.eof = lastWhitespaceChecker(target.eof)
}

function Fsa(t) {
  const self = this
  const TAB = 9
  const NEWLINE = 10
  const SPACE = 32
  const COMMENT_MARK = 35

  let buffer = ''
  let rowNr = 1
  let state = false

  const target = new Interceptor(t)

  const checkNewLine = c => c===NEWLINE && rowNr++
  
  const isEof = c => c===null
  
  const isWhiteSpace = c => c===TAB || c===NEWLINE || c===SPACE
  
  const isCommentMark = c => c===COMMENT_MARK
  
  const createData = (val, i, ws) => ({ val, rowNr, ws, charPos: i })
  
  const appendToBuffer = char => buffer += String.fromCharCode(char)
  
  const forwardString = i => {
    const data = createData(buffer, i)
    if(isNaN(buffer)) {
      target.string(data)
    } else {
      buffer.includes('.') ? target.number(data) : target.integer(data)
    }
    buffer = ''
  }

  const states = {
    start: (char, i) => { 
      if(isEof(char)) {
        self.halt()
        target.error('Empty query')
      } else if(isCommentMark(char)) {
        state = states.withinComment
      } else if(isWhiteSpace(char)) {
        checkNewLine(char)
        state = states.withinWhitespace
      }else {
        appendToBuffer(char)
        state = states.withinString
      }
    },
    undecided: (char, i) => {
      if(isEof(char)) {
        target.eof(createData('', i))
        self.halt()
      } else if(isCommentMark(char)) {
        state = states.withinComment
      } else if(isWhiteSpace(char)) {
        checkNewLine(char)
        state = states.withinWhitespace
      } else {
        appendToBuffer(char)
        state = states.withinString
      }
    },
    withinString: (char, i) => {
      if(isEof(char)) {        
        forwardString(i)
        target.eof(createData(buffer, i))
        self.halt()
      } else if(isCommentMark(char)) {
        forwardString(i)
        state = states.withinComment
      } else if(isWhiteSpace(char)) {
        forwardString(i)
        checkNewLine(char)
        state = states.withinWhitespace
      } else {
        appendToBuffer(char)
      }
    },
    withinWhitespace: (char, i) => { 
      if(isEof(char)) {
        checkNewLine(char)
        target.whitespace(createData(buffer, i, true))
        target.eof(createData(buffer, i))
        self.halt()
      } else if(isCommentMark(char)) {
        checkNewLine(char)
        state = states.withinComment
      } else {
        target.whitespace(createData('', i, true))
        state = states.undecided
        state(char, i)
      }
    },
    withinComment: (char, i) => {
      if(isEof(char)) {        
        target.whitespace(createData('', i, true))
        self.halt()
        target.eof(createData('', i))
      } else if(char===NEWLINE) {
        rowNr++
        target.whitespace(createData('', i, true))
        state = states.undecided
      }
    },
    halt: () => {}
  }

  state = states.start

  self.halt = () => state = states.halt

  self.feed = (char, i) => state(char, i)

  self.eof = i => state(null, i)
}

function Lexer(eventEmitter, p) {
  const self = this 
  
  ParsingStage.call(self, p, eventEmitter) 

  const params = Object.assign({}, p)

  self.fsa = new Fsa({
    error: err => self.error('error', err),
    whitespace: data => eventEmitter.emit('lexWhitespace', data),
    string: data => eventEmitter.emit('lexString', data),
    number: data => eventEmitter.emit('lexNumber', data),
    integer: data => eventEmitter.emit('lexInteger', data),
    eof: data => eventEmitter.emit('lexEof', data)
  })

  eventEmitter.on('srcChar', self.fsa.feed)

  eventEmitter.on('srcEof', self.fsa.eof)
}

Lexer.createInstance = (eventEmitter, params) => new Lexer(eventEmitter, params)

module.exports = Lexer
