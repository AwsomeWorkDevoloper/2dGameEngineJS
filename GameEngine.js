const GMath = {
    GetDistanceBetweenPoints: (a,b) => Math.sqrt(((b.x - a.x)**2) + ((b.y - a.y)**2)),
    FlipBetween1and0: (n) => 1 - n,
    IsBetween: (n, min, max) => {
        if(n >= min && n <= max) return true;
        return false;
    },
    Clamp: (x, min, max) => {
        if(x < min) return min;
        if(x > max) return max;

        return x;
    }
};

export class GEngineGame {
    constructor (viewport) {
        this.viewport = viewport;
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.viewport.center = () => {
            return {
                x: this.viewport.width / 2,
                y: this.viewport.height / 2
            }
        }
        this.ctx = viewport.getContext('2d');

        this.levels = [];
        this.levelIndex = 0;

        // save the latest input data
        this.latestKeys = [];
        this.latestMouseData = {x: 0, y: 0, isClicking: false};

        // handle keyboard input
        document.addEventListener('keydown', e => {
            this.latestKeys.push(e.key.toLowerCase());
        });

        // handle keyboard inputs let go
        document.addEventListener('keyup', e => {
            let newKeys = [];

            this.latestKeys.forEach(k => {
                if(k !== e.key.toLowerCase()) newKeys.push(k);
            });

            this.latestKeys = [...newKeys];
        });

        // handle mouse click input
        document.addEventListener('mousedown', e => {
            this.latestMouseData.isClicking = true;
        });

        // handle mouse hold
        document.addEventListener('mouseup', e => {
            this.latestMouseData.isClicking = false;
        });

        // handle mouse move input
        document.addEventListener('mousemove', e => {
            this.latestMouseData.x = e.pageX;
            this.latestMouseData.y = e.pageY;
        });

        // request a key
        this.RequestKey = (key)=>{
            if(this.latestKeys.includes(key)){
                return true;
            }
            return false;
        }

        // request keys
        this.RequestKeys = (keys, type='all') => {
            let res = [];

            for(let key of keys) {
                res.push(this.latestKeys.includes(key));
            }

            if(type === 'all')
                return res.every(x => x === true);

            return res.includes(true);
        }

        // request mouse data
        this.RequestMouseData = (data)=>{
            if(data == 'x') return this.latestMouseData.x;
            if(data == 'y') return this.latestMouseData.y;
            if(data == 'click') return this.latestMouseData.isClicking;
        }

        // reset input data
        this.ResetKeys = ()=>{this.latestKeys = []}

        this.Start = () => {
            let level = this.levels[this.levelIndex];

            level.entities.forEach(entity => {
                entity.onAwake();
            });

            this.gameInterval = setInterval(()=>{
                this.viewport.width = window.innerWidth;
                this.viewport.height = window.innerHeight;

                const shadowCanvas = document.createElement('canvas');
                const shadowCtx = shadowCanvas.getContext('2d');

                shadowCanvas.width = this.viewport.width;
                shadowCanvas.height = this.viewport.height;

                shadowCtx.fillStyle = 'black';
                shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);

                shadowCtx.globalCompositeOperation = 'destination-out';

                level.entities.forEach(entity => {
                    entity.onUpdate();

                    if(entity.render.affectedByCamera) {
                        entity.renderTransform.position = {
                            x: (entity.transform.position.x - level.camera.transform.position.x) * level.camera.transform.zoom,
                            y: (entity.transform.position.y - level.camera.transform.position.y) * level.camera.transform.zoom,
                        }
                        entity.renderTransform.size = {
                            width: entity.transform.size.width * level.camera.transform.zoom,
                            height: entity.transform.size.height * level.camera.transform.zoom,
                        }
                    } else {
                        entity.renderTransform.position = {...entity.transform.position},
                        entity.renderTransform.size = {...entity.transform.size}
                    }

                    if(entity.render.show) {
                        if(entity.render.type === 'rect') {
                            this.ctx.fillStyle = entity.render.color;
                            this.ctx.fillRect(
                                entity.renderTransform.position.x,
                                entity.renderTransform.position.y,
                                entity.renderTransform.size.width,
                                entity.renderTransform.size.height,
                            );
                        }
                        else if(entity.render.type === 'sprite') {
                            if(entity.render.spriteData !== null) {
                                // generate a second canvas
                                let renderer = document.createElement('canvas');
                                renderer.width = entity.render.spriteData.width;
                                renderer.height = entity.render.spriteData.height;
                                // render our ImageData on this canvas
                                renderer.getContext('2d').putImageData(entity.render.spriteData, 0, 0);
                                // Now we can scale our image, by drawing our second canvas
                                this.ctx.drawImage(
                                    renderer,
                                    entity.renderTransform.position.x,
                                    entity.renderTransform.position.y, 
                                    entity.renderTransform.size.width, 
                                    entity.renderTransform.size.height, 
                                );
                            }
                        }
                        else if(entity.render.type === 'light') {
                            let grad = shadowCtx.createRadialGradient(
                                entity.renderTransform.position.x, 
                                entity.renderTransform.position.y,
                                0,
                                entity.renderTransform.position.x, 
                                entity.renderTransform.position.y,
                                entity.render.lightData.radius
                            );

                            grad.addColorStop(0, `rgba(${entity.render.lightData.highColor}, ${entity.render.lightData.highLvl})`);
                            grad.addColorStop(1, `rgba(${entity.render.lightData.lowColor}, ${entity.render.lightData.lowLvl})`);
                                
                            shadowCtx.fillStyle = grad;
                            shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);
                        }
                        else if(entity.render.type === 'text') {
                            this.ctx.font = entity.render.text.font;
                            this.ctx.fillStyle = entity.render.color;
                            this.ctx.fillText(entity.render.text.content, entity.renderTransform.position.x, entity.renderTransform.position.y)
                        }
                    }
                });

                this.ctx.drawImage(
                    shadowCanvas,
                    0, 0,
                    this.viewport.width, this.viewport.height
                )

                this.ctx.restore();
            }, 1);
        }
        this.End = () => {
            clearInterval(this.gameInterval);
        }
    }
}

