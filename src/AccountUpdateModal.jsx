import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { supabase } from './supabaseClient';
import { useAccount } from './AccountContext';



const AccountUpdateModal = ({ session, isVisible, setVisible }) => {
    // const [visible, setVisible] = useState(false);
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);
    const { accountData, setAccountData } = useAccount();

    const [form] = Form.useForm();

    console.log('account update modal');
    console.log('account data', accountData);

    // useEffect(() => {
    //     const fetchAccountInfo = async () => {

    //         const { user } = session;

    //         let { data, error } = await supabase
    //             .from('profiles')
    //             .select('username, business_name')
    //             .eq('id', user.id)
    //             .single();

    //         // const { data, error } = await supabase
    //         //     .from('profiles')
    //         //     .select('*')
    //         //     .eq('user_id', session.user.id)
    //         //     .single();


    //         if (data) {
    //             setVisible(true);
    //         }
    //         else {
    //             console.log('data', data);
    //             // setIsVisible(false);
    //         }
    //     };

    //     fetchAccountInfo();
    // }, [session]);

    useEffect(() => {

        if (isVisible && accountData) {
            console.log('account data', accountData);
            form.setFieldsValue({
                full_name: accountData.username,
                email: accountData.email,
                business_name: accountData.business_name
            });
            setVisible(true);
        }
    }, [isVisible, accountData]);



    const validateFields = async () => {
        try {
            await form.validateFields(['full_name', 'email']);
            setOkButtonDisabled(false);
        } catch (error) {
            setOkButtonDisabled(true);
        }
    };

    const handleOk = async () => {
        let { business_name, full_name, email } = form.getFieldsValue();
        const { user } = session;

        const updates = {
            id: user.id,
            username: full_name,
            business_name: business_name,
            updated_at: new Date(),
            email: email,
        };

        let { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        }
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <Modal
            title="Account Update Information"
            open={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="ok" type="primary" onClick={handleOk}>
                    OK
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" onFieldsChange={validateFields}>
                <Form.Item
                    label="Full Name"
                    name="full_name"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Not a valid email!' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Business Name (Optional)" name="business_name">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AccountUpdateModal;
