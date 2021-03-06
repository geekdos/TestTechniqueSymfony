$(document).ready(function() {
    $("#pageTokenNext").on( "click", function( event ) {
        $("#pageToken").val($("#pageTokenNext").val());
        youtubeApiCall();
    });
    $("#pageTokenPrev").on( "click", function( event ) {
        $("#pageToken").val($("#pageTokenPrev").val());
        youtubeApiCall();
    });
    $("#geekdoos-searchBtn").on( "click", function( event ) {
        youtubeApiCall();
        return false;
    });
    jQuery( "#geekdoos-search" ).autocomplete({
        source: function( request, response ) {
            //console.log(request.term);
            var sqValue = [];
            jQuery.ajax({
                type: "POST",
                url: "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1",
                dataType: 'jsonp',
                data: jQuery.extend({
                    q: request.term
                }, { }),
                success: function(data){
                    console.log(data[1]);
                    obj = data[1];
                    jQuery.each( obj, function( key, value ) {
                        sqValue.push(value[0]);
                    });
                    response( sqValue);
                }
            });
        },
        select: function( event, ui ) {
            setTimeout( function () {
                youtubeApiCall();
            }, 300);
        }
    });
});
function youtubeApiCall(){
    $.ajax({
        cache: false,
        data: $.extend({
            key: 'zfT3VGBwTVbqfPpzayPmjRlo', //API_KEY
            q: $('#geekdoos-search').val(),
            part: 'snippet'
        }, {maxResults:20,pageToken:$("#pageToken").val()}),
        dataType: 'json',
        type: 'GET',
        timeout: 5000,
        url: 'https://www.googleapis.com/youtube/v3/search'
    })
        .done(function(data) {
            $('.btn-group').show();
            if (typeof data.prevPageToken === "undefined") {
                $("#pageTokenPrev").hide();}else{$("#pageTokenPrev").show();
            }
            if (typeof data.nextPageToken === "undefined") {
                $("#pageTokenNext").hide();}else{$("#pageTokenNext").show();
            }
            var items = data.items, videoList = "";
            $("#pageTokenNext").val(data.nextPageToken);
            $("#pageTokenPrev").val(data.prevPageToken);
            $.each(items, function(index,e) {
                videoList = videoList + '<li class="geekdoos-video-list-item"><div class="geekdoos-content-wrapper"><a href="" class="geekdoos-content-link" title="'+e.snippet.title+'"><span class="title">'+e.snippet.title+'</span><span class="stat attribution">by <span>'+e.snippet.channelTitle+'</span></span></a></div><div class="geekdoos-thumb-wrapper"><a href="" class="geekdoos-thumb-link"><span class="geekdoos-simple-thumb-wrap"><img alt="'+e.snippet.title+'" src="'+e.snippet.thumbnails.default.url+'" width="120" height="90"></span></a></div></li>';
            });
            $("#geekdoos-watch-related").html(videoList);
            // JSON Responce to display for user
            new PrettyJSON.view.Node({
                el:$(".geekdoos-watch-sidebar-body"),
                data:data
            });
        });
}