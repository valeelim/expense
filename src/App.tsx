import { ExpenseDetail, Home } from "./pages";
import "./App.css";
import "./assets/images/beerCategory.svg";

import { ChakraProvider, extendTheme, extendBaseTheme } from "@chakra-ui/react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    const customTheme = extendTheme({
        styles: {
            global: {
                body: {
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                    background: 'linear-gradient(180deg, #19A7CE 0%, #146C94 100%)',
                },
            },
        },
    });

    return (
        <ChakraProvider theme={customTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/expenses/:slug" Component={ExpenseDetail} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
