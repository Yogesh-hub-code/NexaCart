import {
  Component,
  AfterViewInit,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css']
})
export class LocationPickerComponent implements AfterViewInit {

  @Output() close = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<string>();

  map!: L.Map;
  marker!: L.Marker;

  searchText = '';
  selectedLocation = '';
  currentLocation = '';

  suggestions: any[] = [];
  showSuggestions = false;

  geoApiKey = environment.geoApiKey;

  private searchTimer: any;

  constructor(
    private http: HttpClient
  ) { }

  ngAfterViewInit(): void {

    setTimeout(() => {

      const mapElement = document.getElementById('map');

      if (!mapElement) {
        console.error('Map div not found');
        return;
      }

      this.map = L.map(mapElement).setView(
        [17.3850, 78.4867],
        13
      );

      L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors'
        }
      ).addTo(this.map);

      this.marker = L.marker(
        [17.3850, 78.4867]
      ).addTo(this.map);

      this.map.invalidateSize();

    }, 300);

  }

  deliverHere(): void {

    const location = this.selectedLocation || this.currentLocation;

    this.locationSelected.emit(location);

    this.close.emit();
  }

  closePopup(): void {
    this.close.emit();
  }
  // Search suggestions while typing
searchSuggestions(): void {

  clearTimeout(this.searchTimer);

  if (!this.searchText || this.searchText.trim().length < 3) {
    this.suggestions = [];
    this.showSuggestions = false;
    return;
  }

  this.searchTimer = setTimeout(() => {

    const url =
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(this.searchText)}&limit=5&apiKey=${this.geoApiKey}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.suggestions = res.features || [];
        this.showSuggestions = this.suggestions.length > 0;
      },
      error: (err) => {
        console.error(err);
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });

  }, 400);
}


// Search when Enter is pressed
searchLocation(): void {

  if (!this.searchText.trim()) {
    return;
  }

  const url =
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(this.searchText)}&limit=1&apiKey=${this.geoApiKey}`;

  this.http.get<any>(url).subscribe({
    next: (res) => {

      if (res.features.length) {

        const feature = res.features[0];

        const lat = feature.properties.lat;
        const lng = feature.properties.lon;

        this.selectedLocation = feature.properties.formatted;

        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 16);

        this.showSuggestions = false;
      }
    },
    error: (err) => console.error(err)
  });

}


// Select from suggestions
selectSuggestion(item: any): void {

  const lat = item.properties.lat;
  const lng = item.properties.lon;

  this.selectedLocation = item.properties.formatted;
  this.searchText = item.properties.formatted;

  this.marker.setLatLng([lat, lng]);
  this.map.setView([lat, lng], 16);

  this.showSuggestions = false;
}


// Get current location
getCurrentLocation(): void {

  if (!navigator.geolocation) {
    alert('Geolocation is not supported.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], 16);

      const url =
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${this.geoApiKey}`;

      this.http.get<any>(url).subscribe({
        next: (res) => {

          if (res.features.length) {

            this.selectedLocation =
              res.features[0].properties.formatted;

            this.currentLocation = this.selectedLocation;
          }

        },
        error: (err) => console.error(err)
      });

    },
    (error) => {
      console.error(error);
      alert('Unable to get current location.');
    }
  );
}

}