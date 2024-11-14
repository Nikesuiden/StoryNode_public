'use client'

import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// CredentialResponse インターフェースを定義
interface CredentialResponse {
  credential: string
  select_by?: string
}

// グローバルに 'google' オブジェクトを宣言
declare global {
  interface Window {
    google?: any
  }
}

const OneTapComponent = () => {
  const supabase = createClient()
  const router = useRouter()

  // Google IDトークンのサインインに使用するノンスを生成
  const generateNonce = async (): Promise<string[]> => {
    const randomValues = window.crypto.getRandomValues(new Uint8Array(32))
    let randomString = ''
    for (let i = 0; i < randomValues.length; i++) {
      randomString += String.fromCharCode(randomValues[i])
    }
    const nonce = btoa(randomString)
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = new Uint8Array(hashBuffer)
    let hashedNonce = ''
    for (let i = 0; i < hashArray.length; i++) {
      hashedNonce += hashArray[i].toString(16).padStart(2, '0')
    }

    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = async () => {
      console.log('Initializing Google One Tap')
      const [nonce, hashedNonce] = await generateNonce()
      console.log('Nonce: ', nonce, hashedNonce)

      // 既存のセッションがあるか確認
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session', error)
      }
      if (data.session) {
        router.push('/')
        return
      }

      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: async (response: CredentialResponse) => {
            try {
              // SupabaseにIDトークンを送信
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              })

              if (error) throw error
              console.log('Session data: ', data)
              console.log('Successfully logged in with Google One Tap')

              // リダイレクト
              router.push('/')
            } catch (error) {
              console.error('Error logging in with Google One Tap', error)
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        })
        window.google.accounts.id.prompt()
      } else {
        console.error('Google One Tap is not available.')
      }
    }

    initializeGoogleOneTap()
  }, [supabase, router])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  )
}

export default OneTapComponent
