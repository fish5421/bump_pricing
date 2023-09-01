import React, { useEffect, useState } from 'react';
import { Result, Button } from 'antd';
import { motion, useMotionValue } from 'framer-motion';
import CircularProgress from './CircularProgress';

export default function SuccessPage() {
    const [subscriberNumber, setSubscriberNumber] = useState(null);
    let progress = useMotionValue(90);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSubscriberNumber(urlParams.get('subscriberNumber'));
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-green-50 w-screen">
            <Result
                icon={
                    <div className="flex justify-center items-center">
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: 100 }}
                            style={{ x: progress }}
                            transition={{ duration: 1 }}
                        />
                        <CircularProgress progress={progress} />
                    </div>
                }
                status="success"
                title={'Payment Successful'}
                subTitle={`You are subscriber #${subscriberNumber || 'N/A'}`}
                extra={[
                    <Button type="primary" key="console" href='/' className="bg-blue-600 text-white hover:bg-blue-700">
                        Go to Dashboard
                    </Button>,
                ]}
            />
        </div>
    );
}
