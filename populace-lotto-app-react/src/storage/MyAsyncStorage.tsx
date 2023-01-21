import AsyncStorage from '@react-native-async-storage/async-storage';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export const keyName = {
  userData: 'userData',
  userId: 'userId',
  isIntro: 'isIntro',
};

export const MyAsyncStorage = {
  async saveData(key: any, data: any) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  },

  async getData(key: any) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  },

  async logOut() {
    AsyncStorage.clear().then((data: any) => {
      Navigator.setRoot(screenName.Splash);
    });
  },
};
