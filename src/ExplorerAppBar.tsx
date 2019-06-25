import * as React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Menu,
  Chip,
  withStyles,
  createStyles,
  Theme,
  IconButton,
  Divider
} from "@material-ui/core";
import { Done, CheckBoxOutlineBlank } from "@material-ui/icons";

const styles = (theme: Theme) =>
  createStyles({
    padding: {
      flexGrow: 1
    },
    title: {
      fontFamily: "serif",
      fontWeight: "bold",
      letterSpacing: "0.1em"
    },
    appBar: {
      position: "fixed",
      boxShadow: "none",
      backgroundColor: "#fafafa",
      left: 0,
      zIndex: 1000,
      width: "100%"
    },
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      margin: theme.spacing.unit,
    },
  });

interface IAppProps {
  classes: any;
  supportingData: Map<string, string>;
  onToggleLayer: Function;
}
interface IAppState {

}
class ExplorerAppBar extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const {
      classes,
      supportingData
    } = this.props;
    return <AppBar color="inherit" >
      <div>{this.makeOptions(supportingData, classes)}</div>
    </AppBar>;
  }

  makeOptions = (supportingData, classes) => {
    const results = Array();
    console.log("#makeoption ", supportingData)
    supportingData.forEach((value, key) => {
      console.log(key)
      const uuid = key;
      const entry = value;
      const { layer_attributes, visible } = entry.props;
      const visibleIcon = visible ? <Done /> : <CheckBoxOutlineBlank />
      results.push(<Chip key={uuid} label={layer_attributes.label}  color={visible ? "secondary" : "inherit"} className={classes.chip} onClick={() => this.props.onToggleLayer(uuid)} />);
    });
    return results;

  }
}




const handleClick = uuid => console.log(uuid)


export default withStyles(styles)(ExplorerAppBar);