import axios from "axios";
import { ACCESS_TOKEN_CACHE_KEY, API_AUTH_ENDPOINT, API_SECRETS_KEY, LIST_PRICE_CACHE_KEY } from "../constnats";
const { getSecrets } = require("./../secrets/SecretHelper");
const cache = require("./../cache/Cache");

export async function refreshAccessToken() {
    const secrets = await getSecrets(API_SECRETS_KEY);
    const clientId = secrets.Appian_ClientId;
    const clientSecret = secrets.Appian_ClientSecret;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    await axios.post(API_AUTH_ENDPOINT, params)
        .then(async response => {
            await cache.set(ACCESS_TOKEN_CACHE_KEY, response.data, response.data.expires_in);
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}