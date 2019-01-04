import request from 'superagent'
import router from '../router/index'


const PRO_SERVER = process.env.BASE_API;


function getUrl(path) {
  if (path.startsWith('http') || path.startsWith('https')) {
    return path;
  }
  return `${PRO_SERVER}${path}`;
}


const HttpClient = {
  get: (path, query) => new Promise((resolve, reject) => {
    if (!window.localStorage.getItem('access_token')) {
      router.push({name: 'login'});
      return false;
    }
    var req = request
      .get(getUrl(path))
      .withCredentials()
      .set('Content-Type', 'application/json')
      .set('Authorization', window.localStorage.getItem('access_token'))
      .query(query)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),

  post: (path, formdata, query) => new Promise((resolve, reject) => {
    if (path.indexOf('/login') < 0 && !window.localStorage.getItem('access_token')) {
      router.push({name: 'login'});
      return false;
    }
    request
      .post(getUrl(path))
      .withCredentials()
      .set('Content-Type', 'application/json')
      .set('Authorization', window.localStorage.getItem('access_token'))
      .query(query)
      .send(formdata)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          if (path.indexOf('login/index') > -1) {
            window.localStorage.setItem('access_token', res.body.token_type + ' ' + res.body.access_token)
          }
          resolve(res.body);
        }
      });
  }),

  put: (path, query, payload) => new Promise((resolve, reject) => {
    request
      .put(getUrl(path))
      .query(query)
      .send(payload)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),

  delete: (path, query) => new Promise((resolve, reject) => {
    request
      .del(getUrl(path))
      .withCredentials()
      .query(query)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  })
};

export default HttpClient;
