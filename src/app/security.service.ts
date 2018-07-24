import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AudioService } from './audio.service';


@Injectable()
export class SecurityService {
  private questions;
  private qID: number;
  private groupIndex: number;
  private questionSubject$: Subject<any>;
  private unlockSubject$: Subject<any>;
  private resetVault$: Subject<any>;

  constructor(private http: Http, private audio: AudioService) {
    this.qID = 0;
    this.groupIndex = 0;
    this.questionSubject$ = new Subject();
    this.unlockSubject$ = new Subject();
    this.resetVault$ = new Subject(); 
    this.loadQuestions().subscribe(data => {
      this.questions = data;
      this.sendNext(true);
    },
      error => console.log(error));
  }

  getQuestion(): Subject<any> {
    return this.questionSubject$;
  }

  unlockVault(): Subject<any> {
    return this.unlockSubject$;
  }

  resetVault(): Subject<any> {
    return this.resetVault$;
  }

  validate(ans) {
    var isCorrect = this.questions[this.groupIndex][this.qID].answer === ans;
    this.questions[this.groupIndex][this.qID].correctAnswered = isCorrect;
    this.questions[this.groupIndex][this.qID].try++;
    if (isCorrect) {
      setTimeout(() => {
        this.processNextQuestion();
      }, 2000);
      this.audio.loadAndPlay('correct');
      this.unlockSubject$.next();
      return true;
    } else if (!isCorrect && this.questions[this.groupIndex][this.qID].try === 2) {
      setTimeout(() => {
        this.processNextQuestion();
      }, 3000);
      this.audio.loadAndPlay('showAnswer');
      return this.questions[this.groupIndex][this.qID].answer;
    }
    this.audio.loadAndPlay('inCorrect');
    return false;
  }

  processNextQuestion() {
    if (this.groupIndex >= this.questions.length) {
      this.sendNext(false);
      return false;
    } else {
      let groupCleared = true;
      this.qID++;
      for (let i = 0; i < this.questions[this.groupIndex].length; i++ , this.qID++) {
        this.qID = this.qID % this.questions[this.groupIndex].length;
        if (!this.questions[this.groupIndex][this.qID].correctAnswered) {
          groupCleared = false;
          this.sendNext(true);
          break;
        }
      }
      if (groupCleared && this.groupIndex + 1 <= this.questions.length) {
        this.qID = -1;
        this.groupIndex++;
        this.processNextQuestion();
      } else {
        return false;
      }
    }
  }

  private loadQuestions(): Observable<any> {
    return this.http.get("assets/data/questions.json")
      .pipe(
        map((res: any) => res.json()),
        catchError(error => of(`Bad Promise: ${error}`))
      );
  }

  private sendNext(hasNext: boolean): void {
    if (!hasNext) {
      this.questionSubject$.next(null);
      return;
    }
    this.questions[this.groupIndex][this.qID].correctAnswered = false;
    this.questions[this.groupIndex][this.qID].try = 0;
    this.questionSubject$.next({
      qid: this.questions[this.groupIndex][this.qID].qid,
      text: this.questions[this.groupIndex][this.qID].text,
      options: this.questions[this.groupIndex][this.qID].options,
    });
  }

  resetActivity(): void {
    this.qID = 0;
    this.groupIndex = 0;
    this.loadQuestions().subscribe(data => {
      this.questions = data;
      this.sendNext(true);
    },
      error => console.log(error));
    this.resetVault$.next();
  }
}
