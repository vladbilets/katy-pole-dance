import { useEffect, useState } from 'react';

const MOBILE_MQ = '(max-width: 900px)';
const REDUCED_MQ = '(prefers-reduced-motion: reduce)';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Налаштування анімації появи секцій.
 *
 * На десктопі — як було: зсув по вертикалі, каскад по картках, довга плавна крива.
 *
 * На мобільних вона навмисно спрощена. Кожна картка з `y`-зсувом — це окремий
 * композитний шар, який WebKit перерастеризовує під час скролу; коли таких шарів
 * чотири та ще й з блюром і великою тінню, вони не встигають перемалюватись і
 * блимають. Тому на телефоні анімується лише прозорість, без каскаду.
 *
 * Також враховується системне «зменшити рух».
 */
function isLight() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_MQ).matches || window.matchMedia(REDUCED_MQ).matches;
}

export function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return mobile;
}

export function useReveal() {
  const [light, setLight] = useState(isLight);

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ);
    const reduced = window.matchMedia(REDUCED_MQ);
    const onChange = () => setLight(mobile.matches || reduced.matches);
    mobile.addEventListener('change', onChange);
    reduced.addEventListener('change', onChange);
    return () => {
      mobile.removeEventListener('change', onChange);
      reduced.removeEventListener('change', onChange);
    };
  }, []);

  /** index — порядковий номер картки в сітці, для каскаду на десктопі */
  return function reveal(index = 0) {
    if (light) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        // amount замість від'ємного margin: rootMargin ламається на iOS,
        // бо адресний рядок згортається під час скролу і viewport змінює висоту
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: 'easeOut' },
      } as const;
    }

    return {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { delay: index * 0.15, duration: 1, ease: EASE },
    } as const;
  };
}
