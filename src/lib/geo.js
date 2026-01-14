export function isFiniteNumber(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

export function hasValidCoordinates(r) {
  return isFiniteNumber(r?.latitude) && isFiniteNumber(r?.longitude);
}

export function getMapCenter(requests) {
  const first = (requests ?? []).find(hasValidCoordinates);
  if (first) return [first.latitude, first.longitude];
  // fallback: Astana-ish
  return [51.1605, 71.4704];
}
