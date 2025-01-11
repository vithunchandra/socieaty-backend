import { Type } from "@mikro-orm/core";
import { json } from "stream/consumers";

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

class DatabasePoint{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
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
        if(!value){
            return undefined;
        }
        
        const databasePoint = JSON.parse(JSON.stringify(value)) as DatabasePoint

        const {x, y} = databasePoint;
        return new Point(x, y);
    }
  
    getColumnType(): string {
        return 'point';
    }
}