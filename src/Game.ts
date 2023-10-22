import { Application } from "pixi.js";
import { UpdateComponent } from "./components/Update.component";
import { registerComponents } from "./components/registry";
import { LoadingBar } from "./dialogs/LoadingBar";
import { Entity, World, createWorld, loadEntityBlueprintRegistry } from "./entities";
import { initControls, updateControls } from "./systems/controls";
import { Socket } from "socket.io-client";
import { MapComponent } from "./components/map/Map.component";
import { SpawnComponent } from "./components/map/Spawn.component";

export async function Init(app: Application) {
	const loadingBar = LoadingBar();

	registerComponents();
	await loadEntityBlueprintRegistry(loadingBar);
	await initControls(app);
	const world = createWorld(app);
	//world.addEntity("DataStorage");

	loadingBar.label = "Loading Player";
	loadingBar.determinate = false;
	//const { userId, entities, spawn } = await world.networkHandler.initPlayer();

	console.log("Starting ticker");
	const map = await world.addEntity("DebugMap");
	await map.getComponent(MapComponent).loadMap(-160, -160);

	const spawn = world.querySingleton(SpawnComponent)
	const hero = await world.addEntity("Hero", {x: spawn.x, y: spawn.y});
	window["hero"] = hero;
	window["sword"] = await world.addEntity("Sword");
	window["map"] = map.getComponent(MapComponent);

	app.ticker.add((dt) => {
		world.queryEntity(UpdateComponent)[0]
			.map((c) => c.update({dt}));
		updateControls();
	});

	// initDebug(world, player);

	loadingBar.finish();
}