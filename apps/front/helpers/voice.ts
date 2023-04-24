import { Lang } from 'database'

export function getVoiceLink(word: string): string {
  word = window.btoa(word)
  return `https://voice.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=Heather22k?inputText=${word}`
}

export function speak(word: string, lang: Lang) {
  if (String(lang) === 'uk') {
    // responsiveVoice.getVoices()
    window.responsiveVoice.speak(word, 'Ukrainian Female')
    // return new Audio(getVoiceLink(word)).play()
  }

  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = word
      msg.volume = 1
      msg.rate = 1.2
      msg.pitch = 1

      const voices = speechSynthesis.getVoices()

      // @ts-ignore
      msg.voice = voices.find((params) => params.lang && params.lang.startsWith(lang))

      if (!msg.voice) {
        const availableLanguages = [...new Set([...voices].map((v) => `"${v.lang.slice(0, 2)}"`))].join(', ')

        const languageError = availableLanguages
          ? 'Dostępne języki: ' + availableLanguages
          : 'Jeśli chcesz korzystać z tej funkcjonalności spróbuj odwiedzić stronę za pomocą Google Chrome'

        reject(new Error(`Twoja przeglądarka nie obsługuje języka o kodzie "${lang}". ${languageError}.`))
      } else {
        msg.onend = resolve
        msg.onerror = reject

        window.speechSynthesis.speak(msg)
      }
    } else {
      reject(new Error('Twoje przeglądarka nie obsługuje interfejsu speechSynthesis.'))
    }
  })
}
