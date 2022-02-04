import AsyncStorage from '@react-native-async-storage/async-storage';
export default {
  getData: key => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key)
        .then(jsonStr => {
          resolve(jsonStr !== null ? JSON.parse(jsonStr) : null);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  storeData: (key, jsonObj) => {
    return new Promise((resolve, reject) => {
      const jsonStr = JSON.stringify(jsonObj);
      AsyncStorage.setItem(key, jsonStr)
        .then(() => {
          resolve('ok');
        })
        .catch(err => {
          reject(err);
        });
    });
  },
};
