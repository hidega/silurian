'use strict'

const renderPage = p => {
  const params = Object.assign({
    ticket: 'xyz',
    user: 'unspecified'
  }, p)

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="ticket" content="${params.ticket}"/>

        <title>IT-116 main page</title>

        <link rel="stylesheet" href="/web/css/styles.css"/>
        <link rel="stylesheet" href="/web/css/fas-all.min.css"/>
        <link rel="stylesheet" href="/web/css/bootstrap.min.css"/>
        <link rel="icon" type="image/png" href="/web/img/favicon-32x32.png" sizes="32x32">

        <script src="/web/js/jquery-3.3.1.min.js"></script>
        <script src="/web/js/bootstrap.bundle.min.js"></script>
        <script src="/web/js/main.js"></script>
      </head>

      <body>
        <div id="it116-pageroot">
          <div id="it116-mainoverlay" class="d-none">
            <div id="it116-mainspinnerbox" class="spinner-border text-dark"></div>
          </div>

          <div id="it116-mainpanel">
            <h4>User properties</h4>

            <div><i>User: ${params.user}</i></div>

            <br/>

            <h5>Search</h5>

            <div id="it116-mainfilterbox">
              <form class="form-inline">
                <div class="form-group">
                  <input type="text"
                      class="form-control"
                      id="it116-key"
                      name="key"
                      placeholder="Enter key"/>
                </div>

                <div class="form-check mx-sm-3">
                  <input class="form-check-input"
                      type="checkbox"
                      name="fragment"
                      id="it116-fragmentchb"/>
                  <label class="form-check-label" for="it116-fragmentchb">Search on fragment</label>
                </div>

                <button type="submit" class="btn btn-primary">Submit</button>

                <div id="it116-mainsearchmessagebox" class="ml-4 form-group alert alert-warning d-none">
                  <span class="it116-iconred fa fa-exclamation-circle"></span>
                  <span class="ml-2">Query error</span>
                </div>
              </form>
            </div>

            <br/>

            <h5>Add new</h5>

            <div id="it116-mainaddnewbox">
              <form class="form-inline">
                <div class="form-group">
                  <input type="text"
                      class="form-control"
                      id="it116-key"
                      name="key"
                      placeholder="Enter key"/>
                </div>

                <div class="form-group">
                  <input type="text"
                      class="ml-4 form-control"
                      id="it116-value"
                      name="value"
                      placeholder="Enter value"/>
                </div>

                <button type="submit" class="ml-4 btn btn-primary">Submit</button>

                <div id="it116-mainaddmessagebox" class="ml-4 form-group alert alert-warning d-none">
                  <span class="it116-iconred fa fa-exclamation-circle"></span>
                  <span class="ml-2">Query error</span>
                </div>
              </form>
            </div>

            <br/>

            <h5>Matching data</h5>

            <div id="it116-mainpropertylist" class="border border-primary"></div>
          </div>
        </div>
      </body>
    </html>
  `
}

module.exports = renderPage
