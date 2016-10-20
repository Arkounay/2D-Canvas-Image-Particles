interface Stats {
    dom: Node;
    domElement: HTMLElement;
    REVISION: number;
    setMode: (mode: number) => void;

    begin(): void;
    end(): number;
    update(): void;
    showPanel(number: number): void;
}

interface StatsConstructor {
    new (): Stats;
}

declare var Stats: StatsConstructor;