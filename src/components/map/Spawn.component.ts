export class SpawnComponent {
	static readonly COMPONENT_ID = "SpawnComponent" as const;
	x = 0;
	y = 0;
	
	onInit({x, y}) {
		this.x = x ?? this.x;
		this.y = y ?? this.y;
		console.log("Spawn");
	}

}