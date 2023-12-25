const envSecretResponse = process.env.AWS_MODERNSTAY_CONFIG as string;
const envSecretString = JSON.parse(envSecretResponse);
export const envSecret = JSON.parse(envSecretString.SecretString);
