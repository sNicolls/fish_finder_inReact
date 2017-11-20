import React, { Component } from 'react';
import './app.css';
import FishBiting from './fish_biting_page';


export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            form: {
                    imageUrl: '',
                },
            modalState : 'hideModal',
            currentPage: 'home',
            pause: 'false'
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.modalClicked = this.modalClicked.bind(this);
        this.returnToHome = this.returnToHome.bind(this);
    }
    handleInputChange(ev){
        const { value, name } = ev.target;
        const { form } = this.state;
        form[name] = value;
        this.setState({
            form: {...form}
        })
    }
    handleSubmit(event){
        event.preventDefault();
        this.setState({
            currentPage: 'fishBiting'
        });
    }
    toggleModal(ev) {
        ev.preventDefault();
        if(this.state.modalState === 'hideModal') {
            this.setState({
                modalState: 'showModal',
            })
        }else if(this.state.modalState === 'showModal') {
            this.setState({
                modalState: 'hideModal'
            })
        }
    }
    modalClicked(ev){
        const imageUrl = /"(.*?)"/.exec(ev.target.style.backgroundImage)[1];
        this.setState({
            form: {
                imageUrl: imageUrl
            },
        })
    }
    returnToHome(){
        this.setState({
            currentPage: 'home',
            pause: 'true'
        })
    }
    render() {
        const {imageUrl} = this.state.form;
        const {modalState} = this.state;

        const backgroundA = 'https://i.pinimg.com/originals/e6/09/6e/e6096ec3f9a6f3afd1f19e42baf9faa7.jpg';
        const backgroundB = 'http://bpc.h-cdn.co/assets/16/44/olivergal-peace-neon-sign.jpg';
        const backgroundC = 'https://i.ebayimg.com/thumbs/images/g/auEAAOSwfIxZaCYj/s-l225.jpg';

        if(this.state.currentPage === 'home') {
            return (
                <div className="border_container">
                    <div className="border_top_bottom">
                        <div className="page_title_div">
                            <div>Fish<br/>Finder</div>
                            <div className="online_text">Online</div>
                        </div>
                        <div className={modalState} id="imageModal">
                            <div className="imageContainer imgContA" onClick={this.modalClicked}
                                 style={{backgroundImage: `url(${backgroundA})`}}>
                            </div>
                            <div className="imageContainer imgContB" onClick={this.modalClicked}
                                 style={{backgroundImage: `url(${backgroundB})`}}>
                            </div>
                            <div className="imageContainer imgContC" onClick={this.modalClicked}
                                 style={{backgroundImage: `url(${backgroundC})`}}>
                            </div>
                        </div>
                        <form onSubmit={this.handleSubmit} className="landing_page_form_container">
                            <div className="form-group  landing_page_form">
                                <button className="fa  fa-camera" onClick={this.toggleModal}/>
                                <input placeholder="" type="text" onChange={this.handleInputChange} name="imageUrl"
                                       className="form-control landing_page_form_field" value={imageUrl}
                                       id="url-input"/>
                            </div>
                                <button onClick={this.handleSubmit} className="btn general_btn" id="submit_button">
                                    Cast Line
                                </button>
                        </form>
                        <p className="instructions_text">Paste an Image URL into the text-field, or select an image by
                            clicking the Camera, and then click <br/>Cast Line.</p>
                    </div>
                </div>
            )
        } else if (this.state.currentPage === 'fishBiting'){
            return(
                <div className="border_container">
                    <div className="border_top_bottom">
                        <FishBiting imageUrl={imageUrl} />
                    </div>
                </div>
            )
        }
    }
}