import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
import queryString from './queryString';
import { get, compact } from './utils';

import { Offer, OfferProps } from './components/Offer';
import { Help } from './components/Help';
import { Header } from './components/Header';
import { LoadingIndicator } from './components/LoadingIndicator';

const getStateFromQueryString = (): SearchState => {
  const query = queryString.fromString(location.search);

  if (query.range && typeof query.range === 'string') {
    query.range = parseInt(query.range, 10);
  }
  if (query.limit && typeof query.limit === 'string') {
    query.limit = parseInt(query.limit, 10);
  }
  if (query.allowRemote) {
    query.allowRemote = query.allowRemote === true || query.allowRemote === 'true';
  }
  if (query.provideVisa) {
    query.provideVisa = query.provideVisa === true || query.provideVisa === 'true';
  }
  if (query.internship) {
    query.internship = query.internship === true || query.internship === 'true';
  }

  return query;
};

const updateQueryStringState = (updatedState: object) => {
  const current = getStateFromQueryString();

  const params = compact({
    ...current,
    ...updatedState
  });

  history.replaceState(null, '', `/?${queryString.toString(params)}`);
};

// tslint:disable-next-line
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Space+Mono:700');

  * {
    box-sizing: border-box;
    font-family: inherit;
  }

  body {
    font-family: Arial;
    font-size: 14px;
    line-height: 1.4;
    color: #444;
    background: white;
  }

  a {
    color: #dd1d64;
    font-weight: bold;
    text-decoration: none;
  }
`;

const AppContainer = styled.div`
  max-width: 970px;
  margin: 0 auto;
`;

const Content = styled.div`
  display: flex;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 0 10px;
  }
`;

const OfferList = styled.div`
  flex: 1;
`;

const Sidebar = styled.div`
  width: 280px;
  max-width: 280px;
  margin-right: 20px;
  flex: 1;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin: 0 0 10px 0;
    cursor: pointer;

    input[type="text"],
    select {
      padding: 5px;
      width: 100%;
      font-size: inherit;
      font-family: inherit;
    }

    input[type="checkbox"] {
      position: relative;
      top: 2px;
    }
  }
`;

const Message = styled.p`
  margin: 0 0 20px 0;
  padding: 0;
  text-align: center;
