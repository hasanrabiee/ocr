import "./globals.css";
import {Inter} from "next/font/google";
import {useLocale} from "next-intl";
import {notFound} from "next/navigation";
import CustomHeader from "../components/layout/Header"
import CustomFooter from "../components/layout/Footer"
import {useTranslations} from "next-intl";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "OCR Application",
    description: "OCR App",
};

export default function RootLayout({children, params}) {
    const locale = useLocale();
    // Show a 404 error if the user requests an unknown locale
    if (params.locale !== locale) {
        notFound();
    }
    const t = useTranslations("Index");


    return (
        <html lang={locale}>
        <body style={{direction:locale === 'fa' ? 'rtl'  : 'ltr'}} className={inter.className}>
        <CustomHeader locale={locale}/>
        {children}
        <CustomFooter androidText={t("android_quote")}/>
        </body>
        </html>
    );
}
