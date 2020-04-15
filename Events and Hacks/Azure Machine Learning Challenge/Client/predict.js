$(function () {
    var key = "api_key";
    var url = "web_service_url";

    // Prevent user from picking dates in the past
    var today = new Date().toISOString().split('T')[0];
    $("#traveldate").attr('min', today);

    // Set datepicker to today's date
    $("#traveldate").val(today);

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function() {
        // Get user input
        var traveldate = $("#traveldate")[0].valueAsDate;
        var month = (traveldate.getMonth() + 1).toString();
        var day = traveldate.getDate().toString();
        var dayOfWeek = traveldate.getDay().toString();
        if (dayOfWeek === "0")
            dayOfWeek = "7"; // In the dataset, Sunday == 7
        var origin = $("#origin").val();
        var destination = $("#destination").val();
        var departuretime = $("#departuretime").val();

        // Build JSON input
        var columns = ["YEAR", "QUARTER", "MONTH", "DAY_OF_MONTH", "DAY_OF_WEEK", "UNIQUE_CARRIER", "TAIL_NUM", "FL_NUM", "ORIGIN_AIRPORT_ID", "ORIGIN", "DEST_AIRPORT_ID", "DEST", "CRS_DEP_TIME", "DEP_TIME", "DEP_DELAY", "DEP_DEL15", "CRS_ARR_TIME", "ARR_TIME", "ARR_DELAY", "ARR_DEL15", "CANCELLED", "DIVERTED", "CRS_ELAPSED_TIME", "ACTUAL_ELAPSED_TIME", "DISTANCE"];
        var values = [0, 0, month, day, dayOfWeek, "", "", 0, 0, origin, 0, destination, departuretime, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var input1 = new Object();
        input1.ColumnNames = columns;
        input1.Values = [values];

        var inputs = new Object();
        inputs.input1 = input1;

        var wrapper = new Object();
        wrapper.Inputs = inputs;
        wrapper.GlobalParameters = new Object();

        // Call ML Web service
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(wrapper),
            headers: {
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json;charset=utf-8"
            }
        }).done(function (data) {
            showResults(data);
        }).fail(function(xhr, status, err) {
            alert(status + " (" + err + ")");
        });
    });
});

function showResults(data) {
    var late = data.Results.output1.value.Values[0][7];
    var probability = data.Results.output1.value.Values[0][8];
    alert("Probability flight will be late: " + Math.floor(probability * 100) + "%");
}