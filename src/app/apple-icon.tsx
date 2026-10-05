import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#FF5A1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 120, fontWeight: 800, color: '#111111', marginTop: -14, display: 'flex' }}>w</div>
      </div>
    ),
    size,
  );
}
