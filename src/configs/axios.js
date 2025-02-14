import { logoutSuccess, updateAccessToken } from "@/redux/reducer/userSlice";
import { store } from "@/redux/store";
import StatusCodes from "@/utils/status/StatusCodes";
import axios from "axios";

const lang = "vi";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // Thêm ngôn ngữ hiện tại vào header
    config.headers["Accept-Language"] = lang;

    // Thêm ngôn ngữ hiện tại vào query string
    const url = new URL(config.url, config.baseURL);
    url.searchParams.set("lang", lang);
    config.url = url.pathname + url.search;

    // Thêm access token
    const access_token = store.getState().user.account.accessToken;
    config.headers.Authorization = "Bearer " + access_token;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;

    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.EC === StatusCodes.ACCESS_TOKEN_EXPIRED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().user.account.refreshToken;

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token?lang=${lang}`,
          { refreshToken },
          {
            headers: { "Accept-Language": lang },
          },
        );

        if (
          res &&
          res.data &&
          res.data.EC === StatusCodes.SUCCESS &&
          res.data.DT &&
          res.data.DT.accessToken
        ) {
          const accessToken = res.data.DT.accessToken;
          store.dispatch(updateAccessToken({ accessToken }));
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } else {
          // Lỗi không có thông tin trả về
          store.dispatch(logoutSuccess());
          //   window.location.href = "/login";
        }
      } catch (error) {
        // Lỗi xảy ra khi refresh token: token không hợp lệ hoặc hết hạn, lỗi server... => logout và buộc đăng nhập lại
        console.error("Token refresh failed:", error);
        store.dispatch(logoutSuccess());
        //   window.location.href = "/login";
      }
    }

    return error && error.response && error.response.data
      ? error.response.data
      : Promise.reject(error);
  },
);

export default instance;
