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
      extraKeys: { "Ctrl-Z": "autocomplete" }, //自动提示配置
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
  	document.getElementById("view").innerHTML=num*num
  }
</script>
</head>
<body>
<h3>使用ctrl+s进行代码保存</h3>
<h3>使用ctrl+z进行代码提示</h3>
<button type="button" onclick="showNum(10)">显示数字</button>
<div id="view"></div>
</body>
</html>
    `
  }
  ngOnInit() {

    $("#content_right").contents().find("body").html(this.content);

    // this.clicks
    //   .debounceTime(500)
    //   .subscribe(e => {
    //     $("#content_right").contents().find("body")
    //       .html(this.content);
    //   });
    const _this = this;
    window.addEventListener("keydown", function (e) {
      //可以判断是不是mac，如果是mac,ctrl变为花键
      //event.preventDefault() 方法阻止元素发生默认的行为。
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        $("#content_right").contents().find("body")
          .html(_this.content);
      }
    }, false);
  }

}
