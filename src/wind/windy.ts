import * as L from 'leaflet';
import * as _ from 'lodash';
import { WindData, Vector } from './wind-data';

export class Windy extends L.Layer {
    private canvas: HTMLCanvasElement = null;
    private map: L.Map = null;
    private data: any;
    private maxVelocity: number;
    private minVelocity: number;
    private velocityScale: number;
    private bounds: L.LatLngBounds;
    
    constructor (options: IWindyOptions) {
        super(options);
        _.extend(this, options);
    }

    initialize(options: any) {
        L.Util.setOptions(this, options);
    }

    onAdd(map: L.Map): this {
        this.canvas = <HTMLCanvasElement>L.DomUtil.create('canvas', 'leaflet-layer windy');
        this.map = map;
        this.bounds = this.map.getBounds();
        const size = this.map.getSize();
        this.canvas.width = size.x;
        this.canvas.height = size.y;

        (<any>map)._panes.overlayPane.appendChild(this.canvas);

        return this;
    }

    onRemove(map: L.Map): this {
        return this;
    }

    onDrawLayer(overlay: any, params: any) {

    }

    canvasToMap (position: L.Point): L.LatLng {
        const mapLngDelta = this.lngDelta;
        const worldMapRadius = (this.angleWidth / Windy.rad2deg(mapLngDelta)) * 360 / (2 * Math.PI);
        const mapOffsetY = ( worldMapRadius / 2 * Math.log( (1 + Math.sin(this.angleSouth) ) / (1 - Math.sin(this.angleSouth))  ));
        const equatorY = this.angleHeight + mapOffsetY;
        const a = (equatorY - position.y ) / worldMapRadius;

        return new L.LatLng(
            180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2),
            Windy.rad2deg(this.angleWest) + position.x / this.angleWidth * Windy.rad2deg(mapLngDelta)
        );
    }

    mapToCanvas (position: L.LatLng): L.Point {
        const ymin = Windy.mercY(this.angleSouth);
        const ymax = Windy.mercY(this.angleNorth);
        const xFactor = this.angleWidth / ( this.angleEast - this.angleWest );
        const yFactor = this.angleHeight / ( ymax - ymin );

        return new L.Point(
            (Windy.deg2rad(position.lng) - this.angleWest) * xFactor,
            (ymax - Windy.mercY(Windy.deg2rad(position.lat))) * yFactor
        );
    }

    get angleWidth (): number {
        return (4 * Math.PI + this.angleEast - this.angleWest) % (2 * Math.PI);
    }

    get angleHeight (): number {
        return (2 * Math.PI + this.angleNorth - this.angleSouth) % (2 * Math.PI);
    }

    get lngDelta(): number {
        return this.bounds.getNorthEast().lng - this.bounds.getNorthWest().lng;
    }

    get latDelta(): number {
        return this.bounds.getNorthEast().lat - this.bounds.getSouthEast().lat;
    }

    get angleNorth(): number {
        return this.bounds.getNorthEast().lat * Math.PI / 180;
    }
    
    get angleEast(): number {
        return this.bounds.getNorthEast().lng * Math.PI / 180;
    }

    get angleSouth(): number {
        return this.bounds.getSouthEast().lat * Math.PI / 180;
    }
    
    get angleWest(): number {
        return this.bounds.getSouthWest().lat * Math.PI / 180;
    }

    private static deg2rad (deg: number): number {
        return deg * Math.PI / 180;
    }

    private static rad2deg (rad: number): number {
        return rad * 180 / Math.PI;
    }

    private static mercY (φ: number): number {
        return Math.log( Math.tan( φ / 2 + Math.PI / 4 ) );
    }

}

export interface IWindyOptions extends L.LayerOptions {
    data?: WindData;
    maxVelocity?: number;
    minVelocity?: number;
    velocityScale?: number;
}

