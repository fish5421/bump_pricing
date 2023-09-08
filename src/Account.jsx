import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import SubscriptionPage from './SubscriptionPage'; // Make sure the path is correct
import StepWizard from 'react-step-wizard';  // Assuming you've added this package for step-by-step flow




export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [businessName, setBusinessName] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);



    const handleSubscriptionClick = async () => {
        if (isSubscribed) {
            console.log('cancel now');
            window.location.href = 'https://billing.stripe.com/p/login/test_28oeVY8Uq6d410c9AA'

        } else {
            console.log('set now');
            setShowSubscriptionPage(true)
        }
    };

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('profiles')
                .select('username, business_name')
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn(error);
            } else if (data) {
                console.log('data', data);
                setUsername(data.username);
                setBusinessName(data.business_name);
            }

            setLoading(false);
        }

        getProfile();
    }, [session]);

    async function updateProfile(event) {
        event.preventDefault();

        setLoading(true);
        const { user } = session;

        const updates = {
            id: user.id,
            username,
            business_name: businessName,
            updated_at: new Date(),
        };

        let { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        async function fetchSubscription() {
            console.log('fetch subs', session);
            const { user } = session;
            const cleanedUserId = user.id.trim();  // Trim whitespaces and newlines
            console.log('cleaned_user_id', cleanedUserId);


            const { data, error } = await supabase
                .from('subscriptions')
                .select('active')
                .eq('subscriber_id', cleanedUserId)
                .eq('active', 'TRUE')
                .single();


            if (data && data.active) {
                console.log('data_7', data);
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
                console.log('data_7', data);

            }
        }

        fetchSubscription();
    }, [session]);


    return (
        showSubscriptionPage ? (
            <SubscriptionPage session={session} />
        ) : (
            <>
                <div className="bg-white text-center font-bold text-2xl mb-4">Darrel's Community</div>
                <StepWizard>
                    <Step1 session={session} username={username} setUsername={setUsername} />
                    <Step2 session={session} businessName={businessName} setBusinessName={setBusinessName} />
                    <Step3 session={session} updateProfile={updateProfile} loading={loading} />
                    <Step4 session={session} isSubscribed={isSubscribed} handleSubscriptionClick={handleSubscriptionClick} />
                </StepWizard>
            </>
        )
    );
}

// Separate the forms into smaller components, one for each "step" in the user onboarding flow
const Step1 = ({ session, username, setUsername }) => {
    return (
        <div className="mb-4 w-full text-black">
            <label htmlFor="email" className="text-lg font-medium text-gray-600">Email</label>
            <input id="email" type="text" value={session.user.email} disabled className="w-full flowbite-input" />
        </div>
    );
};

const Step2 = ({ session, businessName, setBusinessName }) => {
    return (
        <div className="mb-4 w-full text-black">
            <label htmlFor="businessName" className="text-lg font-medium text-gray-600">Business Name</label>
            <input id="businessName" type="text" value={businessName || ''} onChange={(e) => setBusinessName(e.target.value)} className="w-full flowbite-input" />
        </div>
    );
};

const Step3 = ({ session, updateProfile, loading }) => {
    return (
        <button type="submit" disabled={loading} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5">
            {loading ? 'Loading ...' : 'Update'}
        </button>
    );
};

const Step4 = ({ session, isSubscribed, handleSubscriptionClick }) => {
    return (
        <button type="button" className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5" onClick={handleSubscriptionClick}>
            {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
        </button>
    );

};
