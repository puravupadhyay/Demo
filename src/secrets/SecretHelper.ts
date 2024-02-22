import { REGION } from "../constnats";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export async function getSecrets(secret_name: string) {
    const client = new SecretsManagerClient({ region: REGION });
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: 'AWSCURRENT',
            })
        );
        return JSON.parse(response.SecretString);
    } catch (error) {
        throw error;
    }
}