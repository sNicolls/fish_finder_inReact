import React, { Component } from 'react';
import './modal.css'


class ImageModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.modalState} id="imageModal">
                <div className="imageContainer imgContA">
                </div>
                <div className="imageContainer imgContB">
                </div>
                <div className="imageContainer imgContC">
                </div>
            </div>
        )
    }
}

export default ImageModal;