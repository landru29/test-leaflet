import * as _ from 'lodash';
import * as L from 'leaflet';

export class WindData {
    public UAxis: WindAxis;
    public VAxis: WindAxis;

    constructor(apiData: any[]) {
        this.UAxis = new WindAxis(_.find(apiData, (data: any) => _.get(data, 'header.parameterNumber') === 2));
        this.VAxis = new WindAxis(_.find(apiData, (data: any) => _.get(data, 'header.parameterNumber') === 3));
    }

    getWindAt(position: L.LatLng): Vector {
        return new Vector(
            this.UAxis.getValueAt(position),
            this.VAxis.getValueAt(position),
        );
    }
    
}

export class WindAxis {
    data: number[];
    header: WindDataHeader;

    constructor(apiData: any) {
        this.data = _.get(apiData, 'data', []);
        this.header = new WindDataHeader(_.get(apiData, 'header', {}));
    }

    get deltaLat(): number {
        return Math.abs(this.header.la2 - this.header.la1);
    }

    get deltaLng(): number {
        return Math.abs(this.header.lo2 - this.header.lo1);
    }

    get deltaLatIndex(): number {
        return this.deltaLat / this.header.dy;
    }

    get deltaLngIndex(): number {
        return this.deltaLng / this.header.dx;
    }

    positionToIndex(position: L.LatLng): number[] {
        let lat = -position.lat - this.header.la2;
        let lng = position.lng - this.header.lo1;
        while (lat > 180) {
            lat -= 180;
        }
        while (lng < 0) {
            lng += 360;
        }

        while (lng >= 360 ) {
            lng -= 360;
        }
        return [lat / this.header.dy, lng / this.header.dx];
    }

    getValueAt(position: L.LatLng): number {
        const index = this.positionToIndex(position);
        const x = index[0] - Math.floor(index[0]);
        const y = index[1] - Math.floor(index[1]);
        const g00 = this.data[Math.floor(index[0]) * this.header.nx + Math.floor(index[1])];
        const g01 = this.data[Math.ceil(index[0]) * this.header.nx + Math.floor(index[1])];
        const g10 = this.data[Math.floor(index[0]) * this.header.nx + Math.ceil(index[1])];
        const g11 = this.data[Math.ceil(index[0]) * this.header.nx + Math.ceil(index[1])]
        const rx = (1 - x);
        const ry = (1 - y);
        const a = rx * ry;
        const b = x * ry;
        const c = rx * y;
        const d = x * y;
        return g00 * a + g10 * b + g01 * c + g11 * d;
    }
}

export class WindDataHeader {
    dx: number;
    dy: number;
    la1: number;
    la2: number;
    lo1: number;
    lo2: number;
    nx: number;
    ny: number;
    parameterCategory: number;
    parameterNumber: number;
    parameterNumberName: string;
    parameterUnit: string;
    refTime: string;

    constructor(apiData: any) {
        _.extend(this, apiData);
    }
}

export class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get angle(): number {
        return Math.atan2(this.x, this.y);
    }

    get value(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
} 