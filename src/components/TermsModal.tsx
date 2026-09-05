import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Забороняємо скрол фону, коли модальне вікно відкрите
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop (Темний фон без розмиття для кращої продуктивності на мобільних з iframe) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/95"
            style={{ willChange: 'opacity' }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl"
          >
            {/* Header / Кнопка закриття */}
            <div className="flex justify-between items-center p-6 sm:p-8 pb-6 border-b border-white/10 shrink-0">
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight uppercase text-white pr-8">
                Умови використання абонемента
              </h2>
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0 z-10"
                aria-label="Закрити"
              >
                <X className="w-6 h-6 text-white/70" />
              </button>
            </div>

            {/* Scrollable Text Area */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar overscroll-contain text-left">
              <div className="space-y-6 text-white/70 text-base sm:text-lg leading-relaxed">
                <p><span className="text-white/40 font-mono mr-2">1.</span> Термін дії Абонементу починається з дати відвідування першого заняття щодо нього.</p>
                <p><span className="text-white/40 font-mono mr-2">2.</span> Дія Абонементу закінчується у разі відвідування оплаченої кількості занять або після закінчення терміну його дії.</p>
                <p><span className="text-white/40 font-mono mr-2">3.</span> Базовий груповий абонемент включає 8 занять підряд з врахуванням графіку занять групи, до якої Ви записані.</p>
                <p><span className="text-white/40 font-mono mr-2">4.</span> Пропущені заняття (незалежно від поважності причин пропуску) не переносяться на наступний термін після закінчення дії абонементу.</p>
                <p><span className="text-white/40 font-mono mr-2">5.</span> Пропущені заняття можна відпрацювати в іншій групі за домовленістю з тренером.</p>
                <p><span className="text-white/40 font-mono mr-2">6.</span> У випадку оплати першого абонементу – відпрацювання можливі виключно в межах його дії.</p>
                <p><span className="text-white/40 font-mono mr-2">7.</span> Система відпрацювань діє лише за наявності послідовно оплачених абонементів та не застосовується у випадку припинення (в тому числі тимчасового) занять та неоплати наступного абонементу.</p>
                <p><span className="text-white/40 font-mono mr-2">8.</span> У випадку наявності безперервних абонементів, відпрацювання занять можливе до лютого включно наступного календарного року. З 01 березня наступного календарного року пропущені заняття попереднього року не підлягають подальшому відпрацювання незалежно від поважності причин учня.</p>
                <p><span className="text-white/40 font-mono mr-2">9.</span> Пропущені заняття з різних абонементів не сумуються у новий абонемент.</p>
                <p><span className="text-white/40 font-mono mr-2">10.</span> Якщо абонемент закінчується, ми автоматично продовжуємо його дію, якщо учень не повідомляє про припинення занять. У разі відсутності учня на першому занятті нового абонемента оплата рахується по графіку, а пропущене заняття залишається на відпрацювання. Якщо учень не бажає автоматично продовжити абонемент, дія абонементу припиняється з дати його закінчення, а не відпрацьовані заняття згорають.</p>
                <p><span className="text-white/40 font-mono mr-2">11.</span> З припиненням абонементу місце в групі не зберігається.</p>
                
                <h3 className="text-xl sm:text-2xl font-bold mt-12 mb-6 text-white uppercase tracking-tight">Запис на індивідуальні заняття</h3>
                <div className="space-y-4">
                  <p><span className="text-white/40 font-mono mr-2">12.</span> Запис на індивідуальні заняття здійснюється лише за номером <strong>+38 (066) 017 70 82</strong>, бронь години заняття здійснюється після оплати заняття наперед.</p>
                  <p><span className="text-white/40 font-mono mr-2">13.</span> У випадку, якщо учень бажає перенести після оплати заняття, він зобов’язаний повідомити дзвінком адміністратора (<strong>+38 (066) 017 70 82</strong>) не пізніше як за 4 години до зазначеного часу, або до 21.00 попереднього дня (якщо заняття призначене до 12.00 включно), тоді кошти можуть переноситися на інший узгоджений час, в межах місяця з дня першого запису.</p>
                  <p className="bg-red-950/20 border border-red-500/20 p-4 rounded-xl text-red-100/90"><span className="text-red-400/50 font-mono mr-2">14.</span> Якщо ж попередження про відміну заняття замовником було здійснено менш як за 4 години, то <strong className="text-red-400 font-medium">кошти не повертаються</strong>.</p>
                </div>

                <div className="mt-16 pt-10 border-t border-white/10 text-center font-medium text-white/90 text-lg">
                  <p className="mb-2">Дякуємо, що поважаєте нашу працю і наші правила!</p>
                  <p className="text-white">Ми завжди стараємося бути кращими для Вас!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
