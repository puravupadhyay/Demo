import axios from "axios";
import { ACCESS_TOKEN_CACHE_KEY, API_AUTH_ENDPOINT, API_SECRETS_KEY } from "../constnats";
const memoryCache = require("../cache/MemoryCache");
const { getSecrets } = require("./SecretHelper");

module.exports = {
    async refreshAccessToken() {
        var secrets = await getSecrets(API_SECRETS_KEY);
        const clientId = secrets.Appian_ClientId;
        const clientSecret = secrets.Appian_ClientSecret;

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        await axios.post<AccessToken>(API_AUTH_ENDPOINT, params)
            .then(response => {
                memoryCache.set(ACCESS_TOKEN_CACHE_KEY, response.data, response.data.expires_in);
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }
}