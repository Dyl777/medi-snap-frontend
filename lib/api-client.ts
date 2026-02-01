/**
 * API Client Configuration
 * Handles all communication with the backend
 */

export interface InterpretationResponse {
  id: string;
  interpretation: {
    summary: string;
    sections: Array<{
      original: string;
      simplified: string;
      terms: Array<{
        term: string;
        definition: string;
        importance: 'high' | 'medium' | 'low';
      }>;
    }>;
    medicalTerms?: string[];
    warnings: string[];
    nextSteps: string[];
  };
  document_type: string;
  confidence: number;
  processingTime: number;
}

export interface ApiError {
  error: string;
  details?: string;
  statusCode: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Upload document and get interpretation
 */
export async function interpretDocument(
  file: File,
  signal?: AbortSignal
): Promise<InterpretationResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/interpret/`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw new Error(errorData.error || `API Error: ${response.statusCode}`);
    }

    const data = (await response.json()) as InterpretationResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to interpret document: ${error.message}`);
    }
    throw new Error('Failed to interpret document: Unknown error');
  }
}

/**
 * Send follow-up question about interpretation
 */
export async function askQuestion(
  questionId: string,
  question: string,
  signal?: AbortSignal
): Promise<{ answer: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: questionId,
        question,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw new Error(errorData.error || `API Error: ${response.statusCode}`);
    }

    const data = (await response.json()) as { answer: string };
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to ask question: ${error.message}`);
    }
    throw new Error('Failed to ask question: Unknown error');
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload JPG, PNG, or PDF files.',
    };
  }

  return { valid: true };
}
