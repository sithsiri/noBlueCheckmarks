/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    function showTweets(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: "showVerifiedTweets",
			});
    }

    function hideTweets(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: "hideVerifiedTweets",
			});
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not modify tweets: ${error}`);
    }

    /**
     * Get the active tab,
     * then call function as appropriate.
     */
    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    }
    if (e.target.type === "reset") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(hideTweets)
        .catch(reportError);
    } else {
      browser.tabs.query({active: true, currentWindow: true})
        .then(showTweets)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute noBlueCheckmarks content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.query({active: true, currentWindow: true})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
