import {observable, action} from 'mobx';

const WeatherCacheKey = 'weather';
const ErrorsText      = {
  AlreadyInList: 'City already in list',
  NotString:     'City must be a string',
  StringEmpty:   'Input are empty',
  InvalidCoords: 'Invalid coordinated'
};

class WeatherStore {
  @observable state = {
    loading: false,
    error:   null
  };

  @observable citiesList = [];

  constructor (api) {
    this.api        = api;
    this.citiesList = WeatherStore._loadFromCache();
  }

  /**
   * Add city by name
   * @param cityName
   * @returns {Promise<void>}
   */
  @action
  async addCityByName (cityName) {
    const error = WeatherStore._validateCityName(cityName);
    if (error) {
      this.state.error = error;
      return;
    }

    if (this.citiesList.filter(city => city.name === cityName).length > 0) {
      this.state.error = ErrorsText.AlreadyInList;
      return;
    }

    return await this._addCity(this.api.fetchByCityName, cityName);
  }

  /**
   * Add city by coordinates
   * @param coords {object}
   * @returns {Promise<void>}
   */
  @action
  async addCityByCoords (coords) {
    if (!coords.lat || !coords.lon) {
      this.state.error = ErrorsText.InvalidCoords;
      return;
    }

    return await this._addCity(this.api.fetchByCoords, coords);
  }

  async _addCity (fetchFunction, arg) {
    this.state.loading = true;
    this.state.error   = null;

    try {
      const result = await fetchFunction(arg);
      if (this.citiesList.filter(city => city.id === result.id).length > 0) {
        this.state.error = ErrorsText.AlreadyInList;
      } else {
        this.citiesList.push({...result, loading: false, updatedAt: Date.now()});
        WeatherStore._saveToCache(this.citiesList);
      }
      this.state.loading = false;
    } catch (e) {
      this.state.error   = e.message;
      this.state.loading = false;
    }
  }

  /**
   * Update city weather
   * @param city
   * @returns {Promise<void>}
   */
  @action
  async updateCity (city) {
    city.loading = true;
    city.error   = null;
    try {
      const result = await this.api.fetchByCityId(city.id);
      Object.assign(city, {
        ...result,
        updatedAt: Date.now(),
        loading:   false
      });
      WeatherStore._saveToCache(this.citiesList);
    } catch (e) {
      city.error   = e.message;
      city.loading = false;
    }
  }

  /**
   * Remove city from list
   * @param city
   */
  @action removeCity (city) {
    this.citiesList.remove(city);
    WeatherStore._saveToCache(this.citiesList);
  }

  @action
  getMyLocation = () => {
    return new Promise((resolve, reject) => {
      this.state.loading = true;
      this.state.error   = null;
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.state.loading = false;
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        error => {
          this.state.error   = error.message;
          this.state.loading = false;
          reject(error);
        });
    });
  };

  /**
   * Validate city name
   * @param cityName
   * @returns {string|null} null if valid, else string error
   * @private
   */
  static _validateCityName (cityName) {
    if (typeof cityName !== 'string')
      return ErrorsText.NotString;
    if (cityName.trim().length === 0)
      return ErrorsText.StringEmpty;
    return null;
  }

  /**
   * Save current weather info to local storage
   * @private
   */
  static _saveToCache (data) {
    if (!window.localStorage)
      return;

    try {
      const citiesJson = JSON.stringify(data);
      window.localStorage.setItem(WeatherCacheKey, citiesJson);
    } catch (e) {
      console.log('Save to cache error', e);
    }
  }

  /**
   * Load weather info from local storage
   * @returns {array}
   * @private
   */
  static _loadFromCache () {
    if (!window.localStorage)
      return [];

    try {
      const cache = window.localStorage.getItem(WeatherCacheKey);
      if (cache != null) {
        return JSON.parse(cache);
      }
    } catch (e) {
      console.warn('Can\'t parse cached weather', e);
      return [];
    }
    return [];
  }
}

export default WeatherStore;