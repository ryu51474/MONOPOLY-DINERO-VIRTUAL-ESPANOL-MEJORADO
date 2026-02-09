export interface IPropertyInfo {
  name: string;
  color: string;
  price: number;
  hex: string;
}

export const propertyGroups: IPropertyInfo[] = [
  { name: "Café-Marrón Solar 1 o 2 ($60)", color: "brown", price: 60, hex: "#955436" },
  { name: "Celeste Solar 1 o 2 ($100)", color: "light-blue", price: 100, hex: "#aae0fa" },
  { name: "Celeste Solar 3 ($120)", color: "light-blue", price: 120, hex: "#aae0fa" },
  { name: "Lila/Morado Solar 1 o 2 ($140)", color: "pink", price: 140, hex: "#d93a96" },
  { name: "Lila/Morado Solar 3 ($160)", color: "pink", price: 160, hex: "#d93a96" },
  { name: "Naranja Solar 1 o 2 ($180)", color: "orange", price: 180, hex: "#f19122" },
  { name: "Naranja Solar 3 ($200)", color: "orange", price: 200, hex: "#f19122" },
  { name: "Rojo Solar 1 o 2 ($220)", color: "red", price: 220, hex: "#e21123" },
  { name: "Rojo Solar 3 ($240)", color: "red", price: 240, hex: "#e21123" },
  { name: "Amarillo Solar 1 o 2 ($260)", color: "yellow", price: 260, hex: "#fedf00" },
  { name: "Amarillo Solar 3 ($280)", color: "yellow", price: 280, hex: "#fedf00" },
  { name: "Verde Solar 1 o 2 ($300)", color: "green", price: 300, hex: "#1fb25a" },
  { name: "Verde Solar 3 ($320)", color: "green", price: 320, hex: "#1fb25a" },
  { name: "Azul Solar 1 ($350)", color: "dark-blue", price: 350, hex: "#0072bb" },
  { name: "Azul Solar 2 ($400)", color: "dark-blue", price: 400, hex: "#0072bb" },
  { name: "Estaciones-Ferrocarriles ($200)", color: "stations", price: 200, hex: "#000000" },
  { name: "Servicios Públicos ($150)", color: "utilities", price: 150, hex: "#e6ffcc" }
];
