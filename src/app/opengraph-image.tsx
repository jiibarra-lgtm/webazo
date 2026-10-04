import { ImageResponse } from 'next/og';

export const alt = 'Webazo: No hagas una web. Hacé un webazo.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#111111', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 120, fontWeight: 800, letterSpacing: -6 }}>
          webaz
          <div style={{ width: 70, height: 70, borderRadius: 35, background: '#FF5A1F', marginLeft: 4, marginBottom: 24, display: 'flex' }} />
        </div>
        <div style={{ fontSize: 52, marginTop: 30, display: 'flex' }}>No hagas una web. Hacé un webazo.</div>
        <div style={{ display: 'flex', marginTop: 36 }}>
          <div style={{ background: '#FF5A1F', color: '#111', fontSize: 32, fontWeight: 700, padding: '14px 30px', borderRadius: 999 }}>Online en 72 hs</div>
        </div>
      </div>
    ),
    size,
  );
}
