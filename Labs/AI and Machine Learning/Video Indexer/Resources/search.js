$(function () {
    var subscriptionKey = "SUBSCRIPTION_KEY";
    var accountId = "ACCOUNT_ID";
    var fs = require("fs");
    var _ = require('underscore');

    // Handle clicks of the Search button
    $("#search_button").click(function () {
        
        $('#search_button').prop('disabled', true);
        var query = $("#search_box").val();
        var authorizationUrl = "https://api.videoindexer.ai/auth/trial/Accounts/" + accountId + "/AccessToken?allowEdit=False";
        var searchUrl = "https://api.videoindexer.ai/trial/Accounts/" + accountId + "/Videos/Search?query=" + query + "&language=en-US&pageSize=25&skip=0&accessToken=";
        
        // Generate an Access Token based on
        // a Subcription Key and Account ID
        $.ajax({
            type: "GET",
            url: authorizationUrl,            
            processData: false,
            headers: {
                "Ocp-Apim-Subscription-Key": subscriptionKey               
            }
        }).done(function (data) {

            var accessToken = data;

            // Call the Video Indexer Search Videos endpoint
            // using the Access Token generated
            $.ajax({
                type: "GET",
                url: searchUrl + accessToken,            
                processData: false 
            }).done(function (data) {
                
                var innerHtml = "";
                //Populate search results
                data.results.forEach(function(entry) {
    
                    innerHtml = innerHtml + '<div class="tile"><div class="title">' + entry.name +'</div><div style="float:left"><img class="thumbnail" src="' + "https://api.videoindexer.ai/Trial/Accounts/" + accountId + "/Videos/" + entry.id + "/Thumbnails/" + entry.thumbnailId + "?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBY2NvdW50SWQiOiIxNTE0OGJlNi0yNzU0LTQ4NjQtODY2NC1jNDA4OWY4ZDUzYWQiLCJBbGxvd0VkaXQiOiJGYWxzZSIsIkV4dGVybmFsVXNlcklkIjoiYmMyNzM1NWNjMTVlZTVjMCIsIlVzZXJUeXBlIjoiTWljcm9zb2Z0IiwiaXNzIjoiaHR0cHM6Ly93d3cudmlkZW9pbmRleGVyLmFpLyIsImF1ZCI6Imh0dHBzOi8vd3d3LnZpZGVvaW5kZXhlci5haS8iLCJleHAiOjE1NTcyNjQwOTEsIm5iZiI6MTU1NzI2MDE5MX0.16RByv43XkMbgyEDY3PutlRwoR1O7KgHKSEZsXBFwKA" + '" /></div>';
                    innerHtml = innerHtml + '<div style="float:left;margin-left:10px;width:240px">';
                    innerHtml = innerHtml + '<div class="table">';
                   
                    var i=0;
                    //Add an entry for every search hit
                    entry.searchMatches.forEach(function(match) {
    
                        //Limit the results to 6
                        if (i < 6) {
                            innerHtml = innerHtml + '<div class="row">';
                            innerHtml = innerHtml + '<div class="cell">';     
                            innerHtml = innerHtml + '<img src="assets/images/png/icon-' + match.type + '.png" />'
                            innerHtml = innerHtml + '</div>'
                            innerHtml = innerHtml + '<div class="cell" style="width:200px">';
                            innerHtml = innerHtml + match.text.replace(match.exactText, '<span class="match">' + match.exactText + '</span>');
                            innerHtml = innerHtml + '<span style="font-weight:bold"> (' + match.startTime.split('.')[0] +')</span>'
                            innerHtml = innerHtml + '</div>'
                            innerHtml = innerHtml + '</div>'
                            i++;
                        }
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

        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#search_button').prop('disabled', false);
    });

});


