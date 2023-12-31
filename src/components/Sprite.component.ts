import { Sprite, Texture } from "pixi.js";
import { Entity, World } from "../entities";
import { Serializable } from "../network";

const EMPTY_TEXTURE = "assets/textures/empty.png";

@Serializable("sprite.scale.x")
export class SpriteComponent {
	static readonly COMPONENT_ID = "SpriteComponent" as const;
	parent!: Entity;
	world!: World;
	src!: string;
	sprite!: Sprite;
	anchorX = 0;
	anchorY = 0;
	layer="default";

	onInit({x, y, sprite}) {
		const texture = Texture.from(sprite ?? this.src ?? EMPTY_TEXTURE);
		this.sprite = new Sprite(texture.clone());
		this.sprite.anchor.set(this.anchorX, this.anchorY);
		this.sprite.position.set(x, y);
		this.world.renderContainers[this.layer].addChild(this.sprite);
	}

	onSetSprite({sprite}) {
		this.sprite.texture = Texture.from(sprite);
	}

	onDestroy() {
		this.sprite.removeFromParent();
		this.sprite.destroy();
	}

	onPositionChanged({ x, y }) {
		if (this.sprite)
			this.sprite.position.set(x, y);
	}

	onLoad() {
		this.sprite.visible = true;
	}

	onUnload() {
		this.sprite.visible = false;
	}

	get flipX() { return this.sprite.scale.x < 0; }

	set flipX(value: boolean) {
		if (this.flipX !== value)
			this.sprite.scale.x *= -1;
	}

	get flipY() { return this.sprite.scale.y < 0; }
	set flipY(value: boolean) {
		if (this.flipY !== value)
			this.sprite.scale.y *= -1;
	}

	get rotation() { return this.sprite.rotation; }
	set rotation(value) { this.sprite.rotation = value; }
}
