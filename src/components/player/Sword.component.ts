import { Entity } from "../../entities";
import { AnimationPlayerComponent } from "../AnimationPlayer.component";

export class SwordComponent {
	static readonly COMPONENT_ID = "SwordComponent" as const;
	animation!: AnimationPlayerComponent;
	parent!: Entity;

	onInit() {
		this.animation = this.parent.getComponent(AnimationPlayerComponent);
	}

	onUse({facing, x, y}) {
		this.parent.fireEvent("onSetPosition", {x, y});
		this.animation.playAnimation(`swing_${facing}`);
	}

	onAnimationFinished({animation}) {
		if (animation === "default")
			return;
		this.animation.playAnimation("default");
	}
}