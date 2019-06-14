import * as React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection } from "geojson";

import * as _ from "underscore";
import { Value } from "slate";

import { IPost, LatLng, IActiveFeature } from "./types/CustomMapTypes";
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
import TopLevelAppBar from "./AppBars";
import LayoutManager from "./LayoutManager";

import { initialValue } from "./edit/slate-default";
import { computeGeojson, documentToGeojson } from "./document2geojson";
import SmartEditor from "./edit/SmartEditor";
const uuidv1 = require("uuid/v1");

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
      maxHeight: "100%",
      background: "#fafafa"
    },
    textPane: {
      width: "100%",
      height: "100%",
      paddingTop: "80px",
      paddingBottom: theme.spacing.unit * 3,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "stretch"
    }
  });

const NEW_POST = (): IPost => ({
  uuid: uuidv1(),
  bbox: [0, 0, 0, 0],
  title: "",
  content: initialValue,
  userid: uuidv1(),
  meta: {
    canonicalUrl: ""
  }
});

interface IAppProps {
  urlKey: string;
  classes: any;
  uuid: string;
  editNew: boolean;
  editable: boolean;
  layout: string;  // column | classic | map 
}

interface IAppState {
  post: IPost;
  geojson: FeatureCollection;
  mode: string;
  share_screen: boolean;
  viewstate: any;
  mapStyle: string;
  myLocation: LatLng;
  hoveredFeature: IActiveFeature | null;
  publishable: boolean;
}

