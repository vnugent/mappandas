import * as React from "react";
import { IconButton, Tooltip, withStyles } from "@material-ui/core";
import { PhotoCameraOutlined as CameraIcon } from "@material-ui/icons";
import { FeatureCollection } from "geojson";

const styles = theme => ({
  input: {
    display: "none"
  }
});

export interface IAppProps {
  classes: any;
  onError?: (string) => void;
  onUploaded: (imageData) => void;
}

export interface IAppState {}

export default class ImageUploadButton extends React.Component<
  IAppProps,
  IAppState
> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  _onUpload = e => {
    const file = e.target.files[0];
    if (file.size > 5242880) {
      // 5MB
      alert("You tried to upload a file larger than 5MB");
      if (this.props.onError) this.props.onError("File must be less than 5MB");
      return;
    }

    console.log("uploading file ", file);
    var reader = new FileReader();
    reader.onload = event => {
      if (event.target) {
        const result = (event.target as FileReader).result;
        const [mime] = file.type.split("/");
        if (mime === "image") {
          this.props.onUploaded(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  public render() {
    const { classes } = this.props;
    return (
      <span>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="upload-image-control"
          type="file"
          onChange={this._onUpload}
        />
        <Tooltip title="Add an image" aria-label="Add an image">
          <IconButton className={classes.menuButton} onClick={this.onClick}>
            <CameraIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </span>
    );
  }

  onClick = e => {
    const fileElem = document.getElementById("upload-image-control");
    if (fileElem) fileElem.click();
  };
}

//export default withStyles(styles)(Upload);
