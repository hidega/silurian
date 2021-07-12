var userDb = {};

(function() {
  function getDb() {
    return connect('127.0.0.1:27017/middlewareCenter', 'mwuser', 'Pass1234');
  }
  
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
  
  userDb.initialize = function() {
    var db = getDb();
    db.users.drop();
    db.groups.drop();

    var groupsArray = [];
    var groupCount = 10;
    for(var i=0; i<groupCount; i++)  {
      groupsArray.push({
        tag: 'group_' + i,
        name: randomString(8)
      });      
    }
    var defaultGroupId = db.groups.insertOne({tag: 'default', name: 'default'}).insertedId;
    db.groups.insertOne({tag: 'unused', name: 'unused'});

    var groupIds = db.groups.insertMany(groupsArray).insertedIds;
    
    var usersArray = [];
    var userCount = 100;
    for(var i=0; i<userCount; i++)  {
      var user = {
        tag: 'user_' + i,
        nick: randomString(random(4, 8)),
        groups: [defaultGroupId],
        rank: random(1, 500),
        birth: new Date(random(332789516000, 1121707916000)),
        iconBase64: null,
        category: random(1, 5),
        auth: {
          salt: randomString(12),
          password: randomString(12),
          passwordHash: 'TODO',
        },
        firstName: 'firstname' + i + '_' + random(2000, 6000),
        lastName: randomString(random(3, 7)),
        email: randomString(random(4, 8)) + i + '@mail.' + randomString(random(4, 8)).replace('_', 'X') + '.com'
      };
      
      if(random(1, groupCount)>Math.floor(groupCount*0.6667)) {
        var usersGroupsCount = random(1, Math.floor(groupCount*0.6667));
        for(var j=0; j<usersGroupsCount; j++) {
          var r = random(1, groupCount);
          if(user.groups.includes(groupIds[r])) {
            j--;
          } else {
            user.groups.push(groupIds[r]);
          }
        }
      }
      
      user.auth.passwordHash = hashCode(user.auth.salt + user.auth.password);
      random(0, 8)>4 || (user.middleName = 'middlename_' + random(0, 8));
      
      usersArray.push(user);
    }
    db.users.insertMany(usersArray);    
  }
})();

/*
 
// Document count in users:
db.users.count()
 
// Document count in users with cat 4 users:
db.users.count({ category: { $eq: 4 }})

// Document count where middleName exists
db.users.count({ middleName: { $exists: true }})
 
// The creation date of the first user
db.users.find()[0]._id.getTimestamp()

// Tuples of IDs of users with the same rank
db.users.aggregate([
  {
    $group: {
      _id: { rank: '$rank'},
      count: { $sum:  1 },
      userIds: { $push: '$_id'}
    }
  }, {
    $match: {
      count: { $gt : 1 }
    }
  }, {
    $project: {
      userIds: 1,
      _id: 0
    }
  }  
])

// Emails of users belonging to more than one group
db.users.find({
  'groups.1': { $exists: true }
  }, {
  email: 1, 
  _id: 0
})

// Empty groups

*/
