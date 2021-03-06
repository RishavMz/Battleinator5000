import { Game } from './src/game';
import { Multiplayer } from './src/multiplayergame';
import './style.css'


document.getElementById('root').innerHTML = `<div class="menu">
    <br/><br/><br/>
    <center><form class="login" id="loginform">
        <label><b>USERNAME</b></label><br/>
        <input type="text" class="input" name="username" id="username" required/><br/><br/>
        <label><b>GameMode </b></label>
        <select class="gamemode" name="gamemode" id="gamemode">
            <option value="singleplayer">Singleplayer</option>
            <option value="multiplayer">Multiplayer</option>
        </select>
        <br/><br/>
        <label><b>Graphics </b></label>
        <select class="gamemode" name="texture" id="texture">
            <option value="1">HIGH</option>
            <option value="0">LOW</option>
        </select>
        <br/><br/><br/>
        <button class="btn" type="submit" id="loginbuttonsp">Enter World</button>
    </form></center>
</div>`

document.getElementById('loginform').onsubmit= (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const gamemode = document.getElementById('gamemode').value;
    const texture = (document.getElementById('texture').value === '1'?100:10);
    document.getElementById('root').innerHTML = `<div class="loader" id='loader'>
        <center><div class="loadmover"></div></center>
        <br/><br/>
        LOADING . . .
    </div>`;
    var game;
    if(gamemode === 'singleplayer'){
        game = new Game(username, texture);
        game.animate();
        game.bulletAnimate();
        game.playerAnimate();
    } else {
        game = new Multiplayer(username, texture);
        game.animate();
    }

    let gameover = setInterval(() => {
        if(game.player.health <= 0){
            clearInterval(gameover);
            const score = game.player.score;
            game.gameover();
            game = {};
            document.getElementById('root').innerHTML = `<div>
            <center>
                <h1>GAME OVER</h1>
                <h2>Your last score: ${score}</h2><br/><br/><br/>
                <button class="btn" onClick="window.location.reload();">Re-enter World</button>
            </center>
            </div>`
        }
    }, 100);
}