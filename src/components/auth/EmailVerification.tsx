import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { currentUser, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  // Check if user is already verified on mount
  useEffect(() => {
    if (currentUser?.emailVerified) {
      setVerified(true);
      // Auto-redirect after 2 seconds
      const timer = setTimeout(() => {
        const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterAuth');
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  const handleResendEmail = async () => {
    console.log('Resend email clicked, currentUser:', currentUser);

    if (!currentUser) {
      console.error('No current user found');
      setError('U bent niet ingelogd. Log eerst in om de verificatie-e-mail opnieuw te verzenden.');
      return;
    }

    try {
      setError('');
      setSending(true);
      console.log('Sending verification email to:', currentUser.email);
      await sendVerificationEmail(currentUser);
      console.log('Verification email sent successfully');
      setSent(true);
      setTimeout(() => setSent(false), 3000); // Reset after 3 seconds
    } catch (err: unknown) {
      console.error('Resend email error:', err);
      setError('Kan verificatie-e-mail niet opnieuw verzenden. Probeer het later opnieuw.');
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    console.log('Check verification clicked, currentUser:', currentUser, 'auth:', !!auth);

    if (!auth || !currentUser) {
      console.error('Missing auth or currentUser');
      setError('U bent niet ingelogd. Log eerst in om uw verificatiestatus te controleren.');
      return;
    }

    try {
      setError('');
      setChecking(true);
      console.log('Reloading user to check verification status...');
      // Reload the user to get the latest verification status
      await currentUser.reload();
      console.log('User reloaded, emailVerified:', currentUser.emailVerified);

      if (currentUser.emailVerified) {
        console.log('Email is verified! Redirecting...');
        setVerified(true);
        // Redirect after showing success message
        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterAuth');
            navigate(redirectUrl);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        console.log('Email still not verified');
        setError('E-mail nog niet geverifieerd. Klik op de link in uw e-mail en probeer het opnieuw.');
      }
    } catch (err: unknown) {
      console.error('Check verification error:', err);
      setError('Kan verificatiestatus niet controleren. Probeer het opnieuw.');
    } finally {
      setChecking(false);
    }
  };

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
          {verified ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                E-mail geverifieerd!
              </h2>
              <p className="text-gray-600 mb-4">
                Uw e-mailadres is succesvol geverifieerd. U wordt doorgestuurd...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifieer uw e-mailadres
                </h2>
                <p className="text-gray-600">
                  We hebben een verificatie-e-mail verzonden naar{' '}
                  <strong>{currentUser?.email}</strong>. Controleer uw inbox en klik op de link om uw account te activeren.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {error}
                </div>
              )}

              {sent && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verificatie-e-mail opnieuw verzonden!
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleCheckVerification}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={checking}
                >
                  {checking ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Controleren...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Verificatie controleren
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  disabled={sending}
                >
                  {sending ? 'Bezig met verzenden...' : 'E-mail opnieuw verzenden'}
                </Button>

                <Button
                  onClick={() => navigate('/auth/login')}
                  variant="outline"
                  className="w-full"
                >
                  Terug naar inloggen
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Na verificatie kunt u inloggen met uw account.
              </p>

              {/* Debug info - remove in production */}
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                <p><strong>Debug info:</strong></p>
                <p>Current user: {currentUser ? currentUser.email : 'None'}</p>
                <p>Email verified: {currentUser?.emailVerified ? 'Yes' : 'No'}</p>
                <p>Auth initialized: {auth ? 'Yes' : 'No'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
