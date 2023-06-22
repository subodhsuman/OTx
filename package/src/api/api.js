import axios from "axios";

export default class ApiClass {

    // LIVE LINKS
    // static binanceWebsocket = "wss://stream.binance.com:9443/ws";
    // static CAPTCHA_SITE_KEY = '6LeA8aMeAAAAAIZ430h3mJAoaOWKWOZJiIp_5Mag';
    // static VUE_DOMAIN = 'https://demo.otx.trade/';
    // static nodeUrl = 'https://node1.otx.trade/';
    // static nodeWebsocket = 'wss://node1.otx.trade/';
    // static baseUrl = 'https://demo.otx.trade/backend/public/api/';

    static binanceWebsocket = "wss://stream.binance.com:9443/ws";
    static CAPTCHA_SITE_KEY = '6LeA8aMeAAAAAIZ430h3mJAoaOWKWOZJiIp_5Mag';
    static VUE_DOMAIN = 'http://192.168.10.52:5173/';
    static nodeUrl = 'http://192.168.10.52:5059/';
    static nodeWebsocket = 'ws://192.168.10.52:5059/';
    static baseUrl = 'http://192.168.10.52:8000/api/';

    // // post api
    static postRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.post(this.baseUrl + apiUrl, formData, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // get api
    static getRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.get(this.baseUrl + apiUrl, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // update api if form data with image 
    static updateFormRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        baseParam = { _method: "PUT" };
        if (params != null) { var baseParam = Object.assign(params, baseParam); }
        return axios.post(this.baseUrl + apiUrl, formData, this.config(isToken, headers, baseParam)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // update api if form data with json format 
    static updateRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.put(this.baseUrl + apiUrl, formData, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // delete api
    static deleteRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.delete(this.baseUrl + apiUrl, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // Configrations of header and parameters 
    static config(isToken = true, headers = null, parameters = null) {
        var defaultHeaders = {
            Accept: "application/json",
        };
        var merge = {};
        if (isToken) {
            var token = { Authorization: `Bearer ${localStorage.getItem('token')}` };

            // var token = { Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOGNmNGIxZDRlMjIzZTI2NWQ4NDJlNWJiOTMwYWQ3Y2RlMTNiZGY4ZTIyNzVmOTQzNGY0NjEzYmIwZjk4Y2UzMzc4YmI0N2U0NDJiYjA5OTQiLCJpYXQiOjE2NjU0NzMyNzAuODU3OTAyLCJuYmYiOjE2NjU0NzMyNzAuODU3OTA1LCJleHAiOjE2NjU1NTk2NzAuODU0ODI4LCJzdWIiOiIxMCIsInNjb3BlcyI6W109.cMFPgG9Ngm1-uIk1fJ1I4931_zvqCpiy-Cwes04XlnzLsw-7jIQR8k6lkMTFlb7nkKJeSpY2LD2BjpV9hrroM8Z0vCLGB1r6zvYo-1_AgMnFI6itU44fwpqv_N2EXtzZK7P75ehUwL_EbLTxD4RxXFoDYcsnhuAaXQQlPYJX-5WhIg-gg0qOFq3hsglConSNOvzsvgmZyFJfLVki4G6hyuH8utuPGudcSTVm9MyHY12tUKWPFIgJhqTLeVp3KlI2MAfPFXsVjnJvToUBkiM-5XmKl3UxoP7KxlnaAqaz4TF8wAU_U10gF6v3YbNnf1dUNUMmIsQ06d5Fmq6lO-iqvtjK0rYENz_vA-TGNBVHovTDpip-MyDLEo7oZtNmdef2szYVAq7sOkdJT_oJZDznjBT77WrpMqiiBIXg0Ly03sdgDzwr9vPIMvD1ki6xPN7dQZG8FsoH7QC4XJPp0_holM1HCtYdjDAKtgo8H9mZzzsW0fgySTGWmciZAxSEeWqIgCdl--NSTCWL7XKK3XiAj-6Et7kGXen1vU0n7o4REcr_FXyfXUufUB9tyH1Q6acF3C6FmGc0Lt-NBHaG-642aH6sghPRu-BT9D8_jmJZUgIN9T4NOuLF-5Iro13YUSvf9MKoNUr5EgzyjClhmfX3QvguWrfKDEbEO_kjJIH7mqs` };
            merge = Object.assign(defaultHeaders, token);
        }
        merge = Object.assign(defaultHeaders, headers);
        return {
            headers: merge,
            params: parameters,
        };
    }

    // unautherntication Error
    static unauthenticateRedirect() {
        localStorage.clear();
        location.replace("/login");
    }

    // node get Api
    static getNodeRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.get(this.nodeUrl + apiUrl, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) { this.unauthenticateRedirect(); }
        });
    }

    // node post Api
    static postNodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.post(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params)).then((result) => {
            return result;
        }).catch((error) => {
            if (error.response.status == 401) { this.unauthenticateRedirect(); }
        });
    }

}