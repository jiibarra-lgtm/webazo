import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#FF5A1F', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 96 }}>
        <div style={{ fontSize: 340, fontWeight: 800, color: '#111111', marginTop: -40, display: 'flex' }}>w</div>
      </div>
    ),
    size,
  );
}
