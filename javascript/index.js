// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Bounds = Matter.Bounds,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Events = Matter.Events

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        hasBounds: true
    }
});

// create mouse constraint
let mouse = Mouse.create(render.canvas)
let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {visible: false}
    }
});

// create ground
let ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth*1000, 100, {
    isStatic:true,
    collisionFilter: {
        group: 0,
        category: 1,
        mask: -1
    },
})

//create bumps
let bumps = Composites.stack(window.innerWidth, window.innerHeight-55, 100, 1, 1000, 0, function(x,y) {return Bodies.circle(x, y, 50, {isStatic:true})})

// vehicle controls
let x = window.innerWidth/2
let y = window.innerHeight-200
let spring = 0.25
let friction = 1
let damping = 0.5
let speed = 0.10
let static = false
let visible = false
let chassistexture = "assets/boxtruck.png"
let wheeltexture = "assets/wheel.png"

// create truck
let chassis = Bodies.rectangle(x, y, 598, 230, {
    render: {
        sprite: {
            texture: chassistexture,
            xOffset: 0,
            yOffset: 0
        }
    },
    collisionFilter: {
        group: 1,
        category: 2,
        mask: 1
    },
    isStatic: static
})

// create suspension
let swingarmA = Bodies.rectangle(x+60, y+125, 400, 10, {
    collisionFilter: {
        group: 2,
        category: 1,
        mask: 0
    },
    render: {
        visible: visible
    },
    isStatic: static
})
let swingarmB = Bodies.rectangle(x+60, y+125, 400, 10, {
    collisionFilter: {
        group: 2,
        category: 1,
        mask: 0
    },
    render: {
        visible: visible
    },
    isStatic: static
})

// create wheels
let rearwheel = Bodies.circle(x-122, y+125, 33, {
    render: {
        sprite: {
            texture: wheeltexture,
            xScale: 0.08,
            yScale: 0.08
        }
    },
    collisionFilter: {
        group: 3,
        category: 1,
        mask: 1
    },
    friction: friction,
    isStatic: static
})
Body.setMass(rearwheel, 25)

let frontwheel = Bodies.circle(x+242, y+125, 33, {
    render: {
        sprite: {
            texture: wheeltexture,
            xScale: 0.08,
            yScale: 0.08
        }
    },
    collisionFilter: {
        group: 3,
        category: 1,
        mask: 1
    },
    friction: friction,
    isStatic: static
})
Body.setMass(frontwheel, 25)

// create constraints for rear wheel
let swingconstraintA = Constraint.create({
    bodyA: chassis,
    pointA: {x:242, y:100},
    bodyB: swingarmA,
    pointB: {x:180, y:0},
    stiffness: 1,
    length: 0,
    render: {
        visible: visible
    }
})
let springA = Constraint.create({
    bodyA: chassis,
    pointA: {x:-122, y:25},
    bodyB: swingarmA,
    pointB: {x:-185, y:0},
    stiffness: spring*1.25,
    damping: damping,
    length: 100,
    render: {
        visible: visible
    }
})
let axelA = Constraint.create({
    bodyA: swingarmA,
    pointA: {x:-185, y:0},
    bodyB: rearwheel,
    pointB: {x:0, y:0},
    stiffness: 1,
    length: 0,
    render: {
        visible: visible
    }
})

// create constraints for front wheel
let swingconstraintB = Constraint.create({
    bodyA: chassis,
    pointA: {x:-122, y:100},
    bodyB: swingarmB,
    pointB: {x:-180, y:0},
    stiffness: 1,
    length: 0,
    render: {
        visible: visible
    }
})
let springB = Constraint.create({
    bodyA: chassis,
    pointA: {x:242, y:25},
    bodyB: swingarmB,
    pointB: {x:185, y:0},
    stiffness: spring,
    damping: damping,
    length: 100,
    render: {
        visible: visible
    }
})
let axelB = Constraint.create({
    bodyA: swingarmB,
    pointA: {x:185, y:0},
    bodyB: frontwheel,
    pointB: {x:0, y:0},
    stiffness: 1,
    length: 0,
    render: {
        visible: visible
    }
})

// Body.setAngularVelocity(rearwheel, 1)

// add all of the bodies to the world
Composite.add(engine.world, [mouseConstraint, ground, bumps, chassis, swingarmA, swingconstraintA, springA, axelA, rearwheel, swingarmB, swingconstraintB, springB, axelB, frontwheel]);

// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

Events.on(runner, "afterTick", function() {
    Body.setAngularVelocity(rearwheel, speed)
    Body.setAngularVelocity(frontwheel, speed)
})

Events.on(render, "beforeRender", function() {
    Bounds.shift(render.bounds, {
        x: chassis.position.x - window.innerWidth/2,
        y: chassis.position.y - window.innerHeight/2
    })
})