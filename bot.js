console.log("Bot file is running");
var Twit = require("twit");
var config = require("./config");

var T = new Twit(config);

/**
 * Search Tweet function
 */
var params = {
    q: 'poise nigeria',
    count: 10
}

function gotData(err, data, resp) { 
    var status = data.statuses;
    for(var i=0; i<status.length; i++) {
        console.log(i+": "+status[i].text);
    }
}
//T.get('search/tweets', params, gotData);

/**
 * A tweetIt function to make tweets from the account.
 */
function tweetIt(txt) {
    var tweet = {
        status: txt
    }
    T.post('statuses/update', tweet, tweeted);

    function tweeted (err, data, response) {
        if(err) {
            console.log("error: "+err);
        }
        else{
            console.log("it worked!");
        }
    }
}
//tweetIt();
//setInterval(tweetIt, 1000*15);

/**
 * Stream function to stream user activities from follow events, unfollow & mentions.
 */
var stream = T.stream('user');
stream.on('follow', followed);
stream.on('unfollow', unfollowed);

/**
 * Stream for public searching for specific keywords.
 */
var pStream = T.stream('statuses/filter', {track: ['poisenigeria', 'learn etiquette', 'pgfa', 'public speaking', 'poise nigeria', 'corporate culture']});
pStream.on('tweet', function (tweet) {
    var tweetId = tweet.id;
    var txt = tweet.in_reply_to_status_id+': '+tweetId;
    tweetIt('@'+tweet.user.screen_name+' We are here for you, kindly send us a DM, for more information you can visit our website poisenigeria.org.');    
    
});

/**
 * 
 */
function notified (evt) {
    console.log("got one.");
    var name = evt.source.screen_name;
    tweetIt('Hi @'+name+' We are here for you, kindly send us a DM, for more information you can visit our brochure here poisenigeria.org.');
}

/**
 * Anytime someone follows poisenigeria
 */
function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    tweetIt('Hello @'+screenName+" Thank you for following us, because we love to see you grow, here's a place to start poisenigeria.org");
}
function unfollowed(eventMsg) {
    var name = eventMsg.source.name;
    var screenName = eventMsg.source.screen_name;
    tweetIt('Hello @'+screenName+" We noticed you just unfollowed us, kindly let us know how we can serve you better.");
}

