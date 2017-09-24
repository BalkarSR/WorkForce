function RemoveEmployee(){
  this.rootRef;
  this.id;
  this.key;
  this.name;
  this.email;
  this.btn;

  rootRef = firebase.database().ref().child("Employees");

  this.fetchEmployees = function fetchEmployees(){
    rootRef.on('child_added', snap => {
      id = snap.child("ID").val();
      key = snap.key;
      name = snap.child("Name").val();
      email = snap.child("Email").val();
      btn = "<button key='"+ key +"' class='removeEmployee mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Remove</button>";

      $("#table_body").append("<tr id='"+key+"'><td>" + id +
      "</td><td>"  + name  +
      "</td> <td>" + email +
      "</td><td>"  + btn   +
      "</td></tr>");
    });
  }

  //Actually remove the employee
  function removeEmployee(k){
    var itemToRemove = rootRef.child(k);
    itemToRemove.remove()
   .then(function() { // removed from Firebase DB
     console.log("Remove succeeded.")
   })
   .catch(function(error) {
     console.log("Remove failed: " + error.message)
   });
  }

  function confirmRemove(k){
    $("#removeConfirmDialog").show();
    $("#removeConfirmName").show().text("Are you sure you want to remove employee, " + name + "?");
    $(document).on('click', "#yes", function(){
      removeEmployee(k);
      $("#removeConfirmDialog").hide();
    })

    $(document).on('click', "#no", function(){
      $("#removeConfirmDialog").hide();
    })
  }

  this.removeEventListener = function removeEventListener(){
    //Check if the remove button is clicked, then call confirmRemove()
    $(document).on('click', ".removeEmployee", function(){

      key = $(this).attr('key');
      confirmRemove(key);
    });
  }

  this.syncRemove = function syncRemove(){
    rootRef.on('child_removed', function(snap) {
      key = snap.key;
      $('#' + key).remove();
    });
  }
}

var remEmp = new RemoveEmployee();
remEmp.fetchEmployees();
remEmp.removeEventListener();
remEmp.syncRemove();
