SCALE = 20
WIDTH = 30
HEIGHT = 30
SPEED = 400

/** One-time setup: find HTML canvas element */

const canvas = document.getElementById("board")
canvas.setAttribute("height", HEIGHT * SCALE)
canvas.setAttribute("width", WIDTH * SCALE)
const ctx = canvas.getContext("2d")


/** Point: */

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
    constructor(color, keymap, start, dir) {
        this.color = color      // color for this snake
        this.keymap = keymap    // mapping of keys to directions
        this.parts = [start]    // list of x-y coordinates of parts
        this.dir = dir          // dir to move on next move
        this.growBy = 0         // how many to grow by (goes up after eating)
    }

    draw() {
        for (const p of this.parts) p.draw(this.color)
    }

    contains(pt) {
        return this.parts.some(me => me.x === pt.x && me.y === pt.y)
    }

    crashIntoSelf() {
        const head = this.head()
        const body = this.parts.slice(1)
        return body.some(b => b.x === head.x && b.y === head.y)
    }

    crashIntoWall() {
        return (this.head().isOutOfBound())
    }

    head() {
        return this.parts[0]
    }

    move() {
        const {x, y} = this.head()
        let pt
        if (this.dir === "left") pt = new Point(x - 1, y)
        if (this.dir === "right") pt = new Point(x + 1, y)
        if (this.dir === "up") pt = new Point(x, y - 1)
        if (this.dir === "down") pt = new Point(x, y + 1)
        this.parts.unshift(pt)
    }

    handleKey(key) {
        if (this.keymap[key] !== undefined) this.changeDir(this.keymap[key])
    }

    changeDir(dir) {
        if (dir === "left" && this.dir !== "right") this.dir = "left"
        else if (dir === "right" && this.dir !== "left") this.dir = "right"
        else if (dir === "up" && this.dir !== "down") this.dir = "up"
        else if (dir === "down" && this.dir !== "up") this.dir = "down"
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

    crashIntoSnake(other) {
        // we can only crash into another snake with our head
        const head = this.head()
        return other.parts.some(o => o.x === head.x && o.y === head.y)
    }
}

/** Overall game. */

class Game {
    constructor(snakes) {
        this.snakes = snakes
        this.food = []
        this.numFood = 3

        this.interval = null
        this.keyListener = this.onkey.bind(this)
    }

    refillFood() {
        while (this.food.length < this.numFood) {
            const candidate = Pellet.newRandom()
            if (this.snakes.every(s => !s.contains(candidate))) this.food.push(candidate)
        }
    }

    play() {
        document.addEventListener("keydown", this.keyListener)
        this.interval = window.setInterval(this.tick.bind(this), SPEED)
    }

    onkey(e) {
        for (const s of this.snakes) s.handleKey(e.key)
    }

    removeFood(pellet) {
        this.food = this.food.filter(
            f => f.pt.x !== pellet.pt.x && f.pt.y !== pellet.pt.y)
    }

    tick() {
        console.log("tick")

        const dead = this.snakes.some(
            s => s.crashIntoSelf() ||
                s.crashIntoWall() ||
                this.snakes.filter(sn => sn !== s).some(o => s.crashIntoSnake(o)))

        if (!dead) {
            ctx.clearRect(0, 0, SCALE * WIDTH, SCALE * HEIGHT)
            for (const f of this.food) {
                f.draw()
            }
            for (const s of this.snakes) {
                let eaten
                s.move()
                s.truncate()
                s.draw()
                if (eaten = s.eats(this.food)) {
                    this.removeFood(eaten)
                    s.grow()
                }
            }
            this.refillFood()
        } else {
            window.clearInterval(this.interval)
            window.removeEventListener("keydown", this.keyListener)
        }
    }
}


const snakes = [
    new Snake(
        "red", 
        {ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down"},
        new Point(20, 20),
        "right"),
    new Snake(
        "blue", 
        {w: "up", a: "left", s: "right", z: "down"},
        new Point(10, 10),
        "right")
]


const game = new Game(snakes)
game.play()
