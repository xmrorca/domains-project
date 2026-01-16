import "../styles/globals.css";
import "../styles/animation.css";
import "../styles/scrollbar.css";
import { HeroUIProvider, useDisclosure } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import Footer from "../Components/Front/Footer";
import { useRouter } from "next/router";
import MyLayout from "../Components/Layout";
import { Provider } from "react-redux";
import store from "../Redux/store";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "@smastrom/react-rating/style.css";
import MouseOut from "../Components/Front/MouseExitModal";
import Cookie from "../Components/Front/Cookie";
import ReactGA from "react-ga4";
import axios from "axios";
import Head from "next/head";
import NavBar from "../Components/Front/Navbar";
import { GoogleAdSense } from "next-google-adsense";
import Script from "next/script";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [adSense, setAdSense] = useState("");

  useEffect(() => {
    import("preline");
  }, []);

  useEffect(() => {
    axios.get("/api/get-analytic").then((res) => {
      ReactGA.initialize(res.data?.analyticId);
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname + window.location.search,
      });
    });
  }, [router.asPath]);

  useEffect(() => {
    window.addEventListener("mouseout", function (event) {
      const exitModal = localStorage.getItem("exit-modal");

      if (event.toElement === null && event.relatedTarget === null) {
        if (!exitModal) {
          onOpen();
          localStorage.setItem("exit-modal", true);
        }
      }
    });
  }, []);
  useEffect(() => {
    axios
      .get("/api/adsense")
      .then((res) => setAdSense(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <NextThemesProvider defaultTheme="light" attribute="class">
      <HeroUIProvider>
        <Provider store={store}>
          {adSense?.googleAds?.enableAds && (
            <GoogleAdSense publisherId={adSense?.googleAds?.clientID} />
          )}

          {router.route === "/admin/[route]" || router.route === "/admin" ? (
            <MyLayout />
          ) : (
            <div>
              <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`}
                strategy="afterInteractive"
                crossOrigin="anonymous"
                onError={(e) => console.log("script failed to load", e)}
              />
              <MouseOut isOpen={isOpen} onOpenChange={onOpenChange} />
              <NavBar />
              <Component {...pageProps} />
              <Footer />
              <Cookie />
            </div>
          )}
        </Provider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
