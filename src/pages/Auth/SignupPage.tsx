import AuthWrapper from 'containers/authWrapper';
import SignupComponent from '../../components/authentication/SignupForm/SignupForm';

// ----------------------------------------------------------------------

export default function SignupPage() {
    return (
        <AuthWrapper>
            <SignupComponent />
        </AuthWrapper>
    );
}
