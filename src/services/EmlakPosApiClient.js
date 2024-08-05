import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const def_auth_type = "token";
const def_user_level = "pos";
const def_user_lang = "tr";
const def_platform = "Android";
const def_platform_ver = 1.19;

class EmlakPosApiClient {
  constructor() {
    this.last_response = {};
    this.call_action = "/";
    this.call_params = {
      head: {
        auth_type: def_auth_type,
        user_level: def_user_level,
        user_lang: def_user_lang,
        platform: def_platform,
        platform_ver: def_platform_ver,
        token: null,
        phone: null,
        password: null,
        id_user: 1,
        device_id: null,
      },
      data: {},
    };
    this.device_id = false;
    this.api_base = "https://mobilapi.emlakkatilim.com.tr/?/mobil/v2/";
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  setHeadParam(name, value) {
    this.call_params.head[name] = value;
  }

  setCallAction(value) {
    this.call_action = value;
  }

  setRequestData(value) {
    this.call_params.data = value;
  }

  setRequestDataParam(name, value) {
    return (this.call_params.data[name] = value);
  }

  removeParam(name) {
    delete this.call_params[name];
  }

  async clearApiParams() {
    this.clearHeadParams();
    this.clearRequestParams();
    try {
      
      this.setHeadParam('token', await AsyncStorage.getItem('token'));
      this.setHeadParam('phone', await AsyncStorage.getItem('phone'));
    
    } catch (error) {
      console.error(error);
    }
   
    return;
}
  clearHeadParams() {
    this.call_params.head = {
      auth_type: def_auth_type,
      user_level: def_user_level,
      user_lang: def_user_lang,
      platform: def_platform,
      platform_ver: def_platform_ver,
      token: null,
    };
  }

  clearRequestParams() {
    this.call_params.data = {};
  }

  clearAllParams() {
    for (let key in this.call_params) {
      this.removeParam(key);
    }
  }

  prevalidate() {
    return true;
  }

 async setToken(token) {
    await AsyncStorage.setItem('token', token);
    return this.setHeadParam('token', token);
}

  async callApi(callback = this.handleResponse, callbackData = null) {
    let end_url = this.api_base + this.call_action;

    try {
      const response = await axios.post(end_url, JSON.stringify(this.call_params), {
        headers: this.headers,
      });
      console.log(response)
      if (typeof callback === "function") {
        return callback(response.data, callbackData, this.call_params.data);
      }
      return this.handleResponse(response.data, callbackData, this.call_params.data);
    } catch (error) {
      console.error("API call error:", error);
      // Handle error accordingly
    }
  }

  handleResponse(response, callbackData, requestData) {
    console.log("Response:", response);
    this.last_response = response;

    // requestData'deki verileri response.data'ya ekliyoruz
    if (response.data) {
      response.data = { ...response.data, ...requestData };
    } else {
      response.data = requestData;
    }

    return this.last_response;
    // Add any additional response handling logic here
  }
}

export default EmlakPosApiClient;
