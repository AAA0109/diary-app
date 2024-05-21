import AuthWrapper from 'containers/authWrapper';
import SignupComponent from '../../components/authentication/SignupForm/SignupForm';
import AcceptInvitationForm from 'components/authentication/SignupForm/AcceptInvitationForm';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import useAuth from 'hooks/useAuth';

// ----------------------------------------------------------------------

export default function AcceptInvitationPage() {
    const { token } = useParams();
    const { saveInvitationInformation } = useAuth();

    useEffect(() => {
        if (token) {
            const data = JSON.parse(atob(token));
            saveInvitationInformation(data.guardianId, data.familyId);
        }
    }, [token]);

    return (
        <AuthWrapper>
            <AcceptInvitationForm />
        </AuthWrapper>
    );
}
