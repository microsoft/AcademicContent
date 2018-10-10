$(function () {
    var subscriptionKey = "SUBSCRIPTION_KEY";
    var fs = require("fs");
    var _ = require('underscore');

    // Handle clicks of the Search button
    $("#search_button").click(function () {
        
        $('#search_button').prop('disabled', true);
        var query = $("#search_box").val();
        var url = "https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/Search?query=" + query;

        $.ajax({
            type: "GET",
            url: url,            
            processData: false,
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey               
            }
        }).done(function (data) {

            var innerHtml = "";

            //Populate search results
            data.results.forEach(function(entry) {

                innerHtml = innerHtml + '<div class="tile"><div class="title">' + entry.name +'</div><div style="float:left"><img class="thumbnail" src="' + entry.thumbnailUrl + '" /></div>';
                innerHtml = innerHtml + '<div style="float:left;margin-left:10px;width:240px">';
                innerHtml = innerHtml + '<div class="table">';
               
                //Add an entry for every search hit
                entry.searchMatches.forEach(function(match) {

                    innerHtml = innerHtml + '<div class="row">';
                    innerHtml = innerHtml + '<div class="cell">';     
                    innerHtml = innerHtml + '<img src="assets/images/png/icon-' + match.type + '.png" />'
                    innerHtml = innerHtml + '</div>'
                    innerHtml = innerHtml + '<div class="cell" style="width:200px">';
                    innerHtml = innerHtml + match.text.replace(match.exactText, '<span class="match">' + match.exactText + '</span>');
                    innerHtml = innerHtml + '<span style="font-weight:bold"> (' + match.startTime.split('.')[0] +')</span>'
                    innerHtml = innerHtml + '</div>'
                    innerHtml = innerHtml + '</div>'
                });
               
                innerHtml = innerHtml + '</div>'
                innerHtml = innerHtml + '</div>'
                innerHtml = innerHtml + '</div>'
            });

            $('#searchResults').html(innerHtml);

            $("#search_box").val("");

        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#search_button').prop('disabled', false);
    });

});


