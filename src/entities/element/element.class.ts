import * as d3 from "d3";

export class Vector {
  constructor(private _x: number, private _y: number) {}

  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  dotProduct(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get direction() {
    return Math.atan2(this.x, this.y);
  }
}
let theID: number = 0;

export abstract class RendreEE {
  public readonly id = theID++;
  constructor(private _position: Vector, private _velocity: Vector) {}

  protected abstract drawElement(ctx: OffscreenCanvasRenderingContext2D): void;

  public get position(): Vector {
    return this._position;
  }
  public get velocity(): Vector {
    return this._velocity;
  }

  public set position(position: Vector) {
    this._position = position;
  }
  public set velocity(velocity: Vector) {
    this._velocity = velocity;
  }

  public draw(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.beginPath();

    this.drawElement(ctx);

    ctx.closePath();
    ctx.fill();
  }
}
export class SquareRenderEE extends RendreEE {
  public static maxColor = 60 * 0.5;

  constructor(
    position: Vector,
    velocity: Vector,
    private _width: number,
    private _height: number,
    private _color: number,
    private _colorDir: number
  ) {
    super(position, velocity);
  }

  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }
  public get color(): number {
    return this._color;
  }
  public get colorDir(): number {
    return this._colorDir;
  }
  public set width(width: number) {
    this._width = width;
  }
  public set heigh(height: number) {
    this._height = height;
  }
  public set color(color: number) {
    this._color = color;
  }
  public set colorDir(colorDir: number) {
    this._colorDir = colorDir;
  }
  public get left(): number {
    return this.position.x;
  }
  public get right(): number {
    return this.position.x + this.width;
  }
  public get top(): number {
    return this.position.y;
  }
  public get bottom(): number {
    return this.position.y + this.heigh;
  }

  protected drawElement(ctx: OffscreenCanvasRenderingContext2D): void {
    // ctx.fillStyle = d3.interpolateSpectral(
    //   this.color / SquareRenderEE.maxColor
    // );
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
  }

  public isIntersect(otherSquer: SquareRenderEE): boolean {
    return !(
      otherSquer.left > this.right ||
      otherSquer.right < this.left ||
      otherSquer.top > this.bottom ||
      otherSquer.bottom < this.top
    );
  }
}

export class CircleRenderEE extends RendreEE {
  public static maxColor = 60 * 0.5;

  constructor(
    position: Vector,
    velocity: Vector,
    private _radius: number,
    private _color: number,
    private _colorDir: number
  ) {
    super(position, velocity);
  }

  public get radius(): number {
    return this._radius;
  }
  public get color(): number {
    return this._color;
  }
  public get colorDir(): number {
    return this._colorDir;
  }
  public set radius(radius: number) {
    this._radius = radius;
  }
  public set color(color: number) {
    this._color = color;
  }
  public set colorDir(colorDir: number) {
    this._colorDir = colorDir;
  }

  public get sphereArea() {
    return 4 * Math.PI * this.radius ** 2;
  }

  protected drawElement(ctx: OffscreenCanvasRenderingContext2D): void {
    // ctx.fillStyle = d3.interpolateSpectral(
    //   this.color / CircleRenderEE.maxColor
    // );
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  }

  public isIntersect(otherCircle: CircleRenderEE): boolean {
    return (
      this.position.subtract(otherCircle.position).magnitude <=
      this.radius + otherCircle.radius
    );
  }

  public static collisionVector = (b1: CircleRenderEE, b2: CircleRenderEE) => {
    return (
      b1.velocity

        // Take away from the starting velocity
        .subtract(
          // Subtract the positions
          b1.position
            .subtract(b2.position)

            /**
             * Multiply by the dot product of
             * the difference between the velocity
             * and position of both vectors
             **/
            .multiply(
              b1.velocity
                .subtract(b2.velocity)
                .dotProduct(b1.position.subtract(b2.position)) /
                b1.position.subtract(b2.position).magnitude ** 2
            )

            /**
             * Multiply by the amount of mass the
             * object represents in the collision.
             **/
            .multiply((2 * b2.sphereArea) / (b1.sphereArea + b2.sphereArea))
        )
    );
  };
}
