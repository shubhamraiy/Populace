import {Navigator} from '@Navigator';
import {Alert} from 'react-native';

export const ApiServices = {
  baseURL: 'https://populacelottoappnew.aistechnolabs.pro/player/',
  // baseURL: 'https://5da8-103-1-100-202.in.ngrok.io/player/',

  async get(endPoint: string) {
    Navigator.showLoader(true);
    return new Promise((resolver, reject) => {
      fetch(this.baseURL + endPoint, {method: 'GET'})
        .then(async (response: any) => {
          Navigator.showLoader(false);
          const result = await response.json();
          console.log("Response:",result);
          if (response.status === 500) {
            Navigator.showAlert('Something went wrong..');
          } else if (result.status === false) {
            Navigator.showAlert(result.message);
          } else {
            resolver(result);
          }
        })
        .then(result => {
          Navigator.showLoader(false);
          return resolver(result);
        })
        .catch(err => {
          Navigator.showAlert(err.message ?? 'Something went wrong...');
          Navigator.showLoader(false);
          reject(err);
        });
    });
  },

  async post(endPoint: string, json: any) {
    console.log('formData:', json);
    Navigator.showLoader(true);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: json,
      redirect: 'follow',
    };

    return new Promise((resolver, reject) => {
      fetch(this.baseURL + endPoint, requestOptions)
        .then(async (response: any) => {
          Navigator.showLoader(false);
          const result = await response.json();
          console.log('Response:', result);
          if (response?.status === 500) {
            Navigator.showAlert('Something went wrong..');
          } else if (result?.status === false) {
            Navigator.showAlert(result?.message);
          } else {
            resolver(result);
          }
        })
        .then(result => {
          Navigator.showLoader(false);
          return resolver(result);
        })
        .catch(err => {
          Navigator.showAlert(err?.message ?? 'Something went wrong...');
          Navigator.showLoader(false);
          return reject(err);
        });
    });
  },
};
