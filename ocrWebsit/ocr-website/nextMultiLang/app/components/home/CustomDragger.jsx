'use client';

import React, { useState } from 'react';
import {message, Upload,Button} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import styles from "../../[locale]/page.module.css"
const { Dragger } = Upload;
import axios from "axios"
import { Input } from 'antd';

const { TextArea } = Input;

const CustomDragger = ({convertedFile,convertText}) => {
    const [fileList,setFileList] = useState([])
    const [loading,setLoading] = useState(false)
    const [finalText,setFinalText] = useState("")
    const props = {
        name: 'file',
        multiple: false,
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type ==='application/pdf';
            if (!isJpgOrPng) {
              message.error('You can only upload JPG/PNG file!');
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
              message.error('Image must smaller than 5MB!');
            }
            return isJpgOrPng && isLt5M;
          
          },
        onChange(info) {
            const { status } = info.file;
            console.log(info);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`)
                setFileList(s=>([...s,info.file]))
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const convert = async() =>{
        setLoading(true)
        for(let i=0;i<fileList.length ; i++){
            const convertResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/convert`,{
                url:fileList[i].response.url,
                ext:fileList[i].response.ext,
            })
            console.log(convertResponse);
            setFinalText(s=>(s+ convertResponse.data.text))
        }
        setLoading(false)
    }

    return (
       <>
       <div className={styles.uploader__container}>
         <Dragger {...props}>
            <p className="ant-upload-drag-icon">
               <img src="/upload.svg" alt="" />
            </p>
            <p className="ant-upload-text">
                Drag & Drop files here
            </p>
            <p className="ant-upload-hint">
                Supported formates: JPEG, PNG, PDF
            </p>
        </Dragger>
       </div>
       <div className={styles.button_container}>
                <Button disabled={!fileList.length} loading={loading} type="primary" block size="large" onClick={()=>convert()}>{convertText}</Button>

       </div>
       <div className={styles.button_container}>
        <p className={styles.converted_title}>{convertedFile}</p>
       <TextArea value={finalText} rows={6}/>

       </div>
       </>
    );
};

export default CustomDragger;
