
import { useRouter } from "next/router";

import GeneralLayout from "./components/layouts/GeneralLayout";
import BuyerLayout from "./components/layouts/BuyerLayout";
import SellerLayout from "./components/layouts/SellerLayout";
import AdminLayout from "./components/layouts/AdminLayout";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router.pathname;

  let Layout = GeneralLayout;

  if (path.startsWith("/buyer")) {
    Layout = BuyerLayout;
  } else if (path.startsWith("/seller")) {
    Layout = SellerLayout;
  } else if (path.startsWith("/admin")) {
    Layout = AdminLayout;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
