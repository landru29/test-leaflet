import * as L from 'leaflet';
import * as _ from 'lodash';
import { WindData } from './wind-data';

export class Windy extends L.Layer {
    private canvas: HTMLCanvasElement = null;
    private map: L.Map = null;
    private data: any;
    private maxVelocity: number;
    private minVelocity: number;
    private velocityScale: number;
    
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
}

export interface IWindyOptions extends L.LayerOptions {
    data?: WindData;
    maxVelocity?: number;
    minVelocity?: number;
    velocityScale?: number;
}

