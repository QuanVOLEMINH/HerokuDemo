// Oath client id
const CLIENT_ID = '561068894972-07vkec5j60t8gtfk9uf3c8gjajenjjn9.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
// Authorization scopes required by the API. If using multiple scopes, separated them with spaces.
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

// Form submit and change channel
channelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const channel = channelInput.value;
    getChannelThenShowData(channel);
});

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init client library and set up sign in listener
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        // Listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle initial sign in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = "none";
        signoutButton.style.display = "block";
        content.style.display = "block";
        videoContainer.style.display = "block";
        getChannelThenShowData(defaultChannel);
    } else {
        authorizeButton.style.display = "block";
        signoutButton.style.display = "none";
        content.style.display = "none";
        videoContainer.style.display = "none";
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Get channel from api
function getChannelThenShowData(channel) {
    console.log(channel);
    gapi.client.youtube.channels.list({
        part: 'snippet, contentDetails, statistics',
        forUsername: channel
    })
        .then(response => {
            const channel = response.result.items[0];
            const output = extractData(channel);
            showChannelData(output);

            const playlistId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);

        })
        .catch(() => alert('No Channel By That Name'));
}

// Extract data
function extractData(channel) {
    const output =
        `
                <ul class="collection">
                    <li class="collection-item">Title: ${channel.snippet.title}</li>
                    <li class="collection-item">ID: ${channel.id}</li>
                    <li class="collection-item">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
                    <li class="collection-item">Views: ${numberWithCommas(channel.statistics.viewCount)}</li>
                    <li class="collection-item">Videos: ${numberWithCommas(channel.statistics.videoCount)}</li>

                </ul>
                <p>${channel.snippet.description}</p>
                <hr>
                <a href="https://youtube.com/${channel.snippet.customUrl}" class="btn grey darken-2" target="_blank">Visit Channel</a>
         `;
    return output;
}

// Display channel date
function showChannelData(data) {
    const channelData = document.getElementById("channel-data");
    channelData.innerHTML = data;
}

// Request videos
function requestVideoPlaylist(playlistId) {
    const requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 4
    };
    const request = gapi.client.youtube.playlistItems.list(requestOptions);
    request.execute(response => {
        const playlistItems = response.result.items;
        if (playlistItems) {
            let output = '<br><h4 class="center-align">Latest Videos</h4><br>';
            playlistItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;
                output += `
               <div class="col s3">
                    <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
               `
            });

            // Output videos
            videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = 'No Uploaded Video';
        }
    });
}

// Helper functions
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}