`;

enum OfferType {
  HIRING = 'hiring',
  FORHIRE = 'for-hire'
}

enum HasMore {
  MAYBE = 1,
  NO = 0
}

enum NetworkStatus {
  IDLE = 0,
  WORKING = 1
}

export interface SearchState {
  range?: number;
  limit?: number;
  type?: OfferType;
  allowRemote?: boolean;
  provideVisa?: boolean;
  internship?: boolean;
  query?: string;
}

interface AppState extends SearchState {

  hasMore: HasMore;
  networkStatus: NetworkStatus;
  helpShown: boolean;
  offers: Array<OfferProps> | undefined;
  pager: {
    next?: string;
    prev?: string;
  };
}

class App extends React.Component<{}, AppState> {
  performSearch = debounce(() => {
    const query: { [key: string]: {} } = {
      range: this.state.range!,
      limit: this.state.limit!,
      type: this.state.type!
    };

    if (this.state.allowRemote) {
      query.remote = this.state.allowRemote;
    }
    if (this.state.internship) {
      query.internship = this.state.internship;
    }
    if (this.state.provideVisa) {
      query.visa = this.state.provideVisa;
    }
    if (this.state.query) {
      query.query = this.state.query;
    }

    const url = `/api/job?${queryString.toString(query)}`;
    this.load(url, false);
  }, 250, {
    trailing: true
  });

  finalizeQuery = debounce((): void => {
    this.performSearch();
  }, 500);

  detectScroll = throttle(() => {
    if (this.state.networkStatus === NetworkStatus.WORKING || this.state.hasMore === HasMore.NO) {
      return;
    }
    if (document.getElementsByTagName('body')[0].getBoundingClientRect().bottom <= window.innerHeight) {
      this.loadOlder();
    }
  }, 500);

  load = (url: string, append: boolean = false) => {
    url = `https://reactistory.com:8443${url}`;

    this.setState({
      networkStatus: NetworkStatus.WORKING,
      offers: append ? this.state.offers : undefined
    });

    return fetch(url).then(response => response.json()).then(data => {
      const { offers } = this.state;
      const newOffers = (append && Array.isArray(offers)) ? offers.concat(data.messages) : data.messages;
      let hasMore = HasMore.MAYBE;
      if (data.messages.length === 0) {
        hasMore = HasMore.NO;
      } else if (data.messages.length < this.state.limit!) {
        hasMore = HasMore.NO;
      }
      this.setState({
        offers: newOffers,
        hasMore,
        networkStatus: NetworkStatus.IDLE,
        pager: {
          prev: data.paginate ? data.paginate.prev : undefined,
          next: data.paginate ? data.paginate.next : undefined
        }
      });
    });
  }

  loadOlder = () => {
    if (this.state.pager.prev) {
      this.load(this.state.pager.prev, true);
    }
  }

  toggleHelp = () => {
    this.setState({
      helpShown: !this.state.helpShown
    });
  }

  updateRange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const state = {
      range: parseInt(event.target.value, 10)
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  updateLimit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const state = {
      limit: parseInt(event.target.value, 10)
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  toggleVisa = (event: React.MouseEvent<HTMLInputElement>) => {
    const state = {
      provideVisa: !this.state.provideVisa
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  toggleRemote = (event: React.MouseEvent<HTMLInputElement>) => {
    const state = {
      allowRemote: !this.state.allowRemote
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  toggleInternship = (event: React.MouseEvent<HTMLInputElement>) => {
    const state = {
      internship: !this.state.internship
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  updateType = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const state = {
      type: event.target.value as OfferType
    };

    this.setState(state, () => {
      this.performSearch();
      updateQueryStringState(state);
    });
  }

  updateQuery = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const state = {
      query: event.currentTarget.value
    };

    this.setState(state, () => {
      this.finalizeQuery();
      updateQueryStringState(state);
    });
  }

  constructor(props: {}) {
    super(props);
    const query = getStateFromQueryString();

    this.state = {
      range: get(query, 'range', 180),
      limit: get(query, 'limit', 50),
      type: get(query, 'type', OfferType.HIRING),
      allowRemote: get(query, 'allowRemote', false),
      provideVisa: get(query, 'provideVisa', false),
      internship: get(query, 'internship', false),
      query: get(query, 'query', ''),
      hasMore: HasMore.MAYBE,
      networkStatus: NetworkStatus.IDLE,
      helpShown: false,
      offers: undefined,
      pager: {
        next: undefined,
        prev: undefined
      }
    };
  }

  render() {
    const { offers } = this.state;

    const isSearching = this.state.offers === undefined;
    const hasResults = !isSearching && Array.isArray(offers) && offers.length !== 0;

    return (
      <AppContainer>
        {this.state.helpShown && <Help onClick={this.toggleHelp}>
          <p>
            If the job posting does not contain a dedicated email, link or phone number you can contact the person
            that added the post by joining our community over at <a href="https://www.reactiflux.com">Reactiflux.com</a>
            {' '} and sending a direct message to the person.
          </p>
          <p>
            If you don't already have one, you will need to create a (free!)
            {' '}<a href="https://discordapp.com/">Discord</a> account.
          </p>
        </Help>}
        <Header subtitle="Jobs">Reactiflux</Header>
        <Content>
          <Sidebar>
            <label>
              <select value={this.state.type} onChange={this.updateType}>
                <option value={OfferType.HIRING}>I'm looking for a JOB</option>
                <option value={OfferType.FORHIRE}>I'm looking for an EMPLOYEE</option>
              </select>
            </label>

            <label>
              <select value={this.state.range} onChange={this.updateRange}>
                <option value={7}>offers posted in last week</option>
                <option value={30}>offers posted in last 30 days</option>
                <option value={90}>offers posted in last 3 months</option>
                <option value={180}>offers posted in last 6 months</option>
                <option value={365}>offers posted in last year</option>
              </select>
            </label>

            <label>
              <select value={this.state.limit} onChange={this.updateLimit}>
                <option value={50}>load 50 results at a time</option>
                <option value={100}>load 100 results at a time</option>
              </select>
            </label>

            <label>
              <input
                type="text"
                onChange={this.updateQuery}
                value={this.state.query}
                placeholder="text search"
              />
            </label>

            <label>
              <input type="checkbox" checked={this.state.provideVisa} onClick={this.toggleVisa} />
              employer helps with Visa
            </label>

            <label>
              <input type="checkbox" checked={this.state.allowRemote} onClick={this.toggleRemote} />
              allow remote work
            </label>

            <label>
              <input type="checkbox" checked={this.state.internship} onClick={this.toggleInternship} />
              offer is an internship / no exp. required
            </label>

          </Sidebar>
          <OfferList>
            {isSearching && <Message>Searching ...</Message>}
            {hasResults && (offers || []).map(offer => {
              return <Offer {...offer} onClick={this.toggleHelp} key={offer.id} />;
            })}
            {!isSearching && !hasResults && <Message>Sorry, we found no offers matching your search query :(</Message>}
            {hasResults && this.state.networkStatus === NetworkStatus.WORKING && <LoadingIndicator />}
          </OfferList>
        </Content>
      </AppContainer>
    );
  }

  componentDidMount() {
    this.performSearch();
    window.addEventListener('scroll', this.detectScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.detectScroll);
  }
}

export default App;
