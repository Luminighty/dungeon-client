import { Assets } from "pixi.js";
import { Entity, World } from "../../entities";
import { TilesetComponent } from "./Tileset.component";
import { ObjectGroup, TileLayer, TiledMap } from "./map";

const FLIPPED_HORIZONTALLY_FLAG  = 0x80000000;
const FLIPPED_VERTICALLY_FLAG    = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG    = 0x20000000;
const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;
const TILE_GUID = ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG | ROTATED_HEXAGONAL_120_FLAG);

export class MapComponent {
	static readonly COMPONENT_ID = "MapComponent" as const;
	world!: World;
	parent!: Entity;
	tileset!: TilesetComponent;
	map!: string;
	offset = {x: 0, y: 0}

	onInit({map}) {
		this.map = map ?? this.map;
		this.tileset = this.parent.getComponent(TilesetComponent)
	}

	async loadMap(x = 0, y = 0) {
		await this.tileset.tilesetLoading;
		this.offset = {x, y};
		const data = await Assets.load<TiledMap>(this.map);
		for (const layer of data.layers) {
			if (layer.type === "tilelayer")
				await this.loadTileLayer(data, layer);
			if (layer.type === "objectgroup")
				await this.loadObjectGroup(data, layer);
		}
	}

	private async loadTileLayer(map: TiledMap, layer: TileLayer) {
		const firstgid = 1;
		for (let i = 0; i < layer.data.length; i++) {
			const tile = layer.data[i];
			if (tile === 0)
				continue;

			const x = (i % layer.width) * map.tilewidth + this.offset.x;
			const y = Math.floor(i / layer.width) * map.tileheight + this.offset.y;

			const guid = tile & TILE_GUID;
			const flipHorizontal = Boolean(tile & FLIPPED_HORIZONTALLY_FLAG);
			const flipVertical = Boolean(tile & FLIPPED_VERTICALLY_FLAG);
			const flipDiagonal = Boolean(tile & FLIPPED_DIAGONALLY_FLAG);
			const entity = await this.tileset.createTile(guid - firstgid, x, y)
			entity.fireEvent("onUpdateTileOrientation", { flipHorizontal, flipVertical, flipDiagonal })
		}
	}

	private async loadObjectGroup(map: TiledMap, group: ObjectGroup) {
		const firstgid = 1;
		for (const object of group.objects) {
			const props = (object.properties ?? [])
				.reduce((prev, curr) => ({...prev, [curr.name]: curr.value}), {});
			const x = object.x + group.x + this.offset.x;
			const y = object.y + group.y + this.offset.y;
			await this.tileset.createTile(object.gid - firstgid, x, y, props)
		}
	}

}