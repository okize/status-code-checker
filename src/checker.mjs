const checkUrl = async (url) => {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'status-code-checker/1.0',
      },
      redirect: 'follow',
    });
    return { url, status: response.status };
  } catch (error) {
    const cause = error.cause || error;
    return {
      url,
      error: cause.code === 'ECONNREFUSED'
        ? 'Connection refused'
        : cause.message || error.message,
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
