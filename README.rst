=========
JS Snake!
=========

In this exercise, you'll fix up and improve a classic arcade game using
Vanilla JS.

The game is "Snake": you move a snake around the screen, gobbling up food
pellets and avoiding crashing into walls or into yourself. However, every
time you eat a food pellet, the snake grows longer, making it harder to
navigate!


Step Zero: Play the Game
========================

Open ``solution-single/index.html`` in a browser and play the game to get
a feel for how it should work:

- the up/down/left/right arrow keys to move the snake around

- you can't turn the snake 180 degrees; you can only turn 90 degrees
  per move

- the game will end when you crash into yourself or into a wall


Step One: Read the Source
=========================

Read over the source code. There's a lot happeneing here!

- There are OO classes for the Snake, each food Pellet, and the game itself

- The snake handles its own moving by being called by the games' key handler

- The snake "moves" by just adding a new head and cropping off the tail
  (much like how lights on a moving light board "move")

- When you eat a pellet, a property on the snake keeps track of the fact
  that it shouldn't shrink for a few rounds. Can you figure out the logic
  here?

Add comments and notes to understand the source better.


Step Three: Fix the Keyboard Bug
================================

There's a bug preventing the keyboard moving from working (you should
see an error in the console). Fix this.


Step Four: Die When You Crash Into Yourself
===========================================

The game currently ends when you crash into a wall. Add logic to end
the game when the snake crashes into itself.


Step Five: Don't Allow Changing 180 Degrees
===========================================

Implement a solution that prevents the snake from changing directions
180 degrees (for example, if you're moving up, you can't change to
moving down, only to left or right).


Step Six: Allow Different Colored Snake
=======================================

The snake is hard-coded to be orange. Make it so that the snake color
can be passed into the snake at the time the snake is created.


Optional Step Seven: Make Food Creation Smarter
===============================================

Food pellets are currently refilled now by picking a random spot on
the board. It's possible that that might be on the head or in the
body of the snake. Add a check to make sure new food can't be
created on the snake.


The Big One: Step Eight
=======================

Being object-oriented, our Snake class holds all the information about
the snake. This allows us to make a big, impressive change: turn this
single-player snake game into a multi-player snake game!

This will require some thinking, and a few changes in different parts
of the code:

- the ``Game`` object should change to holding an array of snakes,
  and taking an array of snakes in the constructor (you can make
  a second snake in a different color, with different keyboard keys
  used to move)

- places like the ``tick`` method of ``Game`` will need to handle
  different snakes

- **Harder:** make it so that any snake crashing into any snake should
  end the game!


Further Play
============

- Add CSS to give this a much more snazzy look

- Make more things configurable: speed, amount snakes grow when they eat, etc
