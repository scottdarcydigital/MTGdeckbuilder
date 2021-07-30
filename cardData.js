function init() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyA5fk5C5iBNksX-6MamN4Dqyln8E_MV8qE",
        authDomain: "mtg-deckbuilder-2f349.firebaseapp.com",
        databaseURL: "https://mtg-deckbuilder-2f349-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "mtg-deckbuilder-2f349",
        storageBucket: "mtg-deckbuilder-2f349.appspot.com",
        messagingSenderId: "910102441863",
        appId: "1:910102441863:web:6f76b752f925034c246d22",
        measurementId: "G-EN94X0KB0V"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
}

init(); // initialise connection

// // Global vars
var database = firebase.database();

function sendDeckData() {
    var $user_name = $('#user-name-input').val();
    var $deck_name = $('#deck-name-input').val();
    database.ref('Decks/' + $user_name + '/' + $deck_name).set({});
}

// get some of the json data from the scryfall API endpoint (this requires no access key)
var _GET = 'https://api.scryfall.com/cards/search?q=c%3Awhite+cmc%3D1';

var pageTemplate = ``;
var pageCount = localStorage.setItem('pageCount', 0);
var cardPageSize = 18;

$(document).ready(function() {
    $.get(_GET, function(data, status) {

        // append multiple pages development test
        for (var x = 0; x < 4; x++) {
            $('#main-container').append(`<div id="card-page-` + x + `" class="card-page" style="display: none"></div>`);
        }

        // if there is no localStorgae Deck data then initialise it, else draw from this data in order to source urls
        // since the firebase end points add their own values to local toarage this is not appropriate and ust be standardised with the crd objects that you are avtuall using. Othwerise the code will not tirgger correcly

        if (!localStorage.getItem('card-0')) {
            for (var i = 0; i < data.data.length; i++) {
                var card_url = data.data[i].image_uris.large;
                var card_name = data.data[i].name;
                localStorage.setItem("card-"+i, card_url);
                var card_el = `<div onclick="addToFirebaseDatabase(this);" name="`+card_name+`" class="card SF" style="background-image:url('` + localStorage.getItem("card-"+i) + `');">`;

            }
        } else {
            for (var i = 0; i < data.data.length; i++) {
                var tenCount = 0;
                var card_name = data.data[i].name;
                console.log(localStorage.getItem("card-"+i));
                var card_el = `<div onclick="addToFirebaseDatabase(this);" name="`+card_name+`" class="card LS" style="background-image:url('` + localStorage.getItem("card-"+i) + `');">`;

                // There needs to be a way of making this more dynamic later on....
                if (i < cardPageSize) {
                    $('#card-page-0').css("display","block");
                    localStorage.setItem('pageCount', 0);
                    $('#card-page-'+localStorage.getItem('pageCount')).append(card_el);
                    tenCount = localStorage.getItem('pageCount') * 10;
                    console.log(tenCount);
                }
                if (i > cardPageSize-1 && i < cardPageSize*2) {
                    localStorage.setItem('pageCount', 1);
                    $('#card-page-'+localStorage.getItem('pageCount')).append(card_el);
                    tenCount = localStorage.getItem('pageCount') * 10;
                    console.log(tenCount);
                }
                if (i > cardPageSize*2-1 && i < cardPageSize*3) {
                    localStorage.setItem('pageCount', 2);
                    $('#card-page-'+localStorage.getItem('pageCount')).append(card_el);
                    tenCount = localStorage.getItem('pageCount') * 10;
                    console.log(tenCount);
                }
                if (i > cardPageSize*3-1 && i < cardPageSize*4) {
                    localStorage.setItem('pageCount', 3);
                    $('#card-page-'+localStorage.getItem('pageCount')).append(card_el);
                    tenCount = localStorage.getItem('pageCount') * 10;
                    console.log(tenCount);
                }
            }
        }
    });

    // Firebase init read data for the RBH menu (this is a pre-requresit for the reset safe gaurd on stored data from FB)
    var RHS_FB_Data = firebase.database().ref('Decks/Scott105/MonoW');

    RHS_FB_Data.on('value', (snapshot) => {
        $('#RHS').empty();

        snapshot.forEach(function(child) {
            var cardName = child.val().cardName;
            var RSHCardItem = `<div name="`+ cardName +`" class="RHS-card-item"></div>`;
            $('#RHS').append($(RSHCardItem).text(cardName));
        });
    });
});

function addToFirebaseDatabase(card) {
    var $user_name = $('#user-name-input').val();
    var $deck_name = $('#deck-name-input').val();
    var $deck_name = $('#deck-name-input').val();
    var cardName = $(card).attr('name');
    var RSHCardItem = `<div class="RHS-card-item"></div>`;
    var $RHSLength = $('#RHS').children().length;

    database.ref('Decks/' + $user_name + '/' + $deck_name + '/' + $RHSLength).update({
        cardID: $RHSLength,
        cardName: cardName
    });
}

function rightArrow() {
    console.log($('#card-page-0'));
    if ($('#card-page-0').is(":visible")) {
        $('#card-page-0').css("display","none");
        $('#card-page-1').css("display","block");
        return;
    }
    if ($('#card-page-1').is(":visible")) {
        $('#card-page-1').css("display","none");
        $('#card-page-2').css("display","block");
        return;
    }
    if ($('#card-page-2').is(":visible")) {
        $('#card-page-2').css("display","none");
        $('#card-page-3').css("display","block");
        return;
    }
    if ($('#card-page-3').is(":visible")) {
        $('#card-page-3').css("display","none");
        $('#card-page-0').css("display","block");
        return;
    }
}

function leftArrow() {
    if ($('#card-page-0').is(":visible")) {
        $('#card-page-0').css("display","none");
        $('#card-page-3').css("display","block");
        return;
    }
    if ($('#card-page-1').is(":visible")) {
        $('#card-page-1').css("display","none");
        $('#card-page-0').css("display","block");
        return;
    }
    if ($('#card-page-3').is(":visible")) {
        $('#card-page-3').css("display","none");
        $('#card-page-2').css("display","block");
        return;
    }
    if ($('#card-page-2').is(":visible")) {
        $('#card-page-2').css("display","none");
        $('#card-page-1').css("display","block");
        return;
    }
}

// 1.1.0 Commit
