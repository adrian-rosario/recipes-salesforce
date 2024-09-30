import * as constants from "../config/constants";

export const requestTimeout = function (time) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, time * 1000);
  });
};

export const getJson = async function (theHashId) {
  try {
    if (!theHashId) return;

    const theRequest = fetch(`${constants.API_URL}${theHashId}`);
    const theTimeout = requestTimeout(constants.TIMEOUT_SECONDS);

    const response = await Promise.race([theRequest, theTimeout]);
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const getSearchJson = async function (query) {
  try {
    if (!query) return;

    const theRequest = fetch(`${constants.API_SEARCH}${query}`);
    const theTimeout = requestTimeout(constants.TIMEOUT_SECONDS);

    const response = await Promise.race([theRequest, theTimeout]);

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const sendJson = async function (thePostUrl, theDataToPost) {
  log("helpers - SendJson called", thePostUrl);
  try {
    if (!thePostUrl) return;

    const thePostRequest = fetch(thePostUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(theDataToPost),
    });

    const theTimeout = requestTimeout(constants.TIMEOUT_SECONDS);

    const response = await Promise.race([thePostRequest, theTimeout]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message}\n${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const log = function (message, data, data2) {
  if (message) console.log(" 🔎 " + message);
  if (data) console.log("... 💼 " + JSON.stringify(data));
  if (data2) console.log("... 💼💼 " + JSON.stringify(data2));
};
