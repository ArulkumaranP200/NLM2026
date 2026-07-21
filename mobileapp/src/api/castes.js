import api from './client';

export async function fetchCastes(religion) {
  try {
    const { data } = await api.get('/profiles/castes/', { params: religion ? { religion } : {} });
    return data;
  } catch {
    return [];
  }
}
