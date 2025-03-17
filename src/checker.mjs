import axios from 'axios';

const checkUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      validateStatus: () => true,
      timeout: 5000,
      headers: {
        'User-Agent': 'status-code-checker/1.0',
      },
    });
    return { url, status: response.status };
  } catch (error) {
    return { 
      url, 
      error: error.code === 'ECONNREFUSED' 
        ? 'Connection refused' 
        : error.message, 
    };
  }
};

const checkUrls = async (urls) => {
  const promises = urls.map(url => {
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    return checkUrl(urlWithProtocol);
  });
  
  return Promise.all(promises);
};

export { checkUrls, checkUrl };
