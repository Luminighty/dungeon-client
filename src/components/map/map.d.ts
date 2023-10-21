import { TiledProperty } from "./tileset"

export interface TiledMap {
	compressionlevel: number,
	height: number,
	width: number,
	infinite: boolean,
	tilewidth: number,
	tileheight: number,
	nextlayerid: number,
	nextobjectid: number,
	orientation: string,
	renderorder: string,
	type: "map",
	version: string,
	tiledversion: string,
	layers: (TileLayer | ObjectGroup)[],
	tilesets: { firstgid: number, source: string}[]
}


type TileLayer = {
	type: "tilelayer",
	id: number,
	name: string,
	opacity: number,
	visible: boolean,
	width: number,
	height: number,
	x: number,
	y: number,
	data: number[],
}

type ObjectGroup = {
	type: "objectgroup",
	id: number,
	name: string,
	opacity: number,
	visible: boolean,
	draworder: string,
	x: number,
	y: number,
	objects: TiledObject[]
}

type TiledObject = {
	gid: number,
	id: number,
	name: string,
	height: number,
	width: number,
	rotation: number,
	type: string,
	visible: boolean,
	x: number,
	y: number,
	properties: TiledProperty[],
}