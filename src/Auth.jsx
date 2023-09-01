import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import anime from 'animejs';


export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    useEffect(() => {
        function randomValues() {
            anime({
                targets: '.square, .circle, .triangle',
                translateX: function () {
                    return anime.random(-500, 500);
                },
                translateY: function () {
                    return anime.random(-300, 300);
                },
                rotate: function () {
                    return anime.random(0, 360);
                },
                scale: function () {
                    return anime.random(.2, 2);
                },
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: randomValues,
            });
        }

        randomValues();
    }, []);

    return (
        <div className='animated-background'>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>

            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>

            <div class="triangle"></div>
            <div class="triangle"></div>
            <div class="triangle"></div>
            <div class="triangle"></div>
            <div class="triangle"></div>

            <div className='auth-container'>
                <section className="bg-gray-900 dark:bg-gray-900 md:h-screen flex flex-col items-center justify-center px-6 py-8 w-screen">
                    <div className="w-full bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow sm:max-w-md">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-cyan-700">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                                Sign in to your account
                            </h1>
                            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-black">Your email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        className="text-black bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" disabled={loading}>
                                        {loading ? 'Loading' : 'Send magic link'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
