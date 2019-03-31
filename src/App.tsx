import * as React from "react";
import "./App.css";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import {
  //   Button,
  //   Toolbar,
  //   Tooltip,
  Grid,
  withStyles
} from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";

import * as _ from "underscore";

import { IPanda, LatLng, IActiveFeature } from "./types/CustomMapTypes";
import { FeatureCollection2 } from "@mappandas/yelapa";

import DefaultURLHandler from "./DefaultURLHandler";
import LatLngURLHandler from "./LatLngURLHandler";
import ShowPandaURLHandler from "./ShowPandaURLHandler";
import * as GeoHelper from "./GeoHelper";
import * as restClient from "./RestClient";
//import LastN from "./Filters/LastN";
import MapNG from "./MapNG";
import ShareScreen from "./ShareScreen";
import Switcher from "./Switcher";
import LocateMe from "./LocateMe";
import ScrollToTop from "./ScrollToTop";
import Popup from "./map/Popup";
import TextPane from "./TextPane";
import PandaCardView from "./panda/PandaCardView";
import TopLevelAppBar from "./AppBars";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
      maxHeight: "100%",
      background: "white"
    },
    textPane: {
      width: "100%",
      height: "100%",
      paddingTop: "80px",
      paddingBottom: theme.spacing.unit * 3,
      boxSizing: "border-box",
      alignItems: "stretch"
    }
  });

interface IAppProps extends RouteComponentProps {
  classes: any;
}

