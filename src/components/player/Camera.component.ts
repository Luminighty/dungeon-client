import { Vector2 } from "@luminight/math";
import { Entity, World } from "../../entities";

const CAMERA_SMOOTH = 50;

export class CameraComponent {
	static readonly COMPONENT_ID = "CameraComponent" as const;

	parent!: Entity;
	world!: World;
	x = 0;
	y = 0;
	targetX = 0;
	targetY = 0;
	offsetX = 0;
	offsetY = 0;
	enabled = true;
	maxStep = 7;

	get offset() { return { x: this.offsetX, y: this.offsetY } }

	onInit({ x, y, }) {
		const newX = Math.floor(x / 160) * 160;
		const newY = Math.floor(y / 160) * 160;
		this.targetX = newX;
		this.targetY = newY;
		this.x = newX;
		this.y = newY;
		const pivot = Vector2.add({x: newX, y: newY}, this.offset)
		this.world.app.stage.pivot.copyFrom(pivot);
	}

	onUpdate({dt}) {
		if (this.targetX === this.x && this.targetY === this.y)
			return;
		const deltaX = this.targetX - this.x;
		const deltaY = this.targetY - this.y;
		
		const stepX = Math.abs(deltaX) > this.maxStep ? this.maxStep * Math.sign(deltaX) : deltaX;
		const stepY = Math.abs(deltaY) > this.maxStep ? this.maxStep * Math.sign(deltaY) : deltaY;

		this.x += stepX;
		this.y += stepY;
		
		const pivot = Vector2.add({x: this.x, y: this.y}, this.offset);
		this.world.app.stage.pivot.copyFrom(pivot);
	}

	onPositionChanged({x, y}) {
		this.targetX = Math.floor(x / 160) * 160;
		this.targetY = Math.floor(y / 160) * 160;
	}

}