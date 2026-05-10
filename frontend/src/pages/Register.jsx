import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Button from '../components/Button'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function validate() {
    const e = {}
    if (!form.name) e.name = 'Nome obrigatório'
    if (!form.email) e.email = 'E-mail obrigatório'
    if (!form.password) e.password = 'Senha obrigatória'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirm) e.confirm = 'As senhas não coincidem'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) return setErrors(e2)
    setLoading(true)
    setApiError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ') || 'Erro ao criar conta'
      setApiError(msg)
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
      title="Criar conta"
      subtitle="Comece a aprender e ensinar hoje"
      footer={<>Já tem conta? <Link to="/login">Entrar</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Nome" type="text" name="name" placeholder="Seu nome" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="E-mail" type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Senha" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField label="Confirmar senha" type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} error={errors.confirm} />
        {apiError && <p style={{ color: 'var(--error)', fontSize: 13, marginBottom: 16 }}>{apiError}</p>}
        <Button type="submit" loading={loading}>Criar conta</Button>
      </form>
    </AuthLayout>
  )
}