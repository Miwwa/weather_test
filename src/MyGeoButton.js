import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import WeatherStore from './WeatherStore';

@observer(['store'])
class MyGeoButton extends React.Component {

  handleClick = async e => {
    e.preventDefault();
    try {
      const coords = await this.props.store.getMyLocation();
      await this.props.store.addCityByCoords(coords);
    } catch (err) {
      console.error(err);
    }
  };

  render () {
    const {store} = this.props;
    return (
      <form className="field is-horizontal"
            onSubmit={this.handleClick}>
        <div className="field">
          <div className="control">
            <button className={['button', 'is-primary', store.state.loading && 'is-loading'].join(' ')}
                    disabled={store.state.loading}
                    type="submit">
              Load by my location
            </button>
          </div>
        </div>
      </form>
    );
  }
}

MyGeoButton.propTypes = {
  store: PropTypes.instanceOf(WeatherStore),
};

export default MyGeoButton;