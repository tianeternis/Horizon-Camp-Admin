import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  account: {
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    avatar: "",
    role: "",
    accessToken: "",
    refreshToken: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (_, action) => ({
      isAuth: true,
      account: {
        _id: action?.payload?._id,
        fullName: action?.payload?.fullName,
        email: action?.payload?.email,
        phone: action?.payload?.phone,
        birthday: action?.payload?.birthday,
        gender: action?.payload?.gender,
        avatar: action?.payload?.avatar,
        role: action?.payload?.role,
        accessToken: action?.payload?.accessToken,
        refreshToken: action?.payload?.refreshToken,
      },
    }),
    logoutSuccess: (_, __) => initialState,
    updateAccessToken: (state, action) => ({
      ...state,
      account: { ...state.account, accessToken: action?.payload?.accessToken },
    }),
  },
});

export const { loginSuccess, logoutSuccess, updateAccessToken } =
  userSlice.actions;

export default userSlice.reducer;
