$(function() {
  var mainPropertyList = $('#it116-mainpropertylist');
  var searchMessagebox = $('#it116-mainsearchmessagebox');
  var addnewMessagebox = $('#it116-mainaddmessagebox');
  var loginOverlay = $('#it116-loginoverlay');
  var ticket = $('meta[name=\'ticket\']').attr('content');

  function handleError(err, messageBox) {
    console.error(err);
    messageBox.removeClass('d-none');
    loginOverlay.addClass('d-none');
    setTimeout(function() { messageBox.addClass('d-none'); }, 5000);
  }
  
  setInterval(function() { 
    $.ajax({ method: 'GET', url: '/services/update-ticket?ticket=' + ticket })
    .done(function(data) { ticket = data.result; })
    .fail(function(err) { console.error(err); });
  }, 1000*60);

  $('#it116-mainaddnewbox form').submit(function(event) {
    event.preventDefault();

    addnewMessagebox.addClass('d-none');
    loginOverlay.removeClass();

    var query = $(this).serializeArray().reduce(function(acc, entry) {
      acc[entry.name] = entry.value;
      return acc;
    }, {});

    $.ajax({ method: 'PUT', url: '/services/upsert-kvp?ticket=' + ticket, query })
    .done(function(data) {
      if(data.error) {
        handleError(data.error, addnewMessagebox);
      } else {
      }
    })
    .fail(function(err) { handleError(err, addnewMessagebox); });
  });

  $('#it116-mainfilterbox form').submit(function(event) {
    event.preventDefault();

    searchMessagebox.addClass('d-none');
    loginOverlay.removeClass();

    var query = $(this).serializeArray().reduce(function(acc, entry) {
      acc[entry.name] = entry.value;
      return acc;
    }, {});

    query.ticket = ticket;

    $.ajax({ method: 'POST', url: '/services/find-kvp', query })
    .done(function(data) {
      if(data.error) {
        handleError(data.error, searchMessagebox);
      } else {
        loginOverlay.addClass('d-none');
        mainPropertyList.empty();
        data.result.forEach(function(prop, n) {
          var form = $(
            '<div class="mt-2 ml-2">' +
            ' <form class="it116-mainentry form-inline">' +
            '   <div class="form-group">' + prop.key + '</div>' +
            '   <div class="form-group">' +
            '     <input type="text"' +
            '         class="ml-4 form-control"' +
            '         id="it116-value"' +
            '         name="value"' +
            '         value="' + prop.value + '"' +
            '         placeholder="Enter value"/>' +
            '   </div>' +
            '   <button id="it116-mainkvpentryupdate' + n + '"' +
            '       class="ml-4 btn btn-primary">Update</button>' +
            '   <button id="it116-mainkvpentrydelete' + n + '"' +
            '       class="ml-4 btn btn-primary">Delete</button>' +
            '   <div id="it116-mainkvpentrymsgbox' + n + '" ' +
            '       class="it116-mainitemmessagebox ml-4 form-group alert alert-warning d-none">' +
            '     <span class="it116-iconred fa fa-exclamation-circle"></span>' +
            '     <span>&nbsp;Query error</span>' +
            '   </div>' +
            ' </form>' +
            '</div>'
          );
          mainPropertyList.append(form);

          var messagebox = $('#it116-mainkvpentrymsgbox' + n);
          
          $('#it116-mainkvpentryupdate' + n).on('click', function(event) {
            event.preventDefault();
            $.ajax({ 
              method: 'PUT', 
              url: '/services/upsert-kvp', 
              query: { 
                ticket,
                key: 123, 
                value : 321
              } 
            })
            .done(function(data) {
              if(data.error) {
                handleError(data.error, messagebox);
              } else {
              }
            })
            .fail(function(err) { handleError(err, messagebox); });
          });
          
          $('#it116-mainkvpentrydelete' + n).on('click', function(event) {
            event.preventDefault();
            $.ajax({ 
              method: 'DELETE', 
              url: '/services/delete-kvp?ticket=' + ticket + '&key=123'
            })
            .done(function(data) { console.log(888, data)
              if(data.error) {
                //handleError(data.error, messagebox);
              } else {
              }
            })
            .fail(function(err) { handleError(err, messagebox); });
          });
        });
        
        mainPropertyList.append('<br/>');
      }
    })
    .fail(function(err) { handleError(err, searchMessagebox); });
  });
});
