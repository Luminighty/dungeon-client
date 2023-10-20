import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { AnimationPlayerComponent } from "../AnimationPlayer.component";

export class PlayerComponent {
	static readonly COMPONENT_ID = "PlayerComponent" as const;
	parent!: Entity;
	world!: World;
	animationPlayer!: AnimationPlayerComponent;
	facing = "down";

	onInit() {
		this.animationPlayer = this.parent.getComponent(AnimationPlayerComponent);
	}

	onUpdate() {
		this.move();
	}

	move() {
		const x = Controls.x;
		const y = Controls.y;
		if (x < 0) {
			this.animationPlayer.playAnimation("move_left");
			this.facing = "left";
			return;
		}
		if (x > 0) {
			this.animationPlayer.playAnimation("move_right");
			this.facing = "right";
			return;
		}
		if (y < 0) {
			this.animationPlayer.playAnimation("move_up");
			this.facing = "up";
			return;
		}
		if (y > 0) {
			this.animationPlayer.playAnimation("move_down");
			this.facing = "down";
			return;
		}
		this.animationPlayer.playAnimation(`idle_${this.facing}`);
	}



}