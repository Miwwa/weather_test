import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import WeatherStore from './WeatherStore';
import WeatherApi from './WeatherApi';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';

const store = new WeatherStore(WeatherApi);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
