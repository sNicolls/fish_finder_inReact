import React, { Component } from 'react';
import axios from 'axios';
import './app.css';
import './media_sandbox.css';
const Clarifai = require('clarifai');
import LandingPage from './home_page';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clarifaiApp: new Clarifai.App({
                apiKey: 'e1fb6f596ca44bd2ac0bd6a608906b9e'
            }),
            imageUrl: props.imageUrl,
            predictionsArr: null,
            keyWord: null,
            audioArr: null,
            audioElement: null,
            trackName: null,
            artistName: null,
            pause: props.pause,
            currentPage: 'fishBiting',
            videoUrl: null,
            videoIndex: null,
            audioIndex: null,
        };
        this.getAudio = this.getAudio.bind(this);
        this.handleAudio = this.handleAudio.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
        this.changeAudio = this.changeAudio.bind(this);
        this.getVideos = this.getVideos.bind(this);
        this.selectYouTubeVideo = this.selectYouTubeVideo.bind(this);
        this.getMedia = this.getMedia.bind(this);

        this.backwardAudio = this.backwardAudio.bind(this);
        this.forwardAudio = this.forwardAudio.bind(this);
        this.backwardVideo = this.backwardVideo.bind(this);
        this.forwardVideo = this.forwardVideo.bind(this);
    }

    componentDidMount(){
        const { imageUrl } = this.state;
        this.state.clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, imageUrl).then(
            function(resp) {
                const predictions = resp.outputs[0].data.concepts;
                this.setState({
                    predictionsArr: predictions,
                    keyWord: predictions[this.randomNumberGenerator(predictions.length)].name
                }, ()=>{this.getMedia()});
            }.bind(this),
            function(err) {
                console.error(err);
            }
        );
    }

    componentWillReceiveProps(){
        console.log("WILL RECIEVE PROPTS", this.state.pause)
}
//Generates a random number between 0 and the parameter given
    randomNumberGenerator(highNumber) {
        return Math.floor(Math.random() * (highNumber));
    }

//CLARIFAI//
    getMedia(){
        this.getAudio();
    }
    
