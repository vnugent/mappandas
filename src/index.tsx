import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import App from "./App";
//@ts-ignore
import * as Config from "./Config";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff9100"
    },
    secondary: {
      main: "#00acc1"
    }
  }
});

ReactDOM.render(
  <BrowserRouter>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
