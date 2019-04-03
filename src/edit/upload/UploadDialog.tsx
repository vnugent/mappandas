import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import ReactDropzone from "react-dropzone";
import request from "superagent";

const styles = (theme: Theme) =>
  createStyles({
    root: {}
  });

export interface IAppProps {
  onClose: (value: any) => void;
  classes: any;
}

export interface IAppState {
  file?: File;
  preview: any;
}

class UploadDialog extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = { file: undefined, preview: undefined };
  }

  componentWillUnmount() {
    if (this.state.preview) URL.revokeObjectURL(this.state.preview);
  }

  public render() {
    const { classes, onClose } = this.props;
    return (
      <Dialog open={true} onClose={onClose} className={classes}>
        <DialogTitle id="simple-dialog-title">Insert a photo</DialogTitle>
        <DialogContent>
          <ReactDropzone
            onDrop={this.onDrop}
            accept="image/*"
            multiple={false}
            minSize={16}
            maxSize={1024 * 500}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop photo here, or click to select file</p>
                </div>
                {this.thumb()}
              </section>
            )}
          </ReactDropzone>
        </DialogContent>
      </Dialog>
    );
  }

  onDrop = files => {
    const url = `https://api.cloudinary.com/v1_1/${
      this.context.cloudName
    }/upload`;
    if (files.length === 1) {
      this.setState({ file: files[0], preview: URL.createObjectURL(files[0]) });
    }
  };

  thumb = () => (
    <div>
      <img src={this.state.preview} />
    </div>
  );
}

export default withStyles(styles)(UploadDialog);
