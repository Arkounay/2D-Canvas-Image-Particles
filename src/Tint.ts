export default class Tint {
    public color: string;
    public opacity: number;


    constructor(color: string, opacity: number) {
        this.color = color;
        this.opacity = opacity;
    }

    public isActive(): boolean {
        return this.opacity > 0;
    }

    public clone(): Tint {
        return new Tint(this.color, this.opacity);
    }
}