function CreateSchedule(){
  this.rootRef;
  this.database = firebase.database();
  this.dialog;
  this.newEmployeeID;
  this.newEmployeeName;
  this.newEmployeeEmail;

  rootRef = firebase.database().ref().child("Employees");

  this.fetchEmployees = function fetchEmployees(){
    rootRef.on('child_added', snap => {
      id = snap.child("ID").val();
      key = snap.key;
      name = snap.child("Name").val();
      email = snap.child("Email").val();

      btn = "<button id='addToTimeSlot' key='"+ key +"' class='updateEmployee mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Save</button>";
      timeFrom = "<input type='datetime-local' id='myTimeFrom' value='00:00:00'>";
      timeTo = "<input type='datetime-local' id='mytimeTo' value='00:00:00'>";

      $("#table_body").append("<tr id='" + key + "'> <td>" + name +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + timeFrom + timeTo +
      "</td> <td>"  + btn      + "</td> </tr>");
    });
    document.getElementById('createScheduleTable').style.width='100%';
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
      var button_index = $('.updateEmployee').index(this);
      var dates = [];
      var i = button_index;

      for(i * 14; i < (button_index * 14) + 14; i++){
        var dateVal = $('input[type=datetime-local]').eq(i).val();

        if(dateVal){
          dates.push(dateVal);
        }
      }

      for(var d = 0; d < dates.length; d+=2){
        var temp = dates[d+1];
        if(dates[d] != "" && temp){
          var tempStart = dates[d].toString();
          var tempEnd = temp.toString();

          //CONVERT TO DATE
          var start = new Date(tempStart);
          var end = new Date(tempEnd);
          //GET TIME IN SECONDS
          start = start.getTime() / 1000;
          end = end.getTime() / 1000;
          //CONVERT TO STRING
          start = start.toString();
          end = end.toString();

          firebase.database().ref('Shifts/').push({
            StartTime: start,
            EndTime: end,
            employeeid: key,
            Shiftid: key
          });
        }
      }
      //show the update form
      //$("#updateDialog").show();
      //Get data for the employee clicked and populate form
      //getData(key);
      //checkUpdateClick();

    });
  }

  this.syncUpdate = function syncUpdate(){
    rootRef.on('child_added', function(snap) {
      key = snap.key;
      $('#' + key).set();
    });
  }

}

var createSchedule = new CreateSchedule();
createSchedule.fetchEmployees();
createSchedule.updateEventListener();
createSchedule.syncUpdate();
