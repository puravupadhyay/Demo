import { REGION } from "../constnats";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

module.exports = {
    async getSecrets(secret_name: string) {
        const client = new SecretsManagerClient({ region: REGION });
        let response;
        try {
            response = await client.send(
                new GetSecretValueCommand({
                    SecretId: secret_name,
                    VersionStage: 'AWSCURRENT',
                })
            );
        } catch (error) {
            throw error;
        }
        return JSON.parse(response.SecretString);
    }
}
