import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  // Prevent scrolling when modal is open
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
                Політика конфіденційності
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
              <div className="space-y-8 text-white/70 text-base sm:text-lg leading-relaxed">
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">1. Загальні положення</h3>
                  <p>Ця Політика конфіденційності розроблена відповідно до Закону України «Про захист персональних даних» та регулює порядок збору, обробки, використання та захисту особистої інформації клієнтів студії Katy Pole Dance.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">2. Збір та використання даних</h3>
                  <p className="mb-2">Ми збираємо лише ту інформацію, яку ви добровільно надаєте під час запису на тренування або зв'язку з нами:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ім'я та прізвище.</li>
                    <li>Номер телефону (для запису на заняття та зв'язку з адміністратором).</li>
                    <li>Нікнейм в Instagram або інших месенджерах.</li>
                  </ul>
                  <p className="mt-2">Ці дані використовуються виключно для організації вашого тренувального процесу, інформування про зміни в розкладі та надання якісних послуг.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">3. Захист персональних даних</h3>
                  <p>Студія Katy Pole Dance зобов'язується не передавати ваші персональні дані третім особам, крім випадків, передбачених чинним законодавством України. Ми вживаємо необхідних організаційних та технічних заходів для захисту ваших даних від несанкціонованого доступу.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">4. Використання фото та відео матеріалів</h3>
                  <p>Під час занять у студії може проводитись фото- та відеозйомка для соціальних мереж та маркетингових матеріалів. Якщо ви не бажаєте потрапляти в кадр, будь ласка, заздалегідь попередьте про це тренера або адміністратора.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">5. Права користувача</h3>
                  <p>Ви маєте право у будь-який момент дізнатися, які саме ваші дані ми зберігаємо, а також вимагати їх зміни або повного видалення з нашої бази. Для цього просто зв'яжіться з адміністратором.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">6. Контакти</h3>
                  <p>Якщо у вас виникли запитання щодо цієї політики або обробки ваших даних, звертайтесь за телефоном: <strong>+38 (066) 017 70 82</strong> або в наш Instagram: <strong>@katypoledance1</strong>.</p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
                  <p>Остання редакція: поточний рік.</p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
