/*
My code for successful deploys now consists of two main actions. Send me a nicer email and update my Algolia index.
*/

const indexing = require('algolia-indexing');
const algCredentials = { appId: process.env.ALG_APP_ID, apiKey: process.env.ALG_API_KEY, indexName: 'eleventy_test' };

const fetch = require('node-fetch');

exports.handler = async (event, context) => {

  try {

    /// HANDLE ALOGLIA
    // first, get my index
    let dataResp = await fetch('https://eleventy-algolia.vercel.app/algolia.json');

    let data = await dataResp.json();
    console.log('Successfully got the data, size of articles '+data.length, data[0].title);

    indexing.verbose();

    const settings = { };
    try {
      await indexing.fullAtomic(algCredentials, data, settings);
    } catch(e) {
      console.log('error in fullAtomic', e);
    };
    console.log('Algolia indexing updated. Hopefully.');
    

    return { statusCode: 200, body: 'I\'m done with this shit...' }

  } catch (err) {
    console.log('error handler for function ran', err.toString());
    return { statusCode: 500, body: err.toString() }
  }

}
