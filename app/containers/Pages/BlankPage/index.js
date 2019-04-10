/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import TradingViewWidget from 'react-tradingview-widget';

class BlankPage extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  componentDidMount() {
    fetch('/api/test')
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(users => {
        console.log(users);
        this.setState({ users });
      });
  }

  render() {
    const title = brand.name + ' - Blank Page';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Blank Page" desc="Some text description">
          <h1>Crypto list:</h1>
          <div>
            <ul>
              {this.state.users.map(user => <div key={user.name}>
Nombre: 
{' '}
{user.symbol}
</div>
              )}
            </ul>

            <TradingViewWidget symbol="COINBASE:BTCUSD" />

          </div>
        </PapperBlock>
      </div>
    );
  }
}

export default BlankPage;
