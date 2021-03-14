const got = require('got');
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.recentTweet = async function recentTweet(req, res) {
    try {
        const options = {headers: {"Authorization": "Bearer " + process.env.BEARER_TOKEN}}
	    const response = await got('https://api.twitter.com/2/users/' + req.query.user_id + '/tweets', options);
        const datasetId = 'twitter';
        const tableId = 'recent_tweets';
        for await (tweet of response.body.data) {
            const row = {
                userId: req.query.user_id,
                tweetId: tweet.id,
                tweetText: tweet.text
            };
            await bigquery
                .dataset(datasetId)
                .table(tableId)
                .insert(row);
        };
        await res.send('success!')
    } catch (error) {
	    console.log(error);
        res.send('error!');
	}
};