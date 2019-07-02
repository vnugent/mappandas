import * as React from 'react';
import * as client from './PdxMapHelper';

export interface IAppProps {
    address: string
}

export interface IAppState {
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
        const { address } = this.props;
        console.log("#CDW", address)
        if (address) {
            client.getSummary(address).then(data => {
                console.log("pdxmap", data);
            });
        }
    }
    public render() {
        const { address } = this.props;
        if (address) {
            client.getSummary(address).then(data => {
                console.log("pdxmap", data);
            });
        }
        return (
            <div>
                foo{address}
            </div>
        );
    }
}
