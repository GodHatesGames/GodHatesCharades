# God Hates Charades

## A game where you act out the vile and despicable inside all of us.
God Hates Charades is a game where you can talk, shout, and say vile things in the form of 30 second act outs.

* Checkout the site at [godhatescharades.com](godhatescharades.com)
* Follow us on Twitter at [@godhatesgames](http://twitter.com/godhatesgames)
* Follow us on Facebook at [ghcharades](https://www.facebook.com/ghcharades)

## Why is all your source code online?
We hope that by sharing our code we can help others learn by example. We may not be the best or brightest but we've built a large application using AngularJS, Parse, Grunt, and a lot of other great tech. We're built on the back of other great open source projects and we're compelled to share. Information on how to build large production ready applications is often hard to find and difficult to understand, this project won't be the exception but we hope it will help some.

Please keep in mind that the content of our game is copyrighted. It is not included in this repository.

## Dependencies
* We're using Parse.com to handle the database and serverside code
* `npm` is used to manage build dependiencies, ie grunt, bower
* `bower` is used to manage frontend dependencies

## Instalation
1. download the files and run package installers
    1. NPM
        1. run `npm install`
    2. Bower
        1. run `bower install`
2. launch the server using `grunt dev`
3. Customize parse (You can test against our dev parse repository, but please don't abuse it!)

## Parse Classes
* Pair
    - actor:<Suggestion>
    - scenario:<Suggestion>
    - platform:String
    - version:String
    - displayed:Number
    - chosen:Number
    - skipped:Number
    - guessed:Number
    - stumped:Number
* Set
    - name:String
* SetItem
    - card:<Suggestion>
    - owner:<Set>
* Suggestion
    - controversy:Number
    - kdr:Number
    - moderated:Boolean
    - owner:<_User>
    - rejected:Boolean
    - skipped:Number
    - text:String
    - totalVotes:Number
    - type:Number