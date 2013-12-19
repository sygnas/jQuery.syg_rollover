#jQuery SygRollover - swap and scroll and fade effects rollover

##NAME
jQuery SygRollover

##VERSION

2013.10.15 ver1.7

* オプション「onClick」を追加。

2013.10.08 ver1.6

* ターゲット画像に class="lazy" が含まれていたら、画像ファイル名は「data-original」属性から取得するように変更。

2013.06.29 ver1.5

* メソッド「release()」を追加。選択状態を解除する。

2012.11.24 ver1.4

* オプション「toggle」を追加。アクティブなものが押されたらアクティブ解除する。

2012.04.07 ver 1.3

* ロールオーバーだけではなく、選択時の状態も使えるように変更。ファイル名には「-select」を付ける（swapSelectで変更可）。

jQuery VERSION  
version 1.6.2


##SYNOPSIS

[DEMO jQuery SygRollover](http://sygnas.jp/sygrollover/)

###Simple Setup
``` html
<img src="swap_01.png" class="swap" /> <!-- need "swap_01-over.png" -->

<script>
	new $.SygRollover( '.swap' );
</script>
```

###Radio Group
``` html
<img src="swap_01.png" class="swap2" />
<img src="swap_02.png" class="swap2 active" />

<script>
	new $.SygRollover( '.swap', { radio:true } );
</script>
```

##DESCRIPTION
ロールオーバー効果として画像入れ替え、透明度変更、スクロールが使える jQueryプラグインです。
オプションでグループ設定をしたり、外部からグループの選択状態を変更できます。

swap（入れ替え）モードの場合、表示画像と共に、ファイル名末尾に「-over」を付けた画像も必要です。この部分は swapExtパラメータで変更可能です。
例：button.jpg　と　button-over.jpg

scrollモードを使うときは cssで positionや overflowを指定する必要があります。
[DEMO jQuery SygRollover](http://sygnas.jp/sygrollover/)

##PARAMETERS

{}はデフォルト値

### 共通パラメータ
``` html
mode            {"swap"} / "scroll" / "fade"

radio           {false} / true
                ラジオグループにする。
                class="active" になっているものは最初から選択状態になる。

select			{false} / true
				radio:true 指定時、選択時の画像を指定できる。
				false の場合は ロールオーバー状態が選択状態として使われる。

effectTarget    {"self"} or function
                エフェクト対象を指定する。
                マウスオーバーしたエレメント自身に効果を加えるなら無指定。
                背景など別の画像をscroll/swap/fadeさせたいなら、
                function設定してエレメントを返す。

                例：
                function( target ){
                    return $(target).prev();
                }
```

### swapモード用
``` html
swapExt         {"-over"}
                swapモードで使う入れ替え画像ファイル名の修飾子。
                例：「-over」の場合 "file.jpg" と "file-over.jpg"

swapSelect		{"-select"}
                ラジオグループで使う入れ替え画像ファイル名の修飾子。
                例：「-select」の場合 "file.jpg" と "file-select.jpg"
```

### fadeモード用
``` html
fadeOverTime    {200}
				ロールオーバーにかける時間

fadeOutTime     {1000}
				ロールアウトにかける時間

fadeOverOpacity {0.5}
				ロールオーバー時の透明度

fadeOutOpacity  {1}
				ロールアウト時の透明度

fadeSelect		{"-select"}
                ラジオグループで使う入れ替え画像ファイル名の修飾子。
                例：「-select」の場合 "file.jpg" と "file-select.jpg"
```

### scrollモード用
``` html
scrollEasing    {"swing"} / "linear"
				スクロールのイージング。
				jquery.easing.js があればその他のイージングも使えます。

scrollTime      {200}
				スクロールにかける時間

scrollOver      [x,y]
				ロールオーバー時のスクロール座標。

scrollOut       [x,y]
				ロールアウト時のスクロール座標。

scrollSelect    [x,y]
				選択時のスクロール座標。
```

##METHOD

###select(n)

ラジオグループ設定時に、n番目のボタンを選択状態にする。

``` html
var buttons = new $.SygRollover( '.button', {mode:'swap', radio:true } );
buttons.select(1);
```

###rollover(n)

n番目のボタンをロールオーバー状態にする。
実際は使う機会なさそうですが。

``` html
var buttons = new $.SygRollover( '.button' );
buttons.rollover(0);
```

###rollover(n)

n番目のボタンをロールアウト状態にする。
こちらも実際は使う機会なさそうですが。

``` html
var buttons = new $.SygRollover( '.button' );
buttons.rollout(0);
```

##OLD VERSION

2012.04.07 ver 1.3

* ロールオーバーだけではなく、選択時の状態も使えるように変更。ファイル名には「-select」を付ける（swapSelectで変更可）。

2012.04.03 ver 1.2

* スクロール対象の選択パラメータ名を「scrollTarget」から「effectTarget」に変更。

2012.04.03 ver 1.2

* スクロール対象の選択パラメータ名を「scrollTarget」から「effectTarget」に変更。
* swap、fadeモードでもエフェクト対象を「effectTarget」で選択できるようにした。

2012.04.03 ver 1.1

* hover()、click()のイベント受け取りを e.target から e.crrentTarget に変更。

2012.03.26 ver 1.0

* とりあえず公開。

##AUTHOR
Hiroshi Fukuda <dada@sygnas.jp>  
http://sygnas.jp/

##LICENSE
jQuery.syg_carousel

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