class Editor extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      ...this.getState0()
    };
  }

  getState0 = (): IAppState => ({
    post: NEW_POST(),
    geojson: GeoHelper.NEW_FC(),
    mode: this.props.editable ? "edit" : "share",
    share_screen: false,
    viewstate: GeoHelper.INITIAL_VIEWSTATE(),
    mapStyle: "light-v9",
    myLocation: GeoHelper.DEFAULT_LATLNG,
    hoveredFeature: null,
    publishable: false,
  });

  getStateNewEdit = () => ({
    post: NEW_POST(),
    mode: "edit",
    geojson: GeoHelper.NEW_FC(),
    publishable: false
  });

  onNewButtonClick = () => {
    document.title = "MapPandas - Draft";
    this.setState(this.getStateNewEdit(), () => {
      //this.props.history.push("/", { dontMoveMap: true });
    });
  };

  /**
   * Handle new data from the backend
   */
  onDataLoaded = (post: IPost): void => {
    if (post.content && post.content.document) {

      const mode = this.props.editable ? "edit" : "share";
      this.setState({ post, mode });
      this.updateDocTitle(post.content);
      const geojson = documentToGeojson(post.content.document);
      this.updateStateFromGeojson(geojson);
    }
  };

  onInitialized = (_viewstate: any) => {
    this.updateDimensions();
    this.setState({
      ...this.getStateNewEdit()
    },
      () => {
        document.title = this.state.post.title;
      }
    );
    this._locateMe();
  };

  onViewstateChanged = _viewstate => {
    const newVS = _viewstate.viewState
      ? _viewstate.viewState
      : { ...this.state.viewstate, ..._viewstate };
    this.setState({ viewstate: newVS });
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
    //console.log("#mapDivDimensions", width, height);
    return { width, height };
  };

  componentDidMount() {
    const { uuid, editNew } = this.props;
    if (!editNew) {
      getGeojsonFromCacheOrRemote(uuid).then(post => {
        this.onDataLoaded(post);
      });
    } else {
      this.onNewButtonClick();
    };

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentDidUpdate(prevProps: IAppProps) {
    const {layout} = this.props;
    if (layout === "map" || layout === "column") {
      this.updateDimensions();
    }

    if (this.props.layout !== prevProps.layout) {
      //this.onDataLoaded(this.state.post);

      // this.forceUpdate(() => {
      //   console.log("#forceUpdate()")
      // });
    }
  }

  // componentDidUpdate(prevProps: IAppProps, prevSta) {
  //   console.log("#Editor.CDU() ", prevProps, this.props);

  //   const prevUrlParams = new URLSearchParams(prevProps.location.search);
  //   const prevLayout = parseLayout(prevUrlParams.get("layout"));

  //   const urlParams = new URLSearchParams(this.props.location.search);
  //   const layout = parseLayout(urlParams.get("layout"));


  //   if (layout !== prevLayout) {
  //     this.setState({ layout });
  //     //this.props.updateLayout(layout);
  //     const uuid = this.props.match.params["uuid"];

  //     //this.getGeojsonFromCacheOrRemote(uuid, false, layout);

  //   }
  // }

  public render() {
    const { classes, layout, urlKey, editable } = this.props;
    const { mode, post } = this.state;
    return (
      <div className={classes.root} key={this.props.urlKey}>
        <TopLevelAppBar
          readonly={!editable}
          layout={layout}
          isPublishable={this.state.publishable}
          onCreateNewClick={this.onNewButtonClick}
          onPublishClick={this.onPublishClick}
        />

        <LayoutManager layout={layout} {...this.props} editor={<TextPane key={this.props.urlKey}
        >
          <SmartEditor
            //key={post.uuid+layout}
            key={urlKey}
            uuid={post.uuid}
            content={post.content}
            readonly={!editable}
            layout={layout}
            onLocationUpdate={this.onLocationUpdateHandler}
            onContentChange={this.onContentChange}
          />
        </TextPane>
        }
          map={
            <MapNG
              geojson={this.state.geojson}
              viewstate={this.state.viewstate}
              onViewStateChanged={this.onViewstateChanged}
              mapStyle={this.state.mapStyle}
              onHover={this.onHover}
            />}
        />
        <Popup data={this.state.hoveredFeature} />
        {/* <LocateMe onClick={this._locateMe} /> */}
        <ScrollToTop />
        {/* <Switcher
          currentStyle={this.state.mapStyle}
          onChange={this.onMapStyleChange}
        /> */}

        <ShareScreen
          post={this.state.post}
          open={this.state.share_screen}
          onClose={this.onShareScreenClose}
        />
      </div>
    );
  }

  onPublishClick = () => {
    const uri = `/p/${this.state.post.uuid}`;
    const { post } = this.state;
    restClient.createPost(post).then(uuid => {
      this.setState({ share_screen: true });
      //this.props.history.replace(uri);
    });
  };

  onContentChange = content => {
    const title = this.updateDocTitle(content);
    const canonical = content.document.nodes.find(node => node.type === "canonical");
    const meta = canonical && canonical.text ? { canonical: canonical.text } : {};
    const newPost = { ...this.state.post, content, title, meta };
    this.setState({ post: newPost });
  };

  onLocationUpdateHandler = (location, editor) => {
    computeGeojson(location, editor, this.updateStateFromGeojson);
  };

  updateStateFromGeojson = geojson => {
    if (geojson.features.length === 0) {
      this.setState({ geojson });
    } else {
      const { width, height } = this.getMapDivDimensions();
      const bbox = GeoHelper.bboxFromGeoJson(geojson);
      const newViewstate = Object.assign(
        this.state.viewstate,
        GeoHelper.bbox2Viewport(bbox, width, height)
      );
      this.setState({ geojson, viewstate: newViewstate });
    }
  };

  _locateMe = () => {
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


  updateDocTitle = (content) => {
    // get text from first paragraph
    var title = content.document.nodes.first().getFirstText().text;
    if (!title) {
      // not found so let's use whatever text available
      title = content.document.text.substring(0, 200);
    }
    document.title = this.state.mode === "edit" ? "Draft - " : "" + title.substring(0, 80);
    return title;
  }

}

const getGeojsonFromCacheOrRemote = async (uuid: string) => {
  const post = await restClient.get(uuid);
  const slateContent = Value.fromJSON(post.content);
  post.content = Value.isValue(slateContent) ? slateContent : initialValue;
  return post;
  //   if (editable) {
  //     post.uuid = uuidv1();
  //   }
};


export default withStyles(styles)(Editor);
