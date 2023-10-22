import { Entity, World } from "../../entities";
import { SwordComponent } from "../player/Sword.component";

export class PotComponent {
	static readonly COMPONENT_ID = "PotComponent" as const;
	world!: World;
	parent!: Entity;

	onTriggerEnter({source}) {
		const sword = source.parent.getComponent(SwordComponent)
		if (sword)
			this.world.removeEntity(this.parent);
	}
}