import * as React from "react";
import "./App.css";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import { LatLngBounds } from "leaflet";
import { GeoJSON } from "react-leaflet";

import DefaultURLHandler from "./DefaultURLHandler";
import LatLngURLHandler from "./LatLngURLHandler";
import ShowPandaURLHandler from "./ShowPandaURLHandler";

import * as GeoHelper from "./GeoHelper";
import Editor from "./Editor";

import * as restClient from "./RestClient";
import BaseMap from "./BaseMap";
import LastN from "./Filters/LastN";
import { IViewport, IPanda } from "./types/CustomMapTypes";
import { FeatureCollection } from "geojson";

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

interface IAppProps extends RouteComponentProps {
  classes: any;
}

interface IAppState {
  panda: IPanda;
  mode: string;
  viewport?: IViewport;
  bbox?: LatLngBounds;
}

class App extends React.Component<IAppProps, IAppState> {
  private editorRef;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      panda: GeoHelper.NEW_PANDA(),
      mode: "edit",
      viewport: undefined,
      bbox: undefined
    };
    this.editorRef = React.createRef();
  }

  onShareButtonClick = e => {
    console.log("## onShareButtonClick()");
    const uri = `/p/${this.state.panda.uuid}`;
    restClient.create(this.state.panda);
    localStorage.setItem(
      this.state.panda.uuid,
      GeoHelper.stringify(this.state.panda)
    );
    this.setState({ mode: "sharing" });

    this.props.history.push(uri);
  };

  onNewButtonClick = e => {
    if (
      this.state.panda.geojson &&
      this.editorRef &&
      typeof this.editorRef.clear === "function"
    ) {
      this.editorRef.clear();
    }

    this.setState(
      {
        mode: "edit",
        panda: GeoHelper.NEW_PANDA()
      },
      () => {
        this.props.history.push("/", {dontMoveMap: true});
      }
    );
  };

  onDataLoaded = (data: IPanda): void => {
    console.log("load new data", data.geojson);
    this.setState({
      panda: data,
      viewport: undefined,
      bbox: data.bbox,
      mode: "sharing"
    });
  };

  onEditUpdated = (geojson: FeatureCollection) => {
    const newPanda = GeoHelper.NEW_PANDA();
    newPanda.geojson = geojson;
    newPanda.bbox = GeoHelper.bboxFromGeoJson(geojson);
    this.setState({ panda: newPanda });
  };

  onInitialized = (_viewport: IViewport) => {
    console.log("setting initial URL", _viewport);
    this.setState({ viewport: _viewport }, () => {
      this.props.history.replace("/edit");
    });
  };

  onViewportChanged = (_viewport: IViewport) => {
    this.setState({ viewport: _viewport, bbox: undefined });
  };

  private isSharable = () => {
    const geojson = this.state.panda.geojson;
    const flag =
      this.state.mode !== "sharing" &&
      geojson &&
      geojson.features &&
      geojson.features.length > 0
        ? true
        : false;
    return flag;
  };

  public render() {
    const { classes } = this.props;
    // const currentBBox =
    //   this.mapRef && this.mapRef.current
    //     ? this.mapRef.current.getCurrentBbox()
    //     : undefined;
    // console.log(">> current BBox ", this.mapRef, currentBBox);
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar color="" variant="dense">
            <Typography variant="h6" color="inherit">
              MapPandas
            </Typography>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={this.onShareButtonClick}
              disabled={!this.isSharable()}
            >
              Share
            </Button>
            <Button color="inherit" onClick={this.onNewButtonClick}>
              New
            </Button>
          </Toolbar>
        </AppBar>
        {(this.state.viewport || this.state.bbox) && (
          <BaseMap
            viewport={this.state.viewport}
            bbox={this.state.bbox}
            onViewportChanged={this.onViewportChanged}
          >
            {this.state.mode === "edit" && (
              <Editor
                ref={ref => (this.editorRef = ref)}
                onChange={this.onEditUpdated}
              />
            )}
            {this.state.panda.geojson && this.state.mode == "sharing" && (
              <GeoJSON
                key={this.state.panda.uuid}
                data={this.state.panda.geojson}
              />
            )}
          </BaseMap>
        )}
        <LastN />
        <Switch>
          <Route
            path="/@:lat?/:lng?/:zoom?"
            render={props => (
              <LatLngURLHandler
                {...props}
                onLatLngChanged={this.onViewportChanged}
              />
            )}
          />
          <Route
            path="/p/:uuid"
            render={props => (
              <ShowPandaURLHandler
                key={props.location.key}
                {...props}
                onDataLoaded={this.onDataLoaded}
              />
            )}
          />
          } />
          <Route
            render={props => (
              <DefaultURLHandler
                {...props}
                onInitialized={this.onInitialized}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const RRApp = withRouter(App);
export default withStyles(styles)(RRApp);
