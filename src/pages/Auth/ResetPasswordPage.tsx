import AuthWrapper from 'containers/authWrapper';
import ResetPasswordForm from 'components/authentication/ResetPasswordForm';
import BackButton from 'components/backButton';

export default function ResetPasswordPage() {
    return (
        <AuthWrapper>
            <BackButton />
            <ResetPasswordForm />
        </AuthWrapper>
    );
}
