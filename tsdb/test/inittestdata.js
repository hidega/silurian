var tsdb = {};

(function() {
  function random(floor, ceiling) {
    return floor + Math.floor(Math.random()*(ceiling + 1 - floor));
  }
  
  function randomString(len) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0132456789_';
    var result = '';
    for(var i=0; i<len; i++) {
      result += chars[random(0, chars.length-1)];
    }
    return result;
  }
  
  function hashCode(str) {
    return str.split('').reduce(function(prevHash, currVal) { (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0 }, 0);
  }

  function createEntry(data, tag, flag) {
    var result = { data: data };
    tag && (result.tag = tag);
    flag && (result.flag = flag);
    return result;
  }

  var dbSchema = {
    bsonType: 'object',
    additionalProperties: false,
    properties: {
      _id : {
        bsonType: 'objectId' 
      },
      tag: {
        bsonType: 'string',
      },
      flag: {
        bsonType: 'int',
      },
      data: {
        bsonType: 'object'
      }
    },
    required: ['tag', 'flag', 'data']
  };

  tsdb.initialize = function(db) { 
    db.tsdb.drop();

    db.createCollection('tsdb', { capped: true, validator: dbSchema });

    db.tsdb.insert({
      data: { n: 1, m: 2 },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', n: 3 },
      tag: 't2',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X2', y: 'Y2' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X1', y: 'Y1' },
      tag: 't3',
      flag: 1
    });
    sleep(1010)
    db.tsdb.insert({
      data: { m: 1, y: 'Y' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y', z: 'Z' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X'},
      tag: 't1',
      flag: 2
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't2',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y', z: 'Z' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'XX', y: 'YY' },
      tag: 't1',
      flag: -1
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't1',
      flag: 1
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { },
      tag: 't0',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { a: ['X','Y'] },
      tag: 't3',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X3', y: 'Y3' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { b: ['X'], y: 'Y1' },
      tag: 't1',
      flag: 0
    });
    sleep(1010)
    db.tsdb.insert({
      data: { a: { p:1, r:2 }, b: [1,2,3] },
      tag: 't3',
      flag: 1
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't3',
      flag: 3
    });
    sleep(1010)
    db.tsdb.insert({
      data: { x: 'X', y: 'Y' },
      tag: 't3',
      flag: 2
    }); 
  }
})();

/*
// load('<path>inittestdata.js')
// load("C:\\Users\\Andras\\Desktop\\stuff\\work\\silurian\\tsdb\\test\\inittestdata.js")

// mongo -u mwuser -p jhIj458jF_ndsj --authenticationDatabase admin

// Document count in  tsdb:
db.tsdb.count()
 
// tags t0, t2
db.tsdb.find({ $and: [ { tag: { $in: ['t0', 't2'] }} ] })

// _ids between
db.tsdb.find({ $and: [ { _id: { $gte: ObjectId('5c5fe4089755f9e33bca5b5c') } }, { _id: { $lte: ObjectId('5c5fe4099755f9e33bca5b63') } } ] })

*/
