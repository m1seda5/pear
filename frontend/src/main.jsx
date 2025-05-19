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
import { PointPopUpProvider } from "./context/PointPopUpContext";
import { CompetitionContextProvider } from "./context/CompetitionContext";
import { ErrorBoundary } from "./ErrorBoundary";

const pinkMode = localStorage.getItem('pinkMode') === 'true';

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: pinkMode && props.colorMode === 'light' ? '#e9a1ba' : mode("gray.100", "#101010")(props),
		},
	}),
};

const config = {
	initialColorMode: pinkMode ? 'light' : 'dark',
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
				_light: pinkMode ? 'pink.baby' : 'gray.100',
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
					bg: pinkMode && props.colorMode === 'light' ? '#e9a1ba' : mode('white', 'gray.800')(props),
					color: mode('gray.800', 'whiteAlpha.900')(props),
				},
			}),
		},
		Button: {
			variants: {
				solid: (props) => ({
					bg: pinkMode && props.colorMode === 'light' ? '#cc2279' : mode('blue.500', 'gray.700')(props),
					color: 'white',
					_hover: {
						bg: pinkMode && props.colorMode === 'light' ? '#e9a1ba' : mode('blue.600', 'gray.600')(props),
					},
				}),
			},
		},
		Card: {
			baseStyle: (props) => ({
				container: {
					bg: pinkMode && props.colorMode === 'light' ? '#e9a1ba' : mode('white', 'gray.800')(props),
					color: mode('gray.800', 'whiteAlpha.900')(props),
				},
			}),
		},
		Box: {
			baseStyle: (props) => ({
				bg: pinkMode && props.colorMode === 'light' ? '#e9a1ba' : undefined,
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
	<ErrorBoundary>
		<React.StrictMode>
			<RecoilRoot>
				<BrowserRouter>
					<PointPopUpProvider>
						<CompetitionContextProvider>
							<ChakraProvider theme={theme}>
								<ColorModeScript initialColorMode={theme.config.initialColorMode} />
								<SocketContextProvider>
									<App />
								</SocketContextProvider>
							</ChakraProvider>
						</CompetitionContextProvider>
					</PointPopUpProvider>
				</BrowserRouter>
			</RecoilRoot>
		</React.StrictMode>
	</ErrorBoundary>
);
