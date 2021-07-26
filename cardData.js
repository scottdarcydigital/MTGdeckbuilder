console.log('Card data is running...');


// get some of the json data from the scryfall API endpoint (this requires no access key)
var _GET = 'https://api.scryfall.com/cards/search?q=c%3Awhite+cmc%3D1';

$(document).ready(function() {
    $.get(_GET, function(data, status) {
        console.log(data);
        var card_url = data.data[0].image_uris.large;
        console.log(card_url.toString());

        var card_el = `<div style="background-image:url('`+ card_url +`'); background-size:cover; width: 150px; height: 210px">`;

        $('#main-container').append(card_el);
    });
});

