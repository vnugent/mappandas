import * as React from "react";
import { Drawer, withStyles, createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
    createStyles({
        root: {
        },
        content: {
            paddingTop: "50px"

        }
    });

interface IAppProps {
    classes: any;
    onClose: (event) => void;
    shouldOpen: boolean
}

interface IAppState {

}

class Sidebar extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
    }

    public render() {
        const { classes, shouldOpen, children, onClose } = this.props;
        return (
            <div className={classes.root}>
                <Drawer open={shouldOpen} variant="permanent" onClose={onClose} ModalProps={
                    { disableAutoFocus: true }
                }>
                    <div className={classes.content}>
                        {children}</div>
                </Drawer>
            </div>
        );
    }
}

export default withStyles(styles)(Sidebar);



