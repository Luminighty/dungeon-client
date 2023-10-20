import { parseArray, parseAttributes, tryParseInt } from "./utils";

export const ComponentParser = {
	"AnimationPlayerComponent": (component: Element) => {
		const animations: object[] = [];

		for (const animation of component.children) {
			const frames: object[] = [];
			for (const frame of animation.children)
				frames.push(parseAttributes(frame));

			animations.push({
				speed: 1,
				loop: false,
				...parseAttributes(animation),
				frames
			});
		}
		return { animations }
	},
	"AnimationControllerComponent": (component: Element) => {
		const triggers: object[] = [];
		const conditions: object[] = [];

		const parser = {
			"Condition": (element: Element) => {
				const conditionAttributes = parseAttributes(element);
				const facts = Object.entries(conditionAttributes)
					.filter(([key]) => key !== "animation")
				conditions.push({
					animation: conditionAttributes["animation"],
					conditions: facts
				});
			},
			"Trigger": (element: Element) => {
				const triggerAttributes = parseAttributes(element);
				const conditions = Object.entries(triggerAttributes)
					.filter(([key]) => key !== "event" && key !== "animation")
				triggers.push({ 
					event: triggerAttributes["event"], 
					animation: triggerAttributes["animation"],
					conditions
				});
			},
		}
		for (const child of component.children)
			parser[child.tagName](child)
		return { triggers, conditions }
	}
}