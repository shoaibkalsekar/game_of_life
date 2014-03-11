$(function(){


  var $gameContainer = $("#game_container"),
      x = 30,
      y = 40;

  for(var i = 0; i<x; i++)
  {
    // create the rows
    var $new_row = $("<tr></tr>"),
        $new_col = "";

    for(var j = 0; j<y; j++)
    {
      // create columns in each row
      $new_col += "<td class='cell dead' id=cell_"+i+"_"+j+"></td>";
    }

    $new_row.append($new_col);
    $gameContainer.append($new_row);
  };
  // console.log($table);

  Game = function($gameContainer, timeDelay)
  {
    var game = setInterval(checkLives, timeDelay);

    function checkLives()
    {
      for(var i=0; i<x; i++)
      {
        for(var j=0; j<y; j++)
        {
          var $current_cell = $("#cell_"+i+"_"+j);
          if(compute_status($current_cell, x, y) === false)
            $current_cell.removeClass('dead').addClass('live');
          else
            $current_cell.removeClass('live').addClass('dead');
        }
      }
    }


    function compute_status($a, b, c)
    {
      var id = $a.attr('id'),
          i = parseInt(id.split("_")[1] , 10),
          j = parseInt(id.split("_")[2] , 10),
          n_live = 0,
          n_dead = 0;

      // console.log(i,j);

      for(var p = -1; p<=1; p++)
      {
        for(var q = -1; q<=1; q++)
        {
          if( !(p === i && q === q))
          {
            var $cell = $("#cell_"+(i+p)+"_"+(j+q));
            if($cell.attr('id'))
            {
              if($cell.hasClass('live'))
                n_live += 1;
              if($cell.hasClass('dead'))
                n_dead += 1;
            }
          }
        }
      }

      if($a.hasClass('live') && !$a.hasClass('dead'))
      {
        if(n_live < 2)
          return false;
        if(n_live === 2 || n_live === 3)
          return true;
        if(n_live > 3)
          return false;
      }

      if($a.hasClass('dead') && !$a.hasClass('live'))
      {
        if(n_live === 3)
          return true;
      }
    }
  }

  // Game($gameContainer, 300);

  $(".cell").on('click', function(){
    $this = $(this);
    if($this.hasClass('live'))
      $this.removeClass('live').addClass('dead');
    else
      $this.removeClass('dead').addClass('live');
  })


});
