import { Game } from './src/game';
import './style.css'


document.getElementById('root').innerHTML = `<div>
    <center><form class="login" id="loginform">
        <label>USERNAME</label><br/>
        <input type="text" class="input" name="username" id="username" required/><br/><br/>
        <label>EMAIL</label><br/>
        <input type="email" class="input" name="email" id="email" required/><br/><br/>
        <button class="btn" type="submit" id="loginbutton">Enter World</button>
    </form></center>
</div>`

document.getElementById('loginform').onsubmit= (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    document.getElementById('root').innerHTML = `<div class="loader" id='loader'>
        <center><div class="loadmover"></div></center>
        <br/><br/>
        LOADING . . .
    </div>`;

    var game = new Game(email, username);
    game.animate();
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