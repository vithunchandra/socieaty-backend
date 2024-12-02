import { Type } from "@mikro-orm/core";

export class Point{
    latitude: number;
    longitude: number;

    constructor(
        latitude: number,
        longitude: number
    ){
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

export class PointType extends Type<Point | undefined, string | undefined> {

    convertToDatabaseValue(value: Point | undefined): string | undefined {
        if (!value) {
            return undefined;
        }
    
        return `(${value.latitude}, ${value.longitude})`;
    }
  
    convertToJSValue(value: string | undefined): Point | undefined {
        console.log(value)
        if(!value){
            return undefined;
        }

        const [x, y] = value.toString().slice(1, -1).split(',').map(Number);
        return new Point(x, y);
    }
  
    getColumnType(): string {
        return 'point';
    }
}