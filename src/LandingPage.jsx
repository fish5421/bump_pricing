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
            const { user } = session;
            const cleanedUserId = user.id.trim();  // Trim whitespaces and newlines


            const { data, error } = await supabase
                .from('subscriptions')
                .select('active')
                .eq('subscriber_id', cleanedUserId)
                .eq('active', 'TRUE')
                .maybeSingle();

            if (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Error fetching subscription:', error);
                }
                setIsSubscribed(false);
                return;
            }

            if (data && data.active) {
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
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
                        <h1 className="text-5xl font-bold">Join Darrel's Inner Circle: Your Launchpad to Startup Success</h1>
                        <h2 className="text-xl mt-4">Darrel Frater is a seasoned venture capitalist and a three-time founder with a passion for serving others.
                            Kickstart your journey in Darrel's Inner Circle, a paid community dedicated to equipping ambitious leaders like yourself to success.</h2>

                        <ul className="list-disc list-inside mt-4">
                            <li className="text"><strong className="font-extrabold">Personalized Guidance</strong>: Get direct mentorship from Darrel, leverage his startup startup and VC experience, learn the do’s and don’ts, and steer your way towards success.</li>
                            <li className="text"><strong className="font-extrabold">Valuable Connections</strong>: Network with a community of like-minded individuals, share experiences, and create opportunities together.</li>
                            <li className="text"><strong className="font-extrabold">Latest Industry Trends</strong>: Stay updated with the newest trends and strategies that can set you apart in your industry.</li>
                            <li className="text"><strong className="font-extrabold">Investor Insights</strong>: Gain an insider’s view into what investors seek and how investors think so you can leverage that knowledge to your advantage.</li>
                        </ul>

                        <div className="mt-6">
                            <strong className="text-md font-semibold">Special Bump Subscription Offer & Longevity Discounting</strong>
                            <p className="text-sm mt-2">
                                We’re kicking things off with a special subscription offer. The first subscriber gets in at just $10/month, and the price increases by $10 for each new subscriber. Additionally as others exit the community your price gets bumped down, rewarding you for sticking with us.
                            </p>
                            <p className="text-sm mt-2">
                                This is a top-tier offering, priced way below the usual $500 monthly fee.
                            </p>
                        </div>
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
