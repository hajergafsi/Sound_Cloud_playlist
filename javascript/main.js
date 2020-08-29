/* 1. Search */
var search = document.querySelector('.js-submit');
search.addEventListener('click', function () {
  document.querySelector('.search-results').innerHTML = '';
  var input = document.querySelector('.js-search').value;
  SoundCloudAPI.init();
  SoundCloudAPI.getTrack(input);
});

document.querySelector('.js-search').addEventListener('keyup', function (e) {
  var input = document.querySelector('.js-search').value;
  // if the ke enter is pressed
  if (e.which === 13) {
    document.querySelector('.search-results').innerHTML = '';
    SoundCloudAPI.init();
    SoundCloudAPI.getTrack(input);
  }
});

/* 2. Query SoundCloud API */
var SoundCloudAPI = {};
SoundCloudAPI.init = function () {
  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d',
  });
};

SoundCloudAPI.getTrack = function (input) {
  // find all tracks with the genre 'punk' that have a tempo greater than 120 bpm.
  SC.get('/tracks', {
    q: input,
  }).then(function (tracks) {
    console.log(tracks);
    SoundCloudAPI.renderTracks(tracks);
  });
};

/* 3. Display the cards */
SoundCloudAPI.renderTracks = function (tracks) {
  tracks.forEach((element) => {
    //1st part
    var card = document.createElement('div');
    card.className = 'card';

    var image = document.createElement('div');
    image.className = 'image';

    var img = document.createElement('img');
    img.className = 'image_img';
    img.src =
      element.artwork_url ||
      'http://lorempixel.com/output/nightlife-q-c-640-480-5.jpg';
    image.appendChild(img);
    card.appendChild(image);

    //2nd part
    var content = document.createElement('div');
    content.className = 'content';

    var link = document.createElement('a');
    link.innerHTML = element.title;
    link.href = element.permalink_url;
    content.appendChild(link);
    card.appendChild(content);

    //3rd part
    var button = document.createElement('div');
    button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

    var icon = document.createElement('i');
    icon.classList.add('add', 'icon');

    var add = document.createElement('span');
    add.innerHTML = 'Add to Playlist';
    button.appendChild(icon);
    button.appendChild(add);
    card.appendChild(button);
    button.addEventListener('click', function () {
      SoundCloudAPI.play(element.permalink_url);
    });
    document.querySelector('.search-results').appendChild(card);
  });
};

/*4 Add to playlist*/
SoundCloudAPI.play = function (trackURL) {
  console.log('click');
  SC.oEmbed(trackURL, {
    auto_play: true,
  }).then(function (embed) {
    console.log('oEmbed response: ', embed);

    var sideBar = document.querySelector('.js-playlist');

    var box = document.createElement('div');
    box.innerHTML = embed.html;

    sideBar.insertBefore(box, sideBar.firstChild);
    localStorage.setItem('key', sideBar.innerHTML);
  });
};
var sideBar = document.querySelector('.js-playlist');
sideBar.innerHTML = localStorage.getItem('key');
