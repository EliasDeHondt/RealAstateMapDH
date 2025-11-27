/**
    * @author EliasDH Team
    * @see https://eliasdh.com
    * @since 01/01/2025
**/

const companyColor = '#4f94f0';
const borderColor = '#6c757d';
const map = L.map('map').setView([50.5, 5.0], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const propertyLayer = L.featureGroup().addTo(map);
fetch('https://eliasdehondt.github.io/RealAstateMapDH/data.json').then(response => response.json()).then(properties => initializeMap(properties)).catch(error => console.error('Error loading properties:', error));

function initializeMap(properties) {
    properties.forEach(prop => {
        let layer;

        if (prop.type === 'point') {
            layer = L.circleMarker(prop.coords, {
                radius: 12,
                color: borderColor,
                weight: 3,
                fillColor: companyColor,
                fillOpacity: 0.8
            });
        } else if (prop.type === 'polygon') {
            layer = L.polygon(prop.coords, {
                color: borderColor,
                weight: 4,
                fillColor: companyColor,
                fillOpacity: 0.5
            });
        }

        if (layer) {
            const propInfoText = `Name: ${prop.name}\nCategory: ${prop.category}\nStatus: ${prop.status}\nDetails: ${prop.details}`;
            const fullPopup = `
                <b>${prop.name}</b><br>
                Category: ${prop.category}<br>
                Status: ${prop.status}<br>
                Details: ${prop.details}<br>
                <div style="margin-top: 10px;">
                    <button class="index-copy-button" onclick="copyPropInfo('${propInfoText.replace(/\n/g, '\\n')}')">Copy Info</button>
                </div>
            `;
            layer.addTo(propertyLayer).bindPopup(fullPopup);
        }
    });

    if (properties.length > 0) {
        map.fitBounds(propertyLayer.getBounds().pad(0.3));
    }
}

function copyPropInfo(text) {
    navigator.clipboard.writeText(text.replace(/\\n/g, '\n')).then(() => alert('Property info copied to clipboard!')).catch(err => alert('Failed to copy: ' + err));
}