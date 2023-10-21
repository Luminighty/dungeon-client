export interface Tileset {
	columns: number,
	image: string,
	imageheight: number,
	imagewidth: number,
	margin: number,
	name: string,
	spacing: number,
	tilecount: number,
	tiledversion: string,
	tileheight: number,
	tilewidth: number,
	type: "tileset",
	version: string,
	tiles: Tile[],
}

type Tile = {
	id: number,
	properties: TiledProperty[],
	animation?: TileAnimation[],
}

type TileAnimation = {
	duration: number,
	tileid: number
}

type TilePropertyVariant<Type, Value> = {
	name: string,
	type: Type,
	value: Value,
}

type TiledProperty = TilePropertyVariant<"string", string> | 
	TilePropertyVariant<"bool", boolean> | 
	TilePropertyVariant<string, object>;

