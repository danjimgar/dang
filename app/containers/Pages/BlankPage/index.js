/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';

class BlankPage extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  componentDidMount() {
    fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10')
      .then(res => res.json())
      .then(json => this.setState({ data: json }));
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
          Crypto list:
          <div>
            <ul>
              {this.state.data.map(el => (
                <li>
                  {el.name}
                  :
                  {el.price_usd}
                </li>
              ))}
            </ul>
          </div>
        </PapperBlock>
      </div>
    );
  }
}

export default BlankPage;
