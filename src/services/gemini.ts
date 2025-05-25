import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Maximum number of retries
const MAX_RETRIES = 3;
// Base delay in milliseconds
const BASE_DELAY = 2000; // 2 seconds

// Request throttling
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get random delay with jitter
const getRandomDelay = (baseDelay: number) => {
  const jitter = Math.random() * 0.2 * baseDelay; // 20% jitter
  return baseDelay + jitter;
};

// Helper function to ensure minimum time between requests
const ensureRequestInterval = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: Waiting ${waitTime}ms before next request`);
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
};

// Custom error class for API errors
class GeminiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isRateLimit: boolean = false
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

// Helper function to make API request
const makeApiRequest = async (prompt: string) => {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new GeminiError(
      error.error?.message || 'API request failed',
      response.status,
      response.status === 429
    );
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Test function to verify API connectivity
export const testGeminiConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      message: 'Gemini API key is not configured',
    };
  }

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Ensure minimum time between requests
      await ensureRequestInterval();

      console.log('Testing Gemini API connection...');
      const text = await makeApiRequest("Say 'API test successful' if you can read this.");
      
      console.log('Gemini API Test Successful:', text);
      return {
        success: true,
        message: 'API connection successful',
        details: {
          model: "gemini-2.0-flash",
          response: text
        }
      };
    } catch (error: any) {
      console.error('Gemini API Test Error:', error);
      
      if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
        const waitTime = getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        console.log(`Rate limit hit. Waiting ${waitTime}ms before retry... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await delay(waitTime);
        retryCount++;
        continue;
      }

      if (retryCount < MAX_RETRIES - 1) {
        retryCount++;
        const delayTime = getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        console.log(`Error occurred. Retrying in ${delayTime}ms...`);
        await delay(delayTime);
      } else {
        return {
          success: false,
          message: error.message || 'Unknown error occurred',
          details: {
            error: error
          }
        };
      }
    }
  }

  return {
    success: false,
    message: 'Failed to connect to Gemini API after multiple attempts',
    details: { retryCount }
  };
};

// Function to generate LinkedIn post
export const generateLinkedInPost = async (
  topic: string,
  postGoal: string,
  targetAudience: string[],
  tone: string,
  format: string,
  includeEmojis: boolean,
  includeHashtags: boolean,
  content: string,
  length: string,
  cta?: string,
  avoid?: string,
  references?: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new GeminiError('Gemini API key is not configured');
  }

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Ensure minimum time between requests
      await ensureRequestInterval();

      // Adjust maxOutputTokens based on length
      const maxTokens = {
        short: 400,
        medium: 800,
        long: 1200
      }[length] || 800;

      const prompt = `You are a LinkedIn content generator that uses proven psychological templates to craft high-performing LinkedIn posts tailored to the user's intent. Output only the final post in the format: Hook + Body + CTA (question), followed by relevant hashtags.

Generate a LinkedIn post in the format:

Hook line (MUST follow one of the 12 psychological hook templates below)

Post body (skimmable, clear, personalized, minimal fluff, minimal emojis)

Engagement question (relevant, open-ended, encourages comments)

Relevant hashtags (only domain-specific and appropriate; no generic or vague ones)

Mandatory Hook Templates (Choose one, do not modify format):

UNIQUE TRANSFORMATION — I went from [before] to [after] in [time]. Without [popular thing].
FAILURE STORY — I [ambitious action] in [timeframe]. [negative outcome].
MAKE PEOPLE FEEL SEEN — If you're [trait], but [objection] This post is for YOU.
STRONG DISAGREEMENT — "[quote]" [disagreement].
OPINION AS FACT — [Claim]. [Tease explanation].
REBELLION STORY — I was told [quote]. I ignored it. [Positive result].
TRIGGER FOMO — I wouldn't recommend this to everyone, but… [desirable outcome].
CONTRARIAN POST — You could be [trait]. But I would still [negative judgment].
SET A GOAL. SHOW YOUR PROCESS — I will [goal] in [timeframe]. Here's how.
SUBJECT MASTERCLASS — 60-second [topic] masterclass. This is how I [achievement] in [timeframe].
GOLDEN ADVICE — I've [action] in the last [timeframe]. [tease insight].
LEVERAGE FOFU — I've heard terrible advice on [topic]. But this is the worst.

Details:
Post Goal: ${postGoal}
Topic: ${topic}
Target Audience: ${targetAudience.join(', ')}
Tone: ${tone}
Format: ${format}
Length: ${length}
Emojis: ${includeEmojis ? 'Yes' : 'No'}
Hashtags: ${includeHashtags ? 'Yes' : 'No'}
Key Points: ${content}
CTA: ${cta || 'Not specified'}
Avoid: ${avoid || 'Not specified'}
References: ${references || 'Not specified'}

Additional Rules:
- For ${length} length, keep the post ${length === 'short' ? 'concise and to the point' : length === 'medium' ? 'balanced and informative' : 'detailed and comprehensive'}
- Limit to 2700 characters max
- No explanation
- No section headings like “Hook,” “Body,” or “CTA”
- Output ONLY the final LinkedIn post`;

      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxTokens,
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new GeminiError(
          error.error?.message || 'API request failed',
          response.status,
          response.status === 429
        );
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error('Error generating LinkedIn post:', error);
      
      if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
        const waitTime = getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        console.log(`Rate limit hit. Waiting ${waitTime}ms before retry... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await delay(waitTime);
        retryCount++;
        continue;
      }

      if (retryCount < MAX_RETRIES - 1) {
        retryCount++;
        const delayTime = getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        console.log(`Error occurred. Retrying in ${delayTime}ms...`);
        await delay(delayTime);
      } else {
        throw new GeminiError(
          error.message || 'Failed to generate LinkedIn post',
          error.status,
          error.message?.includes('rate limit')
        );
      }
    }
  }

  throw new GeminiError('Failed to generate LinkedIn post after multiple attempts');
}; 