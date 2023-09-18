import React from 'react';
import { useState, useEffect } from 'react';
import SubscriptionPage from './SubscriptionPage';
import AccountModal from './AccountModal'; // Import the AccountModal component
import AccountUpdateModal from './AccountUpdateModal';
import { supabase } from './supabaseClient';




const LandingPage = ({ session }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);
    const [reloadTimer, setReloadTimer] = useState(false);



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
    }, []);

    const handleSubscriptionClick = async () => {
        if (isSubscribed) {
            console.log('cancel now');
            window.location.href = 'https://billing.stripe.com/p/login/test_28oeVY8Uq6d410c9AA'

        } else {
            console.log('set now');
            setReloadTimer(true); // Toggle the state to trigger re-fetching the subscription status
            console.log('reload timer', reloadTimer);
            setShowSubscriptionPage(true)
        }
    };



    return (
        <>
            <div className="flex h-full py-12 gap-x-42">
                <SubscriptionPage 
                    session={session}
                    visible={showSubscriptionPage} 
                    onClose={() => setShowSubscriptionPage(false)}
                    reloadTimer={reloadTimer}
                    setReloadTimer={setReloadTimer}
                />
                <AccountModal session={session} />
                {/* <AccountUpdateModal session={session} /> */}

                {/* Left side with Text and CTA */}
                <div className="flex flex-col justify-between w-1/2 p-10 bg-black text-gray-100">
                    <div>
                        <h1 className="text-5xl font-bold">Join Darrel's Discord Community</h1>
                        <h2 className="text-xl mt-4">Empower Your Startup Journey</h2>
                        <ul className="list-disc list-inside mt-4">
                            <li className="text-sm">Exclusive Investment Tips</li>
                            <li className="text-sm">1-on-1 Mentoring Sessions</li>
                            <li className="text-sm">Networking with Industry Leaders</li>
                            <li className="text-sm">Access to Early-stage Investment Opportunities</li>
                            <li className="text-sm">Startup Templates and Resources</li>
                        </ul>
                        <p className="text-md mb-4 mt-10"><span className="font-bold">Special Bump Pricing:</span> The first user to sign up gets the subscription at just $1, and the price will increase from there.</p>

                    </div>
                    <button
                        className="border-0 rounded-full bg-red-600 text-white text-lg px-8 py-4 font-sans focus:outline-none"
                        onClick={handleSubscriptionClick}>
                        {isSubscribed ? 'Cancel Subscription' : 'Subscribe Now'}
                    </button>
                </div>

                {/* Right side with Image */}
                <div className="w-1/2">
                    <img
                        src="https://picsum.photos/400/300"
                        alt="Random"
                        className="h-full w-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
