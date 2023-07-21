import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {Utils} from '@Utils';

const Splash = () => {
  useEffect(() => {
    setTimeout(async () => {
      // console.log('_getUserData', await Utils._getUserData());

      if (await Utils._getUserData()) {
        if (await Utils.isSubscribe()) {
          Navigator.setHome();
        } else {
          Navigator.setRoot(screenName.Subscription, {isShow: true});
        }
      } else {
        Navigator.setRoot(screenName.Auth);
      }
      // Navigator.setHome();
    }, 2000);
  }, []);

  return (
    <ImageBackground
      resizeMode={'cover'}
      style={{flex: 1}}
      source={require('@images/splash_bg.png')}
    />
  );
};
export default Splash;
