import React from 'react';
import { Result, Button } from 'antd';

export default function CancelPage() {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-red-50">
            <Result
                status="error"
                title="Cancelled Payment"
                subTitle="Please check and modify the information."
                extra={[
                    <Button type="primary" key="console" href='/' className='bg-blue-600 text-white hover:bg-blue-700'>
                        Go Back
                    </Button>,
                ]}
            />
        </div>
    );
}
