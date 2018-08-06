import { WindData } from './wind-data';
import * as L from 'leaflet';
import * as _ from 'lodash';
const json = require('../../wind000.json');

describe('WindData', () => {

    let data: WindData;

    beforeEach(() => {
        data = new WindData(json);
    });

    it('Should load data', () => {
        expect(data.UAxis.deltaLat).toBe(180);
        expect(data.UAxis.deltaLng).toBe(359);
    });

    it('Should get data index (lng negative)', () => {
        const indexes = data.UAxis.positionToIndex(new L.LatLng(-45.2, -30));
        expect(_.isArray(indexes)).toBeTruthy();
        expect(indexes.length).toBe(2);
        expect(indexes[0]).toBe(135.2);
        expect(indexes[1]).toBe(330);
    });

    it('Should get data index (lng over 359)', () => {
        const indexes = data.UAxis.positionToIndex(new L.LatLng(10, 720));
        expect(_.isArray(indexes)).toBeTruthy();
        expect(indexes.length).toBe(2);
        expect(indexes[0]).toBe(80);
        expect(indexes[1]).toBe(0);
    });

    it('Should get value on one axis', () => {
        const value = data.UAxis.getValueAt(new L.LatLng(-13.037, -38.555));
        expect(value.toFixed(3)).toBe('-0.564');
    });
})