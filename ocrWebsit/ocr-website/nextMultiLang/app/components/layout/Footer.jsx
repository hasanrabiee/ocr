'use client';

import React from 'react';
import styles from "./styles/layout.module.css"
import { Space, Dropdown, MenuProps } from "antd";
import { DownOutlined } from '@ant-design/icons';
import Link from "next-intl/link";

const CustomFooter = ({androidText}) => {
   

    return (
        <footer className={styles.footer}>
            <a href="https://t.me/hasanOCRBot" target={"_blank"}>
            <section className={styles.telegram__bot__section}>
                <div>
                    <img src="/android.png" width={100}/>    
                </div>
                <div className={styles.telegram__bot__text__section}>
                {androidText}
                </div>
            </section>  
            </a>
          
        </footer>
    );
};

export default CustomFooter;
