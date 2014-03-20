// use strict;

var Game = {

  universe : undefined,

  data : {},

  initializeUniverse : function($root, x, y){
    // $root is the root html node
    // 'x' is the no. of blocks on x-axis
    // 'y' is the no. of blocks on y-axis

    this.universe = {
      rootNode : $root,
      length : y,
      height : x
    }

    $root.html('');

    for(var i = 0; i<y; i++)
    {
      // create the rows
      var $new_row = $("<tr></tr>"),
          $new_col = "";

      for(var j = 0; j<x; j++)
      {
        // create columns in each row
        $new_col += "<td class='cell' data-isAlive='false' id=cell_"+i+"_"+j+"></td>";
      }

      $new_row.append($new_col);
      $root.append($new_row);
    };

  },

  seedLives : function($root, chance){
    // $root is the grid html node
    // chance is the probability of life in the universe
    var universe = this.universe;
    if(!universe)
      throw 'Universe is not initialized';
    for(var i=0; i<universe.length; i++)
      for(var j=0; j<universe.height; j++)
      {
        $cell = this._getCell(i, j);
        if(Math.random() > chance)
          this.giveLife($cell);
      }
  },

  _getCell : function(i, j){
    return this.universe.rootNode.find('#cell_'+i+'_'+j);
  },

  giveLife : function($cell){
    $cell.attr('data-isAlive', 'true');
    $cell.addClass('live');
  },

  killCell : function($cell){
    $cell.attr('data-isAlive', 'false');
    $cell.removeClass('live');
  },

  startEvolution : function(interval){
    this.isUniverse();
    // this.generationInterval = setInterval('evolution', 500);
    this.data.interval = interval;
    this.timer = window.setInterval(this._evolve.bind(this), interval)
    // function()
  },

  _evolve : function(){
    this.createNextGeneration();
    this.renderNextGeneration();
  },

  createNextGeneration : function(){
    this.isUniverse();
    var universe = this.universe,
        $cell;
    for(var i=0; i<universe.length; i++)
      for(var j=0; j<universe.height; j++)
      {
        $cell = this._getCell(i,j);
        if(this.isAlive(i,j))
        {
          if(this.getNeighbours(i,j).liveCount === 2 || this.getNeighbours(i,j).liveCount === 3)
            $cell.attr('data-isAlive', 'true');
          else
            $cell.attr('data-isAlive', 'false');
        }
        else
        {
          if(this.getNeighbours(i,j).liveCount === 3)
            $cell.attr('data-isAlive', 'true');
        }
      }
  },

  getNeighbours : function(i,j){
    this.isUniverse();
    var universe = this.universe,
        isAlive = this.isAlive,
        liveCount = 0,
        deadCount = 0;

    if(isAlive(i-1, j-1))
      liveCount +=1;
    if(isAlive(i-1, j))
      liveCount +=1;
    if(isAlive(i-1, j+1))
      liveCount +=1;

    if(isAlive(i, j-1))
      liveCount +=1;
    if(isAlive(i, j+1))
      liveCount +=1;

    if(isAlive(i+1, j-1))
      liveCount +=1;
    if(isAlive(i+1, j))
      liveCount +=1;
    if(isAlive(i+1, j+1))
      liveCount +=1;

    return {liveCount: liveCount, deadCount: 8-liveCount};
  },

  isAlive : function(i, j)
  {
    var universe = Game.universe;
    if(i>= universe.length || j >= universe.height || i<0 || j<0)
      return false;
    return $("#cell_"+i+"_"+j).hasClass('live');
  },

  renderNextGeneration : function(){
    this.isUniverse();
    var universe = this.universe,
        $cell;
    for(var i=0; i<universe.length; i++)
      for(var j=0; j<universe.height; j++)
      {
        $cell = $("#cell_"+i+"_"+j);
        if($cell.attr('data-isAlive') === 'true')
          this.giveLife($cell);
        else
          this.killCell($cell);
      }
  },

  isUniverse : function(){
    var universe = this.universe;
    if(!universe)
      throw 'Universe is not defined';
  },

  startLife : function($root, x, y){
    this.initializeUniverse($root, x, y);
    this.seedLives($root, 0.5);
  },

  pauseTimer : function(timer){
    clearInterval(timer);
  },

  resume : function(){
    if(this.data.interval)
      this.startEvolution(this.data.interval);
  }
}


$(function(){

  // debugger;
  var doc_width = $(window).width(),
      doc_height = $(window).height();



  Game.startLife($("#game_container"), Math.floor(doc_width/12), Math.floor(doc_height/12));
  $(document).on('.cell', 'click', function(){
    // debugger;
    Game.getLife(this);
  });

})