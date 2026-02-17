import {
  Alert,
  Anchor,
  Button,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { CheckCircle, Mail, Zap } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNotificationCenter } from '@/core/notifications/NotificationCenterContext'

interface ForgotPasswordFormValues {
  email: string
}

export function ForgotPasswordPage() {
  const { addNotification } = useNotificationCenter()
  const { colorScheme } = useMantineColorScheme()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async (values) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    addNotification({
      title: 'Reset email sent',
      message: `If an account exists for ${values.email}, you'll receive password reset instructions.`,
      color: 'green',
    })
  })

  if (isSubmitted) {
    return (
      <div className="login-shell">
        <div
          className={`login-hero ${colorScheme === 'light' ? 'login-hero-light' : ''}`}
        >
          <div className="login-accent login-accent-1" />
          <div className="login-accent login-accent-2" />
          <div className="login-accent login-accent-3" />
          <div className="login-hero-badge">
            <Zap size={12} />
            Production-ready skeleton
          </div>
          <h1 className="login-hero-title">ReactBase</h1>
          <p className="login-hero-tagline">
            Typed auth, RBAC routing, white-label theming, and a polished component
            foundation — ready for your next product.
          </p>
        </div>

        <div className="login-form-side">
          <Stack maw={400} w="100%" className="login-form-enter" align="center">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--mantine-color-green-light)',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle
                size={32}
                style={{ color: 'var(--mantine-color-green-filled)' }}
              />
            </div>

            <Title order={2} mb={4}>
              Check your email
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              We&apos;ve sent password reset instructions to your email address. Please
              check your inbox and follow the link to reset your password.
            </Text>

            <Alert color="blue" variant="light" radius="md" w="100%">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <Button
                variant="subtle"
                size="compact-xs"
                onClick={() => setIsSubmitted(false)}
                type="button"
                px={0}
              >
                try again
              </Button>
              .
            </Alert>

            <Button
              component={Link}
              to="/login"
              variant="light"
              fullWidth
              mt="md"
              leftSection={<Mail size={16} />}
            >
              Back to sign in
            </Button>
          </Stack>
        </div>
      </div>
    )
  }

  return (
    <div className="login-shell">
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
          Typed auth, RBAC routing, white-label theming, and a polished component
          foundation — ready for your next product.
        </p>
      </div>

      <div className="login-form-side">
        <Stack maw={400} w="100%" className="login-form-enter">
          <div>
            <Title order={2} mb={4}>
              Forgot password?
            </Title>
            <Text size="sm" c="dimmed">
              Enter your email address and we&apos;ll send you instructions to reset your
              password.
            </Text>
          </div>

          <Alert color="blue" variant="light" radius="md">
            Demo mode — No actual email will be sent
          </Alert>

          <form onSubmit={onSubmit}>
            <Stack>
              <TextInput
                label="Email address"
                placeholder="alex@example.com"
                size="md"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={formState.errors.email?.message}
              />

              <Button type="submit" size="md" loading={formState.isSubmitting} fullWidth>
                Send reset instructions
              </Button>
            </Stack>
          </form>

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
