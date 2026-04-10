export async function apiRequest(url, { method = 'GET', token, body } = {}) {
  const headers = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const raw = await response.text();
  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const error = new Error('Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function getAPI(url, token) {
  return apiRequest(url, { method: 'GET', token });
}

export async function postAPI(url, body, token) {
  return apiRequest(url, { method: 'POST', token, body });
}
