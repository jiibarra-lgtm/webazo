import type { PopupConfig } from '@/lib/types';
import { Logo } from '@/components/Icons';

/** Vista previa estática del primer paso del popup, tal como lo ve el visitante. */
export default function PopupPreview({ config }: { config: PopupConfig }) {
  return (
    <div className="popup-preview-frame" aria-label="Vista previa del popup">
      <div className="pop" style={{ animation: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.15)', maxHeight: 'none' }}>
        <div className="pop-body">
          <div className="pop-top">
            <Logo />
            <ol className="pop-steps" style={{ marginRight: 0 }}><li className="on" /><li /><li /></ol>
          </div>
          <span className="pop-eyebrow">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p className="pop-text">{config.text}</p>
          <div className="pop-choices">
            <span className="btn btn-orange">{config.cta}</span>
            <span className="pop-no">No, ya tengo todos los clientes que necesito</span>
          </div>
        </div>
        <div className="pop-art">
          <div className="pop-art-offer-wrap">
            <span className="pop-art-offer">{config.offer}</span>
            <span className="pop-art-sub">en tu primer webazo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
