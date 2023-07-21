import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import {keyName, MyAsyncStorage} from '@MyAsyncStorage';
import {Alert, Dimensions, Share} from 'react-native';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export const Utils = {
  API_BASE_URL: 'https://populacelottoappnew.aistechnolabs.pro/',
  // API_BASE_URL: 'http://192.168.2.139:9800/',
  // API_BASE_URL: 'https://5da8-103-1-100-202.in.ngrok.io/player/',

  PAYPAL_URL_GET_TOKEN: 'https://api.sandbox.paypal.com/v1/oauth2/token',
  PAYPAL_URL_PAYMENT: 'https://api.sandbox.paypal.com/v1/payments/payment',
  PAYPAL_CLIENT_ID:
    'AZwxkI5RRarJuG3CldH1nTObNp6dmLke2duCLMcbaBg98t79c1fGkjUWA2vdEpOtfmi-bV2N9axt2cb5',
  PAYPAL_CLIENT_SECRET:
    'EBPJ4SuoqBwifuEaO95bJGzTqQYuS9fTS_VWBAzqurFUyfIi8azbfR_CQib3s0-vIJnBT6nV6NDpGyFl',
  REDIRECT_URL: 'https://populace.com',

  STRIPE_MERCHANT_ID: 'merchant.com.populace-sweepstake.app',
  STRIPE_PUBLISHABLE_KEY:
    'pk_test_51N0W26EMXPG2wvA7EM6kOfxYMZOAfzZN9O0VQ0qai45XbyQSU47U0e8S1RMo6fuQLsQeyvzCV5volcwit91AORdw00zmZNIB5B',

  exp_pattern_mobile: /^[0-9]{6,14}$/,
  exp_pattern_email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  exp_pattern_url:
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,

  isUrlValid(url: any) {
    let reg = Utils.exp_pattern_url;
    // console.log('Url validation', reg.test(url));
    return reg.test(url);
  },

  isEmailValid(email: any) {
    let reg = Utils.exp_pattern_email;
    return reg.test(email);
  },

  calculateHeight(componentHeight: number) {
    //812 is the screen height which we used to create design of the app
    return responsiveHeight(
      (100 / Dimensions.get('screen').height) * componentHeight,
    );
  },

  calculateWidth(componentWidth: number) {
    //375 is the screen width which we used to create design of the app
    return responsiveWidth(
      (100 / Dimensions.get('screen').width) * componentWidth,
    );
  },

  randomColor() {
    return Math.floor(Math.random() * 16777215);
  },

  async isNetwork() {
    let netFlag = false;
    await NetInfo.fetch()
      .then(isConnected => {
        if (isConnected.isConnected) {
          netFlag = true;
        }
      })
      .catch(err => {
        if (err) {
          netFlag = false;
        }
      });
    return netFlag;
  },

  async _getUserId() {
    const user = await MyAsyncStorage.getData(keyName.userData);
    // console.log('UserData', user);
    return user?.id;
  },
  async isSubscribe() {
    const user = await MyAsyncStorage.getData(keyName.userData);
    // console.log("isSubscribe",user?.isSubscribe);
    // console.log("isSubscribe",user?.isCurrentSubscription)
    let isSubscribe = false;
    if (Object.keys(user?.subscription || {}).length > 0) {
      if (
        user?.subscription?.status === 'active' ||
        user?.subscription?.status === 'canceled' ||
        user?.subscription?.status === 'incomplete'
      ) {
        isSubscribe = true;
      }
    }

    return isSubscribe;
  },
  async _isPlanActive() {
    const user = await MyAsyncStorage.getData(keyName.userData);
    const isActive = user?.subscription === 'active';
    return isActive;
  },
  async _getToken() {
    const user = await MyAsyncStorage.getData(keyName.userData);
    // console.log('userToken', user?.token);
    return user?.jwtToken;
  },
  async getEmail() {
    const user = await MyAsyncStorage.getData(keyName.userData);
    // console.log('userToken', user?.email);
    return user?.email;
  },

  async _setUserData(userData: any) {
    await MyAsyncStorage.saveData(keyName.userData, userData);
  },

  async _setPlanData(planData: any) {
    await MyAsyncStorage.saveData(keyName.plan, planData);
  },

  async _getUserData() {
    return await MyAsyncStorage.getData(keyName.userData);
  },

  async _getPlanData() {
    return await MyAsyncStorage.getData(keyName.plan);
  },

  async _logOut() {
    // await MyAsyncStorage.logOut();
    await MyAsyncStorage.saveData(keyName.userData, {});
    await MyAsyncStorage.saveData(keyName.plan, {});
    Navigator.setRoot(screenName.Splash);
  },

  toHHMMSS(secs: any) {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map(v => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  },

  async onShare() {
    try {
      const result = await Share.share({
        title: 'App link',
        message: 'Please install this app and stay safe , AppLink :link',
        url: 'link',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message + '');
    }
  },

  //    showLoading(isLoading:any) {
  //     return isLoading ? <LoadingView style={{}}/> : <View/>;
  // }
  isNumeric(value: string) {
    // return validate(value.isNumeric) ? true : false
    // console.log(!value.match(/^[^0-9]+$/));

    return !value.match(/^[^0-9]+$/);
  },

  isCharacter(value: any) {
    return !!value.match(/^[^a-zA-Z]+$/);
  },

  isDigit(value: any) {
    // console.log(/^[0-9]+$/.test(value));
    return !!/^[0-9]+$/.test(value);
  },

  isEmpty(value: any) {
    if (value) {
      return value.trim().length === 0;
    } else {
      return false;
    }
  },

  addHours(UTCdate: any, hours: any) {
    const dateAdded = new Date(UTCdate);
    dateAdded.setHours(dateAdded.getHours() + hours);
    return dateAdded;
  },

  subtHours(UTCdate: any, hours: any) {
    const dateSubtracted = new Date(UTCdate);
    dateSubtracted.setHours(dateSubtracted.getHours() - hours);
    return dateSubtracted;
  },

  getSeconds(UTCdate: any) {
    const seconds = new Date(UTCdate);
    seconds.getSeconds();
    return seconds;
  },

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  },

  intoAMPM(UTCdate: any) {
    const d = new Date(UTCdate);
    var hour =
      d.getHours() == 0
        ? 12
        : d.getHours() > 12
        ? d.getHours() - 12
        : d.getHours();
    var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var am_pm = d.getHours() < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + am_pm;
    return time;
  },
};

export const USstates = [
  {
    name: 'Alabama',
    abbreviation: 'AL',
  },
  {
    name: 'Alaska',
    abbreviation: 'AK',
  },
  {
    name: 'American Samoa',
    abbreviation: 'AS',
  },
  {
    name: 'Arizona',
    abbreviation: 'AZ',
  },
  {
    name: 'Arkansas',
    abbreviation: 'AR',
  },
  {
    name: 'California',
    abbreviation: 'CA',
  },
  {
    name: 'Colorado',
    abbreviation: 'CO',
  },
  {
    name: 'Connecticut',
    abbreviation: 'CT',
  },
  {
    name: 'Delaware',
    abbreviation: 'DE',
  },
  {
    name: 'District Of Columbia',
    abbreviation: 'DC',
  },
  {
    name: 'Federated States Of Micronesia',
    abbreviation: 'FM',
  },
  {
    name: 'Florida',
    abbreviation: 'FL',
  },
  {
    name: 'Georgia',
    abbreviation: 'GA',
  },
  {
    name: 'Guam',
    abbreviation: 'GU',
  },
  {
    name: 'Hawaii',
    abbreviation: 'HI',
  },
  {
    name: 'Idaho',
    abbreviation: 'ID',
  },
  {
    name: 'Illinois',
    abbreviation: 'IL',
  },
  {
    name: 'Indiana',
    abbreviation: 'IN',
  },
  {
    name: 'Iowa',
    abbreviation: 'IA',
  },
  {
    name: 'Kansas',
    abbreviation: 'KS',
  },
  {
    name: 'Kentucky',
    abbreviation: 'KY',
  },
  {
    name: 'Louisiana',
    abbreviation: 'LA',
  },
  {
    name: 'Maine',
    abbreviation: 'ME',
  },
  {
    name: 'Marshall Islands',
    abbreviation: 'MH',
  },
  {
    name: 'Maryland',
    abbreviation: 'MD',
  },
  {
    name: 'Massachusetts',
    abbreviation: 'MA',
  },
  {
    name: 'Michigan',
    abbreviation: 'MI',
  },
  {
    name: 'Minnesota',
    abbreviation: 'MN',
  },
  {
    name: 'Mississippi',
    abbreviation: 'MS',
  },
  {
    name: 'Missouri',
    abbreviation: 'MO',
  },
  {
    name: 'Montana',
    abbreviation: 'MT',
  },
  {
    name: 'Nebraska',
    abbreviation: 'NE',
  },
  {
    name: 'Nevada',
    abbreviation: 'NV',
  },
  {
    name: 'New Hampshire',
    abbreviation: 'NH',
  },
  {
    name: 'New Jersey',
    abbreviation: 'NJ',
  },
  {
    name: 'New Mexico',
    abbreviation: 'NM',
  },
  {
    name: 'New York',
    abbreviation: 'NY',
  },
  {
    name: 'North Carolina',
    abbreviation: 'NC',
  },
  {
    name: 'North Dakota',
    abbreviation: 'ND',
  },
  {
    name: 'Northern Mariana Islands',
    abbreviation: 'MP',
  },
  {
    name: 'Ohio',
    abbreviation: 'OH',
  },
  {
    name: 'Oklahoma',
    abbreviation: 'OK',
  },
  {
    name: 'Oregon',
    abbreviation: 'OR',
  },
  {
    name: 'Palau',
    abbreviation: 'PW',
  },
  {
    name: 'Pennsylvania',
    abbreviation: 'PA',
  },
  {
    name: 'Puerto Rico',
    abbreviation: 'PR',
  },
  {
    name: 'Rhode Island',
    abbreviation: 'RI',
  },
  {
    name: 'South Carolina',
    abbreviation: 'SC',
  },
  {
    name: 'South Dakota',
    abbreviation: 'SD',
  },
  {
    name: 'Tennessee',
    abbreviation: 'TN',
  },
  {
    name: 'Texas',
    abbreviation: 'TX',
  },
  {
    name: 'Utah',
    abbreviation: 'UT',
  },
  {
    name: 'Vermont',
    abbreviation: 'VT',
  },
  {
    name: 'Virgin Islands',
    abbreviation: 'VI',
  },
  {
    name: 'Virginia',
    abbreviation: 'VA',
  },
  {
    name: 'Washington',
    abbreviation: 'WA',
  },
  {
    name: 'West Virginia',
    abbreviation: 'WV',
  },
  {
    name: 'Wisconsin',
    abbreviation: 'WI',
  },
  {
    name: 'Wyoming',
    abbreviation: 'WY',
  },
];
