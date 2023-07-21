import {MyAsyncStorage} from '@MyAsyncStorage';
import {Navigator} from '@Navigator';
import {Utils} from '@Utils';

export const ApiServices = {
  async get(endPoint: string) {
    // Navigator.showLoader(true);
    const token = (await Utils?._getToken()) || '';
    console.log('token', token);

    var myHeaders = new Headers();
    myHeaders.append('jwtToken', token);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    return new Promise((resolver, reject) => {
      fetch(Utils.API_BASE_URL + endPoint, requestOptions)
        .then(async (response: any) => {
          // Navigator.showLoader(false);
          const result = await response.json();
          console.log('Response:', result);
          if (response.status === 500) {
            Navigator.showAlert('Something went wrong..');
            reject(result);
          } else if (result.status === false) {
            reject(result);
            Navigator.showAlert(result.message);
            if (
              result.message == 'Authentication failed, please login again' ||
              result.message == 'Server Error' ||
              result.message == 'Player not Found!'
            ) {
              MyAsyncStorage.logOut();
            }
          } else {
            return resolver(result);
          }
        })
        .then(result => {
          // Navigator.showLoader(false);
          return resolver(result);
        })
        .catch(err => {
          console.log('err', {...err});
          Navigator.showAlert(err.message ?? 'Something went wrong...');
          // Navigator.showLoader(false);
          return reject(err);
        });
    });
  },

  async post(endPoint: string, json: any) {
    // console.log('formData:', json);
    // Navigator.showLoader(true);

    const token = (await Utils?._getToken()) || '';

    var myHeaders = new Headers();
    myHeaders.append('jwtToken', token);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: json,
      redirect: 'follow',
    };

    return new Promise((resolver, reject) => {
      fetch(Utils.API_BASE_URL + endPoint, requestOptions)
        .then(async (response: any) => {
          // Navigator.showLoader(false);
          const result = await response.json();
          console.log('Response:', result);
          if (response?.status === 500) {
            Navigator.showAlert('Something went wrong..');
            reject(result);
          } else if (result?.status === false) {
            Navigator.showAlert(result?.message);
            reject(result);
            if (
              result.message == 'Authentication failed, please login again' ||
              result.message == 'Authentication failed, token not found' ||
              result.message == 'Server Error' ||
              result.message == 'Player not Found!'
            ) {
              MyAsyncStorage.logOut();
            }
          } else {
            return resolver(result);
          }
        })
        .then(result => {
          // Navigator.showLoader(false);
          return resolver(result);
        })
        .catch(err => {
          Navigator.showAlert(err?.message ?? 'Something went wrong...');
          // Navigator.showLoader(false);
          // console.log(err);
          return reject(err);
        });
    });
  },
};
