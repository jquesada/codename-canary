var $, console, dj, document, level, SC, song;
var sound = null;


//Elements
var $sidebar = $('.sidebar');
var $spin = $('#spin'); //CSS Loader
var $artist = $('.artist');
var $radio = $('#radio');
var $social = $('#social');
var $about = $('#about');
var $user = $('#user');
var $what = $('#what');
var $desc = $('#desc');
var $from = $('#from');
var $ig = $('#ig');
var $name = $('#name');
var $dj = $('#dj');
var $track = $('#track');
var $feed = $('#feed');

//Controls
var $play = $('#play');
var $pause = $('#pause');
var $stop = $('#stop');
var $next = $('#next');
var $prev = $('#prev');
var $mute = $('#mute');
var $down = $('#down');
var $up = $('#up');

//Radio vars
var volume = 100;
var tracklist;
var count = 0;
var end = false;


//Sidebar
$('#menu').click(function () {
    $('#wrap').toggleClass('active');
});

// Radio

//Listen for artist
$artist.click(function () {
    var start = this.id;

    //Remove active class from previous artist
    $artist.removeClass('act');
    //Add active class to this artist
    $(this).addClass('act');

    $feed.html('');
    $name.html('');
    $desc.html('');
    $from.html('');

    //SoundCloud
    init(start);

    $("#wrap").toggleClass("active");
    $pause.css("display", "inline");
    $play.css("display", "none");

    $radio.css("display", "block");
    $social.css("display", "block");
    $about.css("display", "block");


});

//Next
$next.click(function () {
    nextTrack();
});
$prev.click(function () {
    prevTrack();
});

//Volume?
$mute.click(function () {

    console.log(volume);
    if (volume !== 0) {
        level = volume;
        volume = 0;
    } else {
        volume = level;
    }
});


/* SoundCloud
================================
*/

$(document).ready(function () {
    //Initialize the api
    SC.initialize({
        client_id: 'ded03d03bddb7d5d9639d4f97e614903',
        redirect_uri: 'http://citruscoders.com/dev/callback.html'
    }); //Working

});

var $login = $('#login');

$login.click(function () {
  SC.connect(function() {
    SC.get('/me', function(me) {
      alert('Hello, ' + me.username);
    });
  });
});

function init(artist) { //Get ALL the info
    count = 0;
    tracklist = null;


    $prev.css('display', 'none');

    console.log('init ' + artist);

    //Artist info
    SC.get('/users/' + artist + '.json', function (user) { //Working

        //SoundCloud username and link
        $user.html('<a href=' + user.permalink_url + ' target=\'_blank\'>' + user.username + '  (' + user.full_name + ')' + '</a>');

        //SoundCloud description + location
        $what.html('<h3>About ' + user.username);
        console.log(user.description);

        if (user.description !== null) {
            $desc.html('<strong>Description:</strong> ' + user.description);
        }
        $from.html('<strong>City:</strong> ' + user.city);

        //SoundCloud Image
        var $img = $('<img>', {
            src: user.avatar_url
        });
        $dj.html($img);

        //SoundCloud username and link
        $('#sc').html('<a href=' + user.permalink_url + ' target="_blank">View ' + user.username + '\'s SoundCloud profile</a>');

        //SoundCloud full name
        if (user.full_name !== '') {
            $name.html('<strong>Name:</strong> ' + user.full_name);
        }


    });

    //Tracks
    SC.get('/users/' + artist + '/tracks', function (playlist) {
        //Setup the playlist
        queue(playlist);
    });

}

function queue(songs) { // Adds tracks to tracklist
    tracklist = songs;
    count = Math.floor(Math.random() * tracklist.length) + 1;
    playSong();

}

function playSong() { //aka change_track
    var track = tracklist[count];

    $track.html('<strong>Now Playing:</strong> ' + track.title);

    SC.stream('/tracks/' + track.id, {
        autoPlay: true,
        onfinish: nextTrack
    }, function (what) { //working
        if (sound !== null) {
            sound.stop();
        }
        sound = what; //why does this work? wth

        sound.setVolume(volume);
        //Play btn
        $play.click(function () {
            sound.resume(what);
            $pause.css('display', 'inline');
            $play.css('display', 'none');
        });
        //Pause
        $pause.click(function () {
            sound.pause(what);
            $play.css('display', 'inline');
            $pause.css('display', 'none');
        });
        //Stop
        $stop.click(function () {
            sound.stop(what);
            $play.css('display', 'inline');
            $pause.css('display', 'none');
        });
    });
} //end playSong


//Next track
function nextTrack() {

    $prev.css('display', 'inline');
    count += 1;

    if (count + 1 === tracklist.length) {
        $next.css('display', 'none');
    }


    playSong();
}
//Prev track
function prevTrack() {

    $next.css('display', 'inline');
    count -= 1;
    if (count === 0) {
        $prev.css('display', 'none');
    }

    playSong();

}
