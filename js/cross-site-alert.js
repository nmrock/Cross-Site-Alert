(function($) {
  function ajaxCall(csaDiv) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        cacheResponse(response);
        updateAlert(csaDiv, response.enabled, response.content);
      }
    };
    xhttp.open("GET", csaDiv.dataset.url, true);
    xhttp.send();
  }

  function updateAlert(csaDiv, enabled, content) {
    if (enabled == 0)
      csaDiv.style.display = "none";
    else {
      csaDiv.classList.add('loaded');
      csaDiv.innerHTML = content;
    }
  }

  function cacheResponse(response) {
    sessionStorage.setItem('crossSiteAlertDate', new Date);
    sessionStorage.setItem('crossSiteAlertEnabled', response.enabled)
    if (response.enabled != 0)
      sessionStorage.setItem('crossSiteAlertContent', response.content)
  }

  window.addEventListener('load', function() {
      csaDiv = document.getElementById("cross-site-alert");
      if (typeof(Storage) !== "undefined") {
            if (sessionStorage.crossSiteAlertDate) {
                var lastDate = Date.parse(sessionStorage.crossSiteAlertDate);
                if (isNaN(lastDate)) {
                    sessionStorage.removeItem('crossSiteAlertDate');
                    ajaxCall(csaDiv);
                    return;
                }
                var timeBetween = new Date() - lastDate;
                var minutesBetween = Math.floor((timeBetween / (1000 * 60)));
                if (minutesBetween > 14) {
                    ajaxCall(csaDiv);
                } else {
                  updateAlert(csaDiv, sessionStorage.crossSiteAlertEnabled, sessionStorage.crossSiteAlertContent)
                }
            } else {
                ajaxCall(csaDiv);
            }
        }



  });


})(jQuery);