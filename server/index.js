/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');
const favicon = require('serve-favicon');
const path = require('path');
const rawicons = require('./rawicons');
const rawdocs = require('./rawdocs');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
  ? require('ngrok')
  : false;
const { resolve } = require('path');
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
// Load material icons
app.use('/api/icons', (req, res) => {
  res.json({
    records: [
      { source: rawicons(req.query) }
    ]
  });
});

// Load code preview
app.use('/api/docs', (req, res) => {
  res.json({
    test: [
      { source: rawdocs(req.query) }
    ]
  });
});

app.use('/api/test', (req, res) => {
  res.json([
    {
        "id": "bitcoin", 
        "name": "Bitcoin", 
        "symbol": "BTC", 
        "rank": "1", 
        "price_usd": "5215.96237821", 
        "price_btc": "1.0", 
        "24h_volume_usd": "15475499732.7", 
        "market_cap_usd": "91990538089.0", 
        "available_supply": "17636350.0", 
        "total_supply": "17636350.0", 
        "max_supply": "21000000.0", 
        "percent_change_1h": "0.19", 
        "percent_change_24h": "-0.2", 
        "percent_change_7d": "9.87", 
        "last_updated": "1554823710"
    }, 
    {
        "id": "ethereum", 
        "name": "Ethereum", 
        "symbol": "ETH", 
        "rank": "2", 
        "price_usd": "177.365605939", 
        "price_btc": "0.03403901", 
        "24h_volume_usd": "7805189250.53", 
        "market_cap_usd": "18727728276.0", 
        "available_supply": "105588274.0", 
        "total_supply": "105588274.0", 
        "max_supply": null, 
        "percent_change_1h": "0.11", 
        "percent_change_24h": "-0.7", 
        "percent_change_7d": "13.67", 
        "last_updated": "1554823701"
    }, 
    {
        "id": "ripple", 
        "name": "XRP", 
        "symbol": "XRP", 
        "rank": "3", 
        "price_usd": "0.3507435981", 
        "price_btc": "0.00006728", 
        "24h_volume_usd": "1175403084.47", 
        "market_cap_usd": "14658314519.0", 
        "available_supply": "41792108527.0", 
        "total_supply": "99991658131.0", 
        "max_supply": "100000000000", 
        "percent_change_1h": "0.04", 
        "percent_change_24h": "-1.7", 
        "percent_change_7d": "3.63", 
        "last_updated": "1554823744"
    }]);
});

app.use('/', express.static('public', { etag: false }));
app.use(favicon(path.join('public', 'favicons', 'favicon.ico')));

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
