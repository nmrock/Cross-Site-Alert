(function () {

  function parseByEndLines(elem, string) {
    textArray = string.split('\n');
    while (textArray.length) {
      elem.appendChild(document.createTextNode(textArray.shift()));
      if (textArray.length)
        elem.appendChild(document.createElement('br'));
    }
  }

  function parseContent(elem, string) {
    var regexMarkdownLink = /\[(.*?)\] ?\((.*?)\)([\S\s]*)/g,
      contentArray = string.split(regexMarkdownLink),
      textArray;
    while (contentArray.length > 1) {
      parseByEndLines(elem, contentArray.shift());
      var link = document.createElement('a');
      link.textContent = contentArray.shift();
      link.href = contentArray.shift();
      link.target = "_blank"
      elem.appendChild(link);
      contentArray = contentArray.shift().split(regexMarkdownLink);
    }
    parseByEndLines(elem, contentArray.shift());

  }

  function cacheResponse(response) {
    sessionStorage.setItem('crossSiteAlertDate', new Date);
    sessionStorage.setItem('crossSiteAlertEnabled', response.enabled)
    if (response.enabled != 0)
      sessionStorage.setItem('crossSiteAlertContent', response.content)
  }

  function ajaxCall(csaDiv, jsonEndpoint) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        cacheResponse(response);
        updateAlert(csaDiv, response.enabled, response.content);
      }
    };
    xhttp.open("GET", jsonEndpoint, true);
    xhttp.send();
  }

  function updateAlert(csaDiv, enabled, content) {
    if (enabled == 0)
      csaDiv.style.display = "none";
    else {
      csaDiv.classList.add('loaded');
      parseContent(csaDiv, content);
    }
  }

  window.addEventListener('load', function () {
    csaDiv = document.getElementById("cross-site-alert");
    if (!csaDiv || !Drupal.settings.cross_site_alert)
      return;

    if (Drupal.settings.cross_site_alert.host) {
      updateAlert(csaDiv, Drupal.settings.cross_site_alert.enabled, Drupal.settings.cross_site_alert.content);
      return;
    }
    if (typeof (Storage) !== "undefined") {
      if (sessionStorage.crossSiteAlertDate) {
        var lastDate = Date.parse(sessionStorage.crossSiteAlertDate);
        if (isNaN(lastDate)) {
          sessionStorage.removeItem('crossSiteAlertDate');
          ajaxCall(csaDiv, Drupal.settings.cross_site_alert.url);
          return;
        }
        var timeBetween = new Date() - lastDate;
        var minutesBetween = Math.floor((timeBetween / (1000 * 60)));
        if (minutesBetween > 14) {
          ajaxCall(csaDiv, Drupal.settings.cross_site_alert.url);
        } else {
          updateAlert(csaDiv, sessionStorage.crossSiteAlertEnabled, sessionStorage.crossSiteAlertContent)
        }
      } else {
        ajaxCall(csaDiv, Drupal.settings.cross_site_alert.url);
      }
    }
  });
})();
