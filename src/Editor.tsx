import * as React from "react";
import { withStyles } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { FeatureCollection } from "geojson";
import { withRouter, RouteComponentProps } from "react-router-dom";


import * as _ from "underscore";
import { Value } from "slate";

import { IPost, LatLng, IActiveFeature } from "./types/CustomMapTypes";
import { FeatureCollection2 } from "@mappandas/yelapa";

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

interface IAppProps extends RouteComponentProps {
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
  selectedFeature: any;
  mode: string;
  share_screen: boolean;
  viewstate: any;
  mapStyle: string;
  myLocation: LatLng;
  hoveredData: any;
  publishable: boolean;
  dataLoaded: boolean;
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
    selectedFeature: {
      id: -1,
      on: false
    },
    geojson: GeoHelper.NEW_FC(),
    mode: this.props.editable ? "edit" : "share",
    share_screen: false,
    viewstate: GeoHelper.INITIAL_VIEWSTATE(),
    mapStyle: "light-v9",
    myLocation: GeoHelper.DEFAULT_LATLNG,
    hoveredData: null,
    publishable: false,
    dataLoaded: false
  });

  getStateNewEdit = () => ({
    post: NEW_POST(),
    mode: "edit",
    geojson: GeoHelper.NEW_FC(),
    publishable: false
  });

  onNewButtonClick = () => {
    //document.title = "MapPandas - Draft";
    //_.delay(this._locateMe, 300);
    // this.setState(this.getStateNewEdit(), () => {
    //   //this.props.history.push("/", { dontMoveMap: true });
    // });
    this.initializeForNew();
    this.props.history.push("/new?layout=" + this.props.layout, { dontMoveMap: true });
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
      _.delay(() => this.updateStateFromGeojson(geojson), 1000);
    }
  };

  initializeForNew = () => {
    this.updateDimensions();
    this.setState({
      ...this.getStateNewEdit()
    },
      () => {
        document.title = this.state.post.title;
      }
    );
    _.delay(this._locateMe, 300);

  };

  onViewstateChanged = ({ viewState }) => {
    this.setState({ viewstate: viewState })
  };

  onShareScreenClose = event => {
    this.setState(
      { share_screen: false },
      () => event.edit && this.onNewButtonClick()
    );
  };

  onMapStyleChange = (style: string) => this.setState({ mapStyle: style });

  updateDimensions = () => {
    const { width, height } = this.getMapDivDimensions();
    const newViewport = Object.assign({}, this.state.viewstate);
    newViewport.width = width;
    newViewport.height = height;
    this.setState({ viewstate: newViewport });
  };

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
    this._locateMe();
    this.updateDimensions();

    const { uuid, editNew } = this.props;
    if (!editNew) {
      getGeojsonFromCacheOrRemote(uuid).then(post => {
        this.onDataLoaded(post);
      });
    } else {
      this.initializeForNew();
    };

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  // componentDidUpdate(prevProps: IAppProps) {
  //   console.log("#Editor.componentDidUpdate() ", this.props);
  //   const { layout, editNew } = this.props;
  //   if ((layout !== prevProps.layout) && (layout === "map" || layout === "column")) {
  //     //this.updateDimensions();
  //   }

  //   if (editNew && (this.props.layout !== prevProps.layout)) {
  //     // this.initializeForNew();
  //     //this.onDataLoaded(this.state.post);

  //     // this.forceUpdate(() => {
  //     //   console.log("#forceUpdate()")
  //     // });
  //   }
  // }

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
    const { post } = this.state;
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
            onCardHover={this.onCardHover}
          />
        </TextPane>
        }
          map={<>
            <MapNG
              geojson={this.state.geojson}
              selectedFeature={this.state.selectedFeature}
              viewstate={this.state.viewstate}
              onViewStateChanged={this.onViewstateChanged}
              mapStyle={this.state.mapStyle}
              onPointHover={this.onMarkerHover}
              onPointClick={this.onPointClick}
            />
            <Popup {...this.state.hoveredData} />
          </>}
        />
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

      //const { longitude, latitude, zoom } = GeoHelper.fitbound(this.state.viewstate, bbox);
      //console.log("#viewstate", newViewstate)
      this.setState({
        geojson, viewstate: {
          ...this.state.viewstate,
          ...GeoHelper.bbox2Viewport(bbox, width, height)
        }
      });
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

  onMarkerHover = _.debounce(data => {
    this.setState({ hoveredData: data });
  }, 350);

  onCardHover = (id: number, on: boolean) => {
    if (!on) return;
    this.setState({
      selectedFeature: {
        on: false
      }
    });
    this.setState({
      selectedFeature: {
        id, on
      }
    });
  }

  onPointClick = ({object }) => {
    const { properties } = object;
    if (properties && properties.dataId) {
      this.onCardHover(properties.dataId, true)
      const anchor = document.querySelector(".anchor-" + properties.dataId);
      anchor && anchor.scrollIntoView({
       // behavior: 'smooth'
      });
    }
  }


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


export default withStyles(styles)(withRouter(Editor));
