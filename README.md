## Website Performance Optimization portfolio project

### Running Instructions

1. Install [Node.js](https://nodejs.org/).

1. Run `npm install` in the root folder of the project.

1. Run `npm run gulp` to run the default gulp task.

1. Start a local server:

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Visit localhost:8080 to view locally.

1. Download and install [ngrok](https://ngrok.com/) to make your local server 
accessible remotely, via the Web:

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok 8080
  ```

1. Copy the public URL ngrok gives you and run it through PageSpeed Insights.


### Performance Improvements to pizza.html and main.js

#### Resizing pizzas

Time to resize pizzas now ~1.25ms

1.  In `changePizzaSizes()`, the call to 
    `document.querySelectorAll(".randomPizzaContainer")` is made 4 times, 
    when only once is necessary. Now done once, _before_ the for loop.
2.  Replace `querySelectorAll` with `getElementsByClassName` in 
    `changePizzaSizes()` function.
3.  Work done by `determineDx` is unnecessary, so replaced by:
    1.  Determining width of containing `#randomPizzas` div once, and only 
        once (previously calculated for every `.randomPizzaContainer`).
    2.  Similarly determining new width for `.randomPizzaContainer` by call
        to `sizeSwitcher()`, which is taken out of its enclosing 
        `determineDx()` function.
3.  Updating styles at the end of the function, after all measurements are
    calculated.

#### Moving pizzas on scroll

Improved 'Average time to generate last 10 frames' from ~25ms to ~0.13ms.

1.  Group all moving pizza images into 5 sets, each in set getting its own 
    `div`. Then animate the `div` on scroll, and not each pizza image. In 
    this way there are only 5 elements to move, not 200.
2.  Put each of the 5 `div` set on a separate layer, using the css hint
    `will-change` (in `styles.css`).
3.  Replace updating of the elements `left` css property with 
    `transform: translateX`.
4.  `bodyPosition = document.body.scrollTop / 125;` taken outside the loop 
    in which transform is calculated, as only need to do this once.
5.  Small refactorings to reduce repetition.
6.  Replace `querySelector` with `getElementById` in `updatePositions()`,
    `createMovingPizzaContainers()`, and `createMovingPizzaSet` functions.
  
#### First render of pizzas

1.  Line 474 (now 463), which gets a DOM reference to the '#randomPizzas' node,
    moved to before the for loop. Only need to do this once.
    
