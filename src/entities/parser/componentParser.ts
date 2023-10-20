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
	}
}