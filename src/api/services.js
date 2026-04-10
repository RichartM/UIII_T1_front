import { apiRequest } from './http';
import { API_BASE } from '../utils/env';

export function loginUser(body) {
  return apiRequest(`${API_BASE.eq1}/api/users/login/`, {
    method: 'POST',
    body,
  });
}

export function registerUser(body) {
  return apiRequest(`${API_BASE.eq1}/api/users/register/`, {
    method: 'POST',
    body,
  });
}

export function getUserProfile(userId, token) {
  return apiRequest(`${API_BASE.eq1}/api/users/${userId}/profile/`, {
    method: 'GET',
    token,
  });
}

export function listProducts(token) {
  return apiRequest(`${API_BASE.eq2}/api/products/`, {
    method: 'GET',
    token,
  });
}

export function getProduct(productId, token) {
  return apiRequest(`${API_BASE.eq2}/api/products/${productId}/`, {
    method: 'GET',
    token,
  });
}

export function createProduct(body, token) {
  return apiRequest(`${API_BASE.eq2}/api/products/`, {
    method: 'POST',
    body,
    token,
  });
}

export function updateProduct(productId, body, token) {
  return apiRequest(`${API_BASE.eq2}/api/products/${productId}/`, {
    method: 'PUT',
    body,
    token,
  });
}

export function deleteProduct(productId, token) {
  return apiRequest(`${API_BASE.eq2}/api/products/${productId}/`, {
    method: 'DELETE',
    token,
  });
}

export function createOrder(body, token) {
  return apiRequest(`${API_BASE.eq3}/api/orders/create/`, {
    method: 'POST',
    body,
    token,
  });
}

export function listUserOrders(userId, token) {
  return apiRequest(`${API_BASE.eq3}/api/orders/user/${userId}/`, {
    method: 'GET',
    token,
  });
}

export function getOrder(orderId, token) {
  return apiRequest(`${API_BASE.eq3}/api/orders/${orderId}/`, {
    method: 'GET',
    token,
  });
}

export function getOrderStatus(orderId, token) {
  return apiRequest(`${API_BASE.eq3}/api/orders/${orderId}/status/`, {
    method: 'GET',
    token,
  });
}

export function updateOrder(orderId, body, token) {
  return apiRequest(`${API_BASE.eq3}/api/orders/${orderId}/update/`, {
    method: 'PATCH',
    body,
    token,
  });
}

export function processPayment(body, token) {
  return apiRequest(`${API_BASE.eq4}/api/payments/process/`, {
    method: 'POST',
    body,
    token,
  });
}
