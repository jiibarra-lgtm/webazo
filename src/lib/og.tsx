import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

/** Imagen para compartir (WhatsApp, Facebook, Google Discover) con título propio. */
export function ogImage(eyebrow: string, title: string) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#111111', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72 }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#FF5A1F' }}>{eyebrow}</div>
        <div style={{ display: 'flex', fontSize: title.length > 48 ? 64 : 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 56, fontWeight: 800, letterSpacing: -3 }}>
            webaz<div style={{ width: 32, height: 32, borderRadius: 16, background: '#FF5A1F', marginLeft: 2, marginBottom: 10, display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', background: '#FF5A1F', color: '#111', fontSize: 28, fontWeight: 700, padding: '12px 26px', borderRadius: 999 }}>webazo.com.ar</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
