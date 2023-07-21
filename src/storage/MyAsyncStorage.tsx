import AsyncStorage from '@react-native-async-storage/async-storage';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export const keyName = {
  userData: 'userData',
  plan: 'planData',
  userId: 'userId',
  isIntro: 'isIntro',
};
export const multikey = ['userData', 'planData', 'userId', 'isIntro'];

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
    // await AsyncStorage.removeItem(keyName.userData).then((data: any) => {
    //   Navigator.setRoot(screenName.Splash);
    // });
    AsyncStorage.clear().then((data: any) => {
      Navigator.setRoot(screenName.Splash);
    });
    // AsyncStorage.multiRemove(multikey).then((data: any) => {
    //   // Navigator.setRoot(screenName.Splash);
    // });

    // AsyncStorage.getAllKeys()
    //   .then(keys => AsyncStorage.multiRemove(keys))
    //   .then(() => Navigator.setRoot(screenName.Splash));
  },
};
