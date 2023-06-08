console.log("noBlueCheckmarks is active");

if (!window.tweetSetupHasRun) {
  window.tweetSetupHasRun = true;
  var styleElement = document.createElement('style');
  styleElement.textContent = '.hasVerifiedAccount { display: none; }';
  styleElement.id = "verifiedTweetStyle"
  document.head.appendChild(styleElement);

  function showVerifiedTweets() {
    styleElement.textContent = '.hasVerifiedAccount {}';
  }
  function hideVerifiedTweets() {
    styleElement.textContent = '.hasVerifiedAccount { display: none; }';
  }
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "showVerifiedTweets") {
      showVerifiedTweets();
    } else if (message.command === "hideVerifiedTweets") {
      hideVerifiedTweets();
    }
  });

  function observeDivCreation(callback) {
    var observer = new MutationObserver(function(mutationsList) {
      mutationsList.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('div[data-testid="cellInnerDiv"]')) {
              callback(node);
            }
          });
        }
      });
    });

    observer.observe(document, { childList: true, subtree: true });
  }

  observeDivCreation(function(newDiv) {
    if (hasVerifiedAccount(newDiv)) {
      // newDiv.style.display = 'none';
      newDiv.classList.add('hasVerifiedAccount');
      console.log("Found tweet by verified user " + getUsername(newDiv));
    }
    else {
      newDiv.classList.add('hasUnverifiedAccount');
    }
  });

  function hasVerifiedAccount(element) {
    var svgElements = element.querySelectorAll('svg[aria-label="Verified account"]');
    return svgElements.length > 0;
  }

  function getUsername(element) {
    var usernameDiv = element.querySelectorAll('div[data-testid="User-Name"]')[0];
    if (!usernameDiv) return "unknown";
    return usernameDiv.children[1].children[0].children[0].children[0].children[0].children[0].innerHTML;
  }
} else {console.log("noBlueCheckmarks JS was run an extra time")}
