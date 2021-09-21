import axios from 'axios';

axios.post(`${process.env.SERVER_URL || 'http://localhost'}:8000/check-update-swap`).then((response) => {
  // console.log(response);
}).catch(e => {
  console.log(e);
})
