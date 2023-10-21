import { Assets, Rectangle } from "pixi.js";
import { TileAnimation, Tileset } from "./tileset";
import { Entity, World } from "../../entities";


interface Tile {
	entity: string,
	frame: Rectangle,
	props: object,
}

const ENTITY_PROP = "entity";
const DEFAULT_ENTITY = "Tile";
const ANIMATION_SPEED = 900;

export class TilesetComponent {
	static readonly COMPONENT_ID = "TilesetComponent" as const;
	world!: World;
	image_src!: string;
	tileset!: string;
	tiles = new Map<number, Tile>();
	tilesetLoading!: Promise<void>;

	onInit({tileset, image_src}) {
		this.tileset = tileset ?? this.tileset;
		this.image_src = image_src ?? this.image_src;
		this.tilesetLoading = this.loadTileset();
	}

	private async loadTileset() {
		const data = await Assets.load<Tileset>(this.tileset);
		for (const tile of data.tiles) {
			const entity = (tile.properties.find((prop) => prop.name === ENTITY_PROP)?.value ?? DEFAULT_ENTITY) as string;
			const props = tile.properties
				.filter((prop) => prop.name !== "entity")
				.reduce((prev, curr) => ({...prev, [curr.name]: curr.value}), {});
			if (tile.animation)
				props["animation"] = loadAnimation(data, tile.animation)
			this.tiles.set(tile.id, {
				entity,
				props,
				frame: getTileFrame(data, tile.id)
			});
		}
	}

	createTile(id: number, x: number, y: number, props = {}): Promise<Entity> {
		const tile = this.tiles.get(id);
		if (!tile)
			throw new Error(`Tile "${id}" not found!`);
		return this.world.addEntity(tile.entity, {
			...tile.props,
			sprite: this.image_src,
			frame: tile.frame,
			...props,
			x, y
		});
	}

}

function getTileFrame(tileset: Tileset, id: number) {
	const x = (id % tileset.columns) * (tileset.tilewidth + tileset.spacing) + tileset.margin;
	const y = Math.floor(id / tileset.columns) * (tileset.tileheight + tileset.spacing) + tileset.margin;
	return new Rectangle(x, y, tileset.tilewidth, tileset.tileheight);
}

function loadAnimation(tileset: Tileset, animation: TileAnimation[]) {
	return {
		name: "default",
		frames: animation.map((frame) => {
			return {x: frame.tileid % tileset.columns, y: Math.floor(frame.tileid / tileset.columns)}
		}),
		speed: ANIMATION_SPEED / (animation.reduce((prev, frame) => prev + frame.duration, 0) / animation.length),
		loop: true,
	}
}