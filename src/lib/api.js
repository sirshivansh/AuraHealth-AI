/**
 * Client-side API service for communicating with the AuraHealth backend.
 */

import { API } from './constants';

/**
 * Sends a chat message and handles SSE streaming.
 * @param {string} message
 * @param {Array} history
 * @param {Function} [onChunk] - callback(chunkText, accumulatedText)
 * @returns {Promise<string>}
 */
export async function streamChat(message, history = [], onChunk) {
  const response = await fetch(API.CHAT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Server error communicating with AI.');
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        const payload = trimmed.slice(6);
        if (payload === '[DONE]') continue;

        try {
          const parsed = JSON.parse(payload);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text, fullText);
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }
    return fullText;
  }

  const data = await response.json();
  return data.response;
}

/**
 * Sends symptoms for structured AI analysis.
 * @param {Object} params - { symptoms, category, severity, duration }
 * @returns {Promise<Object>}
 */
export async function analyzeSymptoms(params) {
  const response = await fetch(API.SYMPTOMS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const report = await response.json();

  if (!response.ok) {
    throw new Error(report.error || 'Server error analyzing symptoms.');
  }

  return report;
}
