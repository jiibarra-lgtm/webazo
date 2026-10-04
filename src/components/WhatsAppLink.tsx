'use client';
import { useEffect, useState } from 'react';
import { trackContact } from '@/lib/tracking';
import { whatsappUrl } from '@/lib/whatsapp';
import { COUPON_EVENT, readCoupon } from '@/lib/coupon-client';

type Props = {
  message: string;
  label: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function WhatsAppLink({ message, label, className, children, ariaLabel }: Props) {
  const [msg, setMsg] = useState(message);
  useEffect(() => {
    const sync = () => {
      const c = readCoupon();
      setMsg(c ? `${message} (tengo el cupón ${c.code})` : message);
    };
    sync();
    window.addEventListener(COUPON_EVENT, sync);
    return () => window.removeEventListener(COUPON_EVENT, sync);
  }, [message]);

  return (
    <a href={whatsappUrl(msg)} target="_blank" rel="noopener" className={className} aria-label={ariaLabel} onClick={() => trackContact(label)}>
      {children}
    </a>
  );
}
