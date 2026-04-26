import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'

const schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit({ email, password }: FormData) {
    setServerError('')
    try {
      const result = await signUp(email, password)
      if (result?.session) {
        navigate('/app', { replace: true })
      } else {
        setEmailSent(true)
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao cadastrar. Tente novamente.',
      )
    }
  }

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="size-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="size-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Confirme seu email</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enviamos um link de confirmação. Verifique sua caixa de entrada e clique no link para ativar sua conta.
        </p>
        <Button variant="secondary" onClick={() => navigate('/login')} className="w-full">
          Ir para o login
        </Button>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Criar conta</h2>
      <p className="text-sm text-gray-500 mb-6">Preencha os dados para se cadastrar</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="Senha" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField label="Confirmar senha" error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
          Criar conta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}
