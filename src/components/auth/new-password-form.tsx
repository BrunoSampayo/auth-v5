'use client'
import { CardWrapper } from './card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPasswordSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FormError } from '@/components/form-error'
import { FormSucess } from '@/components/form-sucess'
import { useState, useTransition } from 'react'
import { newPassword } from '@/actions/new-password'
import { useSearchParams } from 'next/navigation'
export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [sucess, setSucess] = useState<string | undefined>('')
  const [isPending, starTransition] = useTransition()
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    mode: 'onBlur',
    defaultValues: { password: '', confirm: '' },
  })
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError('')
    setSucess('')
    if (!token) {
      setError('Missing token!')
      return
    }

    starTransition(() => {
      newPassword(token, values).then((data) => {
        setError(data?.error)
        setSucess(data?.success)
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="Change your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSucess message={sucess} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Save Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
