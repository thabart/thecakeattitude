import React, {Component} from "react";

class ImagesUploader extends Component {
  constructor(props) {
    super(props);
    this.uploadImage = this.uploadImage.bind(this);
    this.state = {
      images: []
    }
  }
  uploadImage(e) {
    e.preventDefault();
    var self = this;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      var images = self.state.images;
      images.push(reader.result);
      self.setState({
        images: images
      });
    };
    reader.readAsDataURL(file);
  }
  getImages() {
    return this.state.images;
  }
  render() {
    var images = [],
      self = this;
    if (this.state.images && this.state.images.length > 0) {
      this.state.images.forEach(function(image) {
        images.push((<div className="col-md-2 product-image-container">
            <div className="close" onClick={() => {
              var imgs = self.state.images;
              var index = imgs.indexOf(image);
              if (index === -1) {
                return;
              }

              imgs.splice(index, 1);
              self.setState({
                images: imgs
              });
            }}><i className="fa fa-times"></i></div>
            <img src={image} width="50" height="50" />
        </div>));
      });
    }
    return (<div>
      <div><input type='file' accept='image/*' onChange={(e) => this.uploadImage(e)}/></div>
      <div className="row">
        {images}
      </div>
    </div>)
  }
}

export default ImagesUploader;
