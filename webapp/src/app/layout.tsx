import "@/styles/globals.scss";
import PtSans from "@/styles/fonts/PtSans";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { UserContextProvider } from "@/contexts/userContext";
import { default_metadata, default_viewport } from "@/globals";
import { ToastContextProvider } from "@/contexts/toastContext";

export const metadata = default_metadata;
export const viewport = default_viewport;

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Readonly<Props>> = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en">
      <body className={`antialiased ${PtSans.className}`}>
        <UserContextProvider>
          <ToastContextProvider>
            <Header />
            {children}
            <Footer />
          </ToastContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
