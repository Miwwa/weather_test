import React from 'react';
import PropTytes from 'prop-types';
import {observer} from 'mobx-react';
import WeatherStore from './WeatherStore';

@observer(['store'])
class CityInput extends React.Component {
  render () {
    const {store} = this.props;
    return (
      <form className="field is-horizontal"
            onSubmit={async e => {
              e.preventDefault();
              const input = e.target.elements['city'];
              await store.addCityByName(input.value);
              input.value = '';
            }}>
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="text" name="city" placeholder="Enter city name"/>
            <p className="help is-danger">{store.state.error}</p>
          </div>
          <div className="control">
            <button className={['button', 'is-primary', store.state.loading && 'is-loading'].join(' ')}
                    disabled={store.state.loading}
                    type="submit">
              Add city
            </button>
          </div>
        </div>
      </form>
    );
  }
}

CityInput.propTypes = {
  store: PropTytes.instanceOf(WeatherStore)
};

export default CityInput;