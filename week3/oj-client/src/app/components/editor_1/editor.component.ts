import { Component, OnInit } from '@angular/core';
import { ace } from '../../../../node_modules/ace-builds/src-noconflict/ace';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


declare var ace: any;

@Component({
  selector: 'app-editor1',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class Editor1Component implements OnInit {

  editor: any;
  sessionId: string;
  languages: string[] = ['Java', 'Python', 'C++'];
  language: string = 'Java';
  output: string;
  users: string;
  subscriptionUsers: Subscription;

  defaultContent = {
    'Java': `public class Solution{
      public static void main(String[] args){
        // Please type your code here...
      }
    }`,
    'Python': `class Solution:
      def example():
        # Please type your code here...
    `,
    'C++':`int main(){
        /* Please type your code here... */
      }`
  }

  constructor(
    private collaboration: CollaborationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      });
  }

  initEditor() {
    this.editor = ace.edit("editor");
    this.editor.setOptions({
      minLines:15,
      maxLines: Infinity
    });
    this.editor.setTheme("ace/theme/dracula");
    this.resetEditor();

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change', (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e))
      }
    });

    this.editor.getSession().getSelection().on("changeCursor", () => {
      let cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor moves: ' + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }


}
