import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import WeatherStore from './WeatherStore';

@observer(['store'])
class WeatherCard extends React.Component {
  render () {
    const {city, store} = this.props;
    const updatedAt     = new Date(city.updatedAt).toLocaleDateString(
      ['ru-RU', 'en-EN'],
      {hour: '2-digit', minute: '2-digit'});

    return (
      <div className="card card-weather">
        <div className="card-content">
          <button className="delete is-pulled-right" onClick={e => {
            e.preventDefault();
            store.removeCity(city);
          }}/>
          <div className="title">{city.name}</div>
          <div className="subtitle is-size-7">Updated at {updatedAt}</div>
          <div className="level">
            <div className="level-item">
              <img src={`https://openweathermap.org/img/w/${city.weather.icon}.png`}
                   alt={city.weather.description}/>
            </div>
            <div className="level-item is-size-4">{city.temp}°C</div>
          </div>
{/*          <div className="columns">
            <div className="column is-narrow">
              <div>Weather</div>
              <div>Wind</div>
            </div>
            <div className="column">
              <div>Weather</div>
              <div>Wind</div>
            </div>
          </div>*/}
          <div className="has-text-centered">
            <button className={['button', 'is-primary', city.loading && 'is-loading'].join(' ')}
                    disabled={city.loading}
                    onClick={e => {
                      e.preventDefault();
                      store.updateCity(city);
                    }}>
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}

WeatherCard.propTypes = {
  store: PropTypes.instanceOf(WeatherStore),
  city:  PropTypes.object.isRequired
};

export default WeatherCard;