(function($) {
    window.addEventListener('load', function() {
 var xhttp = new XMLHttpRequest();
 csaDiv = document.getElementById("cross-site-alert");
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {


     var response = JSON.parse(this.responseText);
     if (response.enabled == 0) {
        csaDiv.style.display = "none";
     } else {
        csaDiv.innerHTML = response.content;
     }

    }
  };
  xhttp.open("GET", csaDiv.dataset.url, true);
  xhttp.send();
    });
})(jQuery);