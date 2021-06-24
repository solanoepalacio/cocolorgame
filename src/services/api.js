import _ from 'lodash';

import Config from '../config';

const ApiService = {};

const buildApiPath = (path) => {
  return `${Config.apiBaseUrl}/${path}`
};

const request = (...args) => {
  return fetch(...args).then((response) => {
    if (response.status > 400)
      throw new Error(`Response Error: ${response.status}`);
    
    return response.json();
  })
};

const apiRequest = async (path, method, data) => {
  const headers = {};

  if (Config.localApiKey) _.set(headers, 'x-api-key', Config.localApiKey);
  const params = { method };

  if (data) params.body = JSON.stringify(data);

  let response, result, error;
  try {
    response = await request(buildApiPath(path), params);
  } catch (e) {
    console.error('API ERROR:', e);
    error = e.message || 'Unexpected Request Error';
  }

  try {
    result =  await response.json();
  } catch (e) {
    error = e.message || 'Unexpected Response Error';
  }

  return [ error, result ];
};

const getFromApi = (path) => apiRequest(path, 'GET');
const postToApi = (path, data) => apiRequest(path, 'POST', data);

ApiService.getAllPatients = () => getFromApi('patients');
ApiService.postPatient = (patientData) => postToApi('patients', patientData);

export default ApiService;
