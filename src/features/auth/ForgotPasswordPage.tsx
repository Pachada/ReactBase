import {
  Anchor,
  Button,
  Center,
  PinInput,
  PasswordInput,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { CheckCircle, Zap } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '@/core/api/http-client'
import { ApiError } from '@/core/api/ApiError'
import type { AuthEnvelope } from '@/core/api/types'
import { useAuth } from '@/core/auth/AuthContext'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'

type Step = 0 | 1 | 2 // 2 = done

export function ForgotPasswordPage() {
  const { addNotification } = useNotificationCenter()
  const { loginWithEnvelope } = useAuth()
  const navigate = useNavigate()
  const { colorScheme } = useMantineColorScheme()
  const [step, setStep] = useState<Step>(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Step 0 — email form
  const emailForm = useForm<{ email: string }>({
    defaultValues: { email: '' },
    mode: 'onBlur',
  })
  // Step 1 — OTP + new password (combined)
  const pwdForm = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  })

  async function handleEmailSubmit(values: { email: string }) {
    setIsLoading(true)
    try {
      await apiClient.request('/v1/password-recovery/request', {
        method: 'POST',
        body: { email: values.email },
      })
      setEmail(values.email)
      setStep(1)
    } catch (error) {
      // Always show a generic message to avoid leaking whether an email is registered
      if (error instanceof ApiError && error.status === 404) {
        setEmail(values.email)
        setStep(1)
        return
      }
      emailForm.setError('email', { message: 'Could not send OTP. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyAndReset(values: {
    password: string
    confirmPassword: string
  }) {
    if (otp.length < 6) {
      addNotification({
        title: 'Code required',
        message: 'Enter the 6-digit code first.',
        color: 'orange',
      })
      return
    }
    setIsLoading(true)
    try {
      // Step 1: validate OTP → get temporary auth tokens
      const envelope = await apiClient.request<AuthEnvelope>(
        '/v1/password-recovery/validate-code',
        { method: 'POST', body: { otp, email } },
      )
      if (!envelope?.access_token) throw new Error('Invalid response')

      // Step 2: change password using the temporary token
      await apiClient.request('/v1/password-recovery/change-password', {
        method: 'POST',
        token: envelope.access_token,
        body: { new_password: values.password, current_password: '' },
      })

      // Auto-login with the envelope; fall through to success screen on failure
      try {
        await loginWithEnvelope(envelope)
        navigate('/')
      } catch {
        setStep(2)
      }
    } catch (error) {
      let message = 'Please check your code and try again.'
      if (error instanceof ApiError) {
        if (error.status === 410)
          message = 'This code has expired. Please request a new one.'
        else if (error.status === 400 || error.status === 401)
          message = 'Invalid code. Please try again.'
      }
      pwdForm.setError('root', { message })
    } finally {
      setIsLoading(false)
    }
  }

  const hero = (
    <div className={`login-hero ${colorScheme === 'light' ? 'login-hero-light' : ''}`}>
      <div className="login-accent login-accent-1" />
      <div className="login-accent login-accent-2" />
      <div className="login-accent login-accent-3" />
      <div className="login-hero-badge">
        <Zap size={12} />
        Production-ready skeleton
      </div>
      <h1 className="login-hero-title">ReactBase</h1>
      <p className="login-hero-tagline">
        Typed auth, RBAC routing, white-label theming, and a polished component foundation
        — ready for your next product.
      </p>
    </div>
  )

  if (step === 2) {
    return (
      <div className="login-shell">
        {hero}
        <div className="login-form-side">
          <Stack maw={400} w="100%" className="login-form-enter" align="center">
            <Center
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--mantine-color-green-light)',
              }}
            >
              <CheckCircle
                size={32}
                style={{ color: 'var(--mantine-color-green-filled)' }}
              />
            </Center>
            <Title order={2}>Password changed!</Title>
            <Text size="sm" c="dimmed" ta="center">
              Your password has been updated. You can now sign in with your new
              credentials.
            </Text>
            <Button component={Link} to="/login" fullWidth>
              Back to sign in
            </Button>
          </Stack>
        </div>
      </div>
    )
  }

  return (
    <div className="login-shell">
      {hero}
      <div className="login-form-side">
        <Stack maw={400} w="100%" className="login-form-enter">
          <div>
            <Title order={2} mb={4}>
              Reset password
            </Title>
            <Text size="sm" c="dimmed">
              Follow the steps below to reset your account password.
            </Text>
          </div>

          <Stepper active={step} size="sm" mb="md">
            <Stepper.Step label="Email" />
            <Stepper.Step label="Verify & reset" />
          </Stepper>

          {step === 0 && (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <Stack>
                <TextInput
                  label="Email address"
                  placeholder="alex@example.com"
                  size="md"
                  type="email"
                  {...emailForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={emailForm.formState.errors.email?.message}
                />
                <Button type="submit" size="md" loading={isLoading} fullWidth>
                  Send code
                </Button>
              </Stack>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={pwdForm.handleSubmit(handleVerifyAndReset)}>
              <Stack>
                <Text size="sm" c="dimmed">
                  Enter the 6-digit code sent to <b>{email}</b> and choose a new password.
                </Text>
                <Center>
                  <PinInput
                    length={6}
                    size="md"
                    value={otp}
                    onChange={setOtp}
                    type="number"
                  />
                </Center>
                <PasswordInput
                  label="New password"
                  placeholder="At least 8 characters"
                  size="md"
                  {...pwdForm.register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                    maxLength: { value: 72, message: 'Maximum 72 characters' },
                  })}
                  error={pwdForm.formState.errors.password?.message}
                />
                <PasswordInput
                  label="Confirm new password"
                  placeholder="••••••••"
                  size="md"
                  {...pwdForm.register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) =>
                      v === pwdForm.getValues('password') || 'Passwords do not match',
                  })}
                  error={pwdForm.formState.errors.confirmPassword?.message}
                />
                {pwdForm.formState.errors.root && (
                  <Text size="sm" c="red">
                    {pwdForm.formState.errors.root.message}
                  </Text>
                )}
                <Button type="submit" size="md" loading={isLoading} fullWidth>
                  Reset password
                </Button>
                <Button variant="subtle" size="sm" onClick={() => setStep(0)}>
                  Change email
                </Button>
              </Stack>
            </form>
          )}

          <Text size="xs" c="dimmed" ta="center">
            Remember your password?{' '}
            <Anchor component={Link} to="/login" size="xs">
              Back to sign in
            </Anchor>
          </Text>
        </Stack>
      </div>
    </div>
  )
}
