import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Initialize Bedrock client
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Model IDs - Using Amazon Nova Pro (allowed in hackathon)
const NOVA_MODEL_ID = "amazon.nova-pro-v1:0";

/**
 * Invoke Amazon Nova model via Bedrock
 * Using Nova Pro for intelligent quiz analysis and remediation
 */
export async function invokeClaude(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  // Combine system prompt and user prompt for Nova
  const fullPrompt = systemPrompt
    ? `${systemPrompt}\n\n${prompt}`
    : prompt;

  const payload = {
    messages: [
      {
        role: "user",
        content: [
          {
            text: fullPrompt,
          },
        ],
      },
    ],
    inferenceConfig: {
      max_new_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
    },
  };

  const command = new InvokeModelCommand({
    modelId: NOVA_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  // Extract text from Nova response format
  return responseBody.output.message.content[0].text;
}
