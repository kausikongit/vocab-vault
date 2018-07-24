import { Component } from '@angular/core';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  faVolumeUp = faVolumeUp;

  constructor(private audio: AudioService) { }

  playInstAudio(): void {
    this.audio.loadAndPlay('instText');
  }

  playHelpAudio(): void {
    this.audio.loadAndPlay('helpText');
  }

  closeApp(): void {
    window.close(); 
  }
}
