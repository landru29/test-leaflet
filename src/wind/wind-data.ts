import * as _ from 'lodash';
import * as L from 'leaflet';

export class WindData {
    public axis: WindAxis[];

    constructor(apiData: any[]) {
        this.axis = _.map(apiData, (data: any) => new WindAxis(data));
    }

    getWindAd(position: L.LatLng) {

    }

    get header(): WindDataHeader {
        return _.chain(this.axis)
            .first()
            .get('header')
            .value();
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
}

export class WindAxis {
    data: number[];
    header: WindDataHeader;

    constructor(apiData: any) {
        this.data = _.get(apiData, 'data', []);
        this.header = new WindDataHeader(_.get(apiData, 'header', {}));
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