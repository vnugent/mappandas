import * as React from "react";
import { Button, Tooltip, withStyles } from "@material-ui/core";
import { CloudUploadRounded as UploadIcon } from "@material-ui/icons";
import { FeatureCollection } from "geojson";

const styles = theme => ({
  input: {
    display: "none"
  }
});

export interface IAppProps {
  classes: any;
  onError: (string) => void;
  onUpload: (geojson: FeatureCollection) => void;
}

export interface IAppState {}

class Upload extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  _onUpload = e => {
    const file = e.target.files[0];
    if (file.size > 5242880) {
      // 5MB
      this.props.onError("File must be less than 5MB");
      return;
    }

    console.log("uploading file ", file);
    var reader = new FileReader();
    reader.onload = event => {
      // The file's text will be printed here
      if (event.target) {
        const result = (event.target as FileReader).result;
        if (typeof(result)==="string") {
          this.props.onUpload(JSON.parse(result));
        }
      }
    };

    reader.readAsText(file);
  };

  public render() {
    const { classes } = this.props;
    return (
      <div>
        <input
          accept="application/vnd.geo+json  "
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={this._onUpload}
        />
        <label htmlFor="contained-button-file">
        <Tooltip title="Upload Geojson file" aria-label="Add">
          <Button
            component="span"
            className={classes.menuButton}
            style={{ background: "white" }}
            color="secondary"
            variant="outlined"
            size="large"
          >
            <UploadIcon />
            &nbsp; Upload
          </Button>
          </Tooltip>
        </label>
      </div>
    );
  }
}

export default withStyles(styles)(Upload);
