import AuthWrapper from 'containers/authWrapper';
import BackButton from 'components/backButton';
import ChangePasswordForm from 'components/authentication/ChangePasswordForm';

export default function ChangePasswordPage() {
    return (
        <AuthWrapper>
            <BackButton />
            <ChangePasswordForm />
        </AuthWrapper>
    );
}
