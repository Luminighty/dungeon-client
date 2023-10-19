import { World, Entity } from "../../entities";

export class ServerActorComponent {
	static readonly COMPONENT_ID = "ServerActorComponent" as const;
	world!: World;
	parent!: Entity;
	components = {};
	targetState = {};

	onLateInit(props) {
		Entity.deserialize(this.parent, props);
		this.updateEntity(props);
	}

	updateEntity(props) {
		for (const componentType in props) {
			const componentProps = props[componentType];
			if (!this.components[componentType])
				this.components[componentType] = this.parent.getComponentByTypeId(componentType);
			this.targetState[componentType] = {
				...this.targetState[componentType],
				...componentProps
			};
		}
	}

	onUpdate({dt}) {
		for (const type in this.targetState) {
			const target = this.targetState[type];
			if (!target)
				continue;
			const component = this.components[type];
			const deserialize = component.constructor["deserialize"];
			const interpolate = InterpolateComponent[type];
			if (!deserialize && !interpolate)
				throw new Error(`Component '${component.constructor["COMPONENT_ID"]}' can't be interpolated or deserialized`);
			const finished = interpolate ? interpolate(component, target, dt) : deserialize(component, target);
			if (finished)
				this.targetState[type] = null;
		}
	}
	
}

const InterpolateComponent = {
}
