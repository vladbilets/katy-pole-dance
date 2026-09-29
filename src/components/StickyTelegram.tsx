import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Send } from 'lucide-react';

/**
 * Закріплена кнопка «Написати в Telegram» — лише на телефоні.
 * З'являється після першого екрана і ховається біля блоку контактів та футера,
 * щоб не дублювати їх і не перекривати.
 */
export default function StickyTelegram() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const contact = document.getElementById('contact');
      const contactTop = contact ? contact.getBoundingClientRect().top : Infinity;
      const pastHero = y > vh * 0.8;
      const nearContact = contactTop < vh * 0.9;
      setVisible(pastHero && !nearContact);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="https://t.me/Katy_Taniuk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написати Катерині в Telegram"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="btn-brand md:hidden fixed z-30 left-0 right-0 mx-auto w-max inline-flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold text-white whitespace-nowrap"
          style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        >
          <Send className="w-5 h-5" />
          <span>Написати в Telegram</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
