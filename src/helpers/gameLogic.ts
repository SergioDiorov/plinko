import Matter, { Engine, Render, Runner, Bodies, Composite, Events, IBodyDefinition, World, Body } from "matter-js";
import { ScreenSize } from "src/constants/screenSize";

let engine: Matter.Engine;
let render: Matter.Render;
let runner: Matter.Runner;
let ballCount: number;
let columnPositions: number[];
let transparentSquares: Matter.Body[];
let elementRect: DOMRect;

// Start game function
export function startGame(element: any, onGameDataUpdate: (ballNumber: number, squareIndex: number) => void, gameScreenSize: ScreenSize) {
  elementRect = element.getBoundingClientRect();
  console.log(gameScreenSize);

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
    const lineWidth = gameScreenSize === ScreenSize.MEDIUM ? linePins * (pinGap - 10) : gameScreenSize === ScreenSize.SMALL ? linePins * (pinGap - 10) : linePins * pinGap;

    for (let i = 0; i < linePins; i++) {
      if (gameScreenSize === ScreenSize.MEDIUM) {
        const pin = Bodies.circle(
          (worldWidth + 19) / 2 - lineWidth / 2 + i * (pinGap - 6.8),
          178 + l * (pinGap - 12.8),
          (pinSize - 1.2),
          {
            isStatic: true,
            render: {
              visible: false,
            }
          },
        );
        pins.push(pin);
      } else if (gameScreenSize === ScreenSize.LARGE) {
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
      } else if (gameScreenSize === ScreenSize.SMALL) {
        const pin = Bodies.circle(
          (worldWidth + 59) / 2 - lineWidth / 2 + i * (pinGap - 13),
          259 + l * (pinGap - 18.5),
          (pinSize - 2.1),
          {
            isStatic: true,
            render: {
              visible: false,
            }
          },
        );
        pins.push(pin);
      }
    }

    linePins = l % 2 === 0 ? 7 : 8;
  }
  Composite.add(engine.world, pins);

  // Create left side triangles
  for (let l = 0; l < pinLines; l++) {
    if (gameScreenSize === ScreenSize.MEDIUM) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          triangleSize / 2, 180 + l * (pinGap - 13.5),
          3, (triangleSize - 5),
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
    } else if (gameScreenSize === ScreenSize.LARGE) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          triangleSize / 2, 100 + l * (pinGap - 7),
          3, triangleSize,
          {
            isStatic: true,
            restitution: 2,
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
    } else if (gameScreenSize === ScreenSize.SMALL) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          17, 265 + l * (pinGap - 19),
          3, (triangleSize - 13),
          {
            isStatic: true,
            restitution: 2,
            friction: 0,
            angle: 45,
            render: {
              visible: false,
            },
          },
        );

        triangle.vertices[2].x -= triangleSize / 1.3;

        Composite.add(engine.world, triangle);
      }
    }
  }

  // Create right side triangles
  for (let l = 0; l < pinLines; l++) {
    if (gameScreenSize === ScreenSize.MEDIUM) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          worldWidth - triangleSize / 2, 180 + l * (pinGap - 13.5),
          3, (triangleSize - 5.5),
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
    } else if (gameScreenSize === ScreenSize.LARGE) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          worldWidth - triangleSize / 2, 100 + l * (pinGap - 7),
          3, triangleSize,
          {
            isStatic: true,
            restitution: 2,
            friction: 0,
            render: {
              visible: false,
            },
          },
        );

        triangle.vertices[1].x += triangleSize / 1;

        Composite.add(engine.world, triangle);
      }
    } else if (gameScreenSize === ScreenSize.SMALL) {
      if (l % 2 === 1) {
        const triangle = Bodies.polygon(
          worldWidth - 32 / 2, 265 + l * (pinGap - 19),
          3, (triangleSize - 13),
          {
            isStatic: true,
            restitution: 2,
            friction: 0,
            render: {
              visible: false,
            },
          },
        );

        triangle.vertices[1].x += triangleSize / 1.3;

        Composite.add(engine.world, triangle);
      }
    }
  }

  // Create left wall
  const leftWall = Bodies.rectangle(
    0,
    worldHeight / 2,
    gameScreenSize === ScreenSize.MEDIUM ? 12 : 10,
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
    gameScreenSize === ScreenSize.MEDIUM ? 12 : 10,
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
    if (gameScreenSize === ScreenSize.MEDIUM) {
      const columnX = initialX + i * (columnWidth + columnGap);
      const column = Bodies.rectangle(
        columnX, // Position X
        worldHeight - columnHeight / 2, // Position Y
        (columnWidth - 1), (columnHeight - 8), // width and height
        {
          isStatic: true,
          restitution: 0.5,
          render: {
            visible: false,
          },
        },
      );
      Composite.add(engine.world, column);
      columnPositions.push(columnX);
    } else if (gameScreenSize === ScreenSize.LARGE) {
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
    } else if (gameScreenSize === ScreenSize.SMALL) {
      const columnX = initialX + i * (columnWidth + columnGap);
      const column = Bodies.rectangle(
        columnX, // Position X
        worldHeight - columnHeight / 2, // Position Y
        (columnWidth - 2), (columnHeight - 10), // width and height
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
  }

  transparentSquares = [];

  // Adding transparent squares between columns to check for balls
  const squareSize = gameScreenSize === ScreenSize.MEDIUM ? 38 : gameScreenSize === ScreenSize.SMALL ? 40 : 44; // Size of transparent square
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

      pins.forEach((pin) => {
        if (bodyA === pin) {
          applyRandomForce(bodyB);
        } else if (bodyB === pin) {
          applyRandomForce(bodyA);
        }
      });
    });
  }

  function applyRandomForce(body: Matter.Body) {
    const randomForceX = (Math.random() - 0.5) * 0.03;
    const randomForceY = -1 * (Math.random() * 0.03 + 0.02);

    Body.applyForce(body, body.position, { x: randomForceX, y: randomForceY });
  }
}

// Throw Ball function
export const throwBall = ({ x, y, gameScreenSize }: { x: number, y: number, gameScreenSize?: ScreenSize }) => {
  const ballSize = gameScreenSize === ScreenSize.MEDIUM ? 10 : gameScreenSize === ScreenSize.SMALL ? 8 : 12;
  const ballElastity = 0.6;

  if (x > 0 && y > 0) {
    const randomX = x + (Math.random() - 0.5) * 17;

    const distances = columnPositions.map((columnX, index) => ({
      distance: Math.abs(randomX - columnX),
      interval: index + 1,
    }));

    distances.sort((a, b) => a.distance - b.distance);

    const newBall = Bodies.circle(randomX, y, ballSize, {
      restitution: ballElastity,
      render: {
        fillStyle: '#EE3F7F',
      },
      ballNumber: ++ballCount,
    } as Partial<IBodyDefinition> & { ballNumber?: number });
    Composite.add(engine.world, [newBall]);

    const randomForceX = (Math.random() - 0.5) * 0.03;
    const randomForceY = -1 * (Math.random() * 0.03 + 0.02);
    Body.setVelocity(newBall, { x: randomForceX, y: randomForceY });

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
