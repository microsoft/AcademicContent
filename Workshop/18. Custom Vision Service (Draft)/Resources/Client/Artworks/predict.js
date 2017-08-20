$(function () {

    var url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/a999a3e5-e00b-4f6e-bbd2-045432d67e2f/image?iterationId=bbcf86b8-96b1-44b8-b9e9-97b5421a2fa1";
    var predictionKey = "0c574fac4c3045ebb237164898240974";
    
    var fs = require("fs");
    var _ = require('underscore');

    // Store the value of a selected image for display
    var imageBytes;

    // Handle clicks of the Browse (...) button
    $("#select_button").click(function () {

        $('#analysisResults').html('');
        $('#analyze_button').prop('disabled', true);

        const electron = require('electron');
        const dialog = require('electron').dialog;

        var va = electron.remote.dialog.showOpenDialog();

        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        $('#previewImage').html('<img width="240" src="data:image/png;base64,' + contents + '" />');
        $('#analyze_button').prop('disabled', false);

    });

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function () {

        $.ajax({
            type: "POST",
            url: url,
            data: imageBytes,
            processData: false,
            headers: {
                "Prediction-Key": predictionKey,
                "Content-Type": "multipart/form-data"
            }
        }).done(function (data) {

            var predictions = data.Predictions;
            var artists = [predictions.find(o => o.Tag === 'Picasso'), predictions.find(o => o.Tag === 'Rembrandt'), predictions.find(o => o.Tag === 'Pollock')];
            var sortedArtists = _.sortBy(artists, 'Probability').reverse();
            var possibleArtist = sortedArtists[0];

            if (possibleArtist.Probability > .5) {
                $('#analysisResults').html('<div class="matchLabel">' + possibleArtist.Tag + ' (' + (possibleArtist.Probability * 100).toFixed(0) + '%)' + '</div>');
            }
            else {
                $('#analysisResults').html('<div class="noMatchLabel">NOT A FAMOUS PAINTING</div>');
            }

        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#analyze_button').prop('disabled', true);
    });

});


