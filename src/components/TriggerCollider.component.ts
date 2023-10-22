import { IVector2, Vector2 } from "@luminight/math";
import { Entity, World } from "../entities";
import { PositionComponent } from "./Position.component";
import { Component } from ".";
import { CollisionComponent, rectIntersects } from "./Collision.component";

export class TriggerColliderComponent {
	static readonly COMPONENT_ID = "TriggerColliderComponent" as const;
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
	colliders: Component[] = [];

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
		this.checkTriggers(delta);
	}

	enter(other) {
		const index = this.colliders.findIndex((collider) => collider === other);
		if (index !== -1)
			return;
		this.colliders.push(other);
		other.parent.fireEvent("onTriggerEnter", { source: this });
		this.parent.fireEvent("onTriggerEnter", { source: other });
	}

	exit(other) {
		const index = this.colliders.findIndex((collider) => collider === other);
		if (index === -1)
			return;
		this.colliders.splice(index, 1);
		other.parent.fireEvent("onTriggerExit", { source: this });
		this.parent.fireEvent("onTriggerExit", { source: other });
	}

	checkTriggers(delta) {
		const [colliders] = this.world
			.queryEntity(CollisionComponent);

		const rect = this.rect;
		rect.x += delta.x;
		rect.y += delta.y;
		for (const collider of colliders) {
			if (collider.parent === this.parent || !collider.enabled)
				continue;
			if (rectIntersects(rect, collider.rect)) {
				this.enter(collider)
			} else {
				this.exit(collider)
			}
		}
	}
}