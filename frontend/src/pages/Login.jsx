import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function validate() {
    const e = {}
    if (!form.email) e.email = 'E-mail obrigatório'
    if (!form.password) e.password = 'Senha obrigatória'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setApiError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(e2 => ({ ...e2, [e.target.name]: '' }))
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse sua conta para continuar"
      footer={<>Novo por aqui? <Link to="/register">Criar conta</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="E-mail"
          type="email"
          name="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Senha"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        {apiError && <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 16 }}>{apiError}</p>}
        <Button type="submit" loading={loading}>Entrar</Button>
      </form>
    </AuthLayout>
  )
}