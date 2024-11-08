import axios from 'axios';

// export const api = axios.create({
//     baseURL: "http://localhost:2000/api", 
//   });

  export const api = axios.create({
    baseURL: process.env.REACT_APP_EKZA_URL, 
  });