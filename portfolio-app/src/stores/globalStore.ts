import { loadClarity } from '@/composables/analytics'
import { ref } from 'vue'

export const showCookiesPopup = ref<boolean>(false)

export const middleMouseclickAppened = ref<boolean>(false)
export const tutoShowed = ref<boolean>(false)

export function checkCookiesConsent() {
  const status = localStorage.getItem('cookies')
  if (status === 'accepted') {
    return 'accepted'
  } else if (status === 'declined') {
    return 'declined'
  } else {
    return 'prompt'
  }
}

export function acceptCookies() {
  localStorage.setItem('cookies', 'accepted')
  console.log('Cookies accepted')
  loadClarity()
}

export function rejectCookies() {
  localStorage.setItem('cookies', 'declined')
  console.log('Cookies declined')
}

export function initCookieConsent() {
  const consent = localStorage.getItem('cookies')

  if (consent === 'accepted') {
    loadClarity()
  }
}
