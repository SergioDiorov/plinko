import Matter, { Engine, Render, Runner, Bodies, Composite, Events, IBodyDefinition, World } from "matter-js";

let engine: Matter.Engine;
let render: Matter.Render;
let runner: Matter.Runner;
let ballCount: number;
let columnPositions: number[];
let transparentSquares: Matter.Body[];
let elementRect: DOMRect;

// Start game function
export function startGame(element: any, onGameDataUpdate: (ballNumber: number, squareIndex: number) => void) {
  elementRect = element.getBoundingClientRect();

  const worldWidth = elementRect.width;
  const worldHeight = elementRect.height;
  const pinLines = 13;
  const pinSize = 7.3;
  const pinGap = 49.3;
  const triangleSize = 55;

  // Create engine
  engine = Engine.create();

  // Create render
  render = Render.create({
    element: element,
    engine: engine,
    options: {
      background: 'none',
      wireframes: false,
      width: worldWidth,
      height: worldHeight,
      showAngleIndicator: false,
      showBounds: false,
      pixelRatio: 1.5,
    },
  });

  // Create pins
  const pins: Matter.Body[] = [];
  let linePins = 8;

  for (let l = 0; l < pinLines; l++) {
    const lineWidth = linePins * pinGap;
    for (let i = 0; i < linePins; i++) {
      const pin = Bodies.circle(
        (worldWidth + 48.4) / 2 - lineWidth / 2 + i * pinGap,
        100 + l * (pinGap - 7.4),
        pinSize,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        },
      );
      pins.push(pin);
    }

    linePins = l % 2 === 0 ? 7 : 8;
  }
  Composite.add(engine.world, pins);

  // Create left side triangles
  for (let l = 0; l < pinLines; l++) {
    if (l % 2 === 1) {
      const triangle = Bodies.polygon(
        triangleSize / 2, 100 + l * (pinGap - 7),
        3, triangleSize,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          angle: 45,
          render: {
            visible: false,
          },
        },
      );

      triangle.vertices[2].x -= triangleSize / 1;

      Composite.add(engine.world, triangle);
    }
  }

  // Create right side triangles
  for (let l = 0; l < pinLines; l++) {
    if (l % 2 === 1) {
      const triangle = Bodies.polygon(
        worldWidth - triangleSize / 2, 100 + l * (pinGap - 7),
        3, triangleSize,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          render: {
            visible: false,
          },
        },
      );

      triangle.vertices[1].x += triangleSize / 1;

      Composite.add(engine.world, triangle);
    }
  }

  // Create left wall
  const leftWall = Bodies.rectangle(
    0,
    worldHeight / 2,
    10,
    worldHeight,
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  );
  Composite.add(engine.world, leftWall);

  // Create right wall
  const rightWall = Bodies.rectangle(
    worldWidth,
    worldHeight / 2,
    10,
    worldHeight,
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  );
  Composite.add(engine.world, rightWall);


  // Create bottom colums
  const columnWidth = 4;
  const columnHeight = 50;
  const columnGap = (worldWidth - 5 - columnWidth * 8) / 9;
  columnPositions = [];

  // Calculation of the starting position of X for the first column
  const initialX = (worldWidth - (columnWidth * 8 + columnGap * 7)) / 2 + columnWidth / 2;

  for (let i = 0; i < 8; i++) {
    const columnX = initialX + i * (columnWidth + columnGap);
    const column = Bodies.rectangle(
      columnX, // Position X
      worldHeight - columnHeight / 2, // Position Y
      columnWidth, columnHeight, // width and height
      {
        isStatic: true,
        render: {
          visible: false,
        },
      },
    );
    Composite.add(engine.world, column);
    columnPositions.push(columnX);
  }

  transparentSquares = [];

  // Adding transparent squares between columns to check for balls
  const squareSize = 44; // Size of transparent square
  const firstTransparentSquare = Bodies.rectangle(
    columnPositions[0] - columnWidth / 2 - squareSize / 2,
    (worldHeight + 45) - columnHeight - squareSize / 2,
    squareSize,
    squareSize,
    {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'transparent',
        visible: false,
      },
    },
  );
  transparentSquares.push(firstTransparentSquare);

  for (let i = 0; i < columnPositions.length - 1; i++) {
    const posX = (columnPositions[i] + columnPositions[i + 1]) / 2; // Middle position between two columns
    const transparentSquare = Bodies.rectangle(
      posX,
      (worldHeight + 45) - columnHeight - squareSize / 2, // The height at which the transparent square is placed
      squareSize,
      squareSize,
      {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: 'transparent',
          visible: false,
        },
      },
    );
    transparentSquares.push(transparentSquare);
  }

  const lastTransparentSquare = Bodies.rectangle(
    columnPositions[columnPositions.length - 1] + columnWidth / 2 + squareSize / 2,
    (worldHeight + 45) - columnHeight - squareSize / 2,
    squareSize,
    squareSize,
    {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'transparent',
        visible: false,
      },
    },
  );
  transparentSquares.push(lastTransparentSquare);
  Composite.add(engine.world, transparentSquares);

  // Create bottom border
  const bottom = Bodies.rectangle(
    worldWidth / 2,
    worldHeight - 3, // Height position
    worldWidth + 10, // Width
    10, // Height of element
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  );
  Composite.add(engine.world, bottom);

  // Create runner
  runner = Runner.create();

  ballCount = 0;

  Runner.run(runner, engine);

  // Add a collision event to determine if the ball hit a column or a transparent square
  Events.on(engine, 'collisionStart', handleCollisionStart);

  // Collision event handling function
  function handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      transparentSquares.forEach((transparentSquare, index) => {
        if (bodyA === transparentSquare || bodyB === transparentSquare) {
          const transparentSquareIndex = index + 1;
          const ballNumber = bodyA.ballNumber || bodyB.ballNumber;
          ballNumber && onGameDataUpdate(ballNumber, transparentSquareIndex);
        }
      });
    });
  }
}

// Throw Ball function
export const throwBall = ({ x, y }: { x: number, y: number }) => {
  const ballSize = 12;
  const ballElastity = 0.75;

  if (x > 0 && y > 0) {
    const distances = columnPositions.map((columnX, index) => ({
      distance: Math.abs(x - columnX),
      interval: index + 1,
    }));

    distances.sort((a, b) => a.distance - b.distance);

    const newBall = Bodies.circle(x, y, ballSize, {
      restitution: ballElastity,
      render: {
        fillStyle: '#EE3F7F',
      },
      ballNumber: ++ballCount,
    } as Partial<IBodyDefinition> & { ballNumber?: number });
    Composite.add(engine.world, [newBall]);

    Render.run(render);
  }
}

// Reset game function
export function resetGame() {
  // Stop the runner (stops the engine)
  Runner.stop(runner);

  // Clear the engine (removes all bodies and constraints from the world)
  World.clear(engine.world, false);

  // Clear transparent squares array
  transparentSquares = [];

  // Clear column positions array
  columnPositions = [];

  // Clear ball count
  ballCount = 0;

  // Remove collision event listeners
  // Events.off(engine, 'collisionStart', handleCollisionStart);

  // Clear element rectangle
  // elementRect = null;

  // Destroy the renderer
  if (render) {
    Render.stop(render);
    Render.run(render);
  }

  // Recreate engine
  engine = Engine.create();

  // Recreate runner
  runner = Runner.create();
}
