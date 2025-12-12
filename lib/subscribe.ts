/**
 * Subscribe Service
 * 
 * This module handles the email subscription logic.
 * Currently uses a fake implementation, but can be easily replaced
 * with a real API call by modifying the `subscribe` function.
 * 
 * To connect to a real backend:
 * 1. Set NEXT_PUBLIC_SUBSCRIBE_API_URL in your .env.local file
 * 2. The subscribe function will automatically use the real endpoint
 * 
 * Example .env.local:
 * NEXT_PUBLIC_SUBSCRIBE_API_URL=https://api.example.com/subscribe
 * 
 * Or for a Next.js API route:
 * NEXT_PUBLIC_SUBSCRIBE_API_URL=/api/subscribe
 */

export interface SubscribeData {
  email: string;
  name?: string;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

// Get the API URL from environment variable
const SUBSCRIBE_API_URL = process.env.NEXT_PUBLIC_SUBSCRIBE_API_URL;

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

/**
 * Validates the subscribe form data
 */
export function validateSubscribeData(data: SubscribeData): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error!;
  }

  // Name is optional, but if provided, should be at least 2 characters
  if (data.name && data.name.trim().length > 0 && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Fake subscribe implementation for development
 * Simulates a 1-2 second API delay
 */
async function fakeSubscribe(data: SubscribeData): Promise<SubscribeResult> {
  // Simulate network delay (1-2 seconds)
  const delay = 1000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate occasional "already subscribed" response
  if (data.email.includes('test@')) {
    return {
      success: true,
      message: 'You\'re already on our list! We\'ll keep you posted.',
    };
  }

  // Log the subscription data (for development)
  console.log('[FakeSubscribe] New subscription:', {
    email: data.email,
    name: data.name || '(not provided)',
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    message: 'Thanks! We\'ll keep you posted about our launch.',
  };
}

/**
 * Real API subscribe implementation
 * Used when NEXT_PUBLIC_SUBSCRIBE_API_URL is set
 */
async function apiSubscribe(data: SubscribeData): Promise<SubscribeResult> {
  try {
    const response = await fetch(SUBSCRIBE_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Subscription failed',
        error: result.error || `Server error: ${response.status}`,
      };
    }

    return {
      success: true,
      message: result.message || 'Thanks! We\'ll keep you posted about our launch.',
    };
  } catch (error) {
    console.error('[Subscribe] API error:', error);
    return {
      success: false,
      message: 'Subscription failed',
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Main subscribe function
 * 
 * Automatically uses the real API if NEXT_PUBLIC_SUBSCRIBE_API_URL is set,
 * otherwise falls back to the fake implementation.
 */
export async function subscribe(data: SubscribeData): Promise<SubscribeResult> {
  // Validate data first
  const validation = validateSubscribeData(data);
  if (!validation.valid) {
    return {
      success: false,
      message: 'Validation failed',
      error: Object.values(validation.errors).join(', '),
    };
  }

  // Log which implementation we're using
  if (SUBSCRIBE_API_URL) {
    console.log('[Subscribe] Using API endpoint:', SUBSCRIBE_API_URL);
    return apiSubscribe(data);
  } else {
    console.log('[Subscribe] Using fake implementation (no API URL configured)');
    console.log('[Subscribe] Set NEXT_PUBLIC_SUBSCRIBE_API_URL to connect to a real backend');
    return fakeSubscribe(data);
  }
}