export class Level {
    constructor () {
        this.entities = [];
        this.camera = null;
    }
}

export class Entity {
    constructor (x, y, width, height) {
        this.transform = {
            position: {
                x: x,
                y: y
            },
            size: {
                width: width,
                height: height
            },
            Translate: (data)=>{
                this.transform.position.x += data.x;
                this.transform.position.y += data.y;
            },
            Dialate: (data)=>{
                this.transform.size.width += data.width;
                this.transform.size.height += data.height;
            },
            GetPoints: () => {
                return {
                    left: this.transform.position.x,
                    top: this.transform.position.y,
                    right: this.transform.position.x + this.transform.size.width,
                    bottom: this.transform.position.y + this.transform.size.height,
                    midX: (this.transform.size.width / 2) + this.transform.position.x,
                    midY: (this.transform.size.height / 2) + this.transform.position.y
                }
            }
        };

        this.renderTransform = {
            position: {...this.transform.position},
            size: {...this.transform.size},
            GetPoints: () => {
                return {
                    left: this.renderTransform.position.x,
                    top: this.renderTransform.position.y,
                    right: this.renderTransform.position.x + this.renderTransform.size.width,
                    bottom: this.renderTransform.position.y + this.renderTransform.size.height,
                    midX: (this.renderTransform.size.width / 2) + this.renderTransform.position.x,
                    midY: (this.renderTransform.size.height / 2) + this.renderTransform.position.y
                }
            }
        };

        this.render = {
            show: true,
            color: 'red',
            affectedByCamera: true,
            type: 'rect',
            spriteData: null,
            text: {
                font: '32px Arial',
                content: 'default text'
            }
        }

        this.onAwake = () => {};
        this.onUpdate = () => {};
    }
}

export class Light {
    constructor (entity, r, h, l, hc='255,255,255', lc='255,255,255') {
        this.entity = entity;
        this.radius = r;
        this.highLvl = h;
        this.lowLvl = l;
        this.highColor = hc;
        this.lowColor = lc;
    }
}

export class Camera {
    constructor (x, y, zoom) {
        this.transform = {
            position: {
                x: x,
                y: y
            },
            zoom: zoom,
            Translate: (data)=>{
                this.transform.position.x += data.x;
                this.transform.position.y += data.y;
            }
        };
    }
}

export class Animator {
    constructor (entity) {
        this.states = {};
        this.currentState = '';

        this.switchState = async (newState) => {
            this.currentState = newState;

            entity.render.spriteData = await CreateSpriteData(this.states[this.currentState]);
        };
    }
}

class Collider {
    constructor (entity) {
        this.bounce = .2;

        this.GetPoints = () => {
            return {
                left: entity.transform.position.x,
                top: entity.transform.position.y,
                right: entity.transform.position.x + entity.transform.size.width,
                bottom: entity.transform.position.y + entity.transform.size.height,
                midX: (entity.transform.size.width / 2) + entity.transform.position.x,
                midY: (entity.transform.size.height / 2) + entity.transform.position.y
            }
        }
        this.GetRenderPoints = () => {
            return {
                left: entity.renderTransform.position.x,
                top: entity.renderTransform.position.y,
                right: entity.renderTransform.position.x + entity.renderTransform.size.width,
                bottom: entity.renderTransform.position.y + entity.renderTransform.size.height,
                midX: (entity.renderTransform.size.width / 2) + entity.renderTransform.position.x,
                midY: (entity.renderTransform.size.height / 2) + entity.renderTransform.position.y
            }
        }

        this.HasCollided = (other) => {
            let a = this.GetPoints();
            let b = other.collider.GetPoints();

            if(
                a.bottom < b.top || 
                a.top > b.bottom ||
                a.right < b.left ||
                a.left > b.right
            ) {
                return false;
            }

            return true;
        }

        this.debug = {
            drawPoints: (Game, color) => {
                let points = this.GetRenderPoints();
                Game.ctx.fillStyle = color;

                Game.ctx.fillRect(points.left, points.top, 2, 2);
                Game.ctx.fillRect(points.right, points.top, 2, 2);
                Game.ctx.fillRect(points.left, points.bottom, 2, 2);
                Game.ctx.fillRect(points.right, points.bottom, 2, 2);
            }
        };
    }
}

