import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DropZone from 'react-dropzone';
import socket from 'socket.io-client';

import {MdInsertDriveFile} from 'react-icons/md';
import logo from '../../assets/logo.svg';
import  './styles.css';

export default class Box extends Component {
  state = {
    box: {}
  }

  async componentDidMount(){
    this.subscribesToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);

    this.setState({box:response.data});
  }

  subscribesToNewFiles = () =>{
    const box = this.props.match.params.id;
    const io = socket('https://omnistack-higon.herokuapp.com');

    io.emit('connectRoom',box);

    io.on('file', data => {
      this.setState({box:{... this.state.box, files:[data, ... this.state.box.files]}});
    })
  }

  handleUpload = (files)=>{
    files.forEach((file)=>{
      const data = new FormData();

      data.append('file',file);
      const box = this.props.match.params.id;

      api.post(`boxes/${box}/files`, data);
    })
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt=""/>
          <h1>{this.state.box.title}</h1>
        </header>
        
        <DropZone onDropAccepted={this.handleUpload}>
          {({getRootProps, getInputProps})=>(
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()}/>
              <p>Clique ou arraste seus arquivos aqui</p>      
            </div>    
          )}
        </DropZone>

        <ul>
          {this.state.box.files && this.state.box.files.map(file=>(
            <li key={file._id}>
              <a  className="fileInfo" href={file.url} target="_blank">
                <MdInsertDriveFile size={24} color="#A5CFFF"/>
                <strong>{file.title}</strong>
              </a>
              <span>
                criado hà{" "}
                {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
                })}
              </span>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}
