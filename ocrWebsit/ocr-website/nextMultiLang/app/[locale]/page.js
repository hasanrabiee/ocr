import {useTranslations} from "next-intl";
import styles from "./page.module.css"
import CustomDragger from "../components/home/CustomDragger";

// const { Dragger } = Upload;
export default function Home() {
    const t = useTranslations("Index");
   
    return (
        <main className={styles.main}>
            <div className={styles.title__container}>
                <p className={styles.title}>{t("title")}</p>
                <p className={styles.subtitle}>{t("subtitle")}</p>
            </div>
                <CustomDragger convertText={t("convert")} convertedFile={t("converted_file")}/>
           
        </main>
    );
}
