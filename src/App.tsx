import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import MyMap from "./MyMap";
import { Toolbar } from "@material-ui/core";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

interface IAppProps {
  classes: any;
}

interface IAppState {
  geojson: any;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      geojson: {}
    };
  }

  onShareButtonClick = e => {
    console.log('## ', this.state.geojson);
  };

  onChange = newGeojson => {
    this.setState({ geojson: newGeojson });
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              MapPandas
            </Typography>
            <Button color="inherit" onClick={this.onShareButtonClick}>
              Share
            </Button>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Switch>
            <Route
              path="/@:lat/:lng/:zoom?"
              render={props => <MyMap {...props} onChange={this.onChange} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default withStyles(styles)(App);