export class PhysicsBody {
    constructor(entity, collidable) {
        this.vx = 0;
        this.vy = 0;
        this.velocityMultiplier = 0.25;
        this.STICKY_THRESHOLD = 0.0004;
        this.gravitySpeed = 0.02;

        this.velocityXSlowdown = 0.02;

        this.step = () => {
            collidable.forEach(other => {
                const collision = entity.collider.HasCollided(other);

                if(collision) {
                    this.resolveElastic(other);
                }
            });

            entity.transform.Translate({x: this.vx * this.velocityMultiplier, y: this.vy})
            
            //gravity
            this.vy += this.gravitySpeed;

            if(this.vx < 0) {
                //vx slowdown
                this.vx += this.velocityXSlowdown;
            } else if(this.vx > 0) {
                //vx slowdown
                this.vx -= this.velocityXSlowdown;
            }
        }

        this.resolveElastic = (other) => {
            let aPoints = entity.collider.GetPoints();
            let bPoints = other.collider.GetPoints();

            let aMid = {x: aPoints.midX, y: aPoints.midY};
            let bMid = {x: bPoints.midX, y: bPoints.midY};

            let dx = (bMid.x - aMid.x) / (other.transform.size.width / 2);
            let dy = (bMid.y - aMid.y) / (other.transform.size.height / 2);
            
            let absDX = Math.abs(dx);
            let absDY = Math.abs(dy);

            if(Math.abs(absDX - absDY) < 0.1) {
                if(dx < 0) {
                    entity.transform.position.x = bPoints.right;
                } else {
                    entity.transform.position.x = bPoints.left - entity.transform.size.width;
                }

                if(dy < 0) {
                    entity.transform.position.y = bPoints.bottom;
                } else {
                    entity.transform.position.y = bPoints.top - entity.transform.size.height;
                }

                if(Math.random() < 0.5) {
                    this.vx = -this.vx * other.collider.bounce;

                    if(Math.abs(this.vx) < this.STICKY_THRESHOLD) {
                        this.vx = 0;
                    }
                }
                else {
                    this.vy = -this.vy * other.collider.bounce;

                    if(Math.abs(this.vy) < this.STICKY_THRESHOLD) {
                        this.vy = 0;
                    }
                }
            } else if(absDX > absDY) {
                if(dx < 0) {
                    entity.transform.position.x = bPoints.right;
                } else {
                    entity.transform.position.x = bPoints.left - entity.transform.size.width;
                }

                this.vx = -this.vx * other.collider.bounce;

                if(Math.abs(this.vx) < this.STICKY_THRESHOLD) {
                    this.vx = 0;
                }
            } else {
                if(dy < 0) {
                    entity.transform.position.y = bPoints.bottom;
                } else {
                    entity.transform.position.y = bPoints.top - entity.transform.size.height;
                }

                this.vy = -this.vy * other.collider.bounce;

                if(Math.abs(this.vy) < this.STICKY_THRESHOLD) {
                    this.vy = 0;
                }
            }
        }

        this.vy = Math.round(this.vy);
    }
}


function CreateLinearGradient(x1, y1, x2, y2) {
    const canvas = new OffscreenCanvas(x2, y2);
    let context = canvas.getContext('2d');

    return context.createLinearGradient(x1, y1, x2, y2);
}

async function CreateSpriteData(src) {
    var response = await fetch(src);

    var fileBlob = await response.blob();
    var bitmap = await createImageBitmap(fileBlob);

    var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    var context = canvas.getContext('2d');

    context.drawImage(bitmap, 0, 0);
    var myData = context.getImageData(0, 0, bitmap.width, bitmap.height);
    return myData;
};

function GenerateNoise (width, height) {
    let r = [];

    for(let x = 0; x < width; x++) {
        let row = [];
        for(let y = 0; y < height; y++) {
            row.push(Math.random());
        }
        r.push(row);
    }

    return r;
}

function DrawNoise(noise, width, height, scl=1) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${noise[x][y]})`;
            ctx.fillRect(x, y, scl, scl);
        }
    }

    return ctx.getImageData(0, 0, width, height);
}

export { CreateSpriteData, Collider, GMath, CreateLinearGradient, GenerateNoise, DrawNoise };