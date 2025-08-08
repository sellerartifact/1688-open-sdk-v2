import axios from 'axios';
import { UrlParam, computedAppSignature, GetTokenData } from './lib/utils';

export default class ApiExecutor {
  appKey: string;
  appSecret: string;
  domain: string;

  constructor(params: {
    /**
     * 应用的AppKey
     */
    appKey: string;
    /**
     * 应用的AppSecret
     */
    appSecret: string;

    domain?: string;
  }) {
    this.appKey = params.appKey;
    this.appSecret = params.appSecret;
    this.domain = params.domain || 'gw.open.1688.com';
  }

  async execute(api: string, params: UrlParam, access_token: string) {
    api = this.mergeApi(api);
    params.access_token = access_token;
    params._aop_timestamp = Date.now();
    params._aop_signature = computedAppSignature(api, params, this.appSecret);
    const res = await axios({
      url: this.mergeUrl(api),
      method: 'post',
      params,
    });
    return res.data;
  }

  async refreshToken2AccessToken(refreshToken: string) {
    const url = `https://${this.domain}/openapi/param2/1/system.oauth2/getToken/${this.appKey}`;
    const params = {
      grant_type: 'refresh_token',
      client_id: this.appKey,
      client_secret: this.appSecret,
      refresh_token: refreshToken,
    };
    const res = await axios({
      url,
      method: 'post',
      params,
    });
    return res.data as GetTokenData;
  }

  async code2RefreshToken(code: string, redirect_uri: string) {
    const url = `https://gw.open.1688.com/openapi/http/1/system.oauth2/getToken/${this.appKey}?grant_type=authorization_code&need_refresh_token=true&client_id=${this.appKey}&client_secret=${this.appSecret}&redirect_uri=${redirect_uri}&code=${code}`;
    const res = await axios({
      url,
      method: 'post',
    });
    return res.data;
  }

  private mergeApi(api: string) {
    return `param2/1/${api}/${this.appKey}`;
  }

  private mergeUrl(api: string) {
    const request_url = `http://${this.domain}/openapi/`;
    return request_url + api;
  }
}
