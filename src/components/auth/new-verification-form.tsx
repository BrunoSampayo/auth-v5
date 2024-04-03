'use client'

import { useSearchParams } from 'next/navigation'
import { BeatLoader } from 'react-spinners'
import { CardWrapper } from './card-wrapper'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/new-verification'
import { FormSucess } from '../form-sucess'
import { FormError } from '../form-error'

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [sucess, setSucess] = useState<string | undefined>('')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const onSubmit = useCallback(() => {
    if (!token) {
      setError('Missing token!')
      return
    }
    newVerification(token)
      .then((data) => {
        setSucess(data?.success)
        setError(data?.error)
      })
      .catch(() => {
        setError('Something went wrong')
      })
  }, [token])
  useEffect(() => {
    onSubmit()
  }, [onSubmit])
  return (
    <CardWrapper
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      headerLabel="Confirming your verification"
    >
      <div className="flex items-center w-full justify-center">
        {!sucess && !error && <BeatLoader />}

        <FormSucess message={sucess} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  )
}
