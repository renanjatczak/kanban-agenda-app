import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/ui/FormField'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/app'

  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit({ email, password }: FormData) {
    setServerError('')
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.',
      )
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h2>
      <p className="text-sm text-gray-500 mb-6">Entre com sua conta para continuar</p>

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
            placeholder="••••••••"
            autoComplete="current-password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-indigo-600 font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </>
  )
}
