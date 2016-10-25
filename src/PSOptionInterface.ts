import {CursorMode, RotationMode} from "./Modes";
import Tint from "./Tint";

export interface PSOptionInterface {
    maxParticles: number,
    velocityAngle: Array<number>,
    speed: Array<number>,
    rotationStartAngle: Array<number>,
    cursorMode: CursorMode,
    rotationMode: RotationMode,
    rotationSpeed: Array<number>,
    tint: Tint,
    width: Array<number>,
    height: Array<number>,
    addOnClickNb: number,
    density: number,
    cursorRadius: number
}