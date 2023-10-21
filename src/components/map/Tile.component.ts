import { Entity } from "../../entities";
import { SpriteComponent } from "../Sprite.component";
import { AnimationPlayerComponent } from "../AnimationPlayer.component";
import { UpdateComponent } from "../Update.component";

export class TileComponent {
	static readonly COMPONENT_ID = "TileComponent" as const;
	parent!: Entity;
	sprite!: SpriteComponent;
	get texture() { return this.sprite.sprite.texture; }

	onInit({animation}) {
		this.sprite = this.parent.getComponent(SpriteComponent);
		if (animation) {
			this.parent.addComponent(AnimationPlayerComponent, {animations: [animation]});
			this.parent.addComponent(UpdateComponent);
		}
	}
	
	onLateInit({ frame }) {
		if (this.texture.valid) {
			this.texture.frame = frame;
		} else {
			this.texture.once("update", () => {
				this.texture.frame = frame;
			})
		}
	}

	onUpdateTileOrientation({ flipVertical, flipHorizontal, flipDiagonal}) {
		flipHorizontal = flipHorizontal !== flipDiagonal;
		this.sprite.flipX = flipHorizontal;
		this.sprite.flipY = flipVertical;
		this.sprite.rotation = flipDiagonal ? (Math.PI / 2) : 0;
	}

}