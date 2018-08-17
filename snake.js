SCALE = 20
WIDTH = 30
HEIGHT = 30
SPEED = 400

/** One-time setup: find HTML canvas element */

const canvas = document.getElementById("board")
canvas.setAttribute("height", HEIGHT * SCALE)
canvas.setAttribute("width", WIDTH * SCALE)
const ctx = canvas.getContext("2d")


/** Point: 
 * defines coordinates on gameboard. Could be for either snake or food. 
*/

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw(color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.x * SCALE, this.y * SCALE, SCALE / 2, 0, Math.PI * 2)
        ctx.fill()
    }

    static newRandom() {
        const randRange = (low, hi) => low + Math.floor((Math.random() * (hi - low)))
        return new Point(randRange(1, WIDTH), randRange(1, HEIGHT))
    }

    isOutOfBound() {
        return (this.x <= 0 || this.x >= WIDTH || this.y <= 0 || this.y >= HEIGHT)
    }
}

/** Food pellet */

class Pellet {
    constructor(x, y) {
        this.pt = new Point(x, y)
    }

    static newRandom() {
        const pt = Point.newRandom()
        return new Pellet(pt.x, pt.y)
    }

    draw() {
        this.pt.draw("green")
    }
}

/** Snake */

class Snake {
    constructor(keymap, start, dir) {
        this.keymap = keymap    // mapping of keys to directions
        this.parts = [start]    // list of x-y coordinates of parts
        this.dir = dir          // dir to move on next move
        this.growBy = 0         // how many to grow by (goes up after eating)
    }

    draw() {
        for (const p of this.parts) p.draw("orange")
    }

    contains(pt, arr = this.parts) {
        return arr.some(me => me.x === pt.x && me.y === pt.y)
    }

    crashIntoSelf() {
        const headless = this.parts.slice(1)
        return (this.contains(this.head(), headless))
    }

    crashIntoWall() {
        console.log(this.parts[0])
        // console.log(isOutOfBound)
        return (this.head().isOutOfBound())
    }

    head() {
        return this.parts[0]
    }

    //a move adds a new head(first circle) and removes the tail(last circle)
    move() {
        const { x, y } = this.head()
        let pt
        if (this.dir === "left") pt = new Point(x - 1, y)
        if (this.dir === "right") pt = new Point(x + 1, y)
        if (this.dir === "up") pt = new Point(x, y - 1)
        if (this.dir === "down") pt = new Point(x, y + 1)
        this.parts.unshift(pt)
    }

    //snake handles its own moving by calling the game's key handler
    handleKey(key) {
        console.log("this.snake inside of handlekey", this.snake)
        if (this.keymap[key] !== undefined) this.changeDir(this.keymap[key])
    }

    changeDir(dir) {
        this.dir = dir
    }

    grow() {
        this.growBy += 2
    }

    truncate() {
        if (this.growBy === 0) this.parts.pop()
        else this.growBy--
    }

    eats(food) {
        const head = this.head()
        return food.find(f => f.pt.x === head.x && f.pt.y === head.y)
    }
}

/** Overall game. */

class Game {
    constructor(snakes) {
        this.snake = snakes
        this.food = []
        this.numFood = 3

        this.interval = null
        //binds instance of game to the key listener so that when onkey is called "this" references the instance of game, and not window. 
        this.keyListener = this.onkey.bind(this)

    }

    refillFood() {
        while (this.food.length < this.numFood) {
            this.food.push(Pellet.newRandom())
        }
    }

    play() {
        document.addEventListener("keydown", this.keyListener)
        this.interval = window.setInterval(this.tick.bind(this), SPEED)
    }

    //calls the snake's key handler
    onkey(e) {
        this.snake.handleKey(e.key)
        console.log("this.snake", this.snake)
    }

    removeFood(pellet) {
        this.food = this.food.filter(
            f => f.pt.x !== pellet.pt.x && f.pt.y !== pellet.pt.y)
    }

    tick() {
        console.log("tick")

        const dead = this.snake.crashIntoSelf() || this.snake.crashIntoWall()

        if (!dead) {
            ctx.clearRect(0, 0, SCALE * WIDTH, SCALE * HEIGHT)
            for (const f of this.food) {
                f.draw()
            }
            let eaten
            this.snake.move()
            this.snake.truncate()
            this.snake.draw()
            if (eaten = this.snake.eats(this.food)) {
                this.removeFood(eaten)
                this.snake.grow()
            }
            this.refillFood()
        } else {
            window.clearInterval(this.interval)
            window.removeEventListener("keydown", this.keyListener)
        }
    }
}


const snake = new Snake(
    { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" },
    new Point(20, 20),
    "right")


const game = new Game(snake)
game.play()