//iTunes
    getAudio(){
        const{ keyWord } = this.state;
        const url = 'https://itunes.apple.com/search?term=' + keyWord;
        axios.get(url).then((resp)=>{
            this.handleAudio(resp.data.results)
        }).bind(this);
    }
    handleAudio(audioArray) {
        this.setState({
            audioArr: audioArray,
        });
        this.playAudio();
        this.getVideos();
    }
    playAudio(){
        const { audioArr } = this.state;
        const randomNumber = this.randomNumberGenerator(audioArr.length);
            this.setState({
                audioIndex: randomNumber,
                audioElement: new Audio(audioArr[randomNumber].previewUrl),
                trackName: audioArr[randomNumber].trackName,
                artistName: audioArr[randomNumber].artistName,
        });

        this.state.audioElement.play()
    }
    pauseAudio(){
        this.state.audioElement.pause()

    }
    changeAudio(){
        this.pauseAudio();
        setTimeout(()=>{this.playAudio()}, 500);
    }

    getVideos(){
        var searchArr= ["fish", "ocean", "sea", "shark", "creepy", "water", "explosion", "space"];
        var searchHelper = searchArr[this.randomNumberGenerator(searchArr.length)];
        var youtubekey = "https://www.googleapis.com/youtube/v3/search?type=video&q="  + this.state.keyWord + "%20" + searchHelper + "&maxResults=10&part=snippet&key=AIzaSyAsYUCZFGPolUbZChLMmmX9Za7XHJVbOyg";

        axios.get(youtubekey).then((resp)=>{
            this.selectYouTubeVideo(resp.data.items);
        })
    }
    selectYouTubeVideo(videoArray){
        const videoLinkArray = [];
        for(var i = 0; i < videoArray.length; i++){
            videoLinkArray.push("https://www.youtube.com/embed/" + videoArray[i].id.videoId + "?start=30&autoplay=1")
        }
        const randomNumber = this.randomNumberGenerator(videoArray.length);

        this.setState({
            videoIndex: randomNumber,
            videoArr: videoArray,
            videoLinkArr: videoLinkArray,
            videoUrl: videoLinkArray[randomNumber],
            videoTitle: videoArray[randomNumber].snippet.title
        }, ()=>{
            console.log(this.state);
        });
    }

    backwardAudio(){
        this.state.audioElement.pause()
        setTimeout(()=>{
            if(this.state.audioIndex === 0){
                this.setState({
                    audioElement: new Audio(this.state.audioArr[this.state.audioArr.length - 1].previewUrl),
                    trackName: this.state.audioArr[this.state.audioArr.length - 1].trackName,
                    artistName: this.state.audioArr[this.state.audioArr.length - 1].artistName,
                    audioIndex: this.state.audioArr.length  - 1,
                }, ()=>{
                    this.state.audioElement.play()
                })
            }else{
                this.setState({
                    audioElement: new Audio(this.state.audioArr[this.state.audioIndex - 1].previewUrl),
                    trackName: this.state.audioArr[this.state.audioIndex - 1].trackName,
                    artistName: this.state.audioArr[this.state.audioIndex - 1].artistName,
                    audioIndex: this.state.audioIndex - 1,
                }, () => {
                    this.state.audioElement.play()
                })
            }
        }, 500);
    }

    forwardAudio(){
        this.state.audioElement.pause()
        setTimeout(()=>{
            if(this.state.audioIndex + 1 === this.state.audioArr.length){
                this.setState({
                    audioElement: new Audio(this.state.audioArr[0].previewUrl),
                    trackName: this.state.audioArr[0].trackName,
                    artistName: this.state.audioArr[0].artistName,
                    audioIndex: 0,
                }, () => {
                    this.state.audioElement.play()
                })
            }else{
                this.setState({
                    audioElement: new Audio(this.state.audioArr[this.state.audioIndex + 1].previewUrl),
                    trackName: this.state.audioArr[this.state.audioIndex + 1].trackName,
                    artistName: this.state.audioArr[this.state.audioIndex + 1].artistName,
                    audioIndex: this.state.audioIndex + 1,
                }, () => {
                    this.state.audioElement.play()
                })
            }

        }, 500);
    }



    backwardVideo(){
        console.log(this.state.videoIndex)
        if(this.state.videoIndex === 0){
            this.setState({
                videoUrl: this.state.videoLinkArr[this.state.videoLinkArr.length - 1],
                videoTitle: this.state.videoArr[this.state.videoLinkArr.length - 1].snippet.title,
                videoIndex: this.state.videoLinkArr.length -1,
            })
        }else{
            this.setState({
                videoUrl: this.state.videoLinkArr[this.state.videoIndex - 1],
                videoTitle: this.state.videoArr[this.state.videoIndex - 1].snippet.title,
                videoIndex: this.state.videoIndex - 1,
            })
        }
    }


    forwardVideo(){
        console.log(this.state.videoIndex)
        if(this.state.videoIndex === this.state.videoLinkArr.length - 1){
            this.setState({
                videoUrl: this.state.videoLinkArr[0],
                videoTitle: this.state.videoArr[0].snippet.title,
                videoIndex: 0,
            })
        }else {
            this.setState({
                videoUrl: this.state.videoLinkArr[this.state.videoIndex + 1],
                videoTitle: this.state.videoArr[this.state.videoIndex + 1].snippet.title,
                videoIndex: this.state.videoIndex + 1,
            })
        }
    }

    render(){
        console.log("PAWS", this.state.pause)
        const { pause, videoTitle, audioElement, videoUrl, imageUrl, trackName, artistName } = this.state;
        if(pause === 'true'){
            audioElement.pause();
        }
        return (
            <div className="media_sandbox_container">
                <iframe src={videoUrl}>
                </iframe>
                <div className="video_control">
                    <button className="btn general_btn change_media_btn" onClick={this.backwardVideo}><span className="glyphicon glyphicon-backward video_btn"></span></button>
                <div className="video_info">
                    <p className="video_info_label">~Video Title~</p>
                    <p className="info_data">{videoTitle}</p>
                    </div>
                    <button className="btn general_btn change_media_btn" onClick={this.forwardVideo}><span className="glyphicon glyphicon-forward video_btn"></span></button>
                </div>
                <div className="track_control">
                    <button className="btn general_btn change_media_btn" onClick={this.backwardAudio}><span className="glyphicon glyphicon-backward track_btn"></span></button>
                    <div className="track_info">
                        <p className="track_info_label">~Track Name~</p>
                        <p className="info_data">{trackName}</p>
                        <p className="track_info_label">~Artist~</p>
                        <p className="info_data">{artistName}</p>
                    </div>
                    <button className="btn general_btn change_media_btn" onClick={this.forwardAudio}><span className="glyphicon glyphicon-forward track_btn"></span></button>
                </div>

            </div>
        )
    }
}