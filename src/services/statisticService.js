import axios from "@/configs/axios";

export const getOverview = ({ timeRange, viewType, dates }) => {
  let newDates = null;
  if (dates && dates?.length > 0) {
    const data = [];
    if (dates[0]) data.push(new Date(dates[0]).toISOString());
    if (dates[1]) data.push(new Date(dates[1]).toISOString());

    newDates = data.length > 0 ? data.join("&") : null;
  }

  return axios.get(`/statistic/get-overview`, {
    params: { timeRange, viewType, dates: newDates },
  });
};

export const getRevenue = ({ timeRange, viewType, dates }) => {
  let newDates = null;
  if (dates && dates?.length > 0) {
    const data = [];
    if (dates[0]) data.push(new Date(dates[0]).toISOString());
    if (dates[1]) data.push(new Date(dates[1]).toISOString());

    newDates = data.length > 0 ? data.join("&") : null;
  }

  return axios.get(`/statistic/get-revenue`, {
    params: { timeRange, viewType, dates: newDates },
  });
};

export const getOrdersNumberByStatus = ({ timeRange, viewType, dates }) => {
  let newDates = null;
  if (dates && dates?.length > 0) {
    const data = [];
    if (dates[0]) data.push(new Date(dates[0]).toISOString());
    if (dates[1]) data.push(new Date(dates[1]).toISOString());

    newDates = data.length > 0 ? data.join("&") : null;
  }

  return axios.get(`/statistic/get-orders-number`, {
    params: { timeRange, viewType, dates: newDates },
  });
};

export const getSoldAndOrdersNumber = ({ timeRange, viewType, dates }) => {
  let newDates = null;
  if (dates && dates?.length > 0) {
    const data = [];
    if (dates[0]) data.push(new Date(dates[0]).toISOString());
    if (dates[1]) data.push(new Date(dates[1]).toISOString());

    newDates = data.length > 0 ? data.join("&") : null;
  }

  return axios.get(`/statistic/get-sold-and-orders-number`, {
    params: { timeRange, viewType, dates: newDates },
  });
};

export const getCustomersByGender = ({ timeRange, viewType, dates }) => {
  let newDates = null;
  if (dates && dates?.length > 0) {
    const data = [];
    if (dates[0]) data.push(new Date(dates[0]).toISOString());
    if (dates[1]) data.push(new Date(dates[1]).toISOString());

    newDates = data.length > 0 ? data.join("&") : null;
  }

  return axios.get(`/statistic/get-customers-by-gender`, {
    params: { timeRange, viewType, dates: newDates },
  });
};
