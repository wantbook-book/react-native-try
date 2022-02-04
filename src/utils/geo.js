import {PermissionsAndroid, Platform} from 'react-native';
import {init, Geolocation} from 'react-native-amap-geolocation';
import axios from 'axios';
class Geo {
  async initGeo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
    }

    await init({
      ios: '2b084441910671820bebd89978fbde7f',
      android: '2b084441910671820bebd89978fbde7f',
    });
  }
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(({coords}) => {
        resolve(coords);
      }, reject);
    });
  }
  async getCityByLocation() {
    try {
      let {longitude, latitude} = await this.getCurrentPosition();
      console.log('get coord: ', longitude, latitude);
      const res = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
        params: {
          location: `${longitude},${latitude}`,
          key: '96088167121851f94c68f21956b51588',
        },
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Geo();
