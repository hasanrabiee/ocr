'use client';

import React from 'react';
import styles from "./styles/layout.module.css"
import { Space, Dropdown, MenuProps } from "antd";
import { DownOutlined } from '@ant-design/icons';
import Link from "next-intl/link";

const CustomHeader = ({locale}) => {
    const items= [
        {
            label:
                <Link href="/" locale="en">
                    English
                </Link>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label:
                <Link href="/" locale="fa">
                    فارسی
                </Link>,
            key: '1',
        },
    ];

    return (
        <header className={styles.header}>
            <Dropdown menu={{ items }} trigger={['click']}>
                <a  style={{cursor:"pointer"}} onClick={(e) => e.preventDefault()}>
                    <Space>
                        {locale}
                        <img src="/lang.svg" alt="" />
                        {/* <DownOutlined size={'2px'} /> */}
                    </Space>
                </a>
            </Dropdown>
        </header>
    );
};

export default CustomHeader;
