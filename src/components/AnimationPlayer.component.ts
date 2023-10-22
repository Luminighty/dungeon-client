import { Rectangle, Sprite, Texture } from "pixi.js";
import { Entity, World } from "../entities";
import { Serializable } from "../network";
import { SpriteComponent } from "./Sprite.component";


interface Frame {
	x: number,
	y: number,
	moveX?: number,
	moveY?: number,
	flipX?: boolean,
}

interface Animation {
	name: string,
	speed: number,
	loop: boolean,
	flipX?: boolean,
	frames: Frame[],
}


const FRAME_LENGTH = 30;
export class AnimationPlayerComponent {
	static readonly COMPONENT_ID = "AnimationPlayerComponent" as const;
	parent!: Entity;
	world!: World;
	animations!: Animation[];
	sprite!: SpriteComponent;
	get texture() { return this.sprite.sprite.texture; }

	width = 16;
	height = 16;
	offsetX = 0;
	offsetY = 0;
	animation!: Animation;
	frameOffset = 0;
	playing = true;
	private lastFrame = 0;

	onInit({animations}) {
		this.sprite = this.parent.getComponent(SpriteComponent);
		this.animations = animations ?? this.animations;
		this.animation = this.animations[0];
	}

	onLateInit() {
		const frame = this.animation.frames[0];
		const rect = new Rectangle(
			frame.x * (this.width + this.offsetX),
			frame.y * (this.height + this.offsetY),
			this.width,
			this.height
		);
		if (this.texture.valid) {
			this.texture.frame = rect;
		} else {
			this.texture.once("update", () => {
				this.texture.frame = rect;
			})
		}
	}

	setFrame(x, y) {
		this.texture.frame.x = x * (this.width + this.offsetX);
		this.texture.frame.y = y * (this.height + this.offsetY);
		this.texture.updateUvs();
	}

	playAnimation(animation: string) {
		if (this.animation.name == animation && this.playing)
			return;
		const newAnimation = this.animations.find((value) => value.name === animation);
		if (!newAnimation)
			return;
		this.playing = true;
		this.animation = newAnimation;
		this.frameOffset = 0;
		this.lastFrame = -1;
		if (newAnimation.flipX !== undefined)
			this.sprite.flipX = newAnimation.flipX;
	}

	onUpdate({dt}) {
		if (!this.playing)
			return;
		this.frameOffset += dt * this.animation.speed;
		let frameIndex = Math.floor(this.frameOffset / FRAME_LENGTH);
		if (frameIndex == this.lastFrame)
			return;
		if (!this.animation.loop && frameIndex == this.animation.frames.length) {
			this.playing = false;
			this.parent.fireEvent("onAnimationFinished", {animation: this.animation.name, sender: this});
			return;
		}
		frameIndex %= this.animation.frames.length
		this.lastFrame = frameIndex;
		const frame = this.animation.frames[frameIndex];
		this.setFrame(frame.x, frame.y);
		if (frame.flipX !== undefined)
			this.sprite.flipX = frame.flipX;
		if (frame.moveX || frame.moveY)
			this.parent.fireEvent("onMove", {x: frame.moveX ?? 0, y: frame.moveY ?? 0})
	}
}