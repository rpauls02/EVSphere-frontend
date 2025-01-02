import axios from 'axios';

// Define the API endpoint
const CLOUD_RUN_URL = process.env.REACT_APP_CLOUD_RUN_API_URL || 'http://localhost:5000/api/google-maps-embed';

export const getGoogleMapsEmbed = async () => {
  try {
    const response = await axios.get(CLOUD_RUN_URL);
    return response.data.embedUrl; // Expecting an embedUrl field in the response
  } catch (error) {
    console.error('Error fetching Google Maps embed URL:', error);
    throw error;
  }
};