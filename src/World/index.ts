import {Coordinate} from "../Coordinate";

export class World {
    private coordinateRecord: Record<string, Coordinate> = {};
    private liveCoordinateRecord: Record<string, Coordinate> = {};
    private allLiveCellDeadNeighbourRecord: Record<string, Coordinate> = {};

    constructor(private liveCoordinateList: string[]) {
        this.setCoordinateList();
        this.liveCoordinateRecord = World.convertCoordinateRecord(liveCoordinateList);
    }

    private setCoordinateList() {
        this.coordinateRecord = Coordinate.getCoordinateList();
    }

    public isEmpty() {
        return true;
    }

    public tick() {
        this.calculateCountOfNeighbours();
        const nextGenLiveCoordinateList = this.calculateNextGeneration();
        return new World(nextGenLiveCoordinateList);
    }

    private calculateCountOfNeighbours() {
        for (let key in this.coordinateRecord) {
            const coordinate = this.coordinateRecord[key];

            const neighbourCoordinateList = coordinate.getNeighbourCoordinateList();
            const aliveNeighbourList = this.liveCoordinateList.filter(value => neighbourCoordinateList.includes(value));
            const countOfAliveNeighbours = aliveNeighbourList.length;
            coordinate.setCountOfLivingNeighbours(countOfAliveNeighbours);
        }
    }

    private calculateNextGeneration() {

        const liveCoordinateRecord: Record<string, Coordinate> = {};
        const deadCoordinateRecord: Record<string, Coordinate> = Object.assign({}, this.coordinateRecord);
        // modern javascript way to object.assign
        const newDeadCoordinateRecord: Record<string, Coordinate> = {...this.coordinateRecord};
        const nextGenLiveCoordinateList: string[] = [];

        for (let value of this.liveCoordinateList) {
            liveCoordinateRecord[value] = this.coordinateRecord[value];
            delete deadCoordinateRecord[value];
        }

        for (let key in liveCoordinateRecord) {
            const liveNeighbourCount = liveCoordinateRecord[key].getCountOfLivingNeighbours();
            if (liveNeighbourCount == 2 || liveNeighbourCount == 3) {
                const coordinateId = liveCoordinateRecord[key].getId();
                nextGenLiveCoordinateList.push(coordinateId);
            }
        }

        for (let key in deadCoordinateRecord) {
            const liveNeighbourCount = deadCoordinateRecord[key].getCountOfLivingNeighbours();
            if (liveNeighbourCount == 3) {
                const coordinateId = deadCoordinateRecord[key].getId();
                nextGenLiveCoordinateList.push(coordinateId);
            }
        }

        return nextGenLiveCoordinateList;
    }

    public displayResult() {

        const coordinateKeys = Object.keys(this.coordinateRecord);
        const resultList: number[] = coordinateKeys.map(value => {
            let state = 0;
            if (this.liveCoordinateList.includes(value)) {
                state = 1;
            }
            return state;
        });

        let rowList: number[] = [];
        let count = 0;
        let result = [];

        for (let value of resultList) {
            rowList.push(value);
            count++;
            if (count == Coordinate.getRow()) {
                result.push(rowList);
                rowList = [];
                count = 0;
            }
        }

        return result;
    }

    private setCoordinateRecord() {
        for (let value of this.liveCoordinateList) {
            const test1 = "s";
            test1 = "c"
            const valueArr = value.split("_");
            const row = Number(valueArr[0]);
            const column = Number(valueArr[1]);
            this.liveCoordinateRecord[value] = new Coordinate(row, column);
        }
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
        for (let key in this.liveCoordinateRecord) {
            const coordinate = this.liveCoordinateRecord[key];

            const neighbourCoordinateList = coordinate.getNeighbourCoordinateList();
            allLiveCellNeighbourList.push(...neighbourCoordinateList);
            const aliveNeighbourList = this.liveCoordinateList.filter(value => neighbourCoordinateList.includes(value));
            const countOfAliveNeighbours = aliveNeighbourList.length;
            coordinate.setCountOfLivingNeighbours(countOfAliveNeighbours);
        }

        let allLiveCellDeadNeighbourList: string[] = allLiveCellNeighbourList.filter(val => !this.liveCoordinateList.includes(val));

        for (let value of allLiveCellDeadNeighbourList) {
            const valueArr = value.split("_");
            const row = Number(valueArr[0]);
            const column = Number(valueArr[1]);
            this.allLiveCellDeadNeighbourRecord[value] = new Coordinate(row, column);
        }

        for (let key in this.allLiveCellDeadNeighbourRecord) {
            const coordinate = this.allLiveCellDeadNeighbourRecord[key];

            const neighbourCoordinateList = coordinate.getNeighbourCoordinateList();
            const aliveNeighbourList = this.liveCoordinateList.filter(value => neighbourCoordinateList.includes(value));
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

        const coordinateKeys = Object.keys(this.coordinateRecord);
        const resultList: number[] = coordinateKeys.map(value => {
            let state = 0;
            if (this.liveCoordinateList.includes(value)) {
                state = 1;
            }
            return state;
        });



        let rowList: number[] = [];
        let count = 0;
        let result = [];

        for (let value of resultList) {
            rowList.push(value);
            count++;
            if (count == Coordinate.getRow()) {
                result.push(rowList);
                rowList = [];
                count = 0;
            }
        }

        return result;
    }
}
