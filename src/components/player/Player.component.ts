import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { AnimationControllerComponent } from "../AnimationController.component";

export class PlayerComponent {
	static readonly COMPONENT_ID = "PlayerComponent" as const;
	parent!: Entity;
	world!: World;
	animationController!: AnimationControllerComponent;
	facing = "down";

	onInit() {
		this.animationController = this.parent.getComponent(AnimationControllerComponent);
	}

	onUpdate() {
		this.move();
	}

	move() {
		const x = Controls.x;
		const y = Controls.y;
		this.facing = this.getFacing(x, y);
		this.animationController.setParam("facing", this.facing);
		this.animationController.setParam("moving", Boolean(x || y));
		this.animationController.updateAnimation();
	}

	getFacing(x: number, y: number) {
		if (x < 0)
			return "left";
		if (x > 0)
			return "right";
		if (y < 0)
			return "up";
		if (y > 0)
			return "down";
		return this.facing;
	}
}
