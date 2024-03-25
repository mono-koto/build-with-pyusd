export function shortHash(hash: `0x${string}`): `0x${string}` {
  return hash.slice(0, 8) as `0x${string}`;
}
