import {Coordinate} from "../Coordinate";

export class World {
    public readonly liveCoordinateRecord: Record<string, Coordinate> = {};
    public allLiveCellDeadNeighbourRecord: Record<string, Coordinate> = {};

    constructor(liveCoordinateList: string[]) {
        this.liveCoordinateRecord = World.convertCoordinateRecord(liveCoordinateList);
    }

    private static convertCoordinateRecord(liveCoordinateList: string[]) {
        const liveCoordinateRecord: Record<string, Coordinate> = {};
        for (let value of liveCoordinateList) {
            const valueArr = value.split("_");
            const row = Number(valueArr[0]);
            const column = Number(valueArr[1]);
            liveCoordinateRecord[value] = new Coordinate(row, column);
        }
        return liveCoordinateRecord;
    }

    private newCalculateCountOfNeighbours() {
        let allLiveCellNeighbourList = [];
        const liveCoordinateList = Object.keys(this.liveCoordinateRecord);
        for (let key in this.liveCoordinateRecord) {
            const coordinate = this.liveCoordinateRecord[key];
            const neighbourCoordinateList = coordinate.getNeighbourCoordinateList();
            allLiveCellNeighbourList.push(...neighbourCoordinateList);
            const aliveNeighbourList = liveCoordinateList.filter(value => neighbourCoordinateList.includes(value));
            const countOfAliveNeighbours = aliveNeighbourList.length;
            coordinate.setCountOfLivingNeighbours(countOfAliveNeighbours);
        }
        let allLiveCellDeadNeighbourList: string[] = allLiveCellNeighbourList.filter(val => !liveCoordinateList.includes(val));

        for (let value of allLiveCellDeadNeighbourList) {
            const valueArr = value.split("_");
            const row = Number(valueArr[0]);
            const column = Number(valueArr[1]);
            this.allLiveCellDeadNeighbourRecord[value] = new Coordinate(row, column);
        }

        for (let key in this.allLiveCellDeadNeighbourRecord) {
            const coordinate = this.allLiveCellDeadNeighbourRecord[key];

            const neighbourCoordinateList = coordinate.getNeighbourCoordinateList();
            const aliveNeighbourList = liveCoordinateList.filter(value => neighbourCoordinateList.includes(value));
            const countOfAliveNeighbours = aliveNeighbourList.length;
            coordinate.setCountOfLivingNeighbours(countOfAliveNeighbours);
        }
    }

    private newCalculateNextGeneration() {
        const nextGenLiveCoordinateList: string[] = [];

        for (let key in this.liveCoordinateRecord) {
            const liveNeighbourCount = this.liveCoordinateRecord[key].getCountOfLivingNeighbours();
            if (liveNeighbourCount == 2 || liveNeighbourCount == 3) {
                const coordinateId = this.liveCoordinateRecord[key].getId();
                nextGenLiveCoordinateList.push(coordinateId);
            }
        }

        for (let key in this.allLiveCellDeadNeighbourRecord) {
            const liveNeighbourCount = this.allLiveCellDeadNeighbourRecord[key].getCountOfLivingNeighbours();
            if (liveNeighbourCount == 3) {
                const coordinateId = this.allLiveCellDeadNeighbourRecord[key].getId();
                nextGenLiveCoordinateList.push(coordinateId);
            }
        }

        return nextGenLiveCoordinateList;
    }

    public newTick() {
        this.newCalculateCountOfNeighbours();
        const newNextGenLiveCoordinateList = this.newCalculateNextGeneration();
        return new World(newNextGenLiveCoordinateList);
    }

    public newDisplayResult() {
        // const result = "0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 0\n0 0 0 0 0 0\n";
    }
}
