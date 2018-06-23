import 'bulma/css/bulma.css';
import './App.css';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import PropTytes from 'prop-types';
import CityInput from './CityInput';
import WeatherCard from './WeatherCard';
import WeatherStore from './WeatherStore';

@observer(['store'])
class App extends Component {
  render () {
    const {store} = this.props;
    return (
      <div className="container">
        <div className="navbar has-text-centered">
          <div className="navbar-item"><CityInput/></div>
        </div>
        <div className="section weather">
          {store.citiesList.map(city => <WeatherCard key={city.id} city={city}/>)}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  store: PropTytes.instanceOf(WeatherStore)
};

export default App;
