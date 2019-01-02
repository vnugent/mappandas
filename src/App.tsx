import * as React from "react";
import "./App.css";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Tooltip,
  withStyles
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { FeatureCollection } from "geojson";
import * as _ from "underscore";

import { IPanda } from "./types/CustomMapTypes";

import DefaultURLHandler from "./DefaultURLHandler";
import LatLngURLHandler from "./LatLngURLHandler";
import ShowPandaURLHandler from "./ShowPandaURLHandler";
import * as GeoHelper from "./GeoHelper";
import * as restClient from "./RestClient";
import LastN from "./Filters/LastN";
import PandaMetaEditor from "./PandaMetaEditor";
import MapNG from "./MapNG";
import ShareScreen from "./ShareScreen";
import Switcher from "./Switcher";
import Upload from "./Upload";

const styles = theme => ({
  root: {},
  grow: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: "transparent",
    zIndex: 1000
  },
  menuButton: {
    margin: theme.spacing.unit
  }
});

interface IAppProps extends RouteComponentProps {
  classes: any;
}

interface IAppState {
  panda: IPanda;
  editableJSON: FeatureCollection;
  mode: string;
  share_screen: boolean;
  viewstate: any;
  mapStyle: string;
  descriptionVisible: boolean;
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
    descriptionVisible: true
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

  onEditUpdated = (geojson: FeatureCollection) => {
    const newPanda = this.state.panda;
    newPanda.geojson = geojson;
    newPanda.bbox = GeoHelper.bboxFromGeoJson(geojson);
    console.log("App.onEditUpdate() ", geojson);
    this.setState({
      editableJSON: geojson,
      panda: newPanda
      //viewstate: GeoHelper.bounds2Viewport(newPanda.bbox)
    });
  };

  onInitialized = (_viewstate: any) => {
    console.log("setting initial URL", _viewstate);
    this.setState({ viewstate: _viewstate });
  };

  onViewstateChanged = _viewstate => {
    console.log("## new view ", _viewstate);
    const newVS = _viewstate.viewState
      ? _viewstate.viewState
      : { ...this.state.viewstate, ..._viewstate };
    this.setState({ viewstate: newVS });
  };

  onDescriptionUpdate = (event: any) => {
    const currentPanda = this.state.panda;
    currentPanda.description = event.target.value;
    this.setState({ panda: currentPanda });
  };
  private isSharable = () => {
    const geojson = this.state.panda.geojson;
    const flag =
      this.state.mode === "edit" &&
      geojson &&
      geojson.features &&
      geojson.features.length > 0 &&
      this.state.panda.description
        ? true
        : false;
    return flag;
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

  onUpload = (geojson: FeatureCollection) => {
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newViewport = Object.assign({}, this.state.viewstate);
    newViewport.width = width;
    newViewport.height = height;
    this.setState({ viewstate: newViewport });
  }, 400);

  componentDidMount() {
    GeoHelper.getLatLngFromIP().then(latlng => {
      GeoHelper.MY_LATLNG.latitude = latlng[0];
      GeoHelper.MY_LATLNG.longitude = latlng[1];
      //this.setState({ viewstate: GeoHelper.INITIAL_VIEWSTATE() });
    });
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
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.appBar}>
            <div id="search-container" className={classes.grow} />
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
          </Toolbar>
        </AppBar>
        <div className="mapng-container">
          <MapNG
            editable={mode === "edit"}
            geojson={this.state.editableJSON}
            viewstate={this.state.viewstate}
            onViewStateChanged={this.onViewstateChanged}
            onEditUpdated={this.onEditUpdated}
            mapStyle={this.state.mapStyle}
          />
        </div>
        <ShareScreen
          classes={classes}
          panda={this.state.panda}
          open={this.state.share_screen}
          onClose={this.onShareScreenClose}
        />
        {(mode === "edit" || mode === "share") && (
          <PandaMetaEditor
            visible={this.state.descriptionVisible}
            editable={mode === "edit"}
            description={this.state.panda.description}
            onDescriptionUpdate={this.onDescriptionUpdate}
            onShowHideFn={this._showHideDescriptionPanel}
            sharable={this.isSharable()}
            onShare={this.onShareButtonClick}
            onCancel={this.onCancelEdit}
          />
        )}
        <LastN />
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
      </div>
    );
  }

  _showHideDescriptionPanel = () =>
    this.setState({ descriptionVisible: !this.state.descriptionVisible });
}

const RRApp = withRouter(App);
export default withStyles(styles)(RRApp);
