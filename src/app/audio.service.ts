import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  AudioContext = (window["AudioContext"] || window["webkitAudioContext"]);
  audioContext: AudioContext;
  bufferLoader: any;
  audioLoaded: boolean;
  audioBuffer: any;
  audioMap = {
    correct: {
      files: ['now_you_got_it_1.mp3', 'well_done.mp3', 'wonderful.mp3'],
      buffers: []
    },
    inCorrect: {
      files: ['lets_try_another_2.mp3', 'not_quite_keep_trying_1.mp3', 'oops_another_try_1.mp3'],
      buffers: []
    },
    instText: {
      files: ['dl_vocabulary_completes_sentence_2.mp3'],
      buffers: []
    },
    showAnswer: {
      files: ['not_quite_correct_answer_1.mp3'],
      buffers: []
    },
    helpText: {
      files: ['word_vault_help.mp4'],
      buffers: []
    },
    reward: {
      files: ['reward1.mp3'],
      buffers: []
    },
    vaultOpen: {
      files: ['vault_door_02.mp3'],
      buffers: []
    }
  }

  constructor(private http: Http, private common: CommonService) {
    try {
      this.audioLoaded = false;
      this.audioContext = new this.AudioContext();
    }
    catch (e) {
      alert('Web Audio API is not supported in this browser');
    }
  }

  loadAudioFile(fileName: string): Promise<any> {
    let basePath = "/assets/sfx/";
    return fetch(basePath + fileName)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        return new Promise((resolve, reject) => {
          this.audioContext.decodeAudioData(buffer, resolve, reject);
        })
      });
  }

  play() {
    let bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = this.audioBuffer;
    bufferSource.connect(this.audioContext.destination);
    bufferSource.start(0);
  }

  loadAndPlay(type: string) {
    let fileName = this.common.shuffle(this.audioMap[type].files)[0];
    this.loadAudioFile(fileName)
    .then(audioBuffer => {
      this.audioLoaded = false;
      this.audioBuffer = audioBuffer;
      this.play();
    })
    .catch(error => { throw error });
  }  

 

}
