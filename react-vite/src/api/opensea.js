const API_ROOT = '/api/opensea';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenSea proxy ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getCollection(slug, { sample = false } = {}) {
  if (!slug && !sample) throw new Error('Missing collection slug');
  const targetSlug = slug || 'sample';
  const url = `${API_ROOT}/collections/${encodeURIComponent(targetSlug)}${sample ? '?sample=true' : ''}`;
  return fetchJson(url);
}

export async function getListingsByCollection(slug, { limit = 5, sample = false } = {}) {
  if (!slug && !sample) throw new Error('Missing collection slug');
  const targetSlug = slug || 'sample';
  const sampleParam = sample ? '?sample=true' : `?limit=${limit}`;
  const url = `${API_ROOT}/collections/${encodeURIComponent(targetSlug)}/listings${sampleParam}`;
  return fetchJson(url);
}

export async function getCollections({ limit = 20, cursor, sample = false, chain, orderBy } = {}) {
  const params = new URLSearchParams();
  params.set('limit', limit);
  if (cursor) params.set('next', cursor);
  if (chain) params.set('chain', chain);
  if (sample) params.set('sample', 'true');
  if (orderBy) params.set('order_by', orderBy);
  const url = `${API_ROOT}/collections?${params.toString()}`;
  return fetchJson(url);
}
