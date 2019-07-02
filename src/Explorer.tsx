import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as _ from "underscore";

import ExplorerAppBar from "./ExplorerAppBar"
import * as GeoHelper from "./GeoHelper";
import LayoutManager from "./LayoutManager";
import MapNG from "./MapNG";
import Popup from "./map/Popup";
import Sidebar from "./map/Sidebar";
import Report from "./report/Report";
import * as DataLoader from "./mashup/DataLoader"
const uuidv1 = require("uuid/v1");

import { initialValue } from "./edit/slate-default";
import * as restClient from "./RestClient";

interface IExplorerProps extends RouteComponentProps {
    editNew: boolean;
}

interface IExplorerState {
    viewState: any;
    supportingData: Map<string, string>;
    hoverData: any;
    sidebarOn: boolean;
    address: any;
}


export default class Explorer extends React.Component<
    IExplorerProps,
    IExplorerState
    > {
    constructor(props: IExplorerProps) {
        super(props);
        this.state = {
            viewState: { ...GeoHelper.INITIAL_VIEWSTATE(), latitude: 45.52345, longitude: -122.67621 },
            supportingData: new Map(),
            hoverData: null,
            sidebarOn: false,
            address: null
        };
    }

    componentDidMount() {
       DataLoader.loadGeojson().then(data => this.setState({ supportingData: data }))
    }


    render() {
        const { viewState, supportingData, sidebarOn, address } = this.state;
        const layers = Array.from(supportingData.values())
        return <div>
            <ExplorerAppBar supportingData={supportingData} onToggleLayer={this.toggleLayer} />
            <LayoutManager layout="map" map={<>
                <MapNG
                    //geojson={school}
                    //selectedFeature={this.state.selectedFeature}
                    supportingLayers={layers}
                    viewstate={viewState}
                    onViewStateChanged={this.onViewstateChanged}
                    onPointHover={this.onMarkerHover}
                    onclickHandler={this.onclickHandler}
                    hoverHandler={this.hoverHandler}
                />
                <Popup {...this.state.hoverData} />
                <Sidebar shouldOpen={sidebarOn} onClose={() => this.setState({ sidebarOn: false })} >
                    <Report address={address} />
                </Sidebar>
            </>
            } />
        </div>
    }

    toggleLayer = uuid => {
        const { supportingData } = this.state;
        this.setState({ supportingData: DataLoader.toggleLayer(uuid, supportingData) });
    }

    onViewstateChanged = ({ viewState }) => this.setState({ viewState })
    onMarkerHover = () => { }
    onPointClick = () => { }

    hoverHandler = _.debounce((info) => {
        this.setState({ hoverData: info.layer ? info : null })
    }, 180)

    onclickHandler = _.debounce((info) => {
        console.log(info);
        // const content = info && info.layer && info.layer.props && info.layer.props.layer_attributes  null;
        this.setState({
            sidebarOn: info && info.layer ? true : false,
            hoverData: info && info.layer ? info : null
        });
        _.delay(() => this.setState({
            sidebarOn: info && info.layer ? true : false,
            address: info && info.layer && info.layer.props.layer_attributes.category === "Home" ? info.object.properties.name : null
        }), 500);
    }, 100, true)
}

