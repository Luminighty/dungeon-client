import { Entity } from "../../entities";

export class ChestComponent {
	static readonly COMPONENT_ID = "ChestComponent" as const;
	parent!: Entity;
}