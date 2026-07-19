import { useEffect, useRef, useState } from 'react'

export default function useInView(threshold = 0.1, rootMargin = '0px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
