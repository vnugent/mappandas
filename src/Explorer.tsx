import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import ExplorerAppBar from "./ExplorerAppBar"
import * as GeoHelper from "./GeoHelper";
import LayoutManager from "./LayoutManager";
import MapNG from "./MapNG";
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
}


export default class Explorer extends React.Component<
    IExplorerProps,
    IExplorerState
    > {
    constructor(props: IExplorerProps) {
        super(props);
        this.state = {
            viewState: { ...GeoHelper.INITIAL_VIEWSTATE(), latitude: 45.52345, longitude: -122.67621 },
            supportingData: new Map()
        };
    }

    componentDidMount() {
        //const data = DataLoader.loadAll();
        //this.setState({ data });
        this.setState({ supportingData: DataLoader.loadAll() });

    }


    render() {
        const { viewState, supportingData } = this.state;
        console.log("#state", supportingData);
        const layers = Array.from(supportingData.values())
        return <div>
            <ExplorerAppBar supportingData={supportingData} onToggleLayer={this.toggleLayer} />
            <LayoutManager layout="map" map={
                <MapNG
                    //geojson={school}
                    //selectedFeature={this.state.selectedFeature}
                    supportingLayers={layers}
                    viewstate={viewState}
                    onViewStateChanged={this.onViewstateChanged}
                    onPointHover={this.onMarkerHover}
                    onPointClick={this.onPointClick}
                />
            } />
        </div>
    }

    toggleLayer = uuid => {
        const {supportingData} = this.state;
        this.setState({ supportingData: DataLoader.toggleLayer(uuid, supportingData) });
    }

    onViewstateChanged = ({ viewState }) => this.setState({ viewState })
    onMarkerHover = () => { }
    onPointClick = () => { }
}

