const axios = require('axios');
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.recentTweet = async function recentTweet(req, res) {
    try {
        const options = {headers: {'Authorization': 'Bearer ' + process.env.BEARER_TOKEN}};
        const request = await axios.get('https://api.twitter.com/2/users/' + req.query.user_id + '/tweets', options);
        const datasetId = 'twitter';
        const tableId = 'recent_tweets';
        request.data.data.forEach(tweet => {bigquery
            .dataset(datasetId)
            .table(tableId)
             .insert({
                userId: req.query.user_id,
                tweetId: tweet.id,
                tweetText: tweet.text
            })
        });
        res.send('success!');
    } catch (error) {
	    console.log(error);
        res.send('error!');
	}
};