import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, X } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(1, 'Wachtwoord is verplicht'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);

      // Redirect to stored URL or home page
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterAuth');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      console.error('Error type:', typeof err);
      console.error('Error details:', JSON.stringify(err, null, 2));

      const error = err as { code?: string; message?: string };
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      if (error.code === 'auth/email-not-verified') {
        setError(
          'Uw e-mailadres is nog niet geverifieerd. Controleer uw inbox voor de verificatielink.'
        );
        setShowVerificationLink(true);
      } else {
        setShowVerificationLink(false);

        // Provide more specific error messages based on Firebase error codes
        let errorMessage = 'Inloggen mislukt. Probeer het opnieuw.';

        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-email':
            errorMessage = 'Onjuist e-mailadres of wachtwoord';
            break;
          case 'auth/invalid-credential':
            // This might be due to unverified email - check the error message
            if (error.message && error.message.includes('email')) {
              errorMessage = 'Uw e-mailadres is nog niet geverifieerd, of uw inloggegevens zijn onjuist.';
              setShowVerificationLink(true);
            } else {
              errorMessage = 'Onjuist e-mailadres of wachtwoord';
            }
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Te veel pogingen. Probeer het later opnieuw.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Dit account is uitgeschakeld.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Netwerkfout. Controleer uw internetverbinding.';
            break;
          default:
            // Include the error code and message for debugging
            errorMessage = `Inloggen mislukt${error.code ? ` (${error.code})` : ''}. ${error.message || 'Probeer het opnieuw.'}`;
        }

        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Voer een e-mailadres in');
      return;
    }

    try {
      setResetError('');
      setLoading(true);
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      const error = err as { code?: string };
      setResetError(
        error.code === 'auth/user-not-found'
          ? 'Geen account gevonden met dit e-mailadres'
          : 'Kan wachtwoord reset niet verzenden. Probeer het opnieuw.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();

      // Redirect to stored URL or home page
      const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterAuth');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      setError('Google aanmelding mislukt. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              EED CHECK
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                BETA
              </span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {resetSent ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  E-mail verzonden
                </h2>
                <p className="text-gray-600 mb-6">
                  We hebben een wachtwoord reset link verzonden naar <strong>{resetEmail}</strong>.
                  Controleer uw inbox en volg de instructies.
                </p>
                <Button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setResetEmail('');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Terug naar inloggen
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Wachtwoord vergeten?
                  </h2>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetError('');
                      setResetEmail('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Voer uw e-mailadres in en we sturen u een link om uw wachtwoord opnieuw in te stellen.
                </p>

                {resetError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {resetError}
                  </div>
                )}

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                      E-mailadres
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="Voer uw e-mailadres in"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? 'Bezig...' : 'Wachtwoord reset verzenden'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetError('');
                      setResetEmail('');
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Annuleren
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            EED CHECK
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
              BETA
            </span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welkom terug
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Log in op uw account om door te gaan.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                  {showVerificationLink && (
                    <Link
                      to="/auth/verify-email"
                      className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                    >
                      Ga naar verificatiepagina
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 h-11 border-gray-300 hover:bg-gray-50"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Log in met Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">of</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Met uw e-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Voer uw e-mailadres in"
                {...register('email')}
                className="mt-1"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Wachtwoord
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Wachtwoord vergeten?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Wachtwoord"
                {...register('password')}
                className="mt-1"
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? 'Bezig...' : 'Inloggen'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Heeft u nog geen account?{' '}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Registreer hier
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
