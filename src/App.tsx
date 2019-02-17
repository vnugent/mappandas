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
//import { Edit as EditIcon } from "@material-ui/icons";
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
//import Upload from "./Upload";
import Popup from "./map/Popup";
import TextPane from './TextPane';

const styles = theme => ({
  root: { display: "flex", height: "100%" },
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
  descriptionVisible: boolean;
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
    mode: "view",
    share_screen: false,
    viewstate: GeoHelper.INITIAL_VIEWSTATE(),
    mapStyle: "light-v9",
    descriptionVisible: true,
    myLocation: GeoHelper.DEFAULT_LATLNG,
    hoveredFeature: null
  });

  onShareButtonClick = () => {
    const uri = `/p/${this.state.panda.uuid}`;
    restClient.create(this.state.panda);
    localStorage.setItem(
      this.state.panda.uuid,
      GeoHelper.stringify(this.state.panda)
    );
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

  onDataLoaded = (data: IPanda, editable: boolean): void => {
    console.log("App.onDataLoaded()", data.geojson);
    console.log("  viewport: ", this.state.viewstate);
    const newViewstate = {
      ...this.state.viewstate,
      ...GeoHelper.bbox2Viewport(data.bbox)
    };
    console.log("  new viewport: ", newViewstate);

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
    console.log("App.onEditUpdate() ", geojson);
    this.setState({
      editableJSON: geojson,
      panda: newPanda
    });
  };

  onInitialized = (_viewstate: any) => {
    console.log("setting initial URL", _viewstate);
    this.setState({ viewstate: _viewstate });
  };

  onViewstateChanged = _viewstate => {
    const newVS = _viewstate.viewState
      ? _viewstate.viewState
      : { ...this.state.viewstate, ..._viewstate };
    this.setState({ viewstate: newVS });
  };

  onEditorUpdate = (fc: FeatureCollection2) => {
    if (fc.features.length === 0) {
      this.setState({ editableJSON: fc });
    } else {
      const newViewstate = fc.bbox
        ? {
            ...this.state.viewstate,
            ...GeoHelper.bbox2Viewport(fc.bbox)
          }
        : this.state.viewstate;
      this.setState({ editableJSON: fc, viewstate: newViewstate });
    }
  };

//   private isSharable = () => {
//     const geojson = this.state.panda.geojson;
//     const flag =
//       this.state.mode === "edit" &&
//       geojson &&
//       geojson.features &&
//       geojson.features.length > 0 &&
//       this.state.panda.description
//         ? true
//         : false;
//     return flag;
//   };

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
    //const width = window.innerWidth;
    const div = document.getElementById("mapng");
    let width = 500;
    if (div) {
      width = div.clientWidth;
    }
    const height = window.innerHeight - 10;
    const newViewport = Object.assign({}, this.state.viewstate);
    newViewport.width = width;
    newViewport.height = height;
    this.setState({ viewstate: newViewport });
  }, 400);

  componentDidMount() {
    this._locateMe();
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  public render() {
    const { classes } = this.props;
    //const { mode } = this.state;
    return (
      <div className={classes.root}>
        {/* <AppBar position="relative" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <div id="search-container" className={classes.grow} /> 
            <LastN currentPanda={this.state.panda} />
            <div className={classes.mainAction}>
              <Tooltip title="Hand draw a new map" aria-label="Add">
                <Button
                  className={classes.menuButton}
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={this.onNewButtonClick}
                >
                  <EditIcon />
                  &nbsp; Draw New
                </Button>
              </Tooltip>
              <Upload
                classes={classes}
                onError={e => {
                  console.log(e);
                }}
                onUpload={this.onUpload}
              />
            </div>
          </Toolbar>
        </AppBar> */}
        <Grid spacing={0} container={true}>
          <Grid item xs={12} sm={6}>
            <TextPane data={this.state.editableJSON} onEditorUpdate={this.onEditUpdated} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div
              id="mapng"
              style={{
                display: "flex",
                position: "relative",
                backgroundColor: "blue"
              }}
            >
              <MapNG
                geojson={this.state.editableJSON}
                viewstate={this.state.viewstate}
                onViewStateChanged={this.onViewstateChanged}
                onEditUpdated={this.onEditUpdated}
                mapStyle={this.state.mapStyle}
                onHover={this.onHover}
              />
              <Popup data={this.state.hoveredFeature} />
            </div>
            <ShareScreen
              classes={classes}
              panda={this.state.panda}
              open={this.state.share_screen}
              onClose={this.onShareScreenClose}
            />

            <LocateMe onClick={this._locateMe} />
            <Switcher
              currentStyle={this.state.mapStyle}
              onChange={this.onMapStyleChange}
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
    GeoHelper.getLatLngFromIP().then(latlng => {
      this.setState({
        myLocation: latlng,
        viewstate: { ...this.state.viewstate, ...latlng }
      });
    });
  };
  _showHideDescriptionPanel = () =>
    this.setState({ descriptionVisible: !this.state.descriptionVisible });

  onHover = _.debounce((evt: IActiveFeature) => {
    this.setState({ hoveredFeature: evt });
  }, 100);
}

const RRApp = withRouter(App);
export default withStyles(styles)(RRApp);
