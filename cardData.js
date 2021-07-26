console.log('Card data is running...');


// get some of the json data from the scryfall API endpoint (this requires no access key)
var _GET = 'https://api.scryfall.com/cards/search?q=c%3Awhite+cmc%3D1';

$(document).ready(function() {
    $.get(_GET, function(data, status) {
        console.log(data.data.length);

        for (var i = 0; i < data.data.length; i++) {
            var card_url = data.data[i].image_uris.large;
            console.log(card_url);

            // TODO : This needs optimising
            if (localStorage.getItem("card-0") == null) {
                var card_el = `<div class="card" style="background-image:url('` + card_url + `');">`;
                $('#main-container').append(card_el);
                localStorage.setItem("card-"+i, card_url);
                console.log("taken from SF");
            } else {
                var card_el = `<div class="card" style="background-image:url('` + localStorage.getItem("card-"+i) + `');">`;
                $('#main-container').append(card_el);
                console.log("taken from LS");
            }

        }
    });
});

