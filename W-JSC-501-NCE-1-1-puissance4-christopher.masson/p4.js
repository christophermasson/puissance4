class P4 {
  constructor(selector) {
    // parametre de la grille
    this.COL = 7;
    this.LGN = 6;
    this.selector = selector;
    this.player = "red";

    this.drawGame();
    this.ecoute();
    this.checkWin();
  }

  //   affichage du jeux
  drawGame() {
    const $jeu = $(this.selector);

    for (let lgn = 0; lgn < this.LGN; lgn++) {
      const $lgn = $("<div>").addClass("lgn");
      for (let col = 0; col < this.COL; col++) {
        const $col = $("<div>")
          .addClass("col empty")
          .attr("data-col", col)
          .attr("data-lgn", lgn);
        $lgn.append($col);
      }
      $jeu.append($lgn);
    }
  }

  ecoute() {
    const $jeu = $(this.selector);
    const that = this;
    //   chercher la dernière case libre
    function lastCase(col) {
      const $cells = $(`.col[data-col='${col}']`);
      for (let i = $cells.length - 1; i >= 0; i--) {
        const $cell = $($cells[i]);
        if ($cell.hasClass("empty")) {
          return $cell;
        }
      }
      return null;
    }
    // voir ou on va mettre le jetons ligne du bas
    $jeu.on("mouseenter", ".col.empty", function () {
      const $col = $(this).data("col");
      const $last = lastCase($col);
      if ($last != null) {
        $last.addClass(`p${that.player}`);
      }
    });
    // enleve l'endroit non cibler
    $jeu.on("mouseleave", ".col", function () {
      $(".col").removeClass(`p${that.player}`);
    });

    $jeu.on("click", ".col.empty", function () {
      const col = $(this).data("col");
      const $last = lastCase(col);
      $last
        .addClass(`${that.player}`)
        .removeClass(`empty p${that.player}`)
        .data("player", `${that.player}`);

      const winner = that.checkWin($last.data("lgn"), $last.data("col"));
      // changer de player
      that.player = that.player === "red" ? "yellow" : "red";

      if (winner) {
      
        alert(`les ${winner} ont gagné`);
        $("#restart").css("visibility", "visible");

        if (that.player === "red") {
          let test = red.split(" ");
          test = test + 1;
          // console.log($("#" + that.player).text());

          console.log();
          $("#" + that.player).html(test);
        }
        if (that.player === "yellow") {
          let test = parseInt($("#" + that.player).text());
          test = test + 1;
          console.log(test);
          $("#" + that.player).html(test);
        }
        return;
      }
    });
  }

  //   vérifier si il y a un gagnant
  checkWin(lgn, col) {
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-lgn='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction) {
      let total = 0;
      let i = lgn + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i, j);

      while (
        i >= 0 &&
        i < that.LGN &&
        j >= 0 &&
        j < that.COL &&
        $next.data("player") === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i, j);
      }
      return total;
    }
    function checkWin(directionA, directionB) {
      const total = 1 + checkDirection(directionA) + checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }

    function checkHori() {
      return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
    }

    function checkVerti() {
      return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
    }
    function checkDiag1() {
      return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
    }
    function checkDiag2() {
      return checkWin({ i: 1, j: -1 }, { i: -1, j: 1 });
    }

    return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
  }
}
