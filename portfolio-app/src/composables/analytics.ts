// Performance and navigation monitoring through Microsoft Clarity
// Loaded only when cookies are accepted

declare global {
  interface Window {
    clarity?: ClarityFunction
  }
}

type ClarityFunction = {
  (...args: unknown[]): void
  q?: unknown[][]
}

export function loadClarity(): void {
  console.log('Clarity loading')
  if (window.clarity) return

  window.clarity = function (...args: unknown[]) {
    window.clarity?.q?.push(args)
  }

  window.clarity.q = []

  const script = document.createElement('script')

  script.async = true
  script.src = 'https://www.clarity.ms/tag/wpe7033n5w'

  document.head.appendChild(script)

  console.log('Clarity loaded' + script.src)
}