interface IAppState {
  panda: IPanda;
  editableJSON: FeatureCollection2;
  mode: string;
  share_screen: boolean;
  viewstate: any;
  mapStyle: string;
  myLocation: LatLng;
  hoveredFeature: IActiveFeature | null;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      ...this.getState0()
    };
  }

  getState0 = (): IAppState => ({
    panda: GeoHelper.NEW_PANDA(),
    editableJSON: GeoHelper.NEW_FC(),
    mode: "edit",
    share_screen: false,
    viewstate: GeoHelper.INITIAL_VIEWSTATE(),
    mapStyle: "light-v9",
    myLocation: GeoHelper.DEFAULT_LATLNG,
    hoveredFeature: null
  });

  onShareButtonClick = () => {
    const uri = `/p/${this.state.panda.uuid}`;
    const { panda, editableJSON } = this.state;
    panda.geojson = editableJSON;
    panda.bbox = GeoHelper.bboxFromGeoJson(editableJSON);

    restClient.create(panda);

    localStorage.setItem(this.state.panda.uuid, GeoHelper.stringify(panda));
    this.setState({ mode: "share", share_screen: true });
    this.props.history.replace(uri);
  };

  onNewButtonClick = () => {
    this.setState(
      {
        panda: GeoHelper.NEW_PANDA(),
        editableJSON: GeoHelper.NEW_FC(),
        mode: "edit"
      },
      () => {
        this.props.history.push("/", { dontMoveMap: true });
      }
    );
  };

  /**
   * Handle new data from the backend (or possibly from local storage cache)
   */
  onDataLoaded = (data: IPanda, editable: boolean): void => {
    const { width } = this.getMapDivDimensions();
    const height = window.innerHeight;
    const newViewstate = Object.assign(
      this.state.viewstate,
      GeoHelper.bbox2Viewport(data.bbox, width, height)
    );

    this.setState({
      mode: "share",
      panda: data,
      editableJSON: data.geojson,
      viewstate: newViewstate
    });
  };

  onEditUpdated = (geojson: FeatureCollection2) => {
    const newPanda = this.state.panda;
    newPanda.geojson = geojson;
    newPanda.bbox = GeoHelper.bboxFromGeoJson(geojson);
    this.setState({
      editableJSON: geojson,
      panda: newPanda
    });
  };

  onInitialized = (_viewstate: any) => this._locateMe();

  onViewstateChanged = _viewstate => {
    const newVS = _viewstate.viewState
      ? _viewstate.viewState
      : { ...this.state.viewstate, ..._viewstate };
    console.log("## new viewstate:", newVS);
    this.setState({ viewstate: newVS });
  };

  onEditorUpdate = (
    fc: FeatureCollection2,
    options = {
      shouldUpdateView: false
    }
  ) => {
    if (fc.features.length === 0) {
      this.setState({ editableJSON: fc });
    } else {
      const { shouldUpdateView } = options;
      const { width, height } = this.getMapDivDimensions();
      fc.bbox = GeoHelper.bboxFromGeoJson(fc);
      const newViewstate =
        shouldUpdateView && fc.bbox
          ? Object.assign(
              this.state.viewstate,
              GeoHelper.bbox2Viewport(fc.bbox, width, height)
            )
          : this.state.viewstate;
      this.setState({ editableJSON: fc, viewstate: newViewstate });
    }
  };

  onCancelEdit = () =>
    this.setState(
      {
        panda: GeoHelper.NEW_PANDA(),
        editableJSON: GeoHelper.NEW_FC(),
        mode: "view"
      },
      () => {
        this.props.history.push("/", { dontMoveMap: true });
      }
    );

  onUpload = (geojson: FeatureCollection2) => {
    this.setState(
      {
        mode: "edit"
      },
      () => {
        this.onEditUpdated(geojson);
      }
    );
  };

  onShareScreenClose = event => {
    this.setState(
      { share_screen: false },
      () => event.edit && this.onNewButtonClick()
    );
  };

  onMapStyleChange = (style: string) => this.setState({ mapStyle: style });

  updateDimensions = _.debounce(() => {
    const { width, height } = this.getMapDivDimensions();
    const newViewport = Object.assign({}, this.state.viewstate);
    newViewport.width = width;
    newViewport.height = height;
    this.setState({ viewstate: newViewport });
  }, 400);

  getMapDivDimensions = () => {
    const div = document.getElementById("mapng");
    let width = 500;
    //let height = 250;
    if (div) {
      width = div.clientWidth;
      //height = div.clientHeight;
    }
    const height = window.innerHeight;
    return { width, height };
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  public render() {
    const { classes } = this.props;
    const { mode } = this.state;
    return (
      <div className={classes.root}>
        <TopLevelAppBar
          data={this.state.editableJSON}
          onCreateNewClick={this.onNewButtonClick}
        />
        <Grid spacing={0} container={true} alignContent="stretch">
          <Grid item xs={12} md={6}>
            <div id="text-pane-id" className={classes.textPane}>
              {mode === "share" && (
                <PandaCardView data={this.state.editableJSON} />
              )}
              {mode === "edit" && (
                <TextPane
                  data={this.state.editableJSON}
                  onPublishButtonClick={this.onShareButtonClick}
                  onEditorUpdate={this.onEditorUpdate}
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div
              id="mapng"
              style={{
                padding: 0,
                position: "relative"
              }}
            >
              <MapNG
                geojson={this.state.editableJSON}
                viewstate={this.state.viewstate}
                onViewStateChanged={this.onViewstateChanged}
                mapStyle={this.state.mapStyle}
                onHover={this.onHover}
              />
              <Popup data={this.state.hoveredFeature} />
            </div>
            <LocateMe onClick={this._locateMe} />
            <ScrollToTop />
            <Switcher
              currentStyle={this.state.mapStyle}
              onChange={this.onMapStyleChange}
            />

            <ShareScreen
              panda={this.state.panda}
              open={this.state.share_screen}
              onClose={this.onShareScreenClose}
            />
            <Switch>
              <Route
                path="/@:lat?/:lng?/:zoom?"
                render={props => (
                  <LatLngURLHandler
                    {...props}
                    onLatLngChanged={this.onViewstateChanged}
                  />
                )}
              />
              <Route
                path="/p/:uuid/:edit?"
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
          </Grid>
        </Grid>
      </div>
    );
  }

  _locateMe = () => {
    return GeoHelper.getLatLngFromIP();
    GeoHelper.getLatLngFromIP().then(latlng => {
      this.setState({
        // myLocation: latlng,
        viewstate: { ...this.state.viewstate, ...latlng }
      });
    });
  };

  onHover = _.debounce((evt: IActiveFeature | null) => {
    this.setState({ hoveredFeature: evt });
  }, 100);
}

const RRApp = withRouter(App);
export default withStyles(styles)(RRApp);
