$(function() {
  var messageBox = $('#it116-messagebox');
  var overlay = $('#it116-loginoverlay');
  function rndParam() { return 'uid=' + (100000 + parseInt(Math.random()*899999)) + '&';}
  $('#it116-loginform form').submit(function(event) {    
    event.preventDefault();
    messageBox.addClass('d-none');
    overlay.removeClass();
    var data = $(this).serializeArray().reduce(function(acc, entry) {
      acc[entry.name] = entry.value;
      return acc;
    }, {});    
    $.ajax({ 
      method: 'GET', 
      url: 'services/obtain-ticket?' + rndParam() + 'username=' + data.username + '&password=' + data.password 
    })
    .promise()
    .then(function(resp) {
      if(resp.error) {
        throw new Error(resp.error);
      } 
      window.location = '/services/get-main-page?' + rndParam() + 'ticket=' + resp.result;
    })
    .catch(function() { 
      messageBox.removeClass();
      overlay.addClass('d-none');
    });
  });
});
