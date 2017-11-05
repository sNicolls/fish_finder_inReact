import React, { Component } from 'react';

import './app.css'

const Clarifai = require('clarifai')

export default class extends Component {
    constructor(props){
        super(props);
        this.state = {
            form: {
                    image_url: '',
                },
            modalState : 'hideModal',
            currentPage: 'home',
            clarifaiApp: new Clarifai.App({
                apiKey: 'e1fb6f596ca44bd2ac0bd6a608906b9e'
            })
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.modalClicked = this.modalClicked.bind(this);
        this.denySongSelection = this.denySongSelection.bind(this);
        this.playSong = this.playSong.bind(this);
        this.getWord = this.getWord.bind(this);
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
            currentPage: 'queryUserEnjoyment'
        })
        this.getWord()
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
        const imgUrl = /"(.*?)"/.exec(ev.target.style.backgroundImage)[1];
        this.setState({
            form: {
                image_url: imgUrl
            },
        })
    }

    denySongSelection(){
        this.setState({
            currentPage: 'home'
        })
    }


    getWord(){
        console.log("GETTING WORD")
        const {image_url} = this.state.form;
        event.preventDefault();
        this.state.clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, image_url).then(
            function(response) {
                console.log(response);
            },
            function(err) {
                console.error(err);
            }
        );
    }

    playSong(){

    }

    render() {
        const {image_url} = this.state.form;
        const {modalState} = this.state;

        const backgroundA = 'https://i.pinimg.com/originals/e6/09/6e/e6096ec3f9a6f3afd1f19e42baf9faa7.jpg';
        const backgroundB = 'http://bpc.h-cdn.co/assets/16/44/olivergal-peace-neon-sign.jpg';
        const backgroundC = 'https://i.ebayimg.com/thumbs/images/g/auEAAOSwfIxZaCYj/s-l225.jpg';
        if (this.state.currentPage === 'home') {
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
                                <input placeholder="" type="text" onChange={this.handleInputChange} name="image_url"
                                       className="form-control landing_page_form_field" value={image_url}
                                       id="url-input"/>
                            </div>
                            <button onClick={this.handleSubmit} className="btn cast_line_btn" id="submit_button">
                                Cast Line
                            </button>
                        </form>
                        <p className="instructions_text">Paste an Image URL into the text-field, or select an image by
                            clicking the Camera, and then click <br/>Cast Line.</p>
                    </div>
                </div>
            )
        } else if (this.state.currentPage === 'queryUserEnjoyment'){

            return(
                <div className="container">
                    <div className="border_top_bottom">
                        <div className="page_title_div" id="queryUserEnjoyment_border">
                            <div>Are the Fish Biting?</div>
                            <button className="btn cast_line_btn" onClick={this.denySongSelection}>No</button>
                            <button className="btn cast_line_btn">YES</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
