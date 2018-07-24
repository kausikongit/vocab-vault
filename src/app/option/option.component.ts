import { Component, OnInit } from '@angular/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { SecurityService } from './../security.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {
  faCaretRight = faCaretRight;
  private selectedOption: string;
  private showAnswer: boolean;
  private correctAnswer: string;
  private disableOptions: boolean;
  public disableOK: boolean;
  public question: any;

  constructor(private security: SecurityService) {
    this.question = {};
    this.disableOK = true;
    this.disableOptions = false;
  }

  ngOnInit() {
    this.security.getQuestion()
      .subscribe(data => {
        this.showAnswer = false;
        if (!data) {
          this.disableOptions = true;
          return; 
        }
        this.disableOptions = false;
        this.question = data;
        this.selectedOption = undefined;
        this.correctAnswer = undefined;
      });
  }

  setOptionSelected(opt: string): void {
    this.disableOK = this.disableOptions;
    if(this.disableOptions) return;
    this.selectedOption = opt;
    
  }

  submitAns(): void {
    this.disableOK = this.disableOptions = true;
    let correctAns = this.security.validate(this.selectedOption);

    if (typeof correctAns === 'string') {
      this.correctAnswer = correctAns;
      this.showAnswer = true;
    } else if (correctAns === false) {
      setTimeout(() => {
        this.disableOptions = false;
        this.correctAnswer = undefined;
        this.selectedOption = undefined;
      }, 2000);
    }
  }

  resetApp(): void {
    this.security.resetActivity(); 
  }

}
