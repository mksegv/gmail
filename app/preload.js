const $ = require('cash-dom')
const xhook = require('xhook').xhook

window.onload = function() {
  var page = require('./ui/gmail.js');
  var ipc = require('electron').ipcRenderer

  window.$ = $
  window.page = new page();
  window.xhook = xhook

  xhook.after((request, response) => {
    if(request.url.match(/sync\/.*/)) {
      console.log('sync')
    }
  })

  function config_unread_counts() {
    console.log('config unread counts')
    const left_bar = $('.Ls77Lb.aZ6')
    function get_unread_count() {
      // left bar
      const inbox = left_bar.find('.aim').filter((idx, ele) => {
        return ($(ele).find('a').text() === 'Inbox')
      })
      counter_div = inbox.find('a').parent().next()
      return counter_div.length ? counter_div.text() : 0
    }

     // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true, characterData: true }

     // Callback function to execute when mutations are observed
    var callback = function(mutationsList) {
      for (var mutation of mutationsList) {
        update_dock(get_unread_count());
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    const target = left_bar.find('.aim').parent().get(0)
    // Start observing the target node for configured mutations
    observer.observe(target, config);
    // observer.observe(counter_div.first().parent().get(0), config);

    update_dock(get_unread_count());
  }

  function update_dock(count) {
    ipc.send('update-dock', count)
  }
  config_unread_counts()

  // ipc.on('start-compose', window.Gmail.compose.start_compose.bind(window.page));
  ipc.on('logout', window.page.logout.bind(window.page));
  ipc.on('navigate', (event, place) => {
    window.page.navigateTo(place);
  });

  window.page.adjustProfilePicture();
  window.page.adjustLogoutButton();
  // window.page.applyHangoutsCss();
  //  window.Gmail.observe.on("new_email", function(e){
  //    console.log(e)
  //  });
  //  console.log(window.Gmail.get.unread_emails())
};
