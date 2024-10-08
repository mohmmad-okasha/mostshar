"use client";
import { Button } from "antd";
import initTranslations from "../i18n.js";
import { useEffect, useState } from "react";
import LanguageChanger from './components/LanguageChanger';

export default function Home({ params: { locale } }) {
  
  const [t, setT] = useState(() => (key: any) => key);
  useEffect(() => {
    async function loadTranslations() {
      const { t } = await initTranslations(locale, ["common"]);
      setT(() => t);
    }
    loadTranslations();
  }, [locale]);

  return (
    <>
      <p>Mostshar app</p>
      <p>{t("ok")}</p>

      <LanguageChanger />
    </>
  );
}
