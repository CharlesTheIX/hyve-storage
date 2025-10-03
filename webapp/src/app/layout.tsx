import "@/styles/globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PtSans from "@/styles/fonts/PtSans";
import { defaultMetadata, defaultViewport } from "@/globals";
import { UserContextProvider } from "@/contexts/userContext";
import { ToastContextProvider } from "@/contexts/toastContext";

export const metadata = defaultMetadata;
export const viewport = defaultViewport;

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
