/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    console.log('logging in...');
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (result.data.status === 'sucess') {
      showAlert('success', 'Logged in successfully!!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (result.data.status == 'success') location.reload(true);
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', 'Error logging out!, Try again later');
  }
};
