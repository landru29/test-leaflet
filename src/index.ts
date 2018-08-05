import * as L from 'leaflet';
import { Windy, IWindData } from './wind/windy';
import './map.scss';
import * as $ from 'jquery';


class MapView {
    constructor() {
        var map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();

        $.getJSON('wind000.json', (data: IWindData[]) => {
            const layer = new Windy({
                data,
                maxVelocity: 15,
                minVelocity: 0,
                velocityScale: 0.01
              });
    
            layer.addTo(map);
        });

        
    } 
}

new MapView();

