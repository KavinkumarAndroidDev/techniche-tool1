// OpenAI Integration Service
import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for browser usage
});

// Maximum number of retries
const MAX_RETRIES = 3;
// Base delay in milliseconds
const BASE_DELAY = 20000; // 20 seconds

// Request throttling
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between requests
let consecutiveRateLimits = 0;
const MAX_CONSECUTIVE_RATE_LIMITS = 3;

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get random delay with jitter
const getRandomDelay = (baseDelay: number) => {
  const jitter = Math.random() * 0.3 * baseDelay; // 30% jitter
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
class OpenAIError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly retryAfter?: number,
    public readonly isQuotaError: boolean = false,
    public readonly isRateLimit: boolean = false
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export interface OpenAIRequest {
  postGoal: string;
  topic: string;
  targetAudience: string[];
  tone: string;
  format: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  content: string;
  cta: string;
  avoid: string;
  references: string;
}

export const generateLinkedInPost = async (formData: OpenAIRequest): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new OpenAIError('OpenAI API key is not configured');
  }

  const prompt = `Generate a LinkedIn post in the format:

Hook line (MUST follow one of the 12 psychological hook templates below)

Post body (skimmable, minimal emojis, personalized, must answer the hook clearly)

Engagement question (relevant, open-ended, encourages comments)

Relevant hashtags (only domain-specific and appropriate)

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
Post Goal: ${formData.postGoal}
Topic: ${formData.topic}
Target Audience: ${formData.targetAudience.join(', ')}
Tone: ${formData.tone}
Format: ${formData.format}
Emojis: ${formData.includeEmojis ? 'Include minimal emojis' : 'No emojis'}
Hashtags: ${formData.includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}
Content: ${formData.content}
CTA: ${formData.cta}
Avoid: ${formData.avoid}
References: ${formData.references}

Additional Rules:
- Limit to 2700 characters max
- No explanation
- No headings
- Only output the post`;

  let retryCount = 0;
  let lastError: OpenAIError | null = null;

  while (retryCount < MAX_RETRIES) {
    try {
      // Reset consecutive rate limits counter on new attempt
      if (retryCount === 0) {
        consecutiveRateLimits = 0;
      }

      // Ensure minimum time between requests
      await ensureRequestInterval();

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a LinkedIn content generator that uses structured templates to create high-performing LinkedIn posts. Output only the final post in the format: Hook + Body + CTA + Hashtags.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      return completion.choices[0].message.content?.trim() || '';
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      if (error.status === 429) {
        consecutiveRateLimits++;
        
        if (consecutiveRateLimits >= MAX_CONSECUTIVE_RATE_LIMITS) {
          throw new OpenAIError(
            'Too many consecutive rate limits. Please wait a few minutes before trying again.',
            429
          );
        }

        const retryAfter = error.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        
        console.log(`Rate limit hit. Waiting ${waitTime}ms before retry... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await delay(waitTime);
        retryCount++;
        continue;
      }

      if (error.message?.includes('quota')) {
        throw new OpenAIError(
          'You have exceeded your API quota. Please upgrade your plan or try again later.',
          error.status
        );
      }

      lastError = new OpenAIError(
        error.message || 'Unknown error occurred',
        error.status
      );

      if (retryCount < MAX_RETRIES - 1) {
        retryCount++;
        const delayTime = getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        console.log(`Error occurred. Retrying in ${delayTime}ms...`);
        await delay(delayTime);
      } else {
        break;
      }
    }
  }

  throw new OpenAIError(
    lastError?.message || 'Failed to generate post after multiple attempts. Please try again later.',
    lastError?.statusCode
  );
};

// Test function to verify API connectivity
export const testOpenAIConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      message: 'OpenAI API key is not configured',
    };
  }

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // Reset consecutive rate limits counter on new attempt
      if (retryCount === 0) {
        consecutiveRateLimits = 0;
      }

      // Ensure minimum time between requests
      await ensureRequestInterval();

      console.log('Testing OpenAI API connection...');
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say "API test successful" if you can read this.'
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
      });

      // Reset consecutive rate limits on success
      consecutiveRateLimits = 0;
      
      console.log('OpenAI API Test Successful:', completion);
      return {
        success: true,
        message: 'API connection successful',
        details: {
          model: completion.model,
          response: completion.choices[0].message.content
        }
      };
    } catch (error: any) {
      console.error('OpenAI API Test Error:', error);
      
      // Check for quota exceeded error
      if (error.message?.includes('quota') || error.message?.includes('billing')) {
        return {
          success: false,
          message: 'API quota exceeded. Please check your OpenAI account billing and plan details.',
          details: {
            status: error.status,
            error: error.message,
            isQuotaError: true,
            isRateLimit: false
          }
        };
      }
      
      if (error.status === 429) {
        consecutiveRateLimits++;
        
        if (consecutiveRateLimits >= MAX_CONSECUTIVE_RATE_LIMITS) {
          return {
            success: false,
            message: 'Too many consecutive rate limits. Please wait a few minutes before trying again.',
            details: { 
              status: 429,
              isRateLimit: true,
              isQuotaError: false
            }
          };
        }

        const retryAfter = error.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : getRandomDelay(BASE_DELAY * Math.pow(2, retryCount));
        
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
            status: error.status,
            error: error
          }
        };
      }
    }
  }

  return {
    success: false,
    message: 'Failed to connect to OpenAI API after multiple attempts',
    details: { retryCount }
  };
};
