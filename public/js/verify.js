$(document).ready(function() {
    // Getting references to our input
  
    var secretToken = $("#secretToken");
  
    // When the verify button is clicked, we validate the token section is not blank
    $("#button1").on("click", function(event) {
      event.preventDefault();
      var userData = {
        secretToken: secretToken.val().trim()
      };
  
      if (!userData.secretToken) {
        return;
      }
      // If we have an token, run the attempt verify function
      attemptVerify(userData.secretToken);

      secretToken.val("");
    });
  
    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function attemptVerify(secretToken) {
        
      $.post("/api/verify", {

        secretToken: secretToken

      }).then(function(data) {

        window.location.replace(data);
        // If there's an error, handle it by throwing up a boostrap alert
      }).then(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });