// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var Train = $("#train-name");
var TrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var TrainTime = $("#train-time").mask("00:00");
var TimeFreq = $("#time-freq").mask("00");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAtgG7Vg6bmjKnQN3W14x1ZVCSrZByp8qM",
    authDomain: "train-nyc-scheduler.firebaseapp.com",
    databaseURL: "https://train-nyc-scheduler.firebaseio.com",
    projectId: "train-nyc-scheduler",
    storageBucket: "",
    messagingSenderId: "825959420827"
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref("/trains").on("child_added", function (snapshot) {

    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append to table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button
    $("tr").hover(
        function () {
            $(this).find("span").show();
        },
        function () {
            $(this).find("span").hide();
        });

    // REMOVE ITEMS (need to fix)
    $("#table-data").on("click", "tr span", function () {
        console.log(this);
        var trainRef = database.ref("/trains/");
        console.log(trainRef);
    });
});

// function to call the button event, and store the values in the input form
var storeInputs = function (event) {
   
    event.preventDefault();

    // get & store input values
    trainName = Train.val().trim();
    trainDestination = TrainDestination.val().trim();
    trainTime = moment(TrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = TimeFreq.val().trim();

    // add to firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successfully added!");

    //  empty form once submitted
    Train.val("");
    TrainDestination.val("");
    TrainTime.val("");
    TimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function (event) {
    // form validation - if empty - alert
    if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
        alert("Please Fill All Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function (event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
            alert("Please Fill All Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});