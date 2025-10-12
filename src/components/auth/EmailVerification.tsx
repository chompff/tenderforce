import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { currentUser, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!currentUser) return;

    try {
      setError('');
      setSending(true);
      await sendVerificationEmail(currentUser);
      setSent(true);
      setTimeout(() => setSent(false), 3000); // Reset after 3 seconds
    } catch (err: any) {
      console.error('Resend email error:', err);
      setError('Kan verificatie-e-mail niet opnieuw verzenden. Probeer het later opnieuw.');
    } finally {
      setSending(false);
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
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={sending}
            >
              {sending ? 'Bezig met verzenden...' : 'E-mail opnieuw verzenden'}
            </Button>

            <Button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ga naar inloggen
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Na verificatie kunt u inloggen met uw account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
