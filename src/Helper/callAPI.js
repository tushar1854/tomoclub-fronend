import axios from 'axios';

// const BASE_URL = 'https://e5k1yxz18g.execute-api.us-east-1.amazonaws.com/testing';

const api = axios.create({
  //   baseURL: BASE_URL
});

const callAPI = (
  method,
  endpoint,
  data = null,
  headers = {
    'Content-Type': 'application/json'
  }
) => {
  return new Promise((resolve, reject) => {
    api({
      method: method,
      url: endpoint,
      data: data,
      headers: headers
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default callAPI;
