/* Copyright (c) 2023 Gordon Williams. See the file LICENSE for copying permission. */
/*

8x16 VGA-style fixed-width font

Usage:

```
require("FontVGA16").add(Graphics);
g.setFont("VGA16");
g.drawString("0123456789");
```
*/
exports.add = function(graphics) {
  graphics.prototype.setFontVGA16 = function() {
    return this.setFontCustom(atob("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AGAAAAPgA+ACAAIAAgACAAIAAAACAAIAAgACAAIAA+AD4AAAIGB8wH2EA0wGXAx0GCQAACBgfMB9kAMwBnAM3Bj8ABAAAAAAAOA38DfwAOAAAAAAAQADgAbABUADgAbABEAAAARABsADgAVABsADgAEAAAAAAFVVAACqqgAAVVUAAKqqVVWqqlVVqqpVVaqqVVWqqqqq//9VVf//qqr//1VV//8AAAAAAAD/////AAAAAAAAAQABAAEA/////wAAAAAAAAUABQAFAP////8AAAAAAAABAAEA/////wAA/////wAAAQABAAH/Af8BAAH/Af8AAAUABQAFAAf/B/8AAAAAAAAFAAUA/f/9/wAA/////wAAAAAAAP////8AAP////8AAAUABQAF/wX/BAAH/wf/AAAFAAUA/QD9AAEA/wD/AAAAAQABAP8A/wABAP8A/wAAAAUABQAFAP8A/wAAAAAAAAABAAEAAQAB/wH/AAAAAAAAAAAAAAAA/wD/AAEAAQABAAEAAQABAP8A/wABAAEAAQABAAEAAQAB/wH/AQABAAEAAAAAAAAA/////wEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQD/////AQABAAEAAAAAAAAA/////wUABQAFAAAAAAD/////AAD/////AQAAAAAA/wD/AAEA/QD9AAUAAAAAAAf/B/8EAAX/Bf8FAAUABQD9AP0AAQD9AP0ABQAFAAUABf8F/wQABf8F/wUAAAAAAP////8AAP3//f8FAAUABQAFAAUABQAFAAUABQAFAAUA/f/9/wAA/f/9/wUABQAFAAUA/QD9AAUABQAFAAEAAQD/AP8AAQD/AP8AAQAFAAUABQAF/wX/BQAFAAUAAQABAAH/Af8BAAH/Af8BAAAAAAD/AP8AAQD/AP8AAQAAAAAAAAD/AP8ABQAFAAUAAAAAAAAAB/8H/wUABQAFAAAAAAAB/wH/AQAB/wH/AQABAAEA/////wEA/////wEABQAFAAUA/////wUABQAFAAEAAQABAP8A/wAAAAAAAAAAAAAAAAAB/wH/AQABAAEA/////////////////////wH/Af8B/wH/Af8B/wH/Af///////////wAAAAAAAAAAAAAAAAAAAAD///////////4A/gD+AP4A/gD+AP4A/gAD4AfwBBAH8APgBjAEEAAAH/A/8CAAIgA/EB3wAOAAAD/wP/AgACAAIAA4ADgAAAAEAAfwB/AEAAfwB/AEAAAAMDA4cCzQJ5AjEDAwMDAAAAPgB/AEEAfwB+AEAAQAAAAAAgf+B/wAEAAQB/AH4AAABAAMAAgAD/AH8AwACAAAAAAAJ5Av0DhwOHAv0CeQAAAPwB/gMjAiEDIwH+APwAAADhAf8DHwIAAx8B/wDhAAAAAAAeAT8DoQLhAn8CPgAAADgAfABEAHwAfABEAHwAOAA5AH8ATgB8AHQAxAH8ATgAAAD8Af4DIwIhAiEAAAAAAP8B/wEAAQABAAH/AP8AAACSAJIAkgCSAJIAkgCSAAAAAAAhACEA+QD5ACEAIQAAAAAAAQEFAY0A2QBxACEAAAAAACEAcQDZAY0BBQABAAAAAAAAAAAB//P/8gADgAGAAAcAB4AAj/+P/wAAAAAAAAAAABAAEABUAFQAEAAQAAAAJABsAEgAbAAkAGwASAAAAAADAAeABIAHgAMAAAAAAAAAAAAAAAAYABgAAAAAAAAAAAAAAAAAEAAQAAAAAAAAABAAHAAeAAMH/wf/BAAEAAAABAAH4APgBAAH4APgAAAAAAIgBmAE4AWgByACYAAAAAAA/gD+AP4A/gD+AP4AAAAAAAAAAAAAAAAAAAAAAAAA=="), 0, 8, 16);
  }
}
