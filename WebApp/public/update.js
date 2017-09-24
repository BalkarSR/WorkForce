function UpdateEmployee(){
  this.rootRef;
  this.database = firebase.database();
  this.dialog;
  this.newEmployeeID;
  this.newEmployeeName;
  this.newEmployeeEmail;

  dialog = document.querySelector('#updateDialog');

  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  // Now dialog acts like a native <dialog>.
  dialog.showModal();

  rootRef = firebase.database().ref().child("Employees");

  this.fetchEmployees = function fetchEmployees(){
    rootRef.on('child_added', snap => {
      id = snap.child("ID").val();
      key = snap.key;
      name = snap.child("Name").val();
      email = snap.child("Email").val();
      btn = "<button key='"+ key +"' class='updateEmployee mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Update</button>";

      $("#table_body").append("<tr id='"+key+"'><td>" + id + "</td><td>" + name + "</td> <td>" + email +
                              "</td><td>" + btn +"</td></tr>");
    });
  }

  //Get data for the employee clicked and populate form
  function getData(k){
    return firebase.database().ref('/Employees/' + k).once('value').then(function(snapshot) {
      var id = snapshot.val().ID;
      var name = snapshot.val().Name;
      var email = snapshot.val().Email;
      document.getElementById('uId').value = id;
      document.getElementById('uEn').value = name;
      document.getElementById('uEe').value = email;
    });
  }

  function setNewData(k){
    firebase.database().ref('Employees/' + k).set({
      ID: newEmployeeID,
      Email: newEmployeeEmail,
      Name: newEmployeeName
    });
  }

  function checkUpdateClick(){
    //Check if update button is clicked
    $(document).on('click', ".updateBtn", function(){
      newEmployeeID = $("#uId").val();
      newEmployeeName = $("#uEn").val();
      newEmployeeEmail = $("#uEe").val();

      if(newEmployeeID != "" && newEmployeeName != "" && newEmployeeEmail != ""){
        setNewData(key);
        $("#updateSuccess").show().text("Employee successfully updated!");
        //show the update form
      }
      else{
        $("#updateSuccess").show().text("Employee not updated! Try again.");
      }

    });
  }

  this.updateEventListener = function updateEventListener(){
    $(document).on('click', ".updateEmployee", function(){// note: using 'removeElement' as class, not as id

      //fetch the key for the row/employee clicked
      var key = $(this).attr('key');

      //show the update form
      $("#updateDialog").show();
      //Get data for the employee clicked and populate form
      getData(key);
      checkUpdateClick();

    });
  }

  this.syncUpdate = function syncUpdate(){
    rootRef.on('child_added', function(snap) {
      key = snap.key;
      $('#' + key).set();
    });
  }

}

var updateEmp = new UpdateEmployee();
updateEmp.fetchEmployees();
updateEmp.updateEventListener();
updateEmp.syncUpdate();
