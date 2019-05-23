import { Component, OnInit } from '@angular/core';
// import { ace } from '../../../../node_modules/ace-builds/src-noconflict/ace';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../services/data.service';


declare var ace: any;

@Component({
  selector: 'app-editor1',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class Editor1Component implements OnInit {

  editor: any;
  sessionId: string;
  languages: string[] = ['Python', 'Java', 'C++'];
  language: string = 'Python';
  output: string;
  users: string;
  subscriptionUsers: Subscription;

  defaultContent = {
    'Python': `class Solution:
      def example():
        # Please type your code here...
    `,
    'Java': `public class Solution{
      public static void main(String[] args){
        // Please type your code here...
      }
    }`,
    'C++':`int main(){
        /* Please type your code here... */
      }`
  }
  defaultLanguage = {
    'Java': 'java',
    'Python':'python',
    'C++':'c_cpp'
  }

  constructor(
    private collaboration: CollaborationService,
    private route: ActivatedRoute,
    private dataService: DataService) {}

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
    this.editor.getSession().setMode("ace/mode/" + this.defaultLanguage[this.language].toLowerCase());
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    let userCode = this.editor.getValue();
    let data = {
      user_code: userCode,
      lang: this.language.toLowerCase()
    };
    console.log(data)
    this.dataService.buildAndRun(data)
              .then((res:any) => this.output = res.text);
  }


}
