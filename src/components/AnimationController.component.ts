import { Entity } from "../entities";
import { AnimationPlayerComponent } from "./AnimationPlayer.component";

type PropConditions = [string, string][];

interface Trigger {
	event: string,
	conditions: PropConditions;
	animation: string,
}

interface Condition {
	animation: string,
	conditions: PropConditions;
}

export class AnimationControllerComponent {
	static readonly COMPONENT_ID = "AnimationControllerComponent" as const;
	parent!: Entity;
	animationPlayer!: AnimationPlayerComponent;
	param = {};
	conditions: Condition[] = [];
	triggers: Trigger[] = [];
	currentTrigger?: Trigger;
	isDirty = true;

	onInit() {
		this.animationPlayer = this.parent.getComponent(AnimationPlayerComponent);
		window["animation"] = this;
	}

	updateAnimation() {
		if (this.currentTrigger)
			return;
		if (!this.isDirty)
			return;
		this.isDirty = false;
		for (const condition of this.conditions) {
			if (this.isConditionTrue(condition.conditions)) {
				this.animationPlayer.playAnimation(condition.animation);
				return;
			}
		}
	}

	onTriggerAnimation({event}) {
		for (const trigger of this.triggers) {
			if (trigger.event !== event)
				continue;
			if (this.isConditionTrue(trigger.conditions)) {
				this.animationPlayer.playAnimation(trigger.animation);
				this.currentTrigger = trigger;
				return;
			}
		}
	}

	isConditionTrue(conditions: PropConditions) {
		return conditions.every(([key, expected]) => this.param[key] === expected)
	}

	onAnimationFinished({animation}) {
		if (animation === this.currentTrigger?.animation) {
			this.parent.fireEvent("onTriggerFinished", {event: this.currentTrigger?.event});
			this.currentTrigger = undefined;
			this.isDirty = true;
		}
	}

	setParam(param: string, value: unknown) {
		if (this.param[param] === value)
			return;
		this.param[param] = value;
		this.isDirty = true;
	}
}