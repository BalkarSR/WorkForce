var database = firebase.database();

var dialog = document.querySelector('#employeeDialog');
if (! dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}
// Now dialog acts like a native <dialog>.
dialog.showModal();

$("#addBtn").click(
  function(){
    var id = $("#employeeID").val();
    var name = $("#employeeName").val();
    var email = $("#employeeEmail").val();

    if(id != "" && name != "" && email != ""){
      for(i = 0; i < 20; i++){

        firebase.database().ref('Employees/').push({
          ID: id,
          Email: email,
          Name: name
        });

        $("#addSuccess").show().text(name + " successfully added!");
      }

    }
    else{
      $("#addSuccess").show().text("Please fill out all fields!");
    }
  }
);
