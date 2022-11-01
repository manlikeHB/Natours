/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const updatedUser = await axios({
      method: 'PATCH',
      url,
      data,
    });

    console.log(updatedUser);

    if (updatedUser.data.status === 'sucess') {
      showAlert('success', `${type.toUpperCase()} saved successfully!!!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
