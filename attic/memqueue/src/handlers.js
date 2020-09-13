'use strict' 

const restendpoint = require('@permian/restendpoint')

const getRequestParameter = restendpoint.tools.getRequestParameter
 
function Handlers(queue) {
  const self = this
  
  self.peekBackObject = (context, ioaFactory) => {}

  self.peekBackRaw = (context, ioaFactory) => {}  

  self.peekFrontObject = (context, ioaFactory) => {} 

  self.peekFrontRaw = (context, ioaFactory) => {}

  self.dequeueRaw = (context, ioaFactory) => {}
  
  self.dequeueObjects = (context, ioaFactory) => {}
  
  self.enqueueRaw = (context, ioaFactory) => {}
  
  self.enqueueObjects = (context, ioaFactory) => {}
}

module.exports = Handlers
