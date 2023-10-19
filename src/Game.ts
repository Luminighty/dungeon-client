import { Application } from "pixi.js";
import { UpdateComponent } from "./components/Update.component";
import { registerComponents } from "./components/registry";
import { LoadingBar } from "./dialogs/LoadingBar";
import { Entity, World, createWorld, loadEntityBlueprintRegistry } from "./entities";
import { initControls, updateControls } from "./systems/controls";
import { Socket } from "socket.io-client";

export async function Init(app: Application, socket: Socket) {
	const loadingBar = LoadingBar();

	registerComponents();
	await loadEntityBlueprintRegistry(loadingBar);
	await initControls(app);
	const world = createWorld(app, socket);
	world.addEntity("DataStorage");

	loadingBar.label = "Loading Player";
	loadingBar.determinate = false;
	const { userId, entities, spawn } = await world.networkHandler.initPlayer();

	console.log("Starting ticker");
		
	app.ticker.add((dt) => {
		world.queryEntity(UpdateComponent)[0]
			.map((c) => c.update({dt}));
		updateControls();
	});

	// initDebug(world, player);

	loadingBar.finish();
}