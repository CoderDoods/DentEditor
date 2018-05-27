import { Injectable } from '@angular/core';
import { Rgb, Hsl } from '../shared/models/color';

@Injectable({
  providedIn: 'root'
})
export class ColorMapperService {

  rgbToHsl(rgb: Rgb): Hsl {
    const red = rgb.red / 255;
    const green = rgb.green / 255;
    const blue = rgb.blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue: number;
    let saturation: number;
    const lightness = (max + min) / 2;

    if (max === min) {
      hue = saturation = 0; // achromatic
    } else {
      const delta = max - min;
      saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case red:
          hue = (green - blue) / delta + (green < blue ? 6 : 0);
          break;
        case green:
          hue = (blue - red) / delta + 2;
          break;
        case blue:
          hue = (red - green) / delta + 4;
          break;
      }
      hue /= 6;
    }

    return ({
      hue,
      saturation,
      lightness,
    });
  }

  hslToRgb(hsl: Hsl): Rgb {
    let red;
    let green;
    let blue;

    if (hsl.saturation === 0) {
      // achromatic
      red = green = blue = hsl.lightness;
    } else {
      const q = hsl.lightness < 0.5 ? hsl.lightness * (1 + hsl.saturation) :
        hsl.lightness + hsl.saturation - hsl.lightness * hsl.saturation;
      const p = 2 * hsl.lightness - q;
      red = this.hueToRgb(p, q, hsl.hue + 1 / 3);
      green = this.hueToRgb(p, q, hsl.hue);
      blue = this.hueToRgb(p, q, hsl.hue - 1 / 3);
    }

    return ({
      red: Math.round(red * 255),
      green: Math.round(green * 255),
      blue: Math.round(blue * 255),
    });
  }

  parseRgb(value: string) {
    console.log(value);
    const expression = /([\d]{1,3})\,\s([\d]{1,3})\,\s([\d]{1,3})/.exec(value);
    return {
      red: +expression[1],
      green: +expression[2],
      blue: +expression[3],
    };
  }

  hueToRgb(p: number, q: number, t: number) {
    let theta = t;
    if (theta < 0) { theta += 1; }
    if (theta > 1) { theta -= 1; }
    if (theta < 1 / 6) { return p + (q - p) * 6 * theta; }
    if (theta < 1 / 2) { return q; }
    if (theta < 2 / 3) { return p + (q - p) * (2 / 3 - theta) * 6; }
    return p;
  }

  rgbToHex(rgb: Rgb) {
    return '#' + this.componentToHex(rgb.red) + this.componentToHex(rgb.green) + this.componentToHex(rgb.blue);
  }

  hexToRgb(hex: string): Rgb {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16),
    } : null;
  }

  private componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
}
