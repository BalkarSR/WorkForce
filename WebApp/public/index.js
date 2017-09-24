firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $(".login-cover").hide();
    var dialog = document.querySelector('#loginDialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    // Now dialog acts like a native <dialog>.
    dialog.close();

  } else {
    $(".login-cover").show();
    // No user is signed in.
    var dialog = document.querySelector('#loginDialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    // Now dialog acts like a native <dialog>.
    dialog.showModal();
  }
});

$("#loginBtn").click(
  function(){
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    if(email != "" && password != ""){
      $("#loginProgress").show();
      $("#loginBtn").hide();

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
        $("#loginError").show().text(error.message);
        $("#loginProgress").hide();
        $("#loginBtn").show();
      });
    }
  }
);

$("#signOutBtn").click(
  function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $("#loginProgress").hide();
      $("#loginBtn").show();
    }, function(error) {
      // An error happened.
      alert(error.message);
    });
  }
);
