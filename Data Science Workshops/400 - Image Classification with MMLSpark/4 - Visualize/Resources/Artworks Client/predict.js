$(function () {
    var fs = require("fs");
    var _ = require('underscore');
    var url = "http://localhost:1234/analyze";
    var imageBytes;

    $("#select_button").click(function () {
        const electron = require('electron');
        const dialog = require('electron').dialog;

        // Select an image
        var va = electron.remote.dialog.showOpenDialog();
        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        // Update the UI
        $('#select_button').prop('disabled', true);
        $('#previewImage').attr("src", "data:image/png;base64," + contents)
        $("#loader").show();
        
        // Analyze the image
        $.ajax({
            type: "POST",
            url: url,
            data: imageBytes,
            dataType: "json",
            processData: false,
            headers: {
                "Content-Type": "application/octet-stream"
            }
        }).done(function (data) {
            $("#loader").hide();
            $('#select_button').prop('disabled', false);

            setTimeout(function() {
                if (data.Monet < 0.0 && data.Picasso < 0.0 && data.VanGogh < 0.0) {
                    alert("Error analyzing image");
                }
                else {
                    var max = data.Monet;
                    var artist = "Monet";
    
                    if (data.Picasso > max) {
                        max = data.Picasso;
                        artist = "Picasso";
                    }
    
                    if (data.VanGogh > max) {
                        max = data.VanGogh;
                        artist = "Van Gogh";
                    }
    
                    if (max > 0.95) { // 95% threshold
                        alert("Looks like a " + artist);
                    }
                    else {
                        alert("Unknown artist");
                    }
                }
                }, 100);

        }).fail(function (xhr, status, err) {
            $("#loader").hide();
            $('#select_button').prop('disabled', false);

            setTimeout(function() {
                alert(err);
            }, 100);
        });
    });
});