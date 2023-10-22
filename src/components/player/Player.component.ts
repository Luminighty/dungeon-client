import { Vector2 } from "@luminight/math";
import { Entity, World } from "../../entities";
import { Controls } from "../../systems/controls";
import { AnimationControllerComponent } from "../AnimationController.component";
import { PositionComponent } from "../Position.component";

export class PlayerComponent {
	static readonly COMPONENT_ID = "PlayerComponent" as const;
	parent!: Entity;
	world!: World;
	animationController!: AnimationControllerComponent;
	position!: PositionComponent;
	facing = "down";
	isAttacking = false;
	item?: Entity;

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);
		this.animationController = this.parent.getComponent(AnimationControllerComponent);
		this.world.addEntity("Sword")
			.then((sword) => this.item = sword);
	}

	onUpdate({dt}) {
		this.animate();
		this.move();
		this.attack();
	}

	attack() {
		if (this.isAttacking)
			return;
		if (!Controls.isPressed(Controls.attack))
			return;
		if (!this.item)
			return;
		this.isAttacking = true;
		this.item.fireEvent("onUse", {facing: this.facing, ...this.position.position});
		this.parent.fireEvent("onTriggerAnimation", {event: "attack"})
	}

	onTriggerFinished({ event }) {
		if (event === "attack") 
			this.isAttacking = false;
	}

	move() {
		if (this.isAttacking)
			return;
		let move = Vector2.new(Controls.x, Controls.y);
		if (!move.x && !move.y)
			return;
		move = Vector2.div(move, Math.sqrt(Vector2.dot(move, move)));
		this.parent.fireEvent("onMove", move);
	}

	animate() {
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
