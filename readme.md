# LinkedIn feed but without recruitment

As developers, our LinkedIn feed is often plagued with hollow recruitment messages that we look over 99% of the time.

I grew tired of this situation so I made this script that purges your LinkedIn timeline (feed) as you scroll it, detects posts about _"recruitment"_ or made by _"recruiters"_, and simply removes them.

The matching algorithm is a regex right now that looks for specific keywords. Your contribution is welcome to enhance it. Change the `should_remove_node` function in `main.js` and send me your pull-request.

## Installation

+ Install [TamperMonkey](https://www.tampermonkey.net/)
+ In the extension, click "New script"
+ Paste the content of `main.js`
+ ???
+ PROFIT!!!
