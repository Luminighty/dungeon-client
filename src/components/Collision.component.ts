import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";
import { TriggerColliderComponent } from "./TriggerCollider.component";

export class CollisionComponent {
	static readonly COMPONENT_ID = "CollisionComponent" as const;
	parent!: Entity;
	world!: World;
	position!: PositionComponent;
	enabled = true;
	offsetX = -8;
	offsetY = -8;
	x = 0;
	y = 0;
	width = 16;
	height = 16;
	layer = "entity";

	get rect() {
		return {
			x: this.position.x + this.x,
			y: this.position.y + this.y,
			width: this.width,
			height: this.height,
		}
	}

	onInit({collision}) {
		this.position = this.parent.getComponent(PositionComponent);
		this.x = (collision?.x ?? this.x) + this.offsetX;
		this.y = (collision?.y ?? this.y) + this.offsetY;
		this.width = collision?.width ?? this.width;
		this.height = collision?.height ?? this.height;
	}

	onMove(delta: {x: number, y: number}) {
		this.checkCollision(delta);
	}

	checkCollision(delta) {
		if (!this.enabled)
			return;
		const [colliders] = this.world
			.queryEntity(CollisionComponent);

		for (const collider of colliders) {
			if (collider === this || !collider.enabled)
				continue;
			const other = collider.rect;
			const rectX = this.rect;
			rectX.x += delta.x;
			if (rectIntersects(rectX, other)) {
				delta.x = 0;
			}
		}
		for (const collider of colliders) {
			if (collider === this || !collider.enabled)
				continue;
			const other = collider.rect;
			const rectY = this.rect;
			rectY.y += delta.y;
			if (rectIntersects(rectY, other)) {
				delta.y = 0;
			}
		}
	}

}

export function rectIntersects(rectA: Rect, rectB: Rect) {
	return rectA.x < rectB.x + rectB.width && 
				rectA.x + rectA.width > rectB.x &&
				rectA.y < rectB.y + rectB.height &&
				rectA.y + rectA.height > rectB.y
}

interface Rect {
	x: number,
	y: number,
	width: number,
	height: number,
}