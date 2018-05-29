import { Component, Directive, ElementRef, Input, OnInit, Renderer, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

import 'codemirror/addon/hint/javascript-hint.js';


import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //是否移动
  private isDown: boolean = false;
  // X轴位置
  private disX: number;
  // Y轴位置
  private disY: number;

  // 初始化rx对象
  private clicks = new Subject<any>();
  contentLeft: any;
  config: any;
  content: any;

  //点击事件
  onMousedown(event) {
    this.isDown = true;
  }

  @HostListener('document:keyup', ['$event']) onkeyup(e) {
    //只用当元素移动过了，离开函数体才会触发。
    //console.log(this.content);
    e.preventDefault();
    this.clicks.next(event);
  }
  //监听document移动事件事件
  @HostListener('document:mousemove', ['$event']) onMousemove(event) {
    //判断该元素是否被点击了。
    if (this.isDown) {
      this.contentLeft = event.clientX + "px";
      event.preventDefault();
    }

  }

  //监听document离开事件
  @HostListener('document:mouseup', ['$event']) onmouseup() {
    //只用当元素移动过了，离开函数体才会触发。
    if (this.isDown) {
      this.isDown = false;
    }
  }

  constructor() {
    this.config = {
      lineNumbers: true,                     //显示行号
      extraKeys: { "Ctrl": "autocomplete" }, //自动提示配置
      theme: "darcula"                  //选中的theme
    };
    this.content = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>在线编辑器</title>
<script>
  function showNum(num){
  	console.log(num);
  }
</script>
</head>
<body>

<button type="button" onclick="showNum(10)">显示数字</button>

</body>
</html>
    `
  }
  ngOnInit() {

    $("#content_right").contents().find("body").html(this.content);

    this.clicks
      .debounceTime(5000)
      .subscribe(e => {
        $("#content_right").contents().find("body")
          .html(this.content);
      });
  }

}
