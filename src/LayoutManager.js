import * as React from "react";
import { Grid, withStyles, Fade } from "@material-ui/core";

const styles = (theme) =>
    ({
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
            alignItems: "stretch"
        }
    });


class LayoutManager extends React.PureComponent {


    constructor(props) {
        super(props);
        this.LayoutTable = {
            "classic": this.classic,
            "map": this.map,
            "column": this.column
        }
    }


    render() {
        const { classes, layout, editor } = this.props;
        //console.log("#LayoutMgr.render()", editor);
        //const func = this.LayoutTable[layout]();
        switch (layout) {
            case "classic": return this.classic();
            case "map": return this.map();
            case "column": return this.column();
            default: return this.column();
        };
    }

    classic = () => {
        const { classes, editor } = this.props;

        return (<Grid spacing={0} container={true} alignContent="stretch">
            <Grid item xs={12}>
                {this.props.editor}
                {/* <div id="text-pane-id" className={classes.textPane}>
                    {this.props.editor}
                </div> */}
            </Grid>
        </Grid>);
    }

    map = () => {
        const { classes } = this.props;
        return (<Grid spacing={0} container={true} alignContent="stretch">
            <Grid item xs={12} style={{ flexGrow: 1 }}>
                <div id="mapng" style={{ width: "100vw", flexShrink: 0 }}>
                    {this.props.map}
                    {/* {this.props.editor()} */}
                </div>
            </Grid>
        </Grid>);
    }

    column = () => {
        const { classes } = this.props;
        return (<Grid spacing={0} container={true} alignContent="stretch">
            <Grid item xs={12} md={6}>
                {this.props.editor}

                {/* <div id="text-pane-id" className={classes.textPane}>
                    {this.props.editor}
                </div> */}
            </Grid>
            <Grid item xs={12} md={6}>
                <div
                    id="mapng"
                    style={{
                        padding: 0,
                        position: "relative",
                    }}
                >{this.props.map}
                </div>
            </Grid>
        </Grid>);
    }
}





export default withStyles(styles)(LayoutManager)
