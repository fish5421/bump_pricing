import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Button, Spin, Card, Typography, Modal } from 'antd';

const SubscriptionModal = ({ session, visible, onClose, reloadTimer, setReloadTimer }) => {
    const [price, setPrice] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if (reloadTimer) {
            const fetchPrice = async () => {
                setLoading(true);
                const response = await fetch(`https://4681hp1c5f.execute-api.us-east-1.amazonaws.com/default/myCocreateGetPrice?user_id=${session.user.id}`);
                const data = await response.json();
                setPrice(data.price);
                const expiryDate = new Date(data.reserved_until);
                setExpiresAt(expiryDate);
                setLoading(false);
            };
            fetchPrice();
        }
    }, [session, reloadTimer]);

    const renderer = ({ minutes, seconds }) => (
        <Typography.Text strong>
            {minutes}:{seconds}
        </Typography.Text>
    );

    const handleSubscribe = async () => {
        setButtonLoading(true);
        const response = await fetch(`https://zo586v11bk.execute-api.us-east-1.amazonaws.com/default/myCocreateSubscriptionFunction?user_id=${session.user.id}&price=${price}`);
        const data = await response.json();
        window.location.href = data.checkoutUrl;
        setButtonLoading(false);
    };

    const resetReloadTimer = () => {
        setReloadTimer(false);
    };

    return (
        <Modal
            title="Subscription"
            open={visible}
            onCancel={() => { onClose(); resetReloadTimer(); }}
            footer={null}
        >
            <div className="flex flex-col items-center justify-center">
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <Card className="mb-6 p-4 w-full max-w-md">
                            <Typography.Title level={3}>Subscription Price: ${price}</Typography.Title>
                            <Typography.Text strong>
                                    Expires in: <Countdown date={expiresAt} renderer={renderer} onCancel={() => { onClose(); resetReloadTimer(); }}/>
                            </Typography.Text>
                        </Card>
                        <Button
                            type="primary"
                            className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
                            loading={buttonLoading}
                            onClick={handleSubscribe}
                        >
                            Subscribe Now
                        </Button>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default SubscriptionModal;
