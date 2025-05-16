import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("gray.100", "#101010")(props),
		},
	}),
};

const config = {
	initialColorMode: localStorage.getItem('pinkMode') === 'true' ? 'light' : 'dark',
	useSystemColorMode: false,
};

const colors = {
	gray: {
		light: "#616161",
		dark: "#1e1e1e",
	},
	pink: {
		main: "#cc2279",
		baby: "#e9a1ba",
	},
};

const theme = extendTheme({ 
	config, 
	styles, 
	colors,
	semanticTokens: {
		colors: {
			'chakra-body-bg': {
				_light: 'pink.main',
				_dark: '#101010',
			},
			'chakra-body-text': {
				_light: 'gray.800',
				_dark: 'whiteAlpha.900',
			},
		},
	},
	components: {
		Modal: {
			baseStyle: (props) => ({
				dialog: {
					bg: mode('pink.baby', 'gray.800')(props),
					color: mode('gray.800', 'whiteAlpha.900')(props),
				},
			}),
		},
		Button: {
			variants: {
				solid: (props) => ({
					bg: mode('pink.main', 'gray.700')(props),
					color: mode('white', 'white')(props),
					_hover: {
						bg: mode('pink.baby', 'gray.600')(props),
					},
				}),
			},
		},
		Card: {
			baseStyle: (props) => ({
				container: {
					bg: mode('pink.baby', 'gray.800')(props),
					color: mode('gray.800', 'whiteAlpha.900')(props),
				},
			}),
		},
		Box: {
			baseStyle: (props) => ({
				bg: mode('pink.baby', 'gray.800')(props),
				color: mode('gray.800', 'whiteAlpha.900')(props),
			}),
		},
		Text: {
			baseStyle: (props) => ({
				color: mode('gray.800', 'whiteAlpha.900')(props),
			}),
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	// React.StrictMode renders every component twice (in the initial render), only in development.
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
