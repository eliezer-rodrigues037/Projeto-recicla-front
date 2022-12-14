import type { AppProps } from "next/app";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/auth";
import { useAuth } from "../hooks/useAuth";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Lottie from "lottie-react";
import animation from "../assets/lotties/rocket.json";
import { FormLabel } from "../components/styled/FormLabel";
import { Input } from "../components/styled/Input";

const ApiProvider = ({ Component, pageProps }: AppProps) => {
  const { isLoading } = useAuth();

  return (
    <AuthProvider>
      {isLoading ? (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <Lottie
            animationData={animation}
            loop
            style={{ width: 300, height: 300 }}
          />
        </Box>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
};

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const theme = extendTheme({
    styles: {
      global: () => ({
        body: {
          fontFamily: "Poppins",
        },
        html: {
          fontSize: "90%",
        },
      }),
    },
    colors: {
      black: {
        900: "#000F0E",
      },
      gray: {
        200: "#DDDDDD", // Bordas
        400: "#AAAAAA", // Fonte inputs
        500: "#f5f5f582",
      },
      green: {
        500: "#0CD614", // Cor principal da marca
      },
    },
    components: {
      FormLabel,
      Input,
    },
  });
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ApiProvider
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </ChakraProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default MyApp;
