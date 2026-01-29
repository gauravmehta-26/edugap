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

// Model IDs
const CLAUDE_MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0";

interface BedrockMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Invoke Claude model via Bedrock
 */
export async function invokeClaude(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const messages: BedrockMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2000,
    messages,
    ...(systemPrompt && { system: systemPrompt }),
  };

  const command = new InvokeModelCommand({
    modelId: CLAUDE_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.content[0].text;
}
