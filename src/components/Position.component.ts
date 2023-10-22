import { Entity } from "../entities";

export class PositionComponent {
	static readonly COMPONENT_ID = "PositionComponent" as const;
	parent!: Entity;
	x = 0;
	y = 0;

	get position() { return { x: this.x, y: this.y} }

	onInit({x, y}) {
		this.x = x ?? this.x;
		this.y = y ?? this.y;
	}

	onMove({ x, y }) {
		this.x += x ?? 0;
		this.y += y ?? 0;
		this.parent.fireEvent("onPositionChanged", this.position)
	}

	onSetPosition({x, y}) {
		this.x = x ?? this.x;
		this.y = y ?? this.y;
		this.parent.fireEvent("onPositionChanged", this.position)
	}
}