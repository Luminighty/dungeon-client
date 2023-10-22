import { Application } from "pixi.js";

enum ButtonState {
	released,
	idle,
	pressed,
	held,	
}

let appRefence!: Application;
export const Controls = {
	left: ButtonState.idle,
	right: ButtonState.idle,
	up: ButtonState.idle,
	down: ButtonState.idle,
	attack: ButtonState.idle,
	get x() {
		return +Controls.isHeld(this.right) - +Controls.isHeld(this.left)
	},
	get y() {
		return +Controls.isHeld(this.down) - +Controls.isHeld(this.up)
	},
	app: null,

	/** True during the first frame the button was pressed */
	isPressed(button: ButtonState) { return button === ButtonState.pressed; },
	/** True while the button is pressed */
	isHeld(button: ButtonState) { return button === ButtonState.pressed || button === ButtonState.held; },
	/** True during the first frame the button was released */
	isReleased(button: ButtonState) { return button === ButtonState.released;},
	/** True while the button is not pressed */
	isIdle(button: ButtonState) { return button === ButtonState.released || button === ButtonState.idle; },
}

const KeyBinds = {
	"ArrowUp": "up",
	"ArrowLeft": "left",
	"ArrowDown": "down",
	"ArrowRight": "right",
	"KeyX": "attack",
}

const MouseButtons = [ "left", "middle", "right" ];

export function initControls(app: Application) {
	appRefence = app;

	window.addEventListener('keydown', (event) => {
		const key = KeyBinds[event.code];
		if (key && !event.repeat) {
			event.preventDefault();
			Controls[key] = ButtonState.pressed;
		}
	});

	
	window.addEventListener('keyup', (event) => {
		const key = KeyBinds[event.code];
		if (key)
			Controls[key] = ButtonState.released;
	});

	window.document.removeEventListener('mousemove', app.renderer.plugins.interaction.onPointerMove, true);
	window.document.removeEventListener('pointermove', app.renderer.plugins.interaction.onPointerMove, true);
	app.stage.eventMode = "static"
}

function stepButtonState(object, key) {
	const button = object[key] as ButtonState;
	switch (button) {
		case ButtonState.pressed:
			object[key] = ButtonState.held;
			break;
		case ButtonState.released:
			object[key] = ButtonState.idle;
			break;
		default:
			break;
	}
}

export function updateControls() {
	stepButtonState(Controls, "left");
	stepButtonState(Controls, "right");
	stepButtonState(Controls, "up");
	stepButtonState(Controls, "down");
	stepButtonState(Controls, "attack");
}