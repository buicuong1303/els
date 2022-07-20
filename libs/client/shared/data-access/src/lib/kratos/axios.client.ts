import axiosFactory, { AxiosInstance } from 'axios';

export const resilienceAxios = (axios: AxiosInstance) => {
  axios.interceptors.response.use(
    (value) => Promise.resolve(value),
    (error) => {
      if (!error.config) {
        return Promise.reject(error);
      }

      if (
        error.response &&
        (error.response.status == 400 ||
          error.response.status == 401 ||
          error.response.status == 403)
      ) {
        /* console.debug('Network request failed but this is ok', {
          config: error.config,
          error
        }) */
        return Promise.reject(error);
      }

      if (
        error.response &&
        (error.response.status >= 400 || error.response.status < 500)
      ) {
        // 4xx status means we should not retry.
        // console.error('Network request failed', { config: error.config, error })
        return Promise.reject(error);
      }

      const config = {
        ...error.config,
        timeout: 1000,
        count: (error?.config?.count || 0) + 1,
      };

      if (config.count > 60) {
        const err = new Error(
          'Unable to reach network, gave up after 60 retries. Please restart the app and try again.',
        );
        // console.error(err, { config: error.config, error });
        return Promise.reject(err);
      }

      // console.debug('Retrying due to network error', {
      //   count: error.config.count,
      //   error,
      // });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.request(config).then(resolve).catch(reject);
        }, 1000);
      });
    },
  );
};

export const axios = axiosFactory.create();
// resilienceAxios(axios); // Adds retry mechanism to axios
