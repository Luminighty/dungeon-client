import { Component } from "../components";

export type IEntityFilter = (types: (new() => unknown)[], groups: Component[][]) => void;
