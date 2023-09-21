import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { supabase } from './supabaseClient';
import { useAccount } from './AccountContext';
// import { set } from 'animejs';

const AccountModal = ({ session }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [textValid, setTextValid] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [form] = Form.useForm();
    const { updateAccountData } = useAccount();

    const validateForm = () => {
        const formValid = emailValid && textValid;
        setSubmitDisabled(!formValid);
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleChangeEmail = (e) => {
        const isValid = emailRegex.test(e.target.value);
        setEmailValid(isValid);
    };

    const handleChangeText = (e) => {
        const isValid = e.target.value ? true : false;
        setTextValid(isValid);
    };

    useEffect(() => {
        validateForm();
    }, [emailValid, textValid]);

    useEffect(() => {

        const fetchAccountInfo = async () => {

            const { user } = session;

            let { data, error } = await supabase
                .from('profiles')
                .select('username, business_name')
                .eq('id', user.id)
                .single();

            // const { data, error } = await supabase
            //     .from('profiles')
            //     .select('*')
            //     .eq('user_id', session.user.id)
            //     .single();
                

            if (!data) {
                setIsVisible(true);
            }
            else {
                console.log('data',data);
                // setIsVisible(false);
            }
        };

        fetchAccountInfo();
    }, [session]);

    const handleAccountOk = async () => {
        console.log('handleAccountOk', form.getFieldsValue());
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
        await updateAccountData();
        setIsVisible(false);
    };

    return (
        <Modal
            title="Welcome! Please complete your profile"
            open={isVisible}
            closable={false}
            maskClosable={false}
            footer={[
                <Button className='bg-blue-500' key="submit" type="primary" onClick={handleAccountOk} disabled={submitDisabled}>
                    OK
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item 
                    label="Email" 
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input onChange={handleChangeEmail} />
                </Form.Item>
                <Form.Item
                    label="Full Name" 
                    name="full_name"
                    rules={[
                        {
                            type: 'string',
                            required: true,
                            message: 'Please input your full name!',
                        },
                    ]}>
                    <Input onChange={handleChangeText} />
                </Form.Item>
                <Form.Item label="Business Name" name="business_name">
                    <Input onChange={handleChangeText} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AccountModal;
