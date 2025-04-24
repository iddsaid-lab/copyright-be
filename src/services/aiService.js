import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Extract audio features (hash) using Python microservice (librosa, etc.)
export async function extractAudioFeatures(audioFilePath) {
  try {
    const form = new FormData();
    form.append('audio', fs.createReadStream(audioFilePath));
    const response = await axios.post(process.env.AI_SERVICE_URL, form, {
      headers: form.getHeaders(),
      timeout: 30000
    });
    if (!response.data || !response.data.hash) {
      throw new Error('Invalid response from AI microservice');
    }
    return response.data; // { hash: 'unique-hash' }
  } catch (err) {
    throw new Error('AI feature extraction failed: ' + err.message);
  }
}
