export async function loadRequests() {
  const res = await fetch('/data.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load data.json: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  // Normalize shape to keep UI resilient to partial data.
  return data
    .map((r) => ({
      id: r?.id,
      category: r?.category ?? '',
      address: r?.address ?? '',
      status: r?.status ?? '',
      created_at: r?.created_at ?? '',
      description: r?.description ?? '',
      photo: r?.photo ?? '',
      latitude: typeof r?.latitude === 'number' ? r.latitude : Number(r?.latitude),
      longitude: typeof r?.longitude === 'number' ? r.longitude : Number(r?.longitude),
    }))
    .filter((r) => r.id != null);
}
