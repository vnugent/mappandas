import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";
//import FormatChecker from "./edit/FormatChecker";
import CardEditorWithPreview from "./panda/CardEditorWithPreview";

interface IProps {
  data: FeatureCollection2;
  classes: any;
  editable: boolean;
  onEditorUpdate: (fc: FeatureCollection2) => void;
}

interface IState {
  showHandleTooltip: boolean;
  raw: string;
  error: any;
  ast: any;
}

const styles = theme => ({
  root: {
    background: "#778899",
    marginTop: 80,
    width: "100%",
  }
});

class PandaMetaEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showHandleTooltip: false,
      raw: "",
      error: null,
      ast: { entries: [] }
    };
  }

  render() {
    const { classes, editable, data } = this.props;
    return (
      <div className={classes.root}>
        <CardEditorWithPreview
          data={data}
          editable={editable}
          onContentChange={this.props.onEditorUpdate}
        />
      </div>
    );
  }

  onShare = () => {};

  //   onCheckStyle = () => {
  //     let cursor = 1;
  //     if (this.textareaRef.current) {
  //       cursor = this.textareaRef.current.selectionStart;
  //     }

  //     const raw = this.state.raw;
  //     if (
  //       raw.charAt(raw.length - 1) != "\n" &&
  //       this.state.ast.entries.length > 0
  //     ) {
  //       //this.parseUserInput(raw.concat("\n--\n"), cursor);
  //     }
  //   };
}

export default withStyles(styles)(PandaMetaEditor);